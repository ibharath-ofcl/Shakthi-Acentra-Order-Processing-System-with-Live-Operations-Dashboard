package com.acentra.messaging.consumer;

import com.acentra.common.exception.InsufficientStockException;
import com.acentra.common.repository.DlqRecordRepository;
import com.acentra.inventory.service.InventoryService;
import com.acentra.messaging.dto.OrderProcessingMessage;
import com.acentra.messaging.producer.OrderEventProducer;
import com.acentra.operations.model.OperationalEventType;
import com.acentra.operations.service.OperationalEventService;
import com.acentra.order.dto.OrderItemRequest;
import com.acentra.order.model.CustomerTier;
import com.acentra.order.model.Order;
import com.acentra.order.model.OrderStatus;
import com.acentra.order.repository.OrderRepository;
import com.acentra.order.repository.PaymentRepository;
import com.acentra.product.model.Product;
import com.acentra.product.repository.ProductRepository;
import com.rabbitmq.client.Channel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderProcessingConsumerTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private InventoryService inventoryService;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private DlqRecordRepository dlqRecordRepository;

    @Mock
    private OrderEventProducer producer;

    @Mock
    private OperationalEventService eventService;

    @Mock
    private Channel channel;

    @InjectMocks
    private OrderProcessingConsumer consumer;

    private Order sampleOrder;
    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(consumer, "maxRetryAttempts", 3);

        sampleProduct = new Product("SKU-LAPTOP", "Laptop Pro", "Workstation", new BigDecimal("1500.00"));
        sampleProduct.setId(1L);

        sampleOrder = new Order("ORD-TEST-1", "idemp-1", "CUST-10", CustomerTier.STANDARD);
        sampleOrder.setId(100L);
    }

    @Test
    @DisplayName("Consumer: Successful async order processing through stock reservation and completion")
    void testSuccessfulOrderProcessing() throws IOException {
        OrderProcessingMessage message = new OrderProcessingMessage(
                "ORD-TEST-1", "idemp-1", "CUST-10", CustomerTier.STANDARD,
                List.of(new OrderItemRequest("SKU-LAPTOP", 1)), "NONE"
        );

        when(orderRepository.findByOrderNumberWithDetails("ORD-TEST-1")).thenReturn(Optional.of(sampleOrder));
        when(productRepository.findBySku("SKU-LAPTOP")).thenReturn(Optional.of(sampleProduct));

        consumer.handleOrderProcessing(message, channel, 1L);

        assertEquals(OrderStatus.COMPLETED, sampleOrder.getStatus());
        verify(inventoryService, times(1)).reserveStock(sampleProduct, 1, 100L);
        verify(inventoryService, times(1)).fulfillStock(sampleProduct, 1, 100L);
        verify(paymentRepository, times(1)).save(any());
        verify(producer, times(1)).sendOrderCompleted(message);
        verify(channel, times(1)).basicAck(1L, false);

        verify(eventService).emitEvent(eq(OperationalEventType.ORDER_PROCESSING), any(), any(), any(), eq(0));
        verify(eventService).emitEvent(eq(OperationalEventType.INVENTORY_RESERVED), any(), any(), any(), eq(0));
        verify(eventService).emitEvent(eq(OperationalEventType.ORDER_COMPLETED), any(), any(), any(), eq(0));
    }

    @Test
    @DisplayName("Consumer: Out of stock should transition order to INSUFFICIENT_STOCK and emit event")
    void testInsufficientStockHandling() throws IOException {
        OrderProcessingMessage message = new OrderProcessingMessage(
                "ORD-TEST-1", "idemp-1", "CUST-10", CustomerTier.STANDARD,
                List.of(new OrderItemRequest("SKU-LAPTOP", 5)), "NONE"
        );

        when(orderRepository.findByOrderNumberWithDetails("ORD-TEST-1")).thenReturn(Optional.of(sampleOrder));
        when(productRepository.findBySku("SKU-LAPTOP")).thenReturn(Optional.of(sampleProduct));
        doThrow(new InsufficientStockException("SKU-LAPTOP", 5, 2))
                .when(inventoryService).reserveStock(sampleProduct, 5, 100L);

        consumer.handleOrderProcessing(message, channel, 2L);

        assertEquals(OrderStatus.INSUFFICIENT_STOCK, sampleOrder.getStatus());
        verify(producer, times(1)).sendOrderFailed(message);
        verify(channel, times(1)).basicAck(2L, false);
        verify(eventService).emitEvent(eq(OperationalEventType.ORDER_FAILED), any(), any(), any(), eq(0));
    }

    @Test
    @DisplayName("Consumer: Simulated transient failure triggers retry queue routing and event")
    void testSimulatedRetryFailure() throws IOException {
        OrderProcessingMessage message = new OrderProcessingMessage(
                "ORD-TEST-1", "idemp-1", "CUST-10", CustomerTier.STANDARD,
                List.of(new OrderItemRequest("SKU-LAPTOP", 1)), "RETRY"
        );
        message.setRetryCount(1);

        when(orderRepository.findByOrderNumberWithDetails("ORD-TEST-1")).thenReturn(Optional.of(sampleOrder));

        consumer.handleOrderProcessing(message, channel, 3L);

        assertEquals(2, message.getRetryCount());
        verify(producer, times(1)).sendOrderRetry(message);
        verify(channel, times(1)).basicAck(3L, false);
        verify(eventService).emitEvent(eq(OperationalEventType.ORDER_RETRIED), any(), any(), any(), eq(2));
    }

    @Test
    @DisplayName("Consumer: Simulated fatal failure routes directly to Dead Letter Queue (DLQ)")
    void testSimulatedDlqFailure() throws IOException {
        OrderProcessingMessage message = new OrderProcessingMessage(
                "ORD-TEST-1", "idemp-1", "CUST-10", CustomerTier.STANDARD,
                List.of(new OrderItemRequest("SKU-LAPTOP", 1)), "DLQ"
        );

        when(orderRepository.findByOrderNumberWithDetails("ORD-TEST-1")).thenReturn(Optional.of(sampleOrder));

        consumer.handleOrderProcessing(message, channel, 4L);

        assertEquals(OrderStatus.FAILED, sampleOrder.getStatus());
        verify(dlqRecordRepository, times(1)).save(any());
        verify(producer, times(1)).sendOrderToDlq(message);
        verify(channel, times(1)).basicAck(4L, false);
        verify(eventService).emitEvent(eq(OperationalEventType.ORDER_SENT_TO_DLQ), any(), any(), any(), eq(0));
    }
}
