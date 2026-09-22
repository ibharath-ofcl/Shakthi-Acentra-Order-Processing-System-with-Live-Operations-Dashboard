package com.acentra.messaging.consumer;

import com.acentra.common.exception.InsufficientStockException;
import com.acentra.common.model.DlqRecord;
import com.acentra.common.repository.DlqRecordRepository;
import com.acentra.inventory.service.InventoryService;
import com.acentra.messaging.dto.OrderProcessingMessage;
import com.acentra.messaging.producer.OrderEventProducer;
import com.acentra.operations.model.OperationalEventType;
import com.acentra.operations.service.OperationalEventService;
import com.acentra.order.dto.OrderItemRequest;
import com.acentra.order.model.Order;
import com.acentra.order.model.OrderStatus;
import com.acentra.order.model.Payment;
import com.acentra.order.repository.OrderRepository;
import com.acentra.order.repository.PaymentRepository;
import com.acentra.product.model.Product;
import com.acentra.product.repository.ProductRepository;
import com.rabbitmq.client.Channel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.*;

@Service
public class OrderProcessingConsumer {

    private static final Logger log = LoggerFactory.getLogger(OrderProcessingConsumer.class);

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final InventoryService inventoryService;
    private final PaymentRepository paymentRepository;
    private final DlqRecordRepository dlqRecordRepository;
    private final OrderEventProducer producer;
    private final OperationalEventService eventService;

    @Value("${acentra.rabbitmq.retry.max-attempts:3}")
    private int maxRetryAttempts;

    public OrderProcessingConsumer(OrderRepository orderRepository,
                                   ProductRepository productRepository,
                                   InventoryService inventoryService,
                                   PaymentRepository paymentRepository,
                                   DlqRecordRepository dlqRecordRepository,
                                   OrderEventProducer producer,
                                   OperationalEventService eventService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.inventoryService = inventoryService;
        this.paymentRepository = paymentRepository;
        this.dlqRecordRepository = dlqRecordRepository;
        this.producer = producer;
        this.eventService = eventService;
    }

    @RabbitListener(queues = "${acentra.rabbitmq.queue.process:order.process.queue}")
    @Transactional
    public void handleOrderProcessing(OrderProcessingMessage message,
                                      Channel channel,
                                      @Header(AmqpHeaders.DELIVERY_TAG) long deliveryTag) throws IOException {
        String orderNumber = message.getOrderNumber();
        log.info("Received OrderProcessingMessage for order: {} (attempt: {})", orderNumber, message.getRetryCount());

        try {
            Order order = orderRepository.findByOrderNumberWithDetails(orderNumber).orElse(null);
            if (order == null) {
                log.error("Order {} not found in database. Discarding message.", orderNumber);
                channel.basicAck(deliveryTag, false);
                return;
            }

            // Idempotency: If already completed or failed, ignore duplicate message
            if (order.getStatus() == OrderStatus.COMPLETED || order.getStatus() == OrderStatus.CANCELLED) {
                log.warn("Order {} is already in terminal state {}. Acknowledging duplicate message.",
                        orderNumber, order.getStatus());
                channel.basicAck(deliveryTag, false);
                return;
            }

            // 1. Emit PROCESSING Event
            order.setStatus(OrderStatus.PROCESSING);
            orderRepository.save(order);
            eventService.emitEvent(OperationalEventType.ORDER_PROCESSING, orderNumber,
                    message.getCustomerId(), "Order picked up by worker for processing", message.getRetryCount());

            // 2. Simulated Failure Handling (Hackathon demonstration feature)
            boolean isSimulatedRetry = "RETRY".equalsIgnoreCase(message.getSimulateFailure()) ||
                    (message.getCustomerId() != null && message.getCustomerId().contains("FAIL_RETRY"));
            boolean isSimulatedDlq = "DLQ".equalsIgnoreCase(message.getSimulateFailure()) ||
                    (message.getCustomerId() != null && message.getCustomerId().contains("FAIL_DLQ"));

            if (isSimulatedRetry || isSimulatedDlq) {
                if (isSimulatedRetry && message.getRetryCount() < maxRetryAttempts) {
                    handleRetry(message, channel, deliveryTag, "Simulated transient failure (e.g. gateway timeout)");
                    return;
                } else {
                    handleDeadLetter(message, order, channel, deliveryTag, "Simulated fatal error - routed to Dead Letter Queue");
                    return;
                }
            }

            // 3. Concurrency-safe atomic inventory reservation
            Map<String, Product> productMap = new HashMap<>();
            for (OrderItemRequest itemReq : message.getItems()) {
                Product p = productRepository.findBySku(itemReq.getSku()).orElseThrow();
                productMap.put(itemReq.getSku(), p);
            }

            // Sort products canonically by ID to prevent circular wait deadlocks
            List<OrderItemRequest> sortedItems = new ArrayList<>(message.getItems());
            sortedItems.sort(Comparator.comparing(item -> productMap.get(item.getSku()).getId()));

            try {
                for (OrderItemRequest itemReq : sortedItems) {
                    Product product = productMap.get(itemReq.getSku());
                    inventoryService.reserveStock(product, itemReq.getQuantity(), order.getId());
                }

                // Inventory successfully reserved!
                eventService.emitEvent(OperationalEventType.INVENTORY_RESERVED, orderNumber,
                        message.getCustomerId(), "All items reserved atomically without overselling", message.getRetryCount());

            } catch (InsufficientStockException stockEx) {
                log.warn("Insufficient stock for order {}: {}", orderNumber, stockEx.getMessage());
                order.setStatus(OrderStatus.INSUFFICIENT_STOCK);
                order.setFailureReason(stockEx.getMessage());
                orderRepository.save(order);

                eventService.emitEvent(OperationalEventType.ORDER_FAILED, orderNumber,
                        message.getCustomerId(), "Stock check failed: " + stockEx.getMessage(), message.getRetryCount());

                producer.sendOrderFailed(message);
                channel.basicAck(deliveryTag, false);
                return;
            }

            // 4. Complete Fulfillment and Record Payment
            for (OrderItemRequest itemReq : sortedItems) {
                Product product = productMap.get(itemReq.getSku());
                inventoryService.fulfillStock(product, itemReq.getQuantity(), order.getId());
            }

            Payment payment = new Payment(
                    order,
                    "TX-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase(),
                    order.getTotalAmount(),
                    "SUCCESS",
                    "CREDIT_CARD"
            );
            payment.setGatewayResponse("{\"status\":\"APPROVED\",\"authCode\":\"" + UUID.randomUUID().toString().substring(0, 6) + "\"}");
            paymentRepository.save(payment);

            order.setStatus(OrderStatus.COMPLETED);
            orderRepository.save(order);

            eventService.emitEvent(OperationalEventType.ORDER_COMPLETED, orderNumber,
                    message.getCustomerId(), "Order completed and payment captured", message.getRetryCount());

            producer.sendOrderCompleted(message);
            channel.basicAck(deliveryTag, false);
            log.info("Order {} completed successfully!", orderNumber);

        } catch (Exception ex) {
            log.error("Unexpected error while processing order {}: {}", orderNumber, ex.getMessage(), ex);
            Order order = orderRepository.findByOrderNumber(orderNumber).orElse(null);

            if (message.getRetryCount() < maxRetryAttempts) {
                handleRetry(message, channel, deliveryTag, ex.getMessage());
            } else {
                handleDeadLetter(message, order, channel, deliveryTag, ex.getMessage());
            }
        }
    }

    private void handleRetry(OrderProcessingMessage message, Channel channel, long deliveryTag, String reason) throws IOException {
        int nextRetry = message.getRetryCount() + 1;
        message.setRetryCount(nextRetry);

        eventService.emitEvent(OperationalEventType.ORDER_RETRIED, message.getOrderNumber(),
                message.getCustomerId(), "Retry #" + nextRetry + ": " + reason, nextRetry);

        producer.sendOrderRetry(message);
        channel.basicAck(deliveryTag, false);
        log.warn("Order {} queued for retry #{}", message.getOrderNumber(), nextRetry);
    }

    private void handleDeadLetter(OrderProcessingMessage message, Order order, Channel channel, long deliveryTag, String reason) throws IOException {
        if (order != null) {
            order.setStatus(OrderStatus.FAILED);
            order.setFailureReason(reason);
            orderRepository.save(order);
        }

        DlqRecord dlqRecord = new DlqRecord(
                UUID.randomUUID().toString(),
                "order.process.queue",
                "order.deadletter",
                "{\"orderNumber\":\"" + message.getOrderNumber() + "\",\"customerId\":\"" + message.getCustomerId() + "\"}",
                reason,
                "Exceeded maximum retry attempts (" + maxRetryAttempts + ")",
                message.getRetryCount()
        );
        dlqRecordRepository.save(dlqRecord);

        eventService.emitEvent(OperationalEventType.ORDER_SENT_TO_DLQ, message.getOrderNumber(),
                message.getCustomerId(), "Moved to DLQ: " + reason, message.getRetryCount());

        producer.sendOrderToDlq(message);
        channel.basicAck(deliveryTag, false);
        log.error("Order {} sent to DLQ: {}", message.getOrderNumber(), reason);
    }
}
