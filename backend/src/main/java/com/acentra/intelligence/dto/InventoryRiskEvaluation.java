package com.acentra.intelligence.dto;

import com.acentra.intelligence.model.ProductCriticality;
import com.acentra.intelligence.model.RiskLevel;
import java.util.List;

public class InventoryRiskEvaluation {
    private String sku;
    private String productName;
    private ProductCriticality criticality;
    private int riskScore;
    private RiskLevel riskLevel;
    private int currentStock;
    private int reservedStock;
    private int availableStock;
    private int reorderThreshold;
    private double estimatedDailyDemand;
    private double projectedDaysRemaining;
    private int projectedShortage;
    private int recommendedReorderQuantity;
    private int pendingOrdersCount;
    private String recommendation;
    private List<ContributingFactor> contributingFactors;

    public InventoryRiskEvaluation() {
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public ProductCriticality getCriticality() {
        return criticality;
    }

    public void setCriticality(ProductCriticality criticality) {
        this.criticality = criticality;
    }

    public int getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(int riskScore) {
        this.riskScore = riskScore;
    }

    public RiskLevel getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(RiskLevel riskLevel) {
        this.riskLevel = riskLevel;
    }

    public int getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(int currentStock) {
        this.currentStock = currentStock;
    }

    public int getReservedStock() {
        return reservedStock;
    }

    public void setReservedStock(int reservedStock) {
        this.reservedStock = reservedStock;
    }

    public int getAvailableStock() {
        return availableStock;
    }

    public void setAvailableStock(int availableStock) {
        this.availableStock = availableStock;
    }

    public int getReorderThreshold() {
        return reorderThreshold;
    }

    public void setReorderThreshold(int reorderThreshold) {
        this.reorderThreshold = reorderThreshold;
    }

    public double getEstimatedDailyDemand() {
        return estimatedDailyDemand;
    }

    public void setEstimatedDailyDemand(double estimatedDailyDemand) {
        this.estimatedDailyDemand = estimatedDailyDemand;
    }

    public double getProjectedDaysRemaining() {
        return projectedDaysRemaining;
    }

    public void setProjectedDaysRemaining(double projectedDaysRemaining) {
        this.projectedDaysRemaining = projectedDaysRemaining;
    }

    public int getProjectedShortage() {
        return projectedShortage;
    }

    public void setProjectedShortage(int projectedShortage) {
        this.projectedShortage = projectedShortage;
    }

    public int getRecommendedReorderQuantity() {
        return recommendedReorderQuantity;
    }

    public void setRecommendedReorderQuantity(int recommendedReorderQuantity) {
        this.recommendedReorderQuantity = recommendedReorderQuantity;
    }

    public int getPendingOrdersCount() {
        return pendingOrdersCount;
    }

    public void setPendingOrdersCount(int pendingOrdersCount) {
        this.pendingOrdersCount = pendingOrdersCount;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public List<ContributingFactor> getContributingFactors() {
        return contributingFactors;
    }

    public void setContributingFactors(List<ContributingFactor> contributingFactors) {
        this.contributingFactors = contributingFactors;
    }
}
