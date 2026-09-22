package com.acentra.operations.dto;

import java.time.Instant;
import java.util.Map;

public class SystemStatisticsResponse {

    private Instant timestamp;
    private long totalOrders;
    private Map<String, Long> ordersByStatus;
    private Map<String, Long> eventsByType;
    private long dlqCount;
    private int totalProducts;
    private int totalStockAvailable;
    private int totalStockReserved;

    public SystemStatisticsResponse() {
        this.timestamp = Instant.now();
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public Map<String, Long> getOrdersByStatus() {
        return ordersByStatus;
    }

    public void setOrdersByStatus(Map<String, Long> ordersByStatus) {
        this.ordersByStatus = ordersByStatus;
    }

    public Map<String, Long> getEventsByType() {
        return eventsByType;
    }

    public void setEventsByType(Map<String, Long> eventsByType) {
        this.eventsByType = eventsByType;
    }

    public long getDlqCount() {
        return dlqCount;
    }

    public void setDlqCount(long dlqCount) {
        this.dlqCount = dlqCount;
    }

    public int getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(int totalProducts) {
        this.totalProducts = totalProducts;
    }

    public int getTotalStockAvailable() {
        return totalStockAvailable;
    }

    public void setTotalStockAvailable(int totalStockAvailable) {
        this.totalStockAvailable = totalStockAvailable;
    }

    public int getTotalStockReserved() {
        return totalStockReserved;
    }

    public void setTotalStockReserved(int totalStockReserved) {
        this.totalStockReserved = totalStockReserved;
    }
}
