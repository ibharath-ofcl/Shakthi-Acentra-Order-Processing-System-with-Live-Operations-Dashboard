package com.acentra.config;

import com.acentra.messaging.producer.OrderEventProducer;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

import static org.mockito.Mockito.mock;

@TestConfiguration
public class TestRabbitConfig {

    @Bean
    @Primary
    public ConnectionFactory connectionFactory() {
        return mock(ConnectionFactory.class);
    }

    @Bean
    @Primary
    public OrderEventProducer orderEventProducer() {
        return mock(OrderEventProducer.class);
    }
}
