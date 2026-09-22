package com.acentra.order.dto;

import jakarta.validation.constraints.NotBlank;

public class VerifyPaymentRequest {

    private String razorpayOrderId;

    @NotBlank(message = "Razorpay payment ID is required")
    private String razorpayPaymentId;

    private String razorpaySignature;

    @NotBlank(message = "Order number is required")
    private String orderNumber;

    public VerifyPaymentRequest() {
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public String getRazorpaySignature() {
        return razorpaySignature;
    }

    public void setRazorpaySignature(String razorpaySignature) {
        this.razorpaySignature = razorpaySignature;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }
}
