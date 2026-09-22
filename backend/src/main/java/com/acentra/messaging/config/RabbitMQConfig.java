package com.acentra.messaging.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${acentra.rabbitmq.exchange.order:acentra.order.exchange}")
    private String orderExchange;

    @Value("${acentra.rabbitmq.exchange.retry:acentra.retry.exchange}")
    private String retryExchange;

    @Value("${acentra.rabbitmq.exchange.dlx:acentra.dlx}")
    private String dlxExchange;

    @Value("${acentra.rabbitmq.queue.process:order.process.queue}")
    private String processQueue;

    @Value("${acentra.rabbitmq.queue.retry:order.retry.queue}")
    private String retryQueue;

    @Value("${acentra.rabbitmq.queue.inventory:order.inventory.queue}")
    private String inventoryQueue;

    @Value("${acentra.rabbitmq.queue.success:order.success.queue}")
    private String successQueue;

    @Value("${acentra.rabbitmq.queue.failed:order.failed.queue}")
    private String failedQueue;

    @Value("${acentra.rabbitmq.queue.dlq:order.dlq}")
    private String dlqQueue;

    @Value("${acentra.rabbitmq.routing-key.created:order.created}")
    private String createdRoutingKey;

    @Value("${acentra.rabbitmq.routing-key.retry:order.retry}")
    private String retryRoutingKey;

    @Value("${acentra.rabbitmq.routing-key.inventory:order.inventory}")
    private String inventoryRoutingKey;

    @Value("${acentra.rabbitmq.routing-key.completed:order.completed}")
    private String completedRoutingKey;

    @Value("${acentra.rabbitmq.routing-key.failed:order.failed}")
    private String failedRoutingKey;

    @Value("${acentra.rabbitmq.routing-key.deadletter:order.deadletter}")
    private String deadletterRoutingKey;

    @Value("${acentra.rabbitmq.retry.delay-ms:3000}")
    private int retryDelayMs;

    // --- Exchanges ---

    @Bean
    public TopicExchange orderExchange() {
        return new TopicExchange(orderExchange, true, false);
    }

    @Bean
    public DirectExchange retryExchange() {
        return new DirectExchange(retryExchange, true, false);
    }

    @Bean
    public DirectExchange dlxExchange() {
        return new DirectExchange(dlxExchange, true, false);
    }

    // --- Queues ---

    @Bean
    public Queue orderProcessQueue() {
        return QueueBuilder.durable(processQueue)
                .deadLetterExchange(dlxExchange)
                .deadLetterRoutingKey(deadletterRoutingKey)
                .build();
    }

    @Bean
    public Queue orderRetryQueue() {
        return QueueBuilder.durable(retryQueue)
                .ttl(retryDelayMs)
                .deadLetterExchange(orderExchange)
                .deadLetterRoutingKey(createdRoutingKey)
                .build();
    }

    @Bean
    public Queue orderInventoryQueue() {
        return QueueBuilder.durable(inventoryQueue).build();
    }

    @Bean
    public Queue orderSuccessQueue() {
        return QueueBuilder.durable(successQueue).build();
    }

    @Bean
    public Queue orderFailedQueue() {
        return QueueBuilder.durable(failedQueue).build();
    }

    @Bean
    public Queue orderDlq() {
        return QueueBuilder.durable(dlqQueue).build();
    }

    // --- Bindings ---

    @Bean
    public Binding processBinding() {
        return BindingBuilder.bind(orderProcessQueue())
                .to(orderExchange())
                .with(createdRoutingKey);
    }

    @Bean
    public Binding retryBinding() {
        return BindingBuilder.bind(orderRetryQueue())
                .to(retryExchange())
                .with(retryRoutingKey);
    }

    @Bean
    public Binding inventoryBinding() {
        return BindingBuilder.bind(orderInventoryQueue())
                .to(orderExchange())
                .with(inventoryRoutingKey);
    }

    @Bean
    public Binding successBinding() {
        return BindingBuilder.bind(orderSuccessQueue())
                .to(orderExchange())
                .with(completedRoutingKey);
    }

    @Bean
    public Binding failedBinding() {
        return BindingBuilder.bind(orderFailedQueue())
                .to(orderExchange())
                .with(failedRoutingKey);
    }

    @Bean
    public Binding dlqBinding() {
        return BindingBuilder.bind(orderDlq())
                .to(dlxExchange())
                .with(deadletterRoutingKey);
    }

    // --- Converters & Templates ---

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}
