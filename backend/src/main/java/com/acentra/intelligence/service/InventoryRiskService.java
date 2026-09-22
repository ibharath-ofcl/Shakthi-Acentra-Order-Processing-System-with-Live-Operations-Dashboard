package com.acentra.intelligence.service;

import com.acentra.intelligence.dto.ContributingFactor;
import com.acentra.intelligence.dto.InventoryRiskEvaluation;
import com.acentra.intelligence.model.ProductCriticality;
import com.acentra.intelligence.model.RiskLevel;
import com.acentra.inventory.model.Inventory;
import com.acentra.inventory.repository.InventoryRepository;
import com.acentra.order.model.Order;
import com.acentra.order.model.OrderItem;
import com.acentra.order.model.OrderStatus;
import com.acentra.order.repository.OrderRepository;
import com.acentra.product.model.Product;
import com.acentra.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@org.springframework.transaction.annotation.Transactional(readOnly = true)
public class InventoryRiskService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public InventoryRiskService(InventoryRepository inventoryRepository,
                                ProductRepository productRepository,
                                OrderRepository orderRepository) {
        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    /**
     * Evaluates inventory risk for all registered products in the warehouse.
     */
    public List<InventoryRiskEvaluation> evaluateAllProducts() {
        List<Product> products = productRepository.findAll();
        List<InventoryRiskEvaluation> evaluations = new ArrayList<>();

        for (Product product : products) {
            evaluations.add(evaluateProduct(product));
        }

        // Sort descending by risk score
        evaluations.sort((a, b) -> Integer.compare(b.getRiskScore(), a.getRiskScore()));
        return evaluations;
    }

    /**
     * Evaluates inventory risk for a specific product.
     */
    public InventoryRiskEvaluation evaluateProduct(Product product) {
        InventoryRiskEvaluation eval = new InventoryRiskEvaluation();
        eval.setSku(product.getSku());
        eval.setProductName(product.getName());

        ProductCriticality criticality = ProductCriticality.fromSku(product.getSku());
        eval.setCriticality(criticality);
        int safetyThreshold = criticality.getDefaultSafetyThreshold();
        eval.setReorderThreshold(safetyThreshold);

        Inventory inv = inventoryRepository.findByProduct(product).orElse(null);
        int available = inv != null ? inv.getAvailableStock() : 0;
        int reserved = inv != null ? inv.getReservedStock() : 0;
        int current = available + reserved;

        eval.setAvailableStock(available);
        eval.setReservedStock(reserved);
        eval.setCurrentStock(current);

        // Count pending orders and consumption velocity from actual orders
        List<Order> allOrders = orderRepository.findAllWithDetails();
        int pendingDemand = 0;
        int recentConsumedUnits = 0;
        int pendingOrdersCount = 0;

        for (Order order : allOrders) {
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    if (item.getProduct() != null && item.getProduct().getSku().equals(product.getSku())) {
                        if (order.getStatus() == OrderStatus.CREATED ||
                            order.getStatus() == OrderStatus.PROCESSING ||
                            order.getStatus() == OrderStatus.PAYMENT_INITIATED) {
                            pendingDemand += item.getQuantity();
                            pendingOrdersCount++;
                        } else if (order.getStatus() == OrderStatus.COMPLETED ||
                                   order.getStatus() == OrderStatus.PAYMENT_SUCCESS) {
                            recentConsumedUnits += item.getQuantity();
                        }
                    }
                }
            }
        }

        eval.setPendingOrdersCount(pendingOrdersCount);

        // Estimated daily demand (baseline + actual order consumption velocity)
        double estimatedDailyDemand = Math.max(2.0, (recentConsumedUnits * 0.4) + (pendingDemand * 0.3) + 3.0);
        eval.setEstimatedDailyDemand(Math.round(estimatedDailyDemand * 10.0) / 10.0);

        // Projected days remaining before stockout
        double daysRemaining = estimatedDailyDemand > 0 ? (available / estimatedDailyDemand) : 99.0;
        eval.setProjectedDaysRemaining(Math.round(daysRemaining * 10.0) / 10.0);

        // Projected shortage
        int projectedShortage = Math.max(0, safetyThreshold - available);
        eval.setProjectedShortage(projectedShortage);

        // Recommended reorder quantity
        int targetReserve = safetyThreshold * 3;
        int recommendedReorder = Math.max(0, targetReserve - available + pendingDemand);
        eval.setRecommendedReorderQuantity(recommendedReorder);

        // Calculate dynamic risk score (0-100)
        List<ContributingFactor> factors = new ArrayList<>();
        int riskScore = 0;

        // Factor 1: Available stock vs safety threshold (Up to 45 pts)
        if (available <= 5) {
            riskScore += 45;
            factors.add(new ContributingFactor("Depletion Depth", 45, "Severe stock exhaustion: Only " + available + " units remaining in warehouse"));
        } else if (available <= safetyThreshold) {
            riskScore += 30;
            factors.add(new ContributingFactor("Depletion Depth", 30, "Available stock (" + available + ") is below clinical safety threshold (" + safetyThreshold + ")"));
        } else if (available <= safetyThreshold * 2) {
            riskScore += 15;
            factors.add(new ContributingFactor("Depletion Depth", 15, "Stock is in transitional watch level"));
        } else {
            riskScore += 5;
            factors.add(new ContributingFactor("Depletion Depth", 5, "Warehouse inventory meets standard operating buffer"));
        }

        // Factor 2: Criticality Impact (Up to 30 pts)
        if (criticality == ProductCriticality.LIFE_SAVING) {
            riskScore += 30;
            factors.add(new ContributingFactor("Clinical Impact", 30, "Life-Saving medical equipment with zero tolerance for stockouts"));
        } else if (criticality == ProductCriticality.ESSENTIAL) {
            riskScore += 18;
            factors.add(new ContributingFactor("Clinical Impact", 18, "Essential diagnostic/sterile surgical supply"));
        } else {
            riskScore += 8;
            factors.add(new ContributingFactor("Clinical Impact", 8, "General healthcare product"));
        }

        // Factor 3: Pending Allocation Pressure (Up to 25 pts)
        if (pendingDemand > available) {
            riskScore += 25;
            factors.add(new ContributingFactor("Pending Pressure", 25, "Unallocated demand (" + pendingDemand + " units) exceeds available stock (" + available + " units)"));
        } else if (pendingDemand > 0) {
            riskScore += 12;
            factors.add(new ContributingFactor("Pending Pressure", 12, "Active pending orders claim " + pendingDemand + " units"));
        }

        int finalScore = Math.min(100, Math.max(0, riskScore));
        eval.setRiskScore(finalScore);
        eval.setContributingFactors(factors);

        // Classification
        RiskLevel level;
        if (finalScore >= 75) {
            level = RiskLevel.CRITICAL;
        } else if (finalScore >= 50) {
            level = RiskLevel.AT_RISK;
        } else if (finalScore >= 30) {
            level = RiskLevel.WATCH;
        } else {
            level = RiskLevel.SAFE;
        }
        eval.setRiskLevel(level);

        // Actionable Recommendation
        if (level == RiskLevel.CRITICAL) {
            eval.setRecommendation("TRIGGER EMERGENCY REPLENISHMENT: Reorder " + recommendedReorder + " units immediately. Restrict non-ICU allocations.");
        } else if (level == RiskLevel.AT_RISK) {
            eval.setRecommendation("REORDER SOON: Stockout estimated within " + eval.getProjectedDaysRemaining() + " days. Issue purchase order for " + recommendedReorder + " units.");
        } else if (level == RiskLevel.WATCH) {
            eval.setRecommendation("MONITOR VELOCITY: Safe for next " + eval.getProjectedDaysRemaining() + " days. Schedule replenishment in next routine cycle.");
        } else {
            eval.setRecommendation("NOMINAL: Healthy reserves. Stock levels sufficient to cover projected clinical demand.");
        }

        return eval;
    }
}
