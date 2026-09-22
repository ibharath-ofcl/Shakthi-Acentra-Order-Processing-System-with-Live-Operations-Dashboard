package com.acentra.order.dto;

import jakarta.validation.constraints.NotBlank;

public class CreatePaymentOrderRequest {

    @NotBlank(message = "Order number is required")
    private String orderNumber;

    public CreatePaymentOrderRequest() {
    }

    public CreatePaymentOrderRequest(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }
}
