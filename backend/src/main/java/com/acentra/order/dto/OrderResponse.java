package com.acentra.order.dto;

import com.acentra.order.model.CustomerTier;
import com.acentra.order.model.Order;
import com.acentra.order.model.OrderStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

public class OrderResponse {

    private Long id;
    private String orderNumber;
    private String idempotencyKey;
    private String customerId;
    private CustomerTier customerTier;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private String failureReason;
    private List<OrderItemResponse> items;
    private Instant createdAt;
    private Instant updatedAt;

    public OrderResponse() {
    }

    public OrderResponse(Long id, String orderNumber, String idempotencyKey, String customerId,
                         CustomerTier customerTier, OrderStatus status, BigDecimal totalAmount,
                         String failureReason, List<OrderItemResponse> items,
                         Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.idempotencyKey = idempotencyKey;
        this.customerId = customerId;
        this.customerTier = customerTier;
        this.status = status;
        this.totalAmount = totalAmount;
        this.failureReason = failureReason;
        this.items = items;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static OrderResponse fromEntity(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems() != null ?
                order.getItems().stream().map(OrderItemResponse::fromEntity).collect(Collectors.toList()) :
                List.of();

        return new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getIdempotencyKey(),
                order.getCustomerId(),
                order.getCustomerTier(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getFailureReason(),
                itemResponses,
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
