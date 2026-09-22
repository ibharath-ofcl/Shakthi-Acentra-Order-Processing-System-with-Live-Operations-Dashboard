package com.acentra.order.model;

public enum OrderStatus {
    CREATED,
    PAYMENT_INITIATED,
    PENDING_PAYMENT,
    PAYMENT_SUCCESS,
    PAYMENT_FAILED,
    INSUFFICIENT_STOCK,
    PROCESSING,
    COMPLETED,
    CANCELLED,
    FAILED
}
