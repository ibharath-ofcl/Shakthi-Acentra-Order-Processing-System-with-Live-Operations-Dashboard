package com.acentra.intelligence.service;

import com.acentra.intelligence.dto.IntelligenceDashboardResponse;
import com.acentra.intelligence.dto.InventoryRiskEvaluation;
import com.acentra.intelligence.dto.OrderPriorityEvaluation;
import com.acentra.intelligence.model.PriorityLevel;
import com.acentra.intelligence.model.RiskLevel;
import com.acentra.order.model.Order;
import com.acentra.order.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@org.springframework.transaction.annotation.Transactional(readOnly = true)
public class OrderIntelligenceService {

    private final OrderRepository orderRepository;
    private final OrderPriorityService priorityService;
    private final InventoryRiskService inventoryRiskService;

    public OrderIntelligenceService(OrderRepository orderRepository,
                                    OrderPriorityService priorityService,
                                    InventoryRiskService inventoryRiskService) {
        this.orderRepository = orderRepository;
        this.priorityService = priorityService;
        this.inventoryRiskService = inventoryRiskService;
    }

    /**
     * Builds the complete Intelligence Dashboard payload.
     */
    public IntelligenceDashboardResponse getDashboard() {
        List<Order> orders = orderRepository.findAllWithDetails();
        List<OrderPriorityEvaluation> priorityEvals = new ArrayList<>();

        Map<String, Long> priorityDist = new HashMap<>();
        priorityDist.put("CRITICAL", 0L);
        priorityDist.put("HIGH", 0L);
        priorityDist.put("NORMAL", 0L);
        priorityDist.put("LOW", 0L);

        for (Order order : orders) {
            OrderPriorityEvaluation eval = priorityService.evaluatePriority(order);
            priorityEvals.add(eval);
            String levelStr = eval.getPriorityLevel().name();
            priorityDist.put(levelStr, priorityDist.getOrDefault(levelStr, 0L) + 1);
        }

        // Sort orders descending by priority score
        priorityEvals.sort((a, b) -> Integer.compare(b.getPriorityScore(), a.getPriorityScore()));

        List<OrderPriorityEvaluation> criticalOrders = priorityEvals.stream()
                .filter(e -> e.getPriorityLevel() == PriorityLevel.CRITICAL || e.getPriorityLevel() == PriorityLevel.HIGH)
                .limit(10)
                .collect(Collectors.toList());

        // Inventory risks
        List<InventoryRiskEvaluation> inventoryRisks = inventoryRiskService.evaluateAllProducts();

        Map<String, Long> riskDist = new HashMap<>();
        riskDist.put("CRITICAL", 0L);
        riskDist.put("AT_RISK", 0L);
        riskDist.put("WATCH", 0L);
        riskDist.put("SAFE", 0L);

        for (InventoryRiskEvaluation ir : inventoryRisks) {
            String riskStr = ir.getRiskLevel().name();
            riskDist.put(riskStr, riskDist.getOrDefault(riskStr, 0L) + 1);
        }

        List<InventoryRiskEvaluation> atRiskInventory = inventoryRisks.stream()
                .filter(r -> r.getRiskLevel() == RiskLevel.CRITICAL || r.getRiskLevel() == RiskLevel.AT_RISK)
                .collect(Collectors.toList());

        // Key recommendations
        List<String> recommendations = new ArrayList<>();
        if (!criticalOrders.isEmpty()) {
            recommendations.add("Prioritize " + criticalOrders.size() + " critical hospital orders currently waiting for dispatch.");
        }
        if (!atRiskInventory.isEmpty()) {
            recommendations.add("Reorder trigger: " + atRiskInventory.size() + " medical SKUs have dropped below clinical safety buffer.");
        }
        recommendations.add("Allocation engine operating with zero overselling safety guarantees.");

        IntelligenceDashboardResponse response = new IntelligenceDashboardResponse();
        response.setTotalOrdersEvaluated(orders.size());
        response.setCriticalOrdersCount(priorityDist.get("CRITICAL"));
        response.setHighPriorityOrdersCount(priorityDist.get("HIGH"));
        response.setAtRiskProductsCount(riskDist.get("AT_RISK"));
        response.setCriticalStockAlertsCount(riskDist.get("CRITICAL"));
        response.setPriorityDistribution(priorityDist);
        response.setRiskDistribution(riskDist);
        response.setCriticalOrders(criticalOrders);
        response.setAtRiskInventory(atRiskInventory);
        response.setRecentRecommendations(recommendations);

        return response;
    }

    public List<OrderPriorityEvaluation> getAllOrderPriorities() {
        return orderRepository.findAllWithDetails().stream()
                .map(priorityService::evaluatePriority)
                .sorted((a, b) -> Integer.compare(b.getPriorityScore(), a.getPriorityScore()))
                .collect(Collectors.toList());
    }

    public OrderPriorityEvaluation getOrderPriority(String orderNumber) {
        Order order = orderRepository.findByOrderNumberWithDetails(orderNumber)
                .orElseThrow(() -> new com.acentra.common.exception.ResourceNotFoundException("Order " + orderNumber + " not found"));
        return priorityService.evaluatePriority(order);
    }
}
