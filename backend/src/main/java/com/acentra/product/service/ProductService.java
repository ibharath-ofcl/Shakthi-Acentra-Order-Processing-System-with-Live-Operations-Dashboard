package com.acentra.product.service;

import com.acentra.common.exception.ResourceNotFoundException;
import com.acentra.inventory.model.Inventory;
import com.acentra.inventory.model.InventoryTransaction;
import com.acentra.inventory.model.TransactionType;
import com.acentra.inventory.repository.InventoryRepository;
import com.acentra.inventory.repository.InventoryTransactionRepository;
import com.acentra.product.dto.ProductCreateRequest;
import com.acentra.product.dto.ProductResponse;
import com.acentra.product.model.Product;
import com.acentra.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;

    public ProductService(ProductRepository productRepository,
                          InventoryRepository inventoryRepository,
                          InventoryTransactionRepository inventoryTransactionRepository) {
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.inventoryTransactionRepository = inventoryTransactionRepository;
    }

    @Transactional
    public ProductResponse createProduct(ProductCreateRequest request) {
        if (productRepository.existsBySku(request.getSku())) {
            throw new IllegalArgumentException("Product with SKU '" + request.getSku() + "' already exists");
        }

        Product product = new Product(
                request.getSku(),
                request.getName(),
                request.getDescription(),
                request.getPrice()
        );
        Product savedProduct = productRepository.save(product);

        // Initialize inventory
        Inventory inventory = new Inventory(savedProduct, request.getInitialStock(), 0);
        inventoryRepository.save(inventory);

        // Record audit transaction if initial stock > 0
        if (request.getInitialStock() > 0) {
            InventoryTransaction transaction = new InventoryTransaction(
                    savedProduct,
                    null,
                    TransactionType.INITIAL_STOCK,
                    request.getInitialStock(),
                    request.getInitialStock()
            );
            inventoryTransactionRepository.save(transaction);
        }

        return ProductResponse.fromEntity(savedProduct);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductBySku(String sku) {
        Product product = getProductEntityBySku(sku);
        return ProductResponse.fromEntity(product);
    }

    @Transactional(readOnly = true)
    public Product getProductEntityBySku(String sku) {
        return productRepository.findBySku(sku)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "SKU", sku));
    }
}
