# Docker Infrastructure - Shakthi-Acentra System

## Overview
This directory contains the containerization blueprints, orchestration scripts, and environment configurations designed to run the full Shakthi-Acentra system locally and in deployment environments.

## Planned Services
- **MySQL Database**: High-performance relational database storage for orders, inventory, and audit events.
- **RabbitMQ Message Broker**: Robust AMQP messaging server with management UI enabled for queue routing, topic exchanges, and DLQ tracking.
- **Backend Application Service**: Containerized Spring Boot service instances.
- **Frontend Dashboard Service**: Containerized React web client served via high-performance web server (e.g. Nginx).

## Planned Setup
- Multi-container composition via `docker-compose.yml`
- Health check validations and automated service readiness sequencing
- Persistent volumes for database storage and message broker state

*Note: Container configurations, Dockerfiles, and compose files will be provisioned in Stage 3.*
