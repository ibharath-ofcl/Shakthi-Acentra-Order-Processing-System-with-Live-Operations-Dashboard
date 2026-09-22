package com.acentra.order.dto;

import java.math.BigDecimal;

public class CreatePaymentOrderResponse {

    private String razorpayOrderId;
    private String orderNumber;
    private long amountInPaise;
    private BigDecimal amountInRupees;
    private String currency;
    private String keyId;

    public CreatePaymentOrderResponse() {
    }

    public CreatePaymentOrderResponse(String razorpayOrderId, String orderNumber,
                                       long amountInPaise, BigDecimal amountInRupees,
                                       String currency, String keyId) {
        this.razorpayOrderId = razorpayOrderId;
        this.orderNumber = orderNumber;
        this.amountInPaise = amountInPaise;
        this.amountInRupees = amountInRupees;
        this.currency = currency;
        this.keyId = keyId;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public long getAmountInPaise() {
        return amountInPaise;
    }

    public void setAmountInPaise(long amountInPaise) {
        this.amountInPaise = amountInPaise;
    }

    public BigDecimal getAmountInRupees() {
        return amountInRupees;
    }

    public void setAmountInRupees(BigDecimal amountInRupees) {
        this.amountInRupees = amountInRupees;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getKeyId() {
        return keyId;
    }

    public void setKeyId(String keyId) {
        this.keyId = keyId;
    }
}
