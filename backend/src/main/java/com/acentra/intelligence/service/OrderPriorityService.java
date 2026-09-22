package com.acentra.intelligence.service;

import com.acentra.inventory.model.Inventory;
import com.acentra.inventory.repository.InventoryRepository;
import com.acentra.intelligence.dto.ContributingFactor;
import com.acentra.intelligence.dto.OrderPriorityEvaluation;
import com.acentra.intelligence.model.PriorityLevel;
import com.acentra.intelligence.model.ProductCriticality;
import com.acentra.order.model.CustomerTier;
import com.acentra.order.model.Order;
import com.acentra.order.model.OrderItem;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderPriorityService {

    private final InventoryRepository inventoryRepository;

    public OrderPriorityService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    /**
     * Dynamically calculates an explainable Priority Score (0-100) for an order.
     */
    public OrderPriorityEvaluation evaluatePriority(Order order) {
        OrderPriorityEvaluation eval = new OrderPriorityEvaluation();
        eval.setOrderNumber(order.getOrderNumber());
        eval.setOrderId(order.getId());
        eval.setCustomerId(order.getCustomerId());
        eval.setCustomerTier(order.getCustomerTier() != null ? order.getCustomerTier().name() : "STANDARD");
        eval.setTotalAmount(order.getTotalAmount());
        eval.setEvaluatedAt(Instant.now());

        List<ContributingFactor> factors = new ArrayList<>();
        int score = 0;

        // 1. Medical Urgency / Tier Factor (Up to 35 pts)
        CustomerTier tier = order.getCustomerTier();
        if (tier == CustomerTier.VIP) {
            score += 35;
            factors.add(new ContributingFactor("Medical Urgency", 35, "ICU / Emergency fast-track requisition requested by medical facility"));
        } else if (tier == CustomerTier.PRIORITY) {
            score += 25;
            factors.add(new ContributingFactor("Medical Urgency", 25, "Urgent Care procedure requiring expedited dispatch"));
        } else {
            score += 10;
            factors.add(new ContributingFactor("Medical Urgency", 10, "Standard scheduled clinic consumable restocking"));
        }

        // 2. Product Criticality Factor (Up to 30 pts)
        ProductCriticality maxCriticality = ProductCriticality.STANDARD;
        int totalItemsCount = 0;
        boolean hasLowStockItem = false;
        String mostCriticalSku = "";

        if (order.getItems() != null && !order.getItems().isEmpty()) {
            for (OrderItem item : order.getItems()) {
                totalItemsCount += item.getQuantity();
                String sku = item.getProduct() != null ? item.getProduct().getSku() : "";
                ProductCriticality itemCrit = ProductCriticality.fromSku(sku);

                if (itemCrit.getPriorityWeight() > maxCriticality.getPriorityWeight()) {
                    maxCriticality = itemCrit;
                    mostCriticalSku = sku;
                }

                // Check stock contention
                if (item.getProduct() != null) {
                    Optional<Inventory> invOpt = inventoryRepository.findByProduct(item.getProduct());
                    if (invOpt.isPresent()) {
                        Inventory inv = invOpt.get();
                        if (inv.getAvailableStock() <= itemCrit.getDefaultSafetyThreshold() || inv.getAvailableStock() < item.getQuantity()) {
                            hasLowStockItem = true;
                        }
                    }
                }
            }
        }

        eval.setItemCount(totalItemsCount);
        eval.setPrimaryCriticality(maxCriticality.name());

        if (maxCriticality == ProductCriticality.LIFE_SAVING) {
            score += 30;
            factors.add(new ContributingFactor("Product Criticality", 30, "Contains Life-Saving ICU supplies / monitoring equipment (" + mostCriticalSku + ")"));
        } else if (maxCriticality == ProductCriticality.ESSENTIAL) {
            score += 20;
            factors.add(new ContributingFactor("Product Criticality", 20, "Contains essential clinical sterile sets / diagnostic equipment"));
        } else {
            score += 8;
            factors.add(new ContributingFactor("Product Criticality", 8, "General healthcare consumables"));
        }

        // 3. Stock Availability & Contention Factor (Up to 20 pts)
        if (hasLowStockItem) {
            score += 20;
            factors.add(new ContributingFactor("Inventory Contention", 20, "One or more requested SKUs are below critical safety stock threshold in warehouse"));
        } else {
            score += 5;
            factors.add(new ContributingFactor("Inventory Contention", 5, "Warehouse inventory is currently sufficient to fulfill full consignment"));
        }

        // 4. Order Age / Waiting Time Factor (Up to 15 pts)
        Instant created = order.getCreatedAt() != null ? order.getCreatedAt() : Instant.now();
        Duration age = Duration.between(created, Instant.now());
        long ageMinutes = age.toMinutes();

        if (ageMinutes >= 240) { // 4+ hours
            score += 15;
            factors.add(new ContributingFactor("Order Latency", 15, "Order waiting in pipeline for " + (ageMinutes / 60) + "h " + (ageMinutes % 60) + "m"));
        } else if (ageMinutes >= 60) { // 1+ hour
            score += 10;
            factors.add(new ContributingFactor("Order Latency", 10, "Order waiting in queue for " + ageMinutes + " minutes"));
        } else if (ageMinutes >= 15) { // 15+ mins
            score += 5;
            factors.add(new ContributingFactor("Order Latency", 5, "Order queued for " + ageMinutes + " minutes"));
        } else {
            score += 2;
            factors.add(new ContributingFactor("Order Latency", 2, "Recently ingested order (" + ageMinutes + "m old)"));
        }

        // 5. Patient Impact & Consignment Scale (Up to 10 pts)
        if (totalItemsCount >= 10 || (order.getTotalAmount() != null && order.getTotalAmount().doubleValue() >= 300)) {
            score += 10;
            factors.add(new ContributingFactor("Consignment Impact", 10, "High-volume hospital batch requisition impacting multiple clinical departments"));
        }

        // Clamp 0-100
        int finalScore = Math.min(100, Math.max(0, score));
        eval.setPriorityScore(finalScore);
        eval.setContributingFactors(factors);

        // Classification
        PriorityLevel level;
        if (finalScore >= 80) {
            level = PriorityLevel.CRITICAL;
        } else if (finalScore >= 60) {
            level = PriorityLevel.HIGH;
        } else if (finalScore >= 35) {
            level = PriorityLevel.NORMAL;
        } else {
            level = PriorityLevel.LOW;
        }
        eval.setPriorityLevel(level);

        // Generate Human-Readable Explanation
        StringBuilder sb = new StringBuilder();
        sb.append("Priority evaluated at ").append(finalScore).append("/100 (").append(level).append("). ");
        if (tier == CustomerTier.VIP) {
            sb.append("Priority increased because emergency ICU destination was declared. ");
        }
        if (maxCriticality == ProductCriticality.LIFE_SAVING) {
            sb.append("Contains life-critical healthcare supplies. ");
        }
        if (hasLowStockItem) {
            sb.append("Warehouse stock is under high contention. ");
        }
        if (ageMinutes >= 60) {
            sb.append("Order waiting time has exceeded ").append(ageMinutes).append(" minutes. ");
        }
        eval.setExplanation(sb.toString().trim());

        // Generate Actionable Recommendation
        if (level == PriorityLevel.CRITICAL) {
            eval.setRecommendation("Prioritize immediately for sterile dock fulfillment and engage dedicated express transit dispatch.");
        } else if (level == PriorityLevel.HIGH) {
            eval.setRecommendation("Fast-track allocation in next AMQP batch. Monitor inventory levels for high-demand items.");
        } else if (level == PriorityLevel.NORMAL) {
            eval.setRecommendation("Order can proceed through standard automated FIFO allocation pipeline.");
        } else {
            eval.setRecommendation("Standard queue processing. Consolidate with regional bulk logistics dispatch.");
        }

        return eval;
    }
}
