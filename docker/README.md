# Docker Infrastructure - Shakthi-Acentra System

## Overview
This directory contains the container orchestration setup for the Shakthi-Acentra Order Processing System. The entire ecosystem (Persistence, Messaging, and Application Backend) runs in isolated Docker containers with automated health checks and startup sequencing.

---

## Architecture Diagram

```
+---------------------------------------------------------------------------------+
|                               Docker Host Network                               |
|                                                                                 |
|  +--------------------+     +-----------------------+     +------------------+  |
|  |    MySQL 8.0       |     |  RabbitMQ Management  |     |  Spring Boot App |  |
|  | (acentra-mysql)    |     | (acentra-rabbitmq)    |     | (acentra-backend)|  |
|  |                    |     |                       |     |                  |  |
|  | Port: 3306         |     | Ports: 5672, 15672    |     | Port: 8080       |  |
|  | DB: acentra_db     |     | User: guest / guest   |     | Java 21 JRE      |  |
|  | Health: mysqladmin |     | Health: rabbitmq-diag |     | Health: /health  |  |
|  +---------▲----------+     +-----------▲-----------+     +---------▲--------+  |
|            │                            │                           │           |
|            +----------------------------┴────────────────-----------+           |
|                                acentra-net (bridge)                             |
+---------------------------------------------------------------------------------+
```

---

## Services & Ports

| Service | Container Name | Image / Build | Port Mappings | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Database** | `acentra-mysql` | `mysql:8.0` | `3306:3306` | Persistent MySQL relational storage (`orders`, `inventory`, `events`) |
| **Message Broker** | `acentra-rabbitmq` | `rabbitmq:3.13-management` | `5672:5672`<br>`15672:15672` | AMQP 0-9-1 messaging broker + Web Management Dashboard |
| **Backend API** | `acentra-backend` | `Dockerfile` (Java 21) | `8080:8080` | Spring Boot order processing engine, event consumer, and REST APIs |

---

## How to Start the Complete System

### Prerequisites
- Docker Desktop (macOS, Linux, or Windows)
- Docker Compose v2.x

### 1. Launch All Services
From the repository root directory:
```bash
docker compose up -d --build
```

### 2. Verify Container Health
```bash
docker compose ps
```
Expected status: All three containers (`acentra-mysql`, `acentra-rabbitmq`, `acentra-backend`) reporting `Up` and `healthy`.

### 3. Check Live Logs
```bash
# Follow backend logs
docker compose logs -f backend

# Follow RabbitMQ logs
docker compose logs -f rabbitmq

# Follow MySQL logs
docker compose logs -f mysql
```

### 4. Stopping the System
```bash
# Stop containers without removing volumes (data is preserved)
docker compose stop

# Stop and remove containers and network
docker compose down

# Stop, remove containers, and purge volumes (fresh restart)
docker compose down -v
```

---

## RabbitMQ Messaging Flow & Topology

The system implements a reliable, non-blocking asynchronous event topology using Spring AMQP:

### Exchanges & Queues

| Queue Name | Routing Key | Exchange | Purpose |
| :--- | :--- | :--- | :--- |
| `order.process.queue` | `order.process` | `acentra.order.exchange` (Topic) | Ingests new orders for asynchronous inventory reservation & payment |
| `order.inventory.queue` | `order.inventory` | `acentra.order.exchange` (Topic) | Inventory reservation audit stream |
| `order.success.queue` | `order.completed` | `acentra.order.exchange` (Topic) | Completed order events stream |
| `order.failed.queue` | `order.failed` | `acentra.order.exchange` (Topic) | Failed order events stream (out of stock, permanent errors) |
| `order.retry.queue` | `order.retry` | `acentra.retry.exchange` (Direct) | Holds retried orders with a 5000ms TTL. Dead-letters back to `order.process.queue` |
| `order.dlq` | `order.dlq` | `acentra.dlx` (Direct) | Dead Letter Queue for exhausted retries and unrecoverable orders |

### Message Lifecycle
1. **Order Reception**: `POST /api/v1/orders` creates an order record with status `CREATED`, emits `ORDER_RECEIVED` operational event, and asynchronously publishes an `OrderProcessingMessage` to `acentra.order.exchange` (`order.process`).
2. **Order Processing**: `OrderProcessingConsumer` receives message, transitions status to `PROCESSING` (`ORDER_PROCESSING` event).
3. **Atomic Inventory Allocation**: Concurrently decrements stock using database-level row guards (`stock - :qty >= 0`). Emits `INVENTORY_RESERVED`.
4. **Order Completion**: Status updated to `COMPLETED`. Emits `ORDER_COMPLETED`.
5. **Transient Failure / Retry**: If a transient failure occurs and `retryCount < maxRetries (3)`:
   - Publishes to `acentra.retry.exchange` (`order.retry`).
   - Order status remains `PENDING_RETRY`. Emits `ORDER_RETRIED`.
   - After 5 seconds TTL expiration, RabbitMQ automatically routes message back to `order.process.queue`.
6. **Exhausted Retries / DLQ**: When retries reach max limit or non-recoverable error occurs:
   - Publishes to `acentra.dlx` (`order.dlq`).
   - Order status marked `SENT_TO_DLQ` or `FAILED`. Emits `ORDER_SENT_TO_DLQ`.
   - Message persisted in DLQ store for operator inspection and replay.

---

## Failure & Retry Demonstration Steps (Hackathon Guide)

The backend provides built-in failure simulation triggers (`simulateFailure` field in order request) so judges and evaluators can verify retry and DLQ behavior without altering code.

### Step 1: Initialize Test Inventory
```bash
curl -X POST http://localhost:8080/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "PROD-DEMO-001",
    "name": "High-Performance Laptop",
    "description": "Demo laptop for event-driven testing",
    "price": 1299.99,
    "initialStock": 50
  }'
```

### Step 2: Normal Order Processing (Happy Path)
```bash
curl -X POST http://localhost:8080/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUST-1001",
    "items": [{"sku": "PROD-DEMO-001", "quantity": 2}],
    "shippingAddress": "100 Innovation Way, Tech City"
  }'
```
**Verification:**
- Response: HTTP `202 Accepted` with initial status `CREATED`.
- Wait 1-2 seconds, check status:
```bash
curl http://localhost:8080/api/v1/orders
```
- The order status has automatically transitioned to `COMPLETED` asynchronously.

### Step 3: Trigger Simulated Retry (Transient Failure)
Submit an order with `"simulateFailure": "RETRY"`:
```bash
curl -X POST http://localhost:8080/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUST-RETRY-01",
    "items": [{"sku": "PROD-DEMO-001", "quantity": 1}],
    "shippingAddress": "200 Retry Boulevard",
    "simulateFailure": "RETRY"
  }'
```
**Verification:**
1. Check operational events to see the retry cycle:
```bash
curl http://localhost:8080/api/v1/operations/events
```
2. You will observe:
   - `ORDER_RECEIVED`
   - `ORDER_PROCESSING`
   - `ORDER_RETRIED` (Attempt 1)
   - After 5s TTL delay: `ORDER_PROCESSING` -> `INVENTORY_RESERVED` -> `ORDER_COMPLETED`.

### Step 4: Trigger Dead Letter Queue (DLQ)
Submit an order with `"simulateFailure": "DLQ"`:
```bash
curl -X POST http://localhost:8080/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUST-DLQ-01",
    "items": [{"sku": "PROD-DEMO-001", "quantity": 1}],
    "shippingAddress": "300 DLQ Lane",
    "simulateFailure": "DLQ"
  }'
```
**Verification:**
1. Query DLQ messages:
```bash
curl http://localhost:8080/api/v1/operations/dlq
```
2. Check the operational events:
```bash
curl http://localhost:8080/api/v1/operations/events
```
You will observe `ORDER_SENT_TO_DLQ` recorded with the stack trace and failure reason.

### Step 5: Replay / Recover Order from DLQ
Retrieve the `dlqMessageId` from the DLQ list and trigger replay:
```bash
# Replace DLQ_ID with the actual ID from Step 4
curl -X POST http://localhost:8080/api/v1/operations/dlq/DLQ_ID/retry
```
**Verification:**
The message is re-queued into `order.process.queue` with `simulateFailure` cleared, processing completes, and the order moves to `COMPLETED`.

### Step 6: Inspect System Statistics
```bash
curl http://localhost:8080/api/v1/operations/statistics
```
Returns total orders, active retries, dead-letter count, completed orders, and operational event counts in real time.
