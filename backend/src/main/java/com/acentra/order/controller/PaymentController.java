package com.acentra.order.controller;

import com.acentra.common.dto.ApiResponse;
import com.acentra.order.dto.CreatePaymentOrderRequest;
import com.acentra.order.dto.CreatePaymentOrderResponse;
import com.acentra.order.dto.VerifyPaymentRequest;
import com.acentra.order.service.RazorpayService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);

    private final RazorpayService razorpayService;

    public PaymentController(RazorpayService razorpayService) {
        this.razorpayService = razorpayService;
    }

    /**
     * Creates a Razorpay payment order for the given internal order.
     * Frontend calls this after creating the internal order to get Razorpay checkout parameters.
     */
    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<CreatePaymentOrderResponse>> createPaymentOrder(
            @Valid @RequestBody CreatePaymentOrderRequest request) {

        log.info("Payment order creation requested for order: {}", request.getOrderNumber());

        CreatePaymentOrderResponse response = razorpayService.createPaymentOrder(request.getOrderNumber());

        return new ResponseEntity<>(
                ApiResponse.success("Razorpay payment order created successfully", response),
                HttpStatus.CREATED
        );
    }

    /**
     * Verifies the Razorpay payment signature after successful checkout.
     * This is the critical security step — never trust frontend alone.
     */
    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyPayment(
            @Valid @RequestBody VerifyPaymentRequest request) {

        log.info("Payment verification requested for order: {} (paymentId: {})",
                request.getOrderNumber(), request.getRazorpayPaymentId());

        boolean verified = razorpayService.verifyPayment(request);

        if (verified) {
            Map<String, Object> result = Map.of(
                    "verified", true,
                    "orderNumber", request.getOrderNumber(),
                    "paymentId", request.getRazorpayPaymentId()
            );
            return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", result));
        } else {
            Map<String, Object> result = Map.of(
                    "verified", false,
                    "orderNumber", request.getOrderNumber(),
                    "reason", "Payment signature verification failed"
            );
            return new ResponseEntity<>(
                    new ApiResponse<>(false, "Payment verification failed", result),
                    HttpStatus.BAD_REQUEST
            );
        }
    }
}
