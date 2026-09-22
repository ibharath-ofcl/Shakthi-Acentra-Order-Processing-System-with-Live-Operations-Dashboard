package com.acentra.operations.repository;

import com.acentra.operations.model.OperationalEvent;
import com.acentra.operations.model.OperationalEventType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OperationalEventRepository extends JpaRepository<OperationalEvent, Long> {

    List<OperationalEvent> findByOrderByTimestampDesc(Pageable pageable);

    List<OperationalEvent> findByOrderNumberOrderByTimestampAsc(String orderNumber);

    long countByEventType(OperationalEventType eventType);
}
