package com.acentra.order.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class OrderItemRequest {

    @NotBlank(message = "Product SKU is required")
    private String sku;

    @Min(value = 1, message = "Item quantity must be at least 1")
    private int quantity;

    public OrderItemRequest() {
    }

    public OrderItemRequest(String sku, int quantity) {
        this.sku = sku;
        this.quantity = quantity;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
