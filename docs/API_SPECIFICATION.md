# REST & WebSocket API Specification

---

## 1. REST API Overview & Design Principles

The Shakthi-Acentra REST API conforms to modern RESTful architecture, utilizing standard HTTP verbs, JSON request/response payloads, ISO-8601 timestamps, and standardized HTTP status codes.

### Global Headers:
- `Content-Type: application/json`
- `Accept: application/json`
- `Idempotency-Key: <UUID>` *(Mandatory for order creation)*
- `X-Correlation-Id: <UUID>` *(Distributed tracing ID propagated across logs and message queues)*

### Standard Error Response Schema:
```json
{
  "timestamp": "2026-09-22T12:00:00.000Z",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "Stock check failed for SKU: PROD-998. Available: 2, Requested: 5",
  "path": "/api/v1/orders",
  "correlationId": "8f3e2b41-92bb-4c28-98e1-55c3272d1101"
}
```

---

## 2. Order Management API (`/api/v1/orders`)

### 2.1 Submit Order
Asynchronously ingests a new order into the processing pipeline with idempotency guarantees.

- **Method**: `POST`
- **Endpoint**: `/api/v1/orders`
- **Headers**: `Idempotency-Key: 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d`
- **Request Body**:
  ```json
  {
    "customerId": "CUST-8041",
    "customerTier": "VIP",
    "items": [
      {
        "sku": "LAPTOP-PRO-16",
        "quantity": 1
      },
      {
        "sku": "MOUSE-WL-RGB",
        "quantity": 2
      }
    ],
    "paymentDetails": {
      "paymentMethod": "CREDIT_CARD",
      "paymentToken": "tok_visa_4242"
    }
  }
  ```
- **Response**: `202 Accepted`
  ```json
  {
    "orderNumber": "ORD-2026-0922-8491",
    "status": "CREATED",
    "customerTier": "VIP",
    "totalAmount": 2199.00,
    "createdAt": "2026-09-22T12:45:00.000Z",
    "message": "Order successfully accepted and dispatched for processing."
  }
  ```

---

### 2.2 Get Order by Order Number
Retrieves complete lifecycle status, line items, and audit history of a specific order.

- **Method**: `GET`
- **Endpoint**: `/api/v1/orders/{orderNumber}`
- **Response**: `200 OK`
  ```json
  {
    "orderNumber": "ORD-2026-0922-8491",
    "customerId": "CUST-8041",
    "customerTier": "VIP",
    "status": "COMPLETED",
    "totalAmount": 2199.00,
    "failureReason": null,
    "items": [
      {
        "sku": "LAPTOP-PRO-16",
        "name": "Pro Workstation Laptop 16-inch",
        "quantity": 1,
        "unitPrice": 2099.00,
        "subtotal": 2099.00
      },
      {
        "sku": "MOUSE-WL-RGB",
        "name": "Wireless Ergonomic Mouse",
        "quantity": 2,
        "unitPrice": 50.00,
        "subtotal": 100.00
      }
    ],
    "payment": {
      "transactionReference": "TX-991204-ACC",
      "status": "SUCCESS",
      "amount": 2199.00
    },
    "createdAt": "2026-09-22T12:45:00.000Z",
    "updatedAt": "2026-09-22T12:45:03.250Z"
  }
  ```

---

### 2.3 List Orders (Paginated & Filtered)
Used by the operations dashboard to list and filter orders across various states.

- **Method**: `GET`
- **Endpoint**: `/api/v1/orders`
- **Query Parameters**:
  - `status` *(Optional)*: `CREATED`, `PENDING_PAYMENT`, `PAYMENT_FAILED`, `COMPLETED`, `FAILED`
  - `customerTier` *(Optional)*: `STANDARD`, `VIP`, `PRIORITY`
  - `page` *(Optional, Default: 0)*
  - `size` *(Optional, Default: 20)*
  - `sort` *(Optional, Default: `createdAt,desc`)*
- **Response**: `200 OK` (Spring Page JSON payload)

---

### 2.4 Cancel Order
Requests cancellation of an ongoing or pending order, triggering compensation if stock was already reserved.

- **Method**: `POST`
- **Endpoint**: `/api/v1/orders/{orderNumber}/cancel`
- **Request Body**:
  ```json
  {
    "reason": "Customer requested cancellation prior to warehouse packaging"
  }
  ```
- **Response**: `200 OK`

---

## 3. Products & Inventory API (`/api/v1/inventory`)

### 3.1 Get All Inventory
- **Method**: `GET`
- **Endpoint**: `/api/v1/inventory`
- **Response**: `200 OK`
  ```json
  [
    {
      "productId": 1,
      "sku": "LAPTOP-PRO-16",
      "name": "Pro Workstation Laptop 16-inch",
      "price": 2099.00,
      "availableStock": 45,
      "reservedStock": 5,
      "version": 12,
      "updatedAt": "2026-09-22T12:30:00.000Z"
    }
  ]
  ```

---

### 3.2 Restock Product
- **Method**: `POST`
- **Endpoint**: `/api/v1/inventory/restock`
- **Request Body**:
  ```json
  {
    "sku": "LAPTOP-PRO-16",
    "quantityToAdd": 50,
    "notes": "Q3 bulk replenishment shipment from supplier"
  }
  ```
- **Response**: `200 OK`

---

## 4. Operations & DLQ Management API (`/api/v1/operations`)

### 4.1 Get Real-Time Metric Aggregates
- **Method**: `GET`
- **Endpoint**: `/api/v1/operations/metrics`
- **Response**: `200 OK`
  ```json
  {
    "currentTps": 34.5,
    "totalOrdersProcessed": 14205,
    "failedOrdersCount": 12,
    "activeWorkers": 8,
    "queueDepths": {
      "orderProcessQueue": 3,
      "orderPaymentQueue": 1,
      "orderNotificationQueue": 0,
      "orderDlq": 2
    },
    "latencyMetrics": {
      "p50Ms": 42.1,
      "p95Ms": 115.4,
      "p99Ms": 280.6
    }
  }
  ```

---

### 4.2 List Dead Letter Queue Records
- **Method**: `GET`
- **Endpoint**: `/api/v1/operations/dlq`
- **Query Parameters**: `status` (`PENDING_REVIEW`, `REPLAYED`, `DISCARDED`), `page`, `size`
- **Response**: `200 OK`

---

### 4.3 Replay DLQ Message
Re-injects a dead-lettered message back into its original queue with cleared retry counters.

- **Method**: `POST`
- **Endpoint**: `/api/v1/operations/dlq/{id}/retry`
- **Response**: `200 OK`
  ```json
  {
    "dlqRecordId": 4,
    "status": "REPLAYED",
    "replayedAt": "2026-09-22T12:50:00.000Z",
    "message": "Payload successfully re-injected into original queue."
  }
  ```

---

### 4.4 Discard DLQ Message
Marks a poison-pill or obsolete message as discarded.

- **Method**: `POST`
- **Endpoint**: `/api/v1/operations/dlq/{id}/discard`
- **Request Body**:
  ```json
  {
    "reason": "Malformed JSON payload from legacy testing client. Unrecoverable."
  }
  ```
- **Response**: `200 OK`

---

## 5. Real-Time WebSocket / STOMP Protocol Specification

### 5.1 Connection Handshake
- **Handshake Endpoint**: `ws://localhost:8080/ws-telemetry`
- **SockJS Fallback Endpoint**: `http://localhost:8080/ws-telemetry`
- **Sub-protocol**: `STOMP v1.2`

### 5.2 Broadcast Channels & Payloads

#### Channel 1: `/topic/orders`
Broadcast on every order status transition:
```json
{
  "orderNumber": "ORD-2026-0922-8491",
  "customerId": "CUST-8041",
  "customerTier": "VIP",
  "status": "PAYMENT_SUCCESS",
  "totalAmount": 2199.00,
  "timestamp": "2026-09-22T12:45:01.820Z"
}
```

#### Channel 2: `/topic/metrics`
Emitted every 1000ms by the telemetry scheduler:
```json
{
  "timestamp": "2026-09-22T12:45:02.000Z",
  "tps": 38.2,
  "queueLag": 4,
  "activeWorkers": 8,
  "p95LatencyMs": 98.4
}
```

#### Channel 3: `/topic/inventory`
Emitted when stock changes or falls below alert thresholds:
```json
{
  "sku": "LAPTOP-PRO-16",
  "availableStock": 4,
  "reservedStock": 6,
  "alertLevel": "CRITICAL_LOW",
  "timestamp": "2026-09-22T12:45:02.100Z"
}
```

#### Channel 4: `/topic/alerts`
Immediate broadcast on critical system anomalies (e.g. DLQ ingress, gateway failure):
```json
{
  "alertId": "ALT-8832",
  "severity": "CRITICAL",
  "message": "Message sent to Dead Letter Queue (order.dlq) due to 3 consecutive payment gateway timeouts.",
  "sourceQueue": "order.payment.queue",
  "timestamp": "2026-09-22T12:45:03.000Z"
}
```
