package com.acentra.intelligence.dto;

import com.acentra.intelligence.model.PriorityLevel;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class OrderPriorityEvaluation {
    private String orderNumber;
    private Long orderId;
    private String customerId;
    private String customerTier;
    private int priorityScore;
    private PriorityLevel priorityLevel;
    private BigDecimal totalAmount;
    private int itemCount;
    private String primaryCriticality;
    private String recommendation;
    private String explanation;
    private List<ContributingFactor> contributingFactors;
    private Instant evaluatedAt;

    public OrderPriorityEvaluation() {
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getCustomerTier() {
        return customerTier;
    }

    public void setCustomerTier(String customerTier) {
        this.customerTier = customerTier;
    }

    public int getPriorityScore() {
        return priorityScore;
    }

    public void setPriorityScore(int priorityScore) {
        this.priorityScore = priorityScore;
    }

    public PriorityLevel getPriorityLevel() {
        return priorityLevel;
    }

    public void setPriorityLevel(PriorityLevel priorityLevel) {
        this.priorityLevel = priorityLevel;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public int getItemCount() {
        return itemCount;
    }

    public void setItemCount(int itemCount) {
        this.itemCount = itemCount;
    }

    public String getPrimaryCriticality() {
        return primaryCriticality;
    }

    public void setPrimaryCriticality(String primaryCriticality) {
        this.primaryCriticality = primaryCriticality;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public List<ContributingFactor> getContributingFactors() {
        return contributingFactors;
    }

    public void setContributingFactors(List<ContributingFactor> contributingFactors) {
        this.contributingFactors = contributingFactors;
    }

    public Instant getEvaluatedAt() {
        return evaluatedAt;
    }

    public void setEvaluatedAt(Instant evaluatedAt) {
        this.evaluatedAt = evaluatedAt;
    }
}
