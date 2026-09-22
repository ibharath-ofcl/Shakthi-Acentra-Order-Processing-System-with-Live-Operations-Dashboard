package com.acentra.intelligence.dto;

import com.acentra.intelligence.model.RiskLevel;
import java.util.List;

public class WhatIfSimulationResponse {
    private String sku;
    private String productName;
    private int currentStock;
    private int incomingStock;
    private int baselineDemand;
    private int additionalDemand;
    private int totalProjectedDemand;
    private int projectedEndingStock;
    private int shortageOrExcess;
    private RiskLevel projectedRiskLevel;
    private int affectedOrdersCount;
    private String recommendedAction;
    private String explanation;
    private List<ContributingFactor> simulationFactors;

    public WhatIfSimulationResponse() {
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

    public int getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(int currentStock) {
        this.currentStock = currentStock;
    }

    public int getIncomingStock() {
        return incomingStock;
    }

    public void setIncomingStock(int incomingStock) {
        this.incomingStock = incomingStock;
    }

    public int getBaselineDemand() {
        return baselineDemand;
    }

    public void setBaselineDemand(int baselineDemand) {
        this.baselineDemand = baselineDemand;
    }

    public int getAdditionalDemand() {
        return additionalDemand;
    }

    public void setAdditionalDemand(int additionalDemand) {
        this.additionalDemand = additionalDemand;
    }

    public int getTotalProjectedDemand() {
        return totalProjectedDemand;
    }

    public void setTotalProjectedDemand(int totalProjectedDemand) {
        this.totalProjectedDemand = totalProjectedDemand;
    }

    public int getProjectedEndingStock() {
        return projectedEndingStock;
    }

    public void setProjectedEndingStock(int projectedEndingStock) {
        this.projectedEndingStock = projectedEndingStock;
    }

    public int getShortageOrExcess() {
        return shortageOrExcess;
    }

    public void setShortageOrExcess(int shortageOrExcess) {
        this.shortageOrExcess = shortageOrExcess;
    }

    public RiskLevel getProjectedRiskLevel() {
        return projectedRiskLevel;
    }

    public void setProjectedRiskLevel(RiskLevel projectedRiskLevel) {
        this.projectedRiskLevel = projectedRiskLevel;
    }

    public int getAffectedOrdersCount() {
        return affectedOrdersCount;
    }

    public void setAffectedOrdersCount(int affectedOrdersCount) {
        this.affectedOrdersCount = affectedOrdersCount;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }

    public void setRecommendedAction(String recommendedAction) {
        this.recommendedAction = recommendedAction;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public List<ContributingFactor> getSimulationFactors() {
        return simulationFactors;
    }

    public void setSimulationFactors(List<ContributingFactor> simulationFactors) {
        this.simulationFactors = simulationFactors;
    }
}
