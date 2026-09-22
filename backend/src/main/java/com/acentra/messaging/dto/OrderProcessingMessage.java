package com.acentra.messaging.dto;

import com.acentra.order.dto.OrderItemRequest;
import com.acentra.order.model.CustomerTier;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

public class OrderProcessingMessage implements Serializable {

    private String orderNumber;
    private String idempotencyKey;
    private String customerId;
    private CustomerTier customerTier;
    private List<OrderItemRequest> items;
    private int retryCount = 0;
    private String simulateFailure = "NONE"; // NONE, RETRY, DLQ
    private Instant createdAt;

    public OrderProcessingMessage() {
        this.createdAt = Instant.now();
    }

    public OrderProcessingMessage(String orderNumber, String idempotencyKey, String customerId,
                                  CustomerTier customerTier, List<OrderItemRequest> items,
                                  String simulateFailure) {
        this.orderNumber = orderNumber;
        this.idempotencyKey = idempotencyKey;
        this.customerId = customerId;
        this.customerTier = customerTier != null ? customerTier : CustomerTier.STANDARD;
        this.items = items;
        this.retryCount = 0;
        this.simulateFailure = simulateFailure != null ? simulateFailure : "NONE";
        this.createdAt = Instant.now();
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getIdempotencyKey() {
        return idempotencyKey;
    }

    public void setIdempotencyKey(String idempotencyKey) {
        this.idempotencyKey = idempotencyKey;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public CustomerTier getCustomerTier() {
        return customerTier;
    }

    public void setCustomerTier(CustomerTier customerTier) {
        this.customerTier = customerTier;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }

    public int getRetryCount() {
        return retryCount;
    }

    public void setRetryCount(int retryCount) {
        this.retryCount = retryCount;
    }

    public String getSimulateFailure() {
        return simulateFailure;
    }

    public void setSimulateFailure(String simulateFailure) {
        this.simulateFailure = simulateFailure;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
