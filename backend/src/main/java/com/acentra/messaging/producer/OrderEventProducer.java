package com.acentra.messaging.producer;

import com.acentra.messaging.dto.OrderProcessingMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class OrderEventProducer {

    private static final Logger log = LoggerFactory.getLogger(OrderEventProducer.class);

    private final RabbitTemplate rabbitTemplate;

    @Value("${acentra.rabbitmq.exchange.order:acentra.order.exchange}")
    private String orderExchange;

    @Value("${acentra.rabbitmq.exchange.retry:acentra.retry.exchange}")
    private String retryExchange;

    @Value("${acentra.rabbitmq.exchange.dlx:acentra.dlx}")
    private String dlxExchange;

    @Value("${acentra.rabbitmq.routing-key.created:order.created}")
    private String createdRoutingKey;

    @Value("${acentra.rabbitmq.routing-key.retry:order.retry}")
    private String retryRoutingKey;

    @Value("${acentra.rabbitmq.routing-key.completed:order.completed}")
    private String completedRoutingKey;

    @Value("${acentra.rabbitmq.routing-key.failed:order.failed}")
    private String failedRoutingKey;

    @Value("${acentra.rabbitmq.routing-key.deadletter:order.deadletter}")
    private String deadletterRoutingKey;

    public OrderEventProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendOrderCreated(OrderProcessingMessage message) {
        log.info("Publishing OrderCreatedEvent for order: {} to exchange: {} with key: {}",
                message.getOrderNumber(), orderExchange, createdRoutingKey);
        rabbitTemplate.convertAndSend(orderExchange, createdRoutingKey, message);
    }

    public void sendOrderRetry(OrderProcessingMessage message) {
        log.info("Publishing OrderRetryEvent for order: {} (attempt: {}) to retry exchange: {}",
                message.getOrderNumber(), message.getRetryCount(), retryExchange);
        rabbitTemplate.convertAndSend(retryExchange, retryRoutingKey, message);
    }

    public void sendOrderCompleted(OrderProcessingMessage message) {
        log.info("Publishing OrderCompletedEvent for order: {} to exchange: {}",
                message.getOrderNumber(), orderExchange);
        rabbitTemplate.convertAndSend(orderExchange, completedRoutingKey, message);
    }

    public void sendOrderFailed(OrderProcessingMessage message) {
        log.info("Publishing OrderFailedEvent for order: {} to exchange: {}",
                message.getOrderNumber(), orderExchange);
        rabbitTemplate.convertAndSend(orderExchange, failedRoutingKey, message);
    }

    public void sendOrderToDlq(OrderProcessingMessage message) {
        log.warn("Routing message for order: {} to Dead Letter Exchange (DLX): {}",
                message.getOrderNumber(), dlxExchange);
        rabbitTemplate.convertAndSend(dlxExchange, deadletterRoutingKey, message);
    }
}
