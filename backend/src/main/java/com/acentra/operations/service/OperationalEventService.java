package com.acentra.operations.service;

import com.acentra.common.repository.DlqRecordRepository;
import com.acentra.inventory.repository.InventoryRepository;
import com.acentra.operations.dto.OperationalEventResponse;
import com.acentra.operations.dto.SystemStatisticsResponse;
import com.acentra.operations.model.OperationalEvent;
import com.acentra.operations.model.OperationalEventType;
import com.acentra.operations.repository.OperationalEventRepository;
import com.acentra.order.model.OrderStatus;
import com.acentra.order.repository.OrderRepository;
import com.acentra.product.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OperationalEventService {

    private static final Logger log = LoggerFactory.getLogger(OperationalEventService.class);

    private final OperationalEventRepository eventRepository;
    private final OrderRepository orderRepository;
    private final DlqRecordRepository dlqRecordRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;

    public OperationalEventService(OperationalEventRepository eventRepository,
                                   OrderRepository orderRepository,
                                   DlqRecordRepository dlqRecordRepository,
                                   ProductRepository productRepository,
                                   InventoryRepository inventoryRepository) {
        this.eventRepository = eventRepository;
        this.orderRepository = orderRepository;
        this.dlqRecordRepository = dlqRecordRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @Transactional
    public OperationalEvent emitEvent(OperationalEventType eventType, String orderNumber, String customerId, String details, int retryCount) {
        OperationalEvent event = new OperationalEvent(eventType, orderNumber, customerId, details, retryCount);
        OperationalEvent saved = eventRepository.save(event);
        log.info("[OPERATIONAL_EVENT] [{}] Order: {} (Retry: {}) - {}",
                eventType, orderNumber, retryCount, details);
        return saved;
    }

    @Transactional(readOnly = true)
    public List<OperationalEventResponse> getRecentEvents(int limit) {
        int cappedLimit = Math.min(Math.max(limit, 1), 100);
        return eventRepository.findByOrderByTimestampDesc(PageRequest.of(0, cappedLimit))
                .stream()
                .map(OperationalEventResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OperationalEventResponse> getEventsByOrder(String orderNumber) {
        return eventRepository.findByOrderNumberOrderByTimestampAsc(orderNumber)
                .stream()
                .map(OperationalEventResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SystemStatisticsResponse getStatistics() {
        SystemStatisticsResponse stats = new SystemStatisticsResponse();

        stats.setTotalOrders(orderRepository.count());

        Map<String, Long> statusCounts = new HashMap<>();
        for (OrderStatus status : OrderStatus.values()) {
            statusCounts.put(status.name(), (long) orderRepository.findByStatus(status, PageRequest.of(0, 1)).getTotalElements());
        }
        stats.setOrdersByStatus(statusCounts);

        Map<String, Long> eventCounts = new HashMap<>();
        for (OperationalEventType type : OperationalEventType.values()) {
            eventCounts.put(type.name(), eventRepository.countByEventType(type));
        }
        stats.setEventsByType(eventCounts);

        stats.setDlqCount(dlqRecordRepository.count());
        stats.setTotalProducts((int) productRepository.count());

        int totalAvailable = inventoryRepository.findAll().stream()
                .mapToInt(i -> i.getAvailableStock())
                .sum();
        int totalReserved = inventoryRepository.findAll().stream()
                .mapToInt(i -> i.getReservedStock())
                .sum();

        stats.setTotalStockAvailable(totalAvailable);
        stats.setTotalStockReserved(totalReserved);

        return stats;
    }
}
