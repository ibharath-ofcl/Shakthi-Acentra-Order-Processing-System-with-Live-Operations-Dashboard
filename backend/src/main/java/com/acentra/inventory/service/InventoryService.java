package com.acentra.inventory.service;

import com.acentra.common.exception.InsufficientStockException;
import com.acentra.common.exception.ResourceNotFoundException;
import com.acentra.inventory.dto.InventoryResponse;
import com.acentra.inventory.dto.RestockRequest;
import com.acentra.inventory.model.Inventory;
import com.acentra.inventory.model.InventoryTransaction;
import com.acentra.inventory.model.TransactionType;
import com.acentra.inventory.repository.InventoryRepository;
import com.acentra.inventory.repository.InventoryTransactionRepository;
import com.acentra.product.model.Product;
import com.acentra.product.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    private static final Logger log = LoggerFactory.getLogger(InventoryService.class);

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;

    public InventoryService(InventoryRepository inventoryRepository,
                            ProductRepository productRepository,
                            InventoryTransactionRepository inventoryTransactionRepository) {
        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
        this.inventoryTransactionRepository = inventoryTransactionRepository;
    }

    @Transactional(readOnly = true)
    public List<InventoryResponse> getAllInventory() {
        return inventoryRepository.findAll().stream()
                .map(InventoryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InventoryResponse getInventoryBySku(String sku) {
        Inventory inventory = inventoryRepository.findByProductSku(sku)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory for product SKU: " + sku + " not found"));
        return InventoryResponse.fromEntity(inventory);
    }

    @Transactional(readOnly = true)
    public Inventory getInventoryEntityByProductId(Long productId) {
        return inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory for product ID: " + productId + " not found"));
    }

    /**
     * Atomically reserves stock using database-level write locks and conditional checks.
     * Prevents race conditions and overselling under high concurrency.
     */
    @Transactional
    public void reserveStock(Product product, int quantity, Long orderId) {
        log.debug("Attempting atomic stock reservation for SKU: {}, qty: {}, order: {}",
                product.getSku(), quantity, orderId);

        int updated = inventoryRepository.reserveStockAtomic(product.getId(), quantity, Instant.now());
        if (updated == 0) {
            Inventory current = inventoryRepository.findByProductId(product.getId()).orElse(null);
            int available = current != null ? current.getAvailableStock() : 0;
            log.warn("Atomic reservation rejected for SKU: {}. Requested: {}, Available: {}",
                    product.getSku(), quantity, available);
            throw new InsufficientStockException(product.getSku(), quantity, available);
        }

        Inventory updatedInv = inventoryRepository.findByProductId(product.getId()).orElseThrow();
        InventoryTransaction tx = new InventoryTransaction(
                product,
                orderId,
                TransactionType.RESERVE,
                -quantity,
                updatedInv.getAvailableStock()
        );
        inventoryTransactionRepository.save(tx);
        log.info("Reserved {} units of SKU: {} for order: {}. Remaining available: {}",
                quantity, product.getSku(), orderId, updatedInv.getAvailableStock());
    }

    /**
     * Releases previously reserved stock back to available stock (e.g., during compensation or order cancel).
     */
    @Transactional
    public void releaseStock(Product product, int quantity, Long orderId) {
        log.debug("Releasing reserved stock for SKU: {}, qty: {}, order: {}",
                product.getSku(), quantity, orderId);

        int updated = inventoryRepository.releaseStockAtomic(product.getId(), quantity, Instant.now());
        if (updated > 0) {
            Inventory updatedInv = inventoryRepository.findByProductId(product.getId()).orElseThrow();
            InventoryTransaction tx = new InventoryTransaction(
                    product,
                    orderId,
                    TransactionType.RELEASE_COMPENSATION,
                    quantity,
                    updatedInv.getAvailableStock()
            );
            inventoryTransactionRepository.save(tx);
            log.info("Released {} units of SKU: {} for order: {}. New available stock: {}",
                    quantity, product.getSku(), orderId, updatedInv.getAvailableStock());
        } else {
            log.warn("Stock release skipped for SKU: {}: No reserved stock found to release.", product.getSku());
        }
    }

    /**
     * Deducts reserved stock when an order is completed/fulfilled.
     */
    @Transactional
    public void fulfillStock(Product product, int quantity, Long orderId) {
        int updated = inventoryRepository.fulfillDeductAtomic(product.getId(), quantity, Instant.now());
        if (updated > 0) {
            Inventory updatedInv = inventoryRepository.findByProductId(product.getId()).orElseThrow();
            InventoryTransaction tx = new InventoryTransaction(
                    product,
                    orderId,
                    TransactionType.FULFILL_DEDUCT,
                    -quantity,
                    updatedInv.getAvailableStock()
            );
            inventoryTransactionRepository.save(tx);
        }
    }

    /**
     * Administrative replenishment of stock.
     */
    @Transactional
    public InventoryResponse restock(RestockRequest request) {
        Product product = productRepository.findBySku(request.getSku())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "SKU", request.getSku()));

        inventoryRepository.restockAtomic(product.getId(), request.getQuantityToAdd(), Instant.now());

        Inventory updatedInv = inventoryRepository.findByProductId(product.getId()).orElseThrow();
        InventoryTransaction tx = new InventoryTransaction(
                product,
                null,
                TransactionType.RESTOCK,
                request.getQuantityToAdd(),
                updatedInv.getAvailableStock()
        );
        inventoryTransactionRepository.save(tx);
        log.info("Restocked SKU: {} with {} units. New available: {}",
                request.getSku(), request.getQuantityToAdd(), updatedInv.getAvailableStock());

        return InventoryResponse.fromEntity(updatedInv);
    }
}
