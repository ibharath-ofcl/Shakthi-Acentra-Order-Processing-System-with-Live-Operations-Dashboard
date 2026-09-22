package com.acentra.order.repository;

import com.acentra.order.model.CustomerTier;
import com.acentra.order.model.Order;
import com.acentra.order.model.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.product WHERE o.orderNumber = :orderNumber")
    Optional<Order> findByOrderNumberWithDetails(@Param("orderNumber") String orderNumber);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.product ORDER BY o.createdAt DESC")
    java.util.List<Order> findAllWithDetails();

    Optional<Order> findByIdempotencyKey(String idempotencyKey);

    boolean existsByIdempotencyKey(String idempotencyKey);

    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    Page<Order> findByCustomerTier(CustomerTier customerTier, Pageable pageable);

    Page<Order> findByStatusAndCustomerTier(OrderStatus status, CustomerTier customerTier, Pageable pageable);
}
