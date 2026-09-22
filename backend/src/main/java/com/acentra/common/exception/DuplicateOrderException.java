package com.acentra.common.exception;

public class DuplicateOrderException extends RuntimeException {

    private final String idempotencyKey;

    public DuplicateOrderException(String idempotencyKey) {
        super(String.format("Duplicate order submission detected for Idempotency-Key: '%s'", idempotencyKey));
        this.idempotencyKey = idempotencyKey;
    }

    public String getIdempotencyKey() {
        return idempotencyKey;
    }
}
