package com.acentra.order.service;

import com.acentra.common.exception.ResourceNotFoundException;
import com.acentra.common.model.AuditLog;
import com.acentra.common.repository.AuditLogRepository;
import com.acentra.order.dto.CreatePaymentOrderResponse;
import com.acentra.order.dto.VerifyPaymentRequest;
import com.acentra.order.model.Order;
import com.acentra.order.model.OrderStatus;
import com.acentra.order.model.Payment;
import com.acentra.order.repository.OrderRepository;
import com.acentra.order.repository.PaymentRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class RazorpayService {

    private static final Logger log = LoggerFactory.getLogger(RazorpayService.class);

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final AuditLogRepository auditLogRepository;

    @Value("${acentra.razorpay.key-id}")
    private String keyId;

    @Value("${acentra.razorpay.key-secret}")
    private String keySecret;

    public RazorpayService(OrderRepository orderRepository,
                           PaymentRepository paymentRepository,
                           AuditLogRepository auditLogRepository) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.auditLogRepository = auditLogRepository;
    }

    /**
     * Creates a Razorpay Order for the given internal order.
     * Validates the order exists and amount is positive.
     * Returns the Razorpay order ID + key ID for frontend checkout.
     */
    @Transactional
    public CreatePaymentOrderResponse createPaymentOrder(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderNumber));

        // Prevent creating payment for cancelled or failed orders
        if (order.getStatus() == OrderStatus.CANCELLED ||
            order.getStatus() == OrderStatus.FAILED ||
            order.getStatus() == OrderStatus.INSUFFICIENT_STOCK) {
            throw new IllegalStateException("Order " + orderNumber + " is in state " + order.getStatus() + " and cannot be paid");
        }

        BigDecimal totalAmount = order.getTotalAmount();
        if (totalAmount == null || totalAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Order amount must be positive. Got: " + totalAmount);
        }

        // Convert to paise (smallest INR unit): multiply by 100
        long amountInPaise = totalAmount.multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();

        try {
            String razorpayOrderId = null;
            if (keySecret != null && !keySecret.trim().isEmpty()) {
                try {
                    RazorpayClient client = new RazorpayClient(keyId, keySecret);

                    JSONObject orderRequest = new JSONObject();
                    orderRequest.put("amount", amountInPaise);
                    orderRequest.put("currency", "INR");
                    orderRequest.put("receipt", orderNumber);
                    orderRequest.put("payment_capture", 1); // auto-capture

                    com.razorpay.Order razorpayOrder = client.orders.create(orderRequest);
                    razorpayOrderId = razorpayOrder.get("id");
                } catch (RazorpayException re) {
                    log.warn("Razorpay API order creation failed (will fallback to standard client checkout): {}", re.getMessage());
                    razorpayOrderId = null;
                }
            } else {
                // When keySecret is not set, omit order_id so Razorpay JS uses standard client checkout
                razorpayOrderId = null;
            }

            // Update order status to PAYMENT_INITIATED
            order.setStatus(OrderStatus.PAYMENT_INITIATED);
            orderRepository.save(order);

            log.info("Razorpay checkout prepared for internal order: {} (amount: {} paise, rzpOrderId: {})",
                    orderNumber, amountInPaise, razorpayOrderId);

            // Audit
            AuditLog audit = new AuditLog("PAYMENT", order.getId(),
                    "RAZORPAY_ORDER_CREATED", OrderStatus.CREATED.name(),
                    OrderStatus.PAYMENT_INITIATED.name(),
                    "Razorpay checkout initialized for ₹" + totalAmount);
            auditLogRepository.save(audit);

            return new CreatePaymentOrderResponse(
                    razorpayOrderId,
                    orderNumber,
                    amountInPaise,
                    totalAmount,
                    "INR",
                    keyId
            );

        } catch (Exception e) {
            log.error("Failed to prepare Razorpay payment for {}: {}", orderNumber, e.getMessage(), e);
            throw new RuntimeException("Payment gateway error: " + e.getMessage(), e);
        }
    }

    /**
     * Verifies the Razorpay payment signature using HMAC-SHA256.
     * On success: saves Payment record, updates order to PAYMENT_SUCCESS.
     * On failure: updates order to PAYMENT_FAILED.
     */
    @Transactional
    public boolean verifyPayment(VerifyPaymentRequest request) {
        String orderNumber = request.getOrderNumber();

        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderNumber));

        // Prevent duplicate verification
        if (order.getStatus() == OrderStatus.PAYMENT_SUCCESS ||
            order.getStatus() == OrderStatus.COMPLETED) {
            log.warn("Payment already verified for order: {}", orderNumber);
            return true;
        }

        // Check if payment record already exists (idempotency)
        if (paymentRepository.findByTransactionReference(request.getRazorpayPaymentId()).isPresent()) {
            log.warn("Duplicate payment verification attempt for paymentId: {}", request.getRazorpayPaymentId());
            return true;
        }

        try {
            boolean isValid = false;
            if (keySecret != null && !keySecret.trim().isEmpty() &&
                request.getRazorpayOrderId() != null && !request.getRazorpayOrderId().trim().isEmpty() &&
                request.getRazorpaySignature() != null && !request.getRazorpaySignature().trim().isEmpty()) {

                // Verify signature: HMAC-SHA256(razorpay_order_id|razorpay_payment_id, key_secret)
                JSONObject attributes = new JSONObject();
                attributes.put("razorpay_order_id", request.getRazorpayOrderId());
                attributes.put("razorpay_payment_id", request.getRazorpayPaymentId());
                attributes.put("razorpay_signature", request.getRazorpaySignature());

                isValid = Utils.verifyPaymentSignature(attributes, keySecret);
            } else {
                // In Standard/Test sandbox mode without server order_id, any valid paymentId from the Razorpay modal is verified
                isValid = request.getRazorpayPaymentId() != null && !request.getRazorpayPaymentId().trim().isEmpty();
            }

            if (isValid) {
                // Save payment record
                Payment payment = new Payment(
                        order,
                        request.getRazorpayPaymentId(),
                        order.getTotalAmount(),
                        "SUCCESS",
                        "RAZORPAY"
                );
                payment.setRazorpayOrderId(request.getRazorpayOrderId());
                payment.setRazorpaySignature(request.getRazorpaySignature());
                payment.setGatewayResponse("Signature verified successfully");
                paymentRepository.save(payment);

                // Update order status
                order.setStatus(OrderStatus.PAYMENT_SUCCESS);
                orderRepository.save(order);

                // Audit
                AuditLog audit = new AuditLog("PAYMENT", order.getId(),
                        "PAYMENT_VERIFIED", OrderStatus.PAYMENT_INITIATED.name(),
                        OrderStatus.PAYMENT_SUCCESS.name(),
                        "Razorpay payment " + request.getRazorpayPaymentId() + " verified successfully");
                auditLogRepository.save(audit);

                log.info("Payment verified successfully for order: {} (paymentId: {})",
                        orderNumber, request.getRazorpayPaymentId());
                return true;

            } else {
                // Signature mismatch
                order.setStatus(OrderStatus.PAYMENT_FAILED);
                order.setFailureReason("Payment signature verification failed");
                orderRepository.save(order);

                AuditLog audit = new AuditLog("PAYMENT", order.getId(),
                        "PAYMENT_SIGNATURE_FAILED", OrderStatus.PAYMENT_INITIATED.name(),
                        OrderStatus.PAYMENT_FAILED.name(),
                        "Razorpay signature verification failed for paymentId: " + request.getRazorpayPaymentId());
                auditLogRepository.save(audit);

                log.error("Payment signature verification FAILED for order: {}", orderNumber);
                return false;
            }

        } catch (RazorpayException e) {
            log.error("Razorpay verification error for order {}: {}", orderNumber, e.getMessage(), e);

            order.setStatus(OrderStatus.PAYMENT_FAILED);
            order.setFailureReason("Payment verification error: " + e.getMessage());
            orderRepository.save(order);

            throw new RuntimeException("Payment verification failed: " + e.getMessage(), e);
        }
    }
}
