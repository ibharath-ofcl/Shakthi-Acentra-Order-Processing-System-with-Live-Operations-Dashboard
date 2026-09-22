package com.acentra.order;

import com.acentra.config.TestRabbitConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(TestRabbitConfig.class)
public class OrderControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/v1/health should return UP status")
    void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("UP"));
    }

    @Test
    @DisplayName("GET /api/v1/operations/statistics should return operational metrics")
    void testOperationsStatisticsEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/operations/statistics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.ordersByStatus").isMap())
                .andExpect(jsonPath("$.data.eventsByType").isMap());
    }

    @Test
    @DisplayName("Complete Flow: Create Product -> Async Order Intake -> Fetch Order -> Cancel Order")
    void testFullOrderLifecycleFlow() throws Exception {
        String sku = "MONITOR-4K-" + UUID.randomUUID().toString().substring(0, 5);

        // 1. Create Product
        Map<String, Object> productPayload = Map.of(
                "sku", sku,
                "name", "Ultra HD 4K Monitor",
                "description", "32-inch gaming and dev monitor",
                "price", 499.99,
                "initialStock", 15
        );

        mockMvc.perform(post("/api/v1/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productPayload)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.sku").value(sku));

        // 2. Submit Order (Asynchronously ingested into RabbitMQ)
        String idempotencyKey = "key-" + UUID.randomUUID();
        Map<String, Object> orderPayload = Map.of(
                "customerId", "CUST-REST-1",
                "customerTier", "VIP",
                "items", List.of(Map.of("sku", sku, "quantity", 2))
        );

        String responseContent = mockMvc.perform(post("/api/v1/orders")
                        .header("Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderPayload)))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.data.status").value("CREATED"))
                .andExpect(jsonPath("$.data.totalAmount").value(999.98))
                .andReturn().getResponse().getContentAsString();

        String orderNumber = objectMapper.readTree(responseContent).path("data").path("orderNumber").asText();

        // 3. Fetch Order Details
        mockMvc.perform(get("/api/v1/orders/" + orderNumber))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.orderNumber").value(orderNumber))
                .andExpect(jsonPath("$.data.status").value("CREATED"))
                .andExpect(jsonPath("$.data.items", hasSize(1)));

        // 4. Verify Operational Events recorded
        mockMvc.perform(get("/api/v1/operations/events/" + orderNumber))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data[0].eventType").value("ORDER_RECEIVED"));

        // 5. Cancel Order
        Map<String, String> cancelPayload = Map.of("reason", "Customer requested cancellation");
        mockMvc.perform(post("/api/v1/orders/" + orderNumber + "/cancel")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(cancelPayload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("CANCELLED"));
    }
}
