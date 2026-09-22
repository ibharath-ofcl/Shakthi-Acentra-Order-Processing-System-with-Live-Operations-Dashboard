package com.acentra.inventory.dto;

import com.acentra.inventory.model.Inventory;
import java.math.BigDecimal;
import java.time.Instant;

public class InventoryResponse {

    private Long inventoryId;
    private Long productId;
    private String sku;
    private String productName;
    private BigDecimal price;
    private int availableStock;
    private int reservedStock;
    private Long version;
    private Instant updatedAt;

    public InventoryResponse() {
    }

    public InventoryResponse(Long inventoryId, Long productId, String sku, String productName, BigDecimal price,
                             int availableStock, int reservedStock, Long version, Instant updatedAt) {
        this.inventoryId = inventoryId;
        this.productId = productId;
        this.sku = sku;
        this.productName = productName;
        this.price = price;
        this.availableStock = availableStock;
        this.reservedStock = reservedStock;
        this.version = version;
        this.updatedAt = updatedAt;
    }

    public static InventoryResponse fromEntity(Inventory inventory) {
        return new InventoryResponse(
                inventory.getId(),
                inventory.getProduct().getId(),
                inventory.getProduct().getSku(),
                inventory.getProduct().getName(),
                inventory.getProduct().getPrice(),
                inventory.getAvailableStock(),
                inventory.getReservedStock(),
                inventory.getVersion(),
                inventory.getUpdatedAt()
        );
    }

    public Long getInventoryId() {
        return inventoryId;
    }

    public void setInventoryId(Long inventoryId) {
        this.inventoryId = inventoryId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public int getAvailableStock() {
        return availableStock;
    }

    public void setAvailableStock(int availableStock) {
        this.availableStock = availableStock;
    }

    public int getReservedStock() {
        return reservedStock;
    }

    public void setReservedStock(int reservedStock) {
        this.reservedStock = reservedStock;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
