package com.acentra.intelligence.dto;

import java.util.List;
import java.util.Map;

public class IntelligenceDashboardResponse {
    private long totalOrdersEvaluated;
    private long criticalOrdersCount;
    private long highPriorityOrdersCount;
    private long atRiskProductsCount;
    private long criticalStockAlertsCount;
    private Map<String, Long> priorityDistribution;
    private Map<String, Long> riskDistribution;
    private List<OrderPriorityEvaluation> criticalOrders;
    private List<InventoryRiskEvaluation> atRiskInventory;
    private List<String> recentRecommendations;

    public IntelligenceDashboardResponse() {
    }

    public long getTotalOrdersEvaluated() {
        return totalOrdersEvaluated;
    }

    public void setTotalOrdersEvaluated(long totalOrdersEvaluated) {
        this.totalOrdersEvaluated = totalOrdersEvaluated;
    }

    public long getCriticalOrdersCount() {
        return criticalOrdersCount;
    }

    public void setCriticalOrdersCount(long criticalOrdersCount) {
        this.criticalOrdersCount = criticalOrdersCount;
    }

    public long getHighPriorityOrdersCount() {
        return highPriorityOrdersCount;
    }

    public void setHighPriorityOrdersCount(long highPriorityOrdersCount) {
        this.highPriorityOrdersCount = highPriorityOrdersCount;
    }

    public long getAtRiskProductsCount() {
        return atRiskProductsCount;
    }

    public void setAtRiskProductsCount(long atRiskProductsCount) {
        this.atRiskProductsCount = atRiskProductsCount;
    }

    public long getCriticalStockAlertsCount() {
        return criticalStockAlertsCount;
    }

    public void setCriticalStockAlertsCount(long criticalStockAlertsCount) {
        this.criticalStockAlertsCount = criticalStockAlertsCount;
    }

    public Map<String, Long> getPriorityDistribution() {
        return priorityDistribution;
    }

    public void setPriorityDistribution(Map<String, Long> priorityDistribution) {
        this.priorityDistribution = priorityDistribution;
    }

    public Map<String, Long> getRiskDistribution() {
        return riskDistribution;
    }

    public void setRiskDistribution(Map<String, Long> riskDistribution) {
        this.riskDistribution = riskDistribution;
    }

    public List<OrderPriorityEvaluation> getCriticalOrders() {
        return criticalOrders;
    }

    public void setCriticalOrders(List<OrderPriorityEvaluation> criticalOrders) {
        this.criticalOrders = criticalOrders;
    }

    public List<InventoryRiskEvaluation> getAtRiskInventory() {
        return atRiskInventory;
    }

    public void setAtRiskInventory(List<InventoryRiskEvaluation> atRiskInventory) {
        this.atRiskInventory = atRiskInventory;
    }

    public List<String> getRecentRecommendations() {
        return recentRecommendations;
    }

    public void setRecentRecommendations(List<String> recentRecommendations) {
        this.recentRecommendations = recentRecommendations;
    }
}
