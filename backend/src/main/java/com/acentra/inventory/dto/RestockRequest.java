package com.acentra.inventory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class RestockRequest {

    @NotBlank(message = "Product SKU is required for restocking")
    private String sku;

    @Min(value = 1, message = "Quantity to add must be at least 1")
    private int quantityToAdd;

    private String notes;

    public RestockRequest() {
    }

    public RestockRequest(String sku, int quantityToAdd, String notes) {
        this.sku = sku;
        this.quantityToAdd = quantityToAdd;
        this.notes = notes;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public int getQuantityToAdd() {
        return quantityToAdd;
    }

    public void setQuantityToAdd(int quantityToAdd) {
        this.quantityToAdd = quantityToAdd;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
