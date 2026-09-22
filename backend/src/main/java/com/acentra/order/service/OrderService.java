package com.acentra.order.service;

import com.acentra.common.exception.InvalidOrderStateException;
import com.acentra.common.exception.ResourceNotFoundException;
import com.acentra.common.model.AuditLog;
import com.acentra.common.repository.AuditLogRepository;
import com.acentra.inventory.service.InventoryService;
import com.acentra.messaging.dto.OrderProcessingMessage;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final InventoryService inventoryService;
    private final AuditLogRepository auditLogRepository;
    private final OrderEventProducer orderEventProducer;
    private final OperationalEventService operationalEventService;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        InventoryService inventoryService,
                        AuditLogRepository auditLogRepository,
                        OrderEventProducer orderEventProducer,
                        OperationalEventService operationalEventService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.inventoryService = inventoryService;
        this.auditLogRepository = auditLogRepository;
        this.orderEventProducer = orderEventProducer;
        this.operationalEventService = operationalEventService;
    }

    /**
     * Ingests an order asynchronously via RabbitMQ with idempotency and operational tracking.
     */
    @Transactional
    public OrderResponse createOrder(String idempotencyKey, OrderCreateRequest request) {
        if (idempotencyKey == null || idempotencyKey.isBlank()) {
            throw new IllegalArgumentException("Idempotency-Key header is required for order creation");
        }

        // 1. Idempotency Check
        if (orderRepository.existsByIdempotencyKey(idempotencyKey)) {
            log.warn("Duplicate order request detected for Idempotency-Key: {}", idempotencyKey);
            Order existingOrder = orderRepository.findByIdempotencyKey(idempotencyKey).orElseThrow();
            return OrderResponse.fromEntity(existingOrder);
        }

        // 2. Validate Items & Collect Products
        Map<String, Product> productMap = new HashMap<>();
        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findBySku(itemReq.getSku())
                    .orElseThrow(() -> new ResourceNotFoundException("Product with SKU: " + itemReq.getSku() + " not found"));
            productMap.put(itemReq.getSku(), product);
        }

        // 3. Initialize Order
        String orderNumber = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Order order = new Order(
                orderNumber,
                idempotencyKey,
                request.getCustomerId(),
                request.getCustomerTier() != null ? request.getCustomerTier() : CustomerTier.STANDARD
        );

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productMap.get(itemReq.getSku());
            OrderItem item = new OrderItem(product, itemReq.getQuantity(), product.getPrice());
            order.addItem(item);
        }

        // 4. Save order in CREATED state
        Order savedOrder = orderRepository.save(order);

        recordAudit(savedOrder.getId(), "ORDER_CREATED", null,
                OrderStatus.CREATED.name(), "Order ingested and dispatched to RabbitMQ");

        // 5. Emit OPERATIONAL EVENT
        operationalEventService.emitEvent(
                OperationalEventType.ORDER_RECEIVED,
                savedOrder.getOrderNumber(),
                savedOrder.getCustomerId(),
                "Order received and enqueued for async processing. Total: $" + savedOrder.getTotalAmount(),
                0
        );

        // 6. Publish to RabbitMQ Topic Exchange
        OrderProcessingMessage message = new OrderProcessingMessage(
                savedOrder.getOrderNumber(),
                savedOrder.getIdempotencyKey(),
                savedOrder.getCustomerId(),
                savedOrder.getCustomerTier(),
                request.getItems(),
                request.getSimulateFailure()
        );
        orderEventProducer.sendOrderCreated(message);

        log.info("Order {} ingested and enqueued to RabbitMQ for processing.", savedOrder.getOrderNumber());
        return OrderResponse.fromEntity(savedOrder);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumberWithDetails(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order with number: " + orderNumber + " not found"));
        return OrderResponse.fromEntity(order);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> getOrders(OrderStatus status, CustomerTier customerTier, Pageable pageable) {
        Page<Order> orderPage;
        if (status != null && customerTier != null) {
            orderPage = orderRepository.findByStatusAndCustomerTier(status, customerTier, pageable);
        } else if (status != null) {
            orderPage = orderRepository.findByStatus(status, pageable);
        } else if (customerTier != null) {
            orderPage = orderRepository.findByCustomerTier(customerTier, pageable);
        } else {
            orderPage = orderRepository.findAll(pageable);
        }

        return orderPage.map(OrderResponse::fromEntity);
    }

    @Transactional
    public OrderResponse cancelOrder(String orderNumber, OrderCancelRequest cancelRequest) {
        Order order = orderRepository.findByOrderNumberWithDetails(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order with number: " + orderNumber + " not found"));

        if (order.getStatus() == OrderStatus.CANCELLED || order.getStatus() == OrderStatus.COMPLETED) {
            throw new InvalidOrderStateException("Order " + orderNumber + " cannot be cancelled from state: " + order.getStatus());
        }

        OrderStatus previousStatus = order.getStatus();

        // Release reserved stock if order was in PENDING_PAYMENT or PROCESSING
        if (previousStatus == OrderStatus.PENDING_PAYMENT || previousStatus == OrderStatus.PROCESSING) {
            for (OrderItem item : order.getItems()) {
                inventoryService.releaseStock(item.getProduct(), item.getQuantity(), order.getId());
            }
        }

        order.setStatus(OrderStatus.CANCELLED);
        String reason = (cancelRequest != null && cancelRequest.getReason() != null) ?
                cancelRequest.getReason() : "Cancelled by user request";
        order.setFailureReason(reason);
        Order updated = orderRepository.save(order);

        recordAudit(order.getId(), "ORDER_CANCELLED", previousStatus.name(),
                OrderStatus.CANCELLED.name(), reason);

        operationalEventService.emitEvent(
                OperationalEventType.ORDER_FAILED,
                order.getOrderNumber(),
                order.getCustomerId(),
                "Order cancelled by operator: " + reason,
                0
        );

        log.info("Order {} cancelled. Reason: {}", orderNumber, reason);
        return OrderResponse.fromEntity(updated);
    }

    private void recordAudit(Long orderId, String action, String fromState, String toState, String details) {
        AuditLog audit = new AuditLog("ORDER", orderId, action, fromState, toState, details);
        auditLogRepository.save(audit);
    }
}
