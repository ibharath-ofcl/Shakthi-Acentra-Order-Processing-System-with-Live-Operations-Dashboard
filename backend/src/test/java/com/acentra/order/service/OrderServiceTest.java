package com.acentra.order.service;

import com.acentra.common.repository.AuditLogRepository;
import com.acentra.inventory.service.InventoryService;
import com.acentra.messaging.producer.OrderEventProducer;
import com.acentra.operations.model.OperationalEventType;
import com.acentra.operations.service.OperationalEventService;
import com.acentra.order.dto.OrderCancelRequest;
import com.acentra.order.dto.OrderCreateRequest;
import com.acentra.order.dto.OrderItemRequest;
import com.acentra.order.dto.OrderResponse;
import com.acentra.order.model.CustomerTier;
import com.acentra.order.model.Order;
import com.acentra.order.model.OrderItem;
import com.acentra.order.model.OrderStatus;
import com.acentra.order.repository.OrderRepository;
import com.acentra.product.model.Product;
import com.acentra.product.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private InventoryService inventoryService;

    @Mock
    private AuditLogRepository auditLogRepository;

    @Mock
    private OrderEventProducer orderEventProducer;

    @Mock
    private OperationalEventService operationalEventService;

    @InjectMocks
    private OrderService orderService;

    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        sampleProduct = new Product("SKU-100", "Wireless Mouse", "Ergonomic mouse", new BigDecimal("49.99"));
        sampleProduct.setId(1L);
    }

    @Test
    @DisplayName("Should successfully ingest order in CREATED state and dispatch to RabbitMQ")
    void testCreateOrder_Success() {
        String idempotencyKey = "key-success-1";
        OrderCreateRequest request = new OrderCreateRequest(
                "CUST-001",
                CustomerTier.STANDARD,
                List.of(new OrderItemRequest("SKU-100", 2))
        );

        when(orderRepository.existsByIdempotencyKey(idempotencyKey)).thenReturn(false);
        when(productRepository.findBySku("SKU-100")).thenReturn(Optional.of(sampleProduct));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order o = invocation.getArgument(0);
            if (o.getId() == null) {
                o.setId(10L);
            }
            return o;
        });

        OrderResponse response = orderService.createOrder(idempotencyKey, request);

        assertNotNull(response);
        assertEquals(OrderStatus.CREATED, response.getStatus());
        assertEquals("CUST-001", response.getCustomerId());
        assertEquals(new BigDecimal("99.98"), response.getTotalAmount());

        verify(orderEventProducer, times(1)).sendOrderCreated(any());
        verify(operationalEventService, times(1)).emitEvent(
                eq(OperationalEventType.ORDER_RECEIVED), anyString(), eq("CUST-001"), anyString(), eq(0));
    }

    @Test
    @DisplayName("Should return existing order on duplicate idempotency key without publishing again")
    void testCreateOrder_DuplicateIdempotencyKey() {
        String idempotencyKey = "key-dup-1";
        Order existingOrder = new Order("ORD-EXISTING", idempotencyKey, "CUST-001", CustomerTier.STANDARD);
        existingOrder.setId(99L);
        existingOrder.setStatus(OrderStatus.CREATED);

        when(orderRepository.existsByIdempotencyKey(idempotencyKey)).thenReturn(true);
        when(orderRepository.findByIdempotencyKey(idempotencyKey)).thenReturn(Optional.of(existingOrder));

        OrderCreateRequest request = new OrderCreateRequest(
                "CUST-001",
                CustomerTier.STANDARD,
                List.of(new OrderItemRequest("SKU-100", 1))
        );

        OrderResponse response = orderService.createOrder(idempotencyKey, request);

        assertNotNull(response);
        assertEquals("ORD-EXISTING", response.getOrderNumber());
        verify(orderEventProducer, never()).sendOrderCreated(any());
    }

    @Test
    @DisplayName("Should release reserved inventory on order cancellation")
    void testCancelOrder_Success() {
        Order order = new Order("ORD-CANCEL-1", "key-c-1", "CUST-003", CustomerTier.STANDARD);
        order.setId(30L);
        order.setStatus(OrderStatus.PENDING_PAYMENT);
        order.addItem(new OrderItem(sampleProduct, 3, sampleProduct.getPrice()));

        when(orderRepository.findByOrderNumberWithDetails("ORD-CANCEL-1")).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OrderResponse response = orderService.cancelOrder("ORD-CANCEL-1", new OrderCancelRequest("Changed mind"));

        assertEquals(OrderStatus.CANCELLED, response.getStatus());
        verify(inventoryService, times(1)).releaseStock(sampleProduct, 3, 30L);
        verify(auditLogRepository, times(1)).save(any());
        verify(operationalEventService, times(1)).emitEvent(
                eq(OperationalEventType.ORDER_FAILED), eq("ORD-CANCEL-1"), eq("CUST-003"), anyString(), eq(0));
    }
}
