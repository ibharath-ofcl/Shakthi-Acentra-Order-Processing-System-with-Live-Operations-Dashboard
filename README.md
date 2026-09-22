# Shakthi-Acentra: Order Processing System with Live Operations Dashboard

[![Project Status: Event-Driven Architecture Implemented](https://img.shields.io/badge/status-event--driven--architecture--implemented-brightgreen.svg)](#current-development-status)
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

## 🚀 Quick Start with Docker Compose

Launch the complete ecosystem (MySQL 8.0, RabbitMQ 3.13-management, Spring Boot Backend) with a single command:

```bash
docker compose up -d --build
```

### Accessing Endpoints:
- **Backend API & Swagger / Health**: [http://localhost:8080/api/v1/health](http://localhost:8080/api/v1/health)
- **RabbitMQ Management Dashboard**: [http://localhost:15672](http://localhost:15672) (User: `guest`, Password: `guest`)
- **Operations & Events Feed**: [http://localhost:8080/api/v1/operations/events](http://localhost:8080/api/v1/operations/events)
- **Live System Statistics**: [http://localhost:8080/api/v1/operations/statistics](http://localhost:8080/api/v1/operations/statistics)
- **DLQ Message Inspection**: [http://localhost:8080/api/v1/operations/dlq](http://localhost:8080/api/v1/operations/dlq)

Detailed step-by-step failure, retry, and DLQ recovery testing instructions are available in [`docker/README.md`](./docker/README.md).

---

## 📖 Technical Architecture & Documentation

Comprehensive architectural blueprints and technical specifications are maintained in the [`docs/`](./docs/README.md) directory:

- 🏛️ **[System Architecture (ARCHITECTURE.md)](./docs/ARCHITECTURE.md)**: Full system topology, order lifecycle state machine, atomic inventory concurrency strategy, RabbitMQ queue topology, DLQ & saga recovery, WebSocket telemetry, and baseline vs. innovative feature matrix.
- 🗄️ **[Database Design & Schema (DATABASE_DESIGN.md)](./docs/DATABASE_DESIGN.md)**: MySQL 8.0 InnoDB schema, ER diagrams, table schemas, primary/foreign keys, indexing strategies, and transaction isolation rules.
- 🔌 **[API & WebSocket Specification (API_SPECIFICATION.md)](./docs/API_SPECIFICATION.md)**: REST endpoints for order ingestion, inventory, and DLQ operations, error schemas, and STOMP topic payloads.
- 🐳 **[Docker Infrastructure & Demo Guide (docker/README.md)](./docker/README.md)**: Container architecture, RabbitMQ queue flow, and failure simulation runbook.

---

## 📊 Current Development Status
- **Current Phase**: `Stage 5: Event-Driven Order Processing with RabbitMQ Implemented`
- **Current Milestone**:
  - Spring Boot 3.3.4 + Java 21 core application running with full AMQP integration.
  - RabbitMQ topic exchanges, dead-letter exchanges, and retry queues with TTL configured.
  - Non-blocking asynchronous order intake (`202 ACCEPTED`) with background consumer fulfillment.
  - Automated retry with exponential backoff / TTL delay and DLQ isolation.
  - Operational event auditing (`ORDER_RECEIVED`, `ORDER_PROCESSING`, `INVENTORY_RESERVED`, `ORDER_COMPLETED`, `ORDER_FAILED`, `ORDER_RETRIED`, `ORDER_SENT_TO_DLQ`).
  - Operational endpoints for event stream, aggregate statistics, and DLQ replay.
  - Docker Compose multi-container stack (MySQL, RabbitMQ, Backend) operational with automated health checks.
  - Concurrency guard preventing overselling verified under load.

---

## 🧩 Planned Major Modules

```
Shakthi-Acentra
├── backend/
│   ├── Order Ingestion & API Gateway (Implemented)
│   ├── Inventory Allocation & Concurrency Guard (Implemented)
│   ├── Asynchronous Queue Producer & Consumer (Implemented - Stage 5)
│   ├── Order Lifecycle State Machine (Implemented)
│   ├── Dead Letter Queue (DLQ) & Recovery Handler (Implemented - Stage 5)
│   ├── Operational Event Auditing & Statistics API (Implemented - Stage 5)
│   └── WebSocket Telemetry Broadcaster (Stage 6)
├── frontend/
│   ├── Live Operations Dashboard
│   ├── Real-Time Order Stream & Latency Feed
│   ├── Queue Depth & Worker Health Monitors
│   └── Order Inspection & Recovery Console
├── docker/
│   ├── Container Orchestration (docker-compose.yml - Implemented)
│   ├── MySQL Persistence Service (Implemented)
│   └── RabbitMQ Messaging Broker (Implemented)
└── docs/
    ├── System Architecture & Sequence Diagrams (ARCHITECTURE.md)
    ├── MySQL Relational Schema & ERD (DATABASE_DESIGN.md)
    └── REST & WebSocket Protocol Contracts (API_SPECIFICATION.md)
```

---

## 🗺️ Development Roadmap

- [x] **Stage 1**: Git Repository Setup & Remote Access Verification
- [x] **Stage 2**: Project Foundation & Repository Architecture
- [x] **Stage 3**: Complete Technical Architecture & Database Design
- [x] **Stage 4**: Spring Boot Backend Core (Order, Inventory, Entities, & Concurrency Guard)
- [x] **Stage 5**: Asynchronous Messaging & Order Processing Queues with RabbitMQ *(Current)*
- [ ] **Stage 6**: React Live Operations Dashboard & Real-Time Telemetry Streaming
- [ ] **Stage 7**: End-to-End Integration, Stress Testing, and Final Documentation
