package com.acentra.common.repository;

import com.acentra.common.model.DlqRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DlqRecordRepository extends JpaRepository<DlqRecord, Long> {

    Optional<DlqRecord> findByMessageId(String messageId);

    Page<DlqRecord> findByStatus(String status, Pageable pageable);
}
