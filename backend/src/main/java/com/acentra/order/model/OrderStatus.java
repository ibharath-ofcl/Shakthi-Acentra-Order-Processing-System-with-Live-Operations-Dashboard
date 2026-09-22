package com.acentra.order.model;

public enum OrderStatus {
    CREATED,
    PENDING_PAYMENT,
    PAYMENT_SUCCESS,
    PAYMENT_FAILED,
    INSUFFICIENT_STOCK,
    PROCESSING,
    COMPLETED,
    CANCELLED,
    FAILED
}
