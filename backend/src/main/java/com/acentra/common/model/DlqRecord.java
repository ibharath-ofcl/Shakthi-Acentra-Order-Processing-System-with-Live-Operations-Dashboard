package com.acentra.common.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "dlq_records", indexes = {
        @Index(name = "idx_dlq_status_created", columnList = "status, created_at"),
        @Index(name = "idx_dlq_original_queue", columnList = "original_queue")
})
public class DlqRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "message_id", nullable = false, length = 128)
    private String messageId;

    @Column(name = "original_queue", nullable = false, length = 128)
    private String originalQueue;

    @Column(name = "routing_key", nullable = false, length = 128)
    private String routingKey;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String payload;

    @Column(name = "exception_message", columnDefinition = "TEXT")
    private String exceptionMessage;

    @Lob
    @Column(name = "exception_stacktrace", columnDefinition = "LONGTEXT")
    private String exceptionStacktrace;

    @Column(name = "retry_count", nullable = false)
    private int retryCount = 0;

    @Column(nullable = false, length = 32)
    private String status = "PENDING_REVIEW";

    @Column(name = "replayed_at")
    private Instant replayedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public DlqRecord() {
    }

    public DlqRecord(String messageId, String originalQueue, String routingKey, String payload, String exceptionMessage, String exceptionStacktrace, int retryCount) {
        this.messageId = messageId;
        this.originalQueue = originalQueue;
        this.routingKey = routingKey;
        this.payload = payload;
        this.exceptionMessage = exceptionMessage;
        this.exceptionStacktrace = exceptionStacktrace;
        this.retryCount = retryCount;
        this.status = "PENDING_REVIEW";
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessageId() {
        return messageId;
    }

    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }

    public String getOriginalQueue() {
        return originalQueue;
    }

    public void setOriginalQueue(String originalQueue) {
        this.originalQueue = originalQueue;
    }

    public String getRoutingKey() {
        return routingKey;
    }

    public void setRoutingKey(String routingKey) {
        this.routingKey = routingKey;
    }

    public String getPayload() {
        return payload;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }

    public String getExceptionMessage() {
        return exceptionMessage;
    }

    public void setExceptionMessage(String exceptionMessage) {
        this.exceptionMessage = exceptionMessage;
    }

    public String getExceptionStacktrace() {
        return exceptionStacktrace;
    }

    public void setExceptionStacktrace(String exceptionStacktrace) {
        this.exceptionStacktrace = exceptionStacktrace;
    }

    public int getRetryCount() {
        return retryCount;
    }

    public void setRetryCount(int retryCount) {
        this.retryCount = retryCount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getReplayedAt() {
        return replayedAt;
    }

    public void setReplayedAt(Instant replayedAt) {
        this.replayedAt = replayedAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
