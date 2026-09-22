package com.acentra.operations.dto;

import com.acentra.operations.model.OperationalEvent;
import com.acentra.operations.model.OperationalEventType;
import java.time.Instant;

public class OperationalEventResponse {

    private Long id;
    private OperationalEventType eventType;
    private String orderNumber;
    private String customerId;
    private String details;
    private int retryCount;
    private Instant timestamp;

    public OperationalEventResponse() {
    }

    public OperationalEventResponse(Long id, OperationalEventType eventType, String orderNumber, String customerId, String details, int retryCount, Instant timestamp) {
        this.id = id;
        this.eventType = eventType;
        this.orderNumber = orderNumber;
        this.customerId = customerId;
        this.details = details;
        this.retryCount = retryCount;
        this.timestamp = timestamp;
    }

    public static OperationalEventResponse fromEntity(OperationalEvent event) {
        return new OperationalEventResponse(
                event.getId(),
                event.getEventType(),
                event.getOrderNumber(),
                event.getCustomerId(),
                event.getDetails(),
                event.getRetryCount(),
                event.getTimestamp()
        );
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
