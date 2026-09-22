# Project Documentation - Shakthi-Acentra System

## Technical Architecture & Design Index

This directory maintains the authoritative technical design, specifications, database schemas, and API contracts for the **Shakthi-Acentra Order Processing System**.

---

### Core Specifications

| Document | Primary Focus | Key Topics |
| :--- | :--- | :--- |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | **System Topology & Workflows** | Overall architecture, order lifecycle, zero-overselling inventory concurrency guard, RabbitMQ exchange/queue design, retry & DLQ strategy, saga failure recovery, WebSocket telemetry, frontend React structure, Docker service topology, and baseline vs. innovative feature matrix. |
| **[DATABASE_DESIGN.md](./DATABASE_DESIGN.md)** | **Relational Schema & Data Integrity** | MySQL 8.0 InnoDB schema, ER diagrams, tables (`orders`, `order_items`, `products`, `inventory`, `inventory_transactions`, `payments`, `dlq_records`, `audit_logs`), primary/foreign keys, indexes, and concurrency isolation. |
| **[API_SPECIFICATION.md](./API_SPECIFICATION.md)** | **REST & WebSocket Contracts** | RESTful order intake, inventory, and DLQ management endpoints, request/response schemas, error protocols, and STOMP WebSocket topics (`/topic/orders`, `/topic/metrics`, `/topic/alerts`). |

---

### Key Architectural Diagrams Included
- **High-Level System Topology**: Client, API Gateway, RabbitMQ, Spring Core, MySQL, and Telemetry.
- **Order Lifecycle State Machine**: Deterministic transitions from `CREATED` through `COMPLETED` or `FAILED`.
- **Inventory Concurrency Sequence**: Atomic conditional updates and row-level lock safeguards.
- **RabbitMQ Topology**: Topic exchange, direct DLX, durable queues, and dead-letter parking lot.
- **Saga Compensation Flow**: Automated inventory restoration upon downstream payment failure.
- **Entity-Relationship Diagram (ERD)**: Complete relational model for MySQL.
- **STOMP Telemetry Streaming**: Sub-second push mechanism for operations dashboard.
