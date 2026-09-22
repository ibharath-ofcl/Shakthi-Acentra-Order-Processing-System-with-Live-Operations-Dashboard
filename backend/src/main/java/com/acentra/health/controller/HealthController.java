package com.acentra.health.controller;

import com.acentra.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSystemStatus() {
        Map<String, Object> status = Map.of(
                "status", "UP",
                "service", "Shakthi-Acentra Order Processing System",
                "version", "1.0.0-SNAPSHOT",
                "timestamp", Instant.now(),
                "activeModules", Map.of(
                        "orderService", "ONLINE",
                        "inventoryService", "ONLINE",
                        "concurrencyGuard", "ACTIVE"
                )
        );
        return ResponseEntity.ok(ApiResponse.success("System is operational", status));
    }
}
