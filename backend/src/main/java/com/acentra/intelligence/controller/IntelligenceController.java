package com.acentra.intelligence.controller;

import com.acentra.common.dto.ApiResponse;
import com.acentra.intelligence.dto.IntelligenceDashboardResponse;
import com.acentra.intelligence.dto.InventoryRiskEvaluation;
import com.acentra.intelligence.dto.OrderPriorityEvaluation;
import com.acentra.intelligence.dto.WhatIfSimulationRequest;
import com.acentra.intelligence.dto.WhatIfSimulationResponse;
import com.acentra.intelligence.service.InventoryRiskService;
import com.acentra.intelligence.service.OrderIntelligenceService;
import com.acentra.intelligence.service.WhatIfSimulationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/intelligence")
public class IntelligenceController {

    private final OrderIntelligenceService intelligenceService;
    private final InventoryRiskService inventoryRiskService;
    private final WhatIfSimulationService whatIfSimulationService;

    public IntelligenceController(OrderIntelligenceService intelligenceService,
                                  InventoryRiskService inventoryRiskService,
                                  WhatIfSimulationService whatIfSimulationService) {
        this.intelligenceService = intelligenceService;
        this.inventoryRiskService = inventoryRiskService;
        this.whatIfSimulationService = whatIfSimulationService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<IntelligenceDashboardResponse>> getDashboard() {
        IntelligenceDashboardResponse response = intelligenceService.getDashboard();
        return ResponseEntity.ok(ApiResponse.success("Intelligence dashboard metrics computed", response));
    }

    @GetMapping("/orders/priorities")
    public ResponseEntity<ApiResponse<List<OrderPriorityEvaluation>>> getAllOrderPriorities() {
        List<OrderPriorityEvaluation> priorities = intelligenceService.getAllOrderPriorities();
        return ResponseEntity.ok(ApiResponse.success(priorities));
    }

    @GetMapping("/orders/{orderNumber}/priority")
    public ResponseEntity<ApiResponse<OrderPriorityEvaluation>> getOrderPriority(@PathVariable String orderNumber) {
        OrderPriorityEvaluation evaluation = intelligenceService.getOrderPriority(orderNumber);
        return ResponseEntity.ok(ApiResponse.success(evaluation));
    }

    @GetMapping("/inventory/risks")
    public ResponseEntity<ApiResponse<List<InventoryRiskEvaluation>>> getInventoryRisks() {
        List<InventoryRiskEvaluation> risks = inventoryRiskService.evaluateAllProducts();
        return ResponseEntity.ok(ApiResponse.success(risks));
    }

    @PostMapping("/simulate")
    public ResponseEntity<ApiResponse<WhatIfSimulationResponse>> runWhatIfSimulation(
            @Valid @RequestBody WhatIfSimulationRequest request) {
        WhatIfSimulationResponse response = whatIfSimulationService.simulate(request);
        return ResponseEntity.ok(ApiResponse.success("What-If simulation executed successfully", response));
    }
}
