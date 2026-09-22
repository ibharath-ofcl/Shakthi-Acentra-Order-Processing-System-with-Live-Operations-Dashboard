package com.acentra.intelligence.service;

import com.acentra.common.exception.ResourceNotFoundException;
import com.acentra.intelligence.dto.ContributingFactor;
import com.acentra.intelligence.dto.WhatIfSimulationRequest;
import com.acentra.intelligence.dto.WhatIfSimulationResponse;
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
public class WhatIfSimulationService {

    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final OrderRepository orderRepository;

    public WhatIfSimulationService(ProductRepository productRepository,
                                   InventoryRepository inventoryRepository,
                                   OrderRepository orderRepository) {
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.orderRepository = orderRepository;
    }

    /**
     * Executes an explainable What-If Inventory Simulation without mutating production data.
     */
    public WhatIfSimulationResponse simulate(WhatIfSimulationRequest request) {
        Product product = productRepository.findBySku(request.getSku())
                .orElseThrow(() -> new ResourceNotFoundException("Product with SKU: " + request.getSku() + " not found"));

        Inventory inv = inventoryRepository.findByProduct(product).orElse(null);
        int currentStock = inv != null ? inv.getAvailableStock() : 0;
        int incoming = request.getIncomingStock();
        int days = Math.max(1, request.getDays());

        ProductCriticality criticality = ProductCriticality.fromSku(product.getSku());
        int threshold = criticality.getDefaultSafetyThreshold();

        // 1. Calculate Baseline Daily Demand from actual recent order history
        List<Order> orders = orderRepository.findAllWithDetails();
        int activePendingDemand = 0;
        int activePendingOrdersCount = 0;

        for (Order order : orders) {
            if (order.getItems() != null &&
                (order.getStatus() == OrderStatus.CREATED ||
                 order.getStatus() == OrderStatus.PROCESSING ||
                 order.getStatus() == OrderStatus.PAYMENT_INITIATED)) {
                for (OrderItem item : order.getItems()) {
                    if (item.getProduct() != null && item.getProduct().getSku().equals(product.getSku())) {
                        activePendingDemand += item.getQuantity();
                        activePendingOrdersCount++;
                    }
                }
            }
        }

        // Daily base consumption rate
        int baselineDailyRate = Math.max(2, (int) Math.round(activePendingDemand * 0.3) + 3);
        int totalBaselineDemand = baselineDailyRate * days;
        int additionalDemand = request.getExpectedAdditionalDemand();
        int totalProjectedDemand = totalBaselineDemand + additionalDemand;

        // 2. Net Projected Ending Stock Calculation
        int netProjectedStock = currentStock + incoming - totalProjectedDemand;
        int shortageOrExcess = netProjectedStock - threshold;

        // 3. Risk Level Determination
        RiskLevel projectedRisk;
        if (netProjectedStock <= 0) {
            projectedRisk = RiskLevel.CRITICAL;
        } else if (netProjectedStock < threshold) {
            projectedRisk = RiskLevel.AT_RISK;
        } else if (netProjectedStock < threshold * 2) {
            projectedRisk = RiskLevel.WATCH;
        } else {
            projectedRisk = RiskLevel.SAFE;
        }

        // 4. Affected Orders Calculation
        int affectedOrders = 0;
        if (netProjectedStock <= 0) {
            affectedOrders = activePendingOrdersCount + (Math.abs(netProjectedStock) / 3) + 1;
        } else if (netProjectedStock < activePendingDemand) {
            affectedOrders = Math.max(1, activePendingOrdersCount / 2);
        }

        // 5. Factors Breakdown
        List<ContributingFactor> factors = new ArrayList<>();
        factors.add(new ContributingFactor("Current Warehouse Stock", currentStock, "Existing physical reserve at sterile dock"));
        factors.add(new ContributingFactor("Simulated Incoming Supply", incoming, "+" + incoming + " units expected via supply shipment"));
        factors.add(new ContributingFactor("Baseline Projected Demand", totalBaselineDemand, baselineDailyRate + " units/day across " + days + " simulation days"));
        factors.add(new ContributingFactor("Simulated Surge Demand", additionalDemand, "+" + additionalDemand + " units peak outbreak/procedure requisition"));

        // 6. Recommended Action & Explanation
        String recommendedAction;
        String explanation;

        if (netProjectedStock < 0) {
            int deficit = Math.abs(netProjectedStock);
            recommendedAction = "URGENT ACTION REQUIRED: Stockout of " + deficit + " units projected. Fast-track emergency purchase order for at least " + (deficit + threshold * 2) + " units before accepting surge orders.";
            explanation = "With current stock (" + currentStock + ") + incoming (" + incoming + "), total projected demand of " + totalProjectedDemand + " units will result in an inventory deficit of -" + deficit + " units within " + days + " days.";
        } else if (netProjectedStock < threshold) {
            recommendedAction = "PRE-EMPTIVE RESTOCKING: Inventory will drop to " + netProjectedStock + " units (below safety buffer of " + threshold + "). Schedule batch restock of " + (threshold * 2 - netProjectedStock) + " units.";
            explanation = "Ending stock (" + netProjectedStock + ") will fulfill demand but breach the clinical safety threshold of " + threshold + " units.";
        } else {
            recommendedAction = "OPTIMAL INVENTORY POSTURE: Projected balance of " + netProjectedStock + " units provides a healthy buffer above safety threshold (" + threshold + "). Safe to proceed with all planned allocations.";
            explanation = "Incoming shipments and current warehouse reserves will comfortably satisfy the projected " + days + "-day demand of " + totalProjectedDemand + " units.";
        }

        WhatIfSimulationResponse response = new WhatIfSimulationResponse();
        response.setSku(product.getSku());
        response.setProductName(product.getName());
        response.setCurrentStock(currentStock);
        response.setIncomingStock(incoming);
        response.setBaselineDemand(totalBaselineDemand);
        response.setAdditionalDemand(additionalDemand);
        response.setTotalProjectedDemand(totalProjectedDemand);
        response.setProjectedEndingStock(netProjectedStock);
        response.setShortageOrExcess(shortageOrExcess);
        response.setProjectedRiskLevel(projectedRisk);
        response.setAffectedOrdersCount(affectedOrders);
        response.setRecommendedAction(recommendedAction);
        response.setExplanation(explanation);
        response.setSimulationFactors(factors);

        return response;
    }
}
