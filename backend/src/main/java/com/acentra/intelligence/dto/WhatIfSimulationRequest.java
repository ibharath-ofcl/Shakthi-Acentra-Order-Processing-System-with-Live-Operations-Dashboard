package com.acentra.intelligence.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class WhatIfSimulationRequest {

    @NotBlank(message = "Product SKU is required")
    private String sku;

    @Min(value = 0, message = "Incoming stock must be 0 or positive")
    private int incomingStock;

    @Min(value = 0, message = "Expected additional demand must be 0 or positive")
    private int expectedAdditionalDemand;

    @Min(value = 1, message = "Simulation days must be at least 1")
    private int days = 7;

    public WhatIfSimulationRequest() {
    }

    public WhatIfSimulationRequest(String sku, int incomingStock, int expectedAdditionalDemand, int days) {
        this.sku = sku;
        this.incomingStock = incomingStock;
        this.expectedAdditionalDemand = expectedAdditionalDemand;
        this.days = days;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public int getIncomingStock() {
        return incomingStock;
    }

    public void setIncomingStock(int incomingStock) {
        this.incomingStock = incomingStock;
    }

    public int getExpectedAdditionalDemand() {
        return expectedAdditionalDemand;
    }

    public void setExpectedAdditionalDemand(int expectedAdditionalDemand) {
        this.expectedAdditionalDemand = expectedAdditionalDemand;
    }

    public int getDays() {
        return days;
    }

    public void setDays(int days) {
        this.days = days;
    }
}
