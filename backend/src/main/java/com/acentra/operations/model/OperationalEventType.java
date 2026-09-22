package com.acentra.operations.model;

public enum OperationalEventType {
    ORDER_RECEIVED,
    ORDER_PROCESSING,
    INVENTORY_RESERVED,
    ORDER_COMPLETED,
    ORDER_FAILED,
    ORDER_RETRIED,
    ORDER_SENT_TO_DLQ
}
