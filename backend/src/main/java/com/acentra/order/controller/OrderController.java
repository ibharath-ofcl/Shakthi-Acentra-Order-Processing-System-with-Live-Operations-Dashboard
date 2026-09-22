package com.acentra.order.controller;

import com.acentra.common.dto.ApiResponse;
import com.acentra.order.dto.OrderCancelRequest;
import com.acentra.order.dto.OrderCreateRequest;
import com.acentra.order.dto.OrderResponse;
import com.acentra.order.model.CustomerTier;
import com.acentra.order.model.OrderStatus;
import com.acentra.order.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @RequestHeader("Idempotency-Key") String idempotencyKey,
            @Valid @RequestBody OrderCreateRequest request) {
        OrderResponse response = orderService.createOrder(idempotencyKey, request);
        return new ResponseEntity<>(ApiResponse.success("Order accepted and inventory reserved", response), HttpStatus.ACCEPTED);
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderByOrderNumber(@PathVariable String orderNumber) {
        OrderResponse response = orderService.getOrderByOrderNumber(orderNumber);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) CustomerTier customerTier,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<OrderResponse> orders = orderService.getOrders(status, customerTier, pageable);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @PostMapping("/{orderNumber}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @PathVariable String orderNumber,
            @RequestBody(required = false) OrderCancelRequest request) {
        OrderResponse response = orderService.cancelOrder(orderNumber, request);
        return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully", response));
    }
}
