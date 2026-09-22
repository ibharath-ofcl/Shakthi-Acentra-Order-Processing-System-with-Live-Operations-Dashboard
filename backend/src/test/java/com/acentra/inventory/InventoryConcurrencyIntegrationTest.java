package com.acentra.inventory;

import com.acentra.common.exception.InsufficientStockException;
import com.acentra.inventory.model.Inventory;
import com.acentra.inventory.repository.InventoryRepository;
import com.acentra.order.dto.OrderCreateRequest;
import com.acentra.order.dto.OrderItemRequest;
import com.acentra.order.model.CustomerTier;
import com.acentra.order.service.OrderService;
import com.acentra.product.dto.ProductCreateRequest;
import com.acentra.product.service.ProductService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("test")
public class InventoryConcurrencyIntegrationTest {

    @Autowired
    private ProductService productService;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private OrderService orderService;

    @Test
    @DisplayName("Zero-Overselling Concurrency Test: 25 concurrent threads competing for 10 units")
    void testConcurrentOrdersDoNotOversell() throws InterruptedException {
        String testSku = "FLASH-DEAL-" + UUID.randomUUID().toString().substring(0, 6);
        int initialStock = 10;
        int totalAttempts = 25;

        // 1. Create product with initial inventory of 10 units
        productService.createProduct(new ProductCreateRequest(
                testSku,
                "Flash Sale Gadget",
                "High demand item",
                new BigDecimal("99.99"),
                initialStock
        ));

        ExecutorService executor = Executors.newFixedThreadPool(10);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch finishLatch = new CountDownLatch(totalAttempts);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failedCount = new AtomicInteger(0);

        // 2. Submit 25 concurrent orders in parallel
        for (int i = 0; i < totalAttempts; i++) {
            final String idempotencyKey = "key-concur-" + i + "-" + UUID.randomUUID();
            final String customerId = "CUST-" + i;

            executor.submit(() -> {
                try {
                    startLatch.await(); // Ensure all threads start simultaneously

                    OrderCreateRequest request = new OrderCreateRequest(
                            customerId,
                            CustomerTier.STANDARD,
                            List.of(new OrderItemRequest(testSku, 1))
                    );

                    orderService.createOrder(idempotencyKey, request);
                    successCount.incrementAndGet();
                } catch (InsufficientStockException ex) {
                    failedCount.incrementAndGet();
                } catch (Exception ex) {
                    System.err.println("Unexpected exception in thread: " + ex.getMessage());
                } finally {
                    finishLatch.countDown();
                }
            });
        }

        // Fire all threads at once
        startLatch.countDown();
        boolean completed = finishLatch.await(15, TimeUnit.SECONDS);
        executor.shutdown();

        // 3. Assertions
        assertEquals(true, completed, "All concurrent tasks should complete within timeout");
        assertEquals(10, successCount.get(), "Exactly 10 orders should succeed since initial stock was 10");
        assertEquals(15, failedCount.get(), "Exactly 15 orders should fail due to insufficient stock");

        // 4. Verify Database Inventory State
        Inventory finalInventory = inventoryRepository.findByProductSku(testSku).orElseThrow();
        assertEquals(0, finalInventory.getAvailableStock(), "Available stock must be exactly 0 (no overselling)");
        assertEquals(10, finalInventory.getReservedStock(), "Reserved stock must be exactly 10");
    }
}
