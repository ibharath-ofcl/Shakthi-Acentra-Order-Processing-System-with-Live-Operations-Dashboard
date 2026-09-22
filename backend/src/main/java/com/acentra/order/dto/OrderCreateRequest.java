package com.acentra.order.dto;

import com.acentra.order.model.CustomerTier;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class OrderCreateRequest {

    @NotBlank(message = "Customer ID is required")
    private String customerId;

    private CustomerTier customerTier = CustomerTier.STANDARD;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<OrderItemRequest> items;

    private String simulateFailure = "NONE"; // NONE, RETRY, DLQ

    public OrderCreateRequest() {
    }

    public OrderCreateRequest(String customerId, CustomerTier customerTier, List<OrderItemRequest> items) {
        this.customerId = customerId;
        this.customerTier = customerTier;
        this.items = items;
        this.simulateFailure = "NONE";
    }

    public OrderCreateRequest(String customerId, CustomerTier customerTier, List<OrderItemRequest> items, String simulateFailure) {
        this.customerId = customerId;
        this.customerTier = customerTier;
        this.items = items;
        this.simulateFailure = simulateFailure != null ? simulateFailure : "NONE";
    }

    public String getSimulateFailure() {
        return simulateFailure;
    }

    public void setSimulateFailure(String simulateFailure) {
        this.simulateFailure = simulateFailure;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public CustomerTier getCustomerTier() {
        return customerTier;
    }

    public void setCustomerTier(CustomerTier customerTier) {
        this.customerTier = customerTier;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }
}
