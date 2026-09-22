package com.acentra.inventory.controller;

import com.acentra.common.dto.ApiResponse;
import com.acentra.inventory.dto.InventoryResponse;
import com.acentra.inventory.dto.RestockRequest;
import com.acentra.inventory.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<InventoryResponse>>> getAllInventory() {
        List<InventoryResponse> inventory = inventoryService.getAllInventory();
        return ResponseEntity.ok(ApiResponse.success(inventory));
    }

    @GetMapping("/{sku}")
    public ResponseEntity<ApiResponse<InventoryResponse>> getInventoryBySku(@PathVariable String sku) {
        InventoryResponse response = inventoryService.getInventoryBySku(sku);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/restock")
    public ResponseEntity<ApiResponse<InventoryResponse>> restock(@Valid @RequestBody RestockRequest request) {
        InventoryResponse response = inventoryService.restock(request);
        return ResponseEntity.ok(ApiResponse.success("Product restocked successfully", response));
    }
}
