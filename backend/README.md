# Backend Module - Shakthi-Acentra Order Processing System

## Overview
The **Shakthi-Acentra Backend** is built with **Spring Boot 3.3.4** and **Java 21**. It serves as the core transactional engine for the platform, implementing thread-safe inventory reservation with zero overselling, idempotent order intake, and lifecycle state management.

---

## Implemented Components (Stage 4)

### 1. Domain Entities & Relational Mappings
- **`Product`**: Product catalog entity with unique SKU, pricing, and descriptions.
- **`Inventory`**: Stock management entity tracking `availableStock`, `reservedStock`, and `@Version` optimistic concurrency tokens.
- **`InventoryTransaction`**: Immutable audit ledger recording stock changes (`INITIAL_STOCK`, `RESERVE`, `RELEASE_COMPENSATION`, `FULFILL_DEDUCT`, `RESTOCK`).
- **`Order`**: Master order entity with lifecycle state (`CREATED`, `PENDING_PAYMENT`, `PAYMENT_SUCCESS`, `PAYMENT_FAILED`, `INSUFFICIENT_STOCK`, `PROCESSING`, `COMPLETED`, `CANCELLED`, `FAILED`), idempotency token, customer tier, and total valuation.
- **`OrderItem`**: Line items linked to orders and products with locked unit price and subtotal calculations.
- **`Payment`**: Payment transaction record storing transaction references and gateway responses.
- **`AuditLog`**: System-wide entity state transition audit logs.
- **`DlqRecord`**: Persistence entity for dead-lettered message inspection and replay.

### 2. Concurrency Guard & Zero-Overselling Strategy
- **Atomic Conditional Updates**: Stock reservations utilize `reserveStockAtomic` via direct SQL updates:
  ```sql
  UPDATE inventory 
  SET available_stock = available_stock - :qty, 
      reserved_stock  = reserved_stock + :qty, 
      version         = version + 1,
      updated_at      = :now 
  WHERE product_id = :productId AND available_stock >= :qty;
  ```
  Evaluated inside InnoDB row write-locks to eliminate race conditions under concurrent submissions.
- **Deadlock Avoidance**: Multi-item orders are sorted canonically by `productId ASC` before executing stock reservations.
- **Idempotency Protection**: Enforces unique client-supplied `Idempotency-Key` headers on order submissions to prevent duplicate billing and stock reservation.
- **Automatic Compensation**: Order cancellations in `PENDING_PAYMENT` or `PROCESSING` release reserved stock back into available stock.

### 3. REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Service health status and module telemetry |
| `POST` | `/api/v1/products` | Create product catalog item with initial inventory |
| `GET` | `/api/v1/products` | Retrieve all product catalog items |
| `GET` | `/api/v1/products/{sku}` | Retrieve product details by SKU |
| `GET` | `/api/v1/inventory` | Retrieve stock levels for all products |
| `GET` | `/api/v1/inventory/{sku}` | Retrieve inventory details for a SKU |
| `POST` | `/api/v1/inventory/restock` | Restock an item with additional units |
| `POST` | `/api/v1/orders` | Idempotent order creation with stock reservation |
| `GET` | `/api/v1/orders/{orderNumber}` | Retrieve order details and line items |
| `GET` | `/api/v1/orders` | Paginated and filtered order listings |
| `POST` | `/api/v1/orders/{orderNumber}/cancel` | Cancel order and release reserved stock |

---

## How to Build and Run

### Prerequisites
- **JDK 21** or later
- **Apache Maven 3.9+**
- **MySQL 8.0** (or in-memory H2 profile for automated testing)

### Run Automated Tests
```bash
cd backend
mvn clean test
```
*Executes all unit tests, Mockito mocks, MockMvc REST integrations, and multi-threaded concurrency tests.*

### Build Executable JAR
```bash
mvn clean package
```
*Produces `target/acentra-backend-1.0.0-SNAPSHOT.jar`.*

### Run Locally
```bash
# With MySQL running on localhost:3306
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=acentra_db
export DB_USER=acentra_user
export DB_PASSWORD=acentra_password

java -jar target/acentra-backend-1.0.0-SNAPSHOT.jar
```
*The service starts on `http://localhost:8080`.*
