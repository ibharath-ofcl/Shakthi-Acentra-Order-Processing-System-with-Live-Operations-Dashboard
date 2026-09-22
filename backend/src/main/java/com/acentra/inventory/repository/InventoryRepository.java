package com.acentra.inventory.repository;

import com.acentra.inventory.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByProductId(Long productId);

    Optional<Inventory> findByProductSku(String sku);

    /**
     * Atomically reserves stock only if availableStock is greater than or equal to the requested quantity.
     * Evaluates condition inside the database write lock, preventing concurrent overselling.
     *
     * @return 1 if successfully reserved, 0 if insufficient stock.
     */
    @Modifying
    @Query("UPDATE Inventory i " +
           "SET i.availableStock = i.availableStock - :quantity, " +
           "    i.reservedStock = i.reservedStock + :quantity, " +
           "    i.version = i.version + 1, " +
           "    i.updatedAt = :now " +
           "WHERE i.product.id = :productId AND i.availableStock >= :quantity")
    int reserveStockAtomic(@Param("productId") Long productId,
                           @Param("quantity") int quantity,
                           @Param("now") Instant now);

    /**
     * Atomically releases reserved stock back into available stock (e.g., compensation or cancellation).
     *
     * @return 1 if successfully released, 0 if reserved stock was insufficient.
     */
    @Modifying
    @Query("UPDATE Inventory i " +
           "SET i.availableStock = i.availableStock + :quantity, " +
           "    i.reservedStock = i.reservedStock - :quantity, " +
           "    i.version = i.version + 1, " +
           "    i.updatedAt = :now " +
           "WHERE i.product.id = :productId AND i.reservedStock >= :quantity")
    int releaseStockAtomic(@Param("productId") Long productId,
                           @Param("quantity") int quantity,
                           @Param("now") Instant now);

    /**
     * Deducts reserved stock upon successful fulfillment completion.
     */
    @Modifying
    @Query("UPDATE Inventory i " +
           "SET i.reservedStock = i.reservedStock - :quantity, " +
           "    i.version = i.version + 1, " +
           "    i.updatedAt = :now " +
           "WHERE i.product.id = :productId AND i.reservedStock >= :quantity")
    int fulfillDeductAtomic(@Param("productId") Long productId,
                            @Param("quantity") int quantity,
                            @Param("now") Instant now);

    /**
     * Atomically increments available stock for restocking.
     */
    @Modifying
    @Query("UPDATE Inventory i " +
           "SET i.availableStock = i.availableStock + :quantity, " +
           "    i.version = i.version + 1, " +
           "    i.updatedAt = :now " +
           "WHERE i.product.id = :productId")
    int restockAtomic(@Param("productId") Long productId,
                      @Param("quantity") int quantity,
                      @Param("now") Instant now);
}
