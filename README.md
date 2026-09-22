# Shakthi-Acentra: Order Processing System with Live Operations Dashboard

[![Project Status: Foundation Initialized](https://img.shields.io/badge/status-foundation--initialized-blue.svg)](#current-development-status)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📌 Short Description
**Shakthi-Acentra** is a resilient, event-driven Order Processing System engineered to handle concurrent high-volume order intake, automated inventory allocation, dynamic prioritization, failure recovery, and real-time operational telemetry through an interactive live operations dashboard.

---

## ⚠️ Problem Statement
Modern e-commerce and enterprise supply chains encounter significant operational bottlenecks during high-traffic order spikes:
1. **Concurrency and Race Conditions**: High-velocity concurrent order submissions frequently result in overselling, database row contention, or inventory inconsistency.
2. **Synchronous Coupling Bottlenecks**: Tightly coupled order submission pipelines suffer from elevated latency, cascading timeouts, and total request drop when downstream fulfillment services degrade.
3. **Lack of Resilient Failure Recovery**: Intermittent payment gateway outages, inventory service disconnects, and worker node failures often cause dropped orders without reliable replay or dead-letter queue (DLQ) containment.
4. **Operational Blind Spots**: Engineering and fulfillment teams frequently lack unified real-time visibility into queue depths, order throughput, worker node health, and processing latencies.

---

## 🎯 High-Level Objective
The objective of the Shakthi-Acentra platform is to deliver a decoupled, highly available, and observable order fulfillment architecture that guarantees:
- **Zero Inventory Overselling**: Strict concurrency safeguards and transactional isolation for inventory reservation.
- **Asynchronous Throughput Scalability**: Non-blocking order ingestion with reliable event distribution across dedicated worker queues.
- **Self-Healing Fault Tolerance**: Granular retry policies, circuit breakers, and dead-letter queue handling for transient and permanent processing failures.
- **Real-Time Visibility**: A responsive operations dashboard broadcasting end-to-end telemetry, processing metrics, and queue analytics via WebSockets.

---

## 🛠️ Planned Technology Stack

| Layer | Technology | Key Capabilities |
| :--- | :--- | :--- |
| **Backend** | **Java 17+ / 21**, **Spring Boot 3.x** | Core business logic, REST APIs, WebSockets, transaction management |
| **Data Persistence** | **MySQL 8.x**, **Spring Data JPA / Hibernate** | Relational data integrity, ACID compliance, row-level locking, migrations |
| **Messaging & Queues** | **RabbitMQ (AMQP)** | Asynchronous task queues, topic exchanges, consumer groups, Dead Letter Queues (DLQ) |
| **Real-Time Streaming** | **Spring WebSocket (STOMP)** | Low-latency live metric push to operator clients |
| **Frontend** | **React.js**, **Vite**, Modern CSS | Responsive, real-time command center & live telemetry UI |
| **Containerization** | **Docker**, **Docker Compose** | Multi-service orchestration, repeatable local and deployment environments |
| **Testing & Quality** | **JUnit 5**, **Mockito**, **Testcontainers** | Unit, integration, and infrastructure testing suites |

---

## 📊 Current Development Status
- **Current Phase**: `Stage 2: Initial Project Foundation`
- **Foundation State**:
  - Git repository configured and verified with remote sync.
  - Comprehensive `.gitignore` established for multi-tier Java/React stack.
  - Clean modular directory layout initialized (`backend/`, `frontend/`, `docker/`, `docs/`).
  - Architectural blueprints and roadmap defined.

---

## 🧩 Planned Major Modules

```
Shakthi-Acentra
├── backend/
│   ├── Order Ingestion & API Gateway
│   ├── Inventory Allocation & Concurrency Guard
│   ├── Asynchronous Queue Producer & Consumer
│   ├── Order Lifecycle State Machine
│   ├── Dead Letter Queue (DLQ) & Recovery Handler
│   └── WebSocket Telemetry Broadcaster
├── frontend/
│   ├── Live Operations Dashboard
│   ├── Real-Time Order Stream & Latency Feed
│   ├── Queue Depth & Worker Health Monitors
│   └── Order Inspection & Recovery Console
├── docker/
│   ├── Container Orchestration (docker-compose)
│   ├── MySQL Persistence Service
│   └── RabbitMQ Messaging Broker
└── docs/
    ├── Architecture & Sequence Diagrams
    ├── API Contracts & Schemas
    └── Operational Runbooks
```

1. **Order Ingestion & API Gateway**: High-throughput REST endpoints receiving orders and publishing validated order events.
2. **Inventory Management & Allocation Engine**: Safe inventory checking, reservation locks, and compensation actions to eliminate overselling.
3. **Message Broker & Queue Pipeline**: Decoupled message routing with distinct queues for order intake, inventory reservation, payment verification, and fulfillment dispatch.
4. **Resilience & Dead-Letter Queue (DLQ) Engine**: Automated retry backoff policies, poison-pill isolation, and operator-assisted manual replay tools.
5. **Live Operations Dashboard**: High-density React interface streaming live statistics on throughput (TPS), latency percentiles, queue lag, and error rates.

---

## 🗺️ Development Roadmap

- [x] **Stage 1**: Git Repository Setup & Remote Access Verification
- [x] **Stage 2**: Project Foundation & Repository Architecture *(Current)*
- [ ] **Stage 3**: Docker Infrastructure & Baseline Container Services (MySQL, RabbitMQ)
- [ ] **Stage 4**: Spring Boot Backend Core (Domain Entities, Repositories, Database Schema)
- [ ] **Stage 5**: Asynchronous Messaging & Order Processing Queues with RabbitMQ
- [ ] **Stage 6**: Inventory Concurrency Controls, DLQ, & Fault Tolerance Handlers
- [ ] **Stage 7**: React Live Operations Dashboard & Real-Time Telemetry Streaming
- [ ] **Stage 8**: End-to-End Integration, Stress Testing, and Final Documentation
