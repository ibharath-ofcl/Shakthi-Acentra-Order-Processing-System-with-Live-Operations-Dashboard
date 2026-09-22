package com.acentra.operations.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "operational_events", indexes = {
        @Index(name = "idx_op_event_timestamp", columnList = "timestamp"),
        @Index(name = "idx_op_event_order", columnList = "order_number"),
        @Index(name = "idx_op_event_type", columnList = "event_type")
})
public class OperationalEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, length = 32)
    private OperationalEventType eventType;

    @Column(name = "order_number", nullable = false, length = 64)
    private String orderNumber;

    @Column(name = "customer_id", length = 64)
    private String customerId;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(name = "retry_count", nullable = false)
    private int retryCount = 0;

    @Column(nullable = false, updatable = false)
    private Instant timestamp;

    public OperationalEvent() {
    }

    public OperationalEvent(OperationalEventType eventType, String orderNumber, String customerId, String details, int retryCount) {
        this.eventType = eventType;
        this.orderNumber = orderNumber;
        this.customerId = customerId;
        this.details = details;
        this.retryCount = retryCount;
    }

    @PrePersist
    protected void onCreate() {
        if (this.timestamp == null) {
            this.timestamp = Instant.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public OperationalEventType getEventType() {
        return eventType;
    }

    public void setEventType(OperationalEventType eventType) {
        this.eventType = eventType;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public int getRetryCount() {
        return retryCount;
    }

    public void setRetryCount(int retryCount) {
        this.retryCount = retryCount;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
