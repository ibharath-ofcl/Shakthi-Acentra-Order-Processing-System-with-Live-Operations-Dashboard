package com.acentra.operations.controller;

import com.acentra.common.dto.ApiResponse;
import com.acentra.common.exception.ResourceNotFoundException;
import com.acentra.common.model.DlqRecord;
import com.acentra.common.repository.DlqRecordRepository;
import com.acentra.messaging.dto.OrderProcessingMessage;
import com.acentra.messaging.producer.OrderEventProducer;
import com.acentra.operations.dto.OperationalEventResponse;
import com.acentra.operations.dto.SystemStatisticsResponse;
import com.acentra.operations.model.OperationalEventType;
import com.acentra.operations.service.OperationalEventService;
import com.acentra.order.dto.OrderItemRequest;
import com.acentra.order.model.Order;
import com.acentra.order.model.OrderStatus;
import com.acentra.order.repository.OrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/operations")
public class OperationsController {

    private final OperationalEventService eventService;
    private final DlqRecordRepository dlqRecordRepository;
    private final OrderRepository orderRepository;
    private final OrderEventProducer orderEventProducer;

    public OperationsController(OperationalEventService eventService,
                                DlqRecordRepository dlqRecordRepository,
                                OrderRepository orderRepository,
                                OrderEventProducer orderEventProducer) {
        this.eventService = eventService;
        this.dlqRecordRepository = dlqRecordRepository;
        this.orderRepository = orderRepository;
        this.orderEventProducer = orderEventProducer;
    }

    @GetMapping("/events")
    public ResponseEntity<ApiResponse<List<OperationalEventResponse>>> getRecentEvents(
            @RequestParam(defaultValue = "50") int limit) {
        List<OperationalEventResponse> events = eventService.getRecentEvents(limit);
        return ResponseEntity.ok(ApiResponse.success(events));
    }

    @GetMapping("/events/{orderNumber}")
    public ResponseEntity<ApiResponse<List<OperationalEventResponse>>> getEventsByOrder(
            @PathVariable String orderNumber) {
        List<OperationalEventResponse> events = eventService.getEventsByOrder(orderNumber);
        return ResponseEntity.ok(ApiResponse.success(events));
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<SystemStatisticsResponse>> getStatistics() {
        SystemStatisticsResponse stats = eventService.getStatistics();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/dlq")
    public ResponseEntity<ApiResponse<Page<DlqRecord>>> getDlqRecords(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<DlqRecord> records = dlqRecordRepository.findAll(
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.success(records));
    }

    /**
     * Replays a dead-lettered message back into the active processing queue.
     * Clears failure simulation flags so the replayed order recovers and processes cleanly.
     */
    @PostMapping("/dlq/{id}/retry")
    @Transactional
    public ResponseEntity<ApiResponse<DlqRecord>> retryDlqRecord(@PathVariable Long id) {
        DlqRecord dlqRecord = dlqRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DLQ Record with id: " + id + " not found"));

        dlqRecord.setStatus("REPLAYED");
        dlqRecord.setReplayedAt(Instant.now());
        dlqRecordRepository.save(dlqRecord);

        // Find the associated order to reconstruct processing message
        Order order = orderRepository.findAll().stream()
                .filter(o -> dlqRecord.getPayload().contains(o.getOrderNumber()))
                .findFirst()
                .orElse(null);

        if (order != null) {
            order.setStatus(OrderStatus.CREATED);
            order.setFailureReason("Replayed from Dead Letter Queue by operator");
            orderRepository.save(order);

            List<OrderItemRequest> itemRequests = order.getItems().stream()
                    .map(item -> new OrderItemRequest(item.getProduct().getSku(), item.getQuantity()))
                    .collect(Collectors.toList());

            // Create clean message with retryCount = 0 and simulateFailure = NONE
            OrderProcessingMessage message = new OrderProcessingMessage(
                    order.getOrderNumber(),
                    order.getIdempotencyKey(),
                    order.getCustomerId(),
                    order.getCustomerTier(),
                    itemRequests,
                    "NONE"
            );

            eventService.emitEvent(
                    OperationalEventType.ORDER_RECEIVED,
                    order.getOrderNumber(),
                    order.getCustomerId(),
                    "Replayed message from DLQ re-injected into processing queue",
                    0
            );

            orderEventProducer.sendOrderCreated(message);
        }

        return ResponseEntity.ok(ApiResponse.success("DLQ message replayed successfully into processing queue", dlqRecord));
    }

    @PostMapping("/dlq/{id}/discard")
    @Transactional
    public ResponseEntity<ApiResponse<DlqRecord>> discardDlqRecord(@PathVariable Long id) {
        DlqRecord dlqRecord = dlqRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DLQ Record with id: " + id + " not found"));

        dlqRecord.setStatus("DISCARDED");
        dlqRecordRepository.save(dlqRecord);

        return ResponseEntity.ok(ApiResponse.success("DLQ record marked as discarded", dlqRecord));
    }
}
