# MineOps - Backend Architecture

Version: 1.0

Status: Approved

---

# Purpose

This document defines the backend architecture standards for MineOps.

It is the authoritative reference for:

* Spring Boot architecture
* Domain implementation
* Package organization
* API design
* Security implementation
* Persistence strategy
* Validation standards
* Exception handling
* Integration architecture
* Performance requirements

All backend development must follow this document.

---

# Technology Stack

Framework

```text
Spring Boot 3.x
```

Language

```text
Java 21
```

Build Tool

```text
Maven
```

Database

```text
PostgreSQL
```

Geospatial

```text
PostGIS
```

ORM

```text
Spring Data JPA
Hibernate
```

Security

```text
Spring Security
Keycloak
```

Workflow

```text
Camunda BPM
```

Serialization

```text
Jackson
```

Validation

```text
Jakarta Validation
```

Documentation

```text
OpenAPI
Swagger
```

Containerization

```text
Docker
```

---

# Architectural Style

MineOps follows:

```text
Modular Monolith
```

Structure:

```text
API Layer

↓

Application Layer

↓

Domain Layer

↓

Infrastructure Layer

↓

Persistence Layer
```

---

# Architectural Principles

## BE-001

Business logic belongs to domains.

Never inside controllers.

---

## BE-002

Controllers expose APIs.

Services execute use cases.

Repositories access data.

---

## BE-003

Domains must be independent.

Avoid cross-module coupling.

---

## BE-004

Entities are persistence models.

Never expose entities to API consumers.

---

## BE-005

DTOs are the only objects crossing API boundaries.

---

## BE-006

Every business operation must be auditable.

---

## BE-007

Soft delete is mandatory.

---

# Package Structure

```text
com.mineops

common

auth

mine

zone

employee

team

equipment

workorder

maintenance

inspection

incident

reporting

geospatial

workflow
```

---

# Module Structure

Every module must follow:

```text
module/

controller/

service/

repository/

entity/

dto/

mapper/

validator/

specification/

exception/
```

Example:

```text
equipment/

controller/
service/
repository/
entity/
dto/
mapper/
validator/
specification/
exception/
```

---

# Common Module

Contains shared infrastructure.

```text
common/

config/
security/
exception/
audit/
mapper/
pagination/
response/
utils/
```

Responsibilities:

* Global exception handling
* Audit infrastructure
* Security helpers
* API response standards
* Pagination models

---

# API Layer

Controllers must:

* Validate requests
* Call services
* Return DTOs

Controllers must NOT:

* Contain business rules
* Access repositories
* Perform calculations

Example:

```java
@RestController
@RequestMapping("/api/v1/equipment")
public class EquipmentController {
}
```

---

# Service Layer

Responsibilities:

* Execute use cases
* Apply business rules
* Coordinate repositories
* Trigger workflows

Example:

```java
public class CreateWorkOrderService {
}
```

Rules:

Services may call:

* Repositories
* Other services
* External integrations

Services must not expose entities.

---

# Repository Layer

Technology:

```text
Spring Data JPA
```

Responsibilities:

* Data persistence
* Query execution

Rules:

Repositories contain no business logic.

Example:

```java
public interface EquipmentRepository
extends JpaRepository<Equipment, Long> {
}
```

---

# Domain Layer

Each module owns:

* Entities
* Business rules
* Domain validations
* Domain services

Example:

Equipment Domain owns:

```text
Equipment

EquipmentStatus

EquipmentHistory

EquipmentAssignment
```

No other module may directly manipulate internal state.

---

# DTO Standards

Request DTOs

```text
CreateEquipmentRequest
UpdateEquipmentRequest
```

Response DTOs

```text
EquipmentResponse
EquipmentDetailsResponse
```

Rules:

Never return entities.

Never expose internal fields.

---

# Mapper Strategy

Technology:

```text
MapStruct
```

Responsibilities:

* Entity → DTO
* DTO → Entity

Example:

```java
EquipmentMapper
```

Manual mapping only when necessary.

---

# Validation Strategy

Technology:

```text
Jakarta Validation
```

Example:

```java
@NotBlank

@NotNull

@Size

@Email
```

Validation occurs:

1. Request level
2. Service level
3. Domain level

---

# API Response Standard

Success

```json
{
  "data": {},
  "timestamp": "",
  "path": ""
}
```

Error

```json
{
  "timestamp": "",
  "status": 400,
  "error": "Validation Error",
  "message": "",
  "path": ""
}
```

---

# Exception Handling

Centralized.

```text
GlobalExceptionHandler
```

Common Exceptions:

```text
EntityNotFoundException

BusinessRuleException

ValidationException

UnauthorizedException

ForbiddenException
```

---

# Security Architecture

Authentication

```text
Keycloak
```

Protocol

```text
OIDC
```

Authorization

```text
RBAC
```

Roles:

```text
ROLE_OPERATOR

ROLE_TECHNICIAN

ROLE_SUPERVISOR

ROLE_MANAGER

ROLE_ADMIN
```

---

# Security Flow

```text
User

↓

Keycloak

↓

JWT

↓

Spring Security

↓

Controller
```

---

# Authorization Rules

Examples:

Operator

```text
Read Assigned Work Orders
```

Supervisor

```text
Create Work Orders
Approve Work Orders
```

Manager

```text
Access Reporting
```

Admin

```text
System Administration
```

---

# Audit Architecture

Every business action must generate audit records.

Examples:

```text
Equipment Created

Equipment Updated

Work Order Approved

Maintenance Completed
```

Audit storage:

```text
audit_log
```

---

# Soft Delete Strategy

Business entities contain:

```java
private LocalDateTime deletedAt;

private Long deletedBy;
```

Queries must ignore deleted records.

---

# Pagination Standard

Default:

```text
page
size
sort
```

Example:

```http
GET /api/v1/equipment?page=0&size=20
```

Maximum page size:

```text
100
```

---

# Filtering Strategy

Use:

```text
Spring Specifications
```

Example:

```http
GET /equipment?status=ACTIVE
```

Supports:

* Search
* Filters
* Sorting

---

# Transaction Management

Technology:

```text
@Transactional
```

Rules:

Write operations:

```text
Transactional
```

Read operations:

```text
readOnly=true
```

---

# Workflow Integration

Technology:

```text
Camunda BPM
```

Backend Responsibilities:

* Start processes
* Query process state
* Complete tasks
* Synchronize status

Business entities never contain BPM logic.

---

# Geospatial Integration

Technology:

```text
PostGIS
```

Supported Types:

```text
POINT

POLYGON

MULTIPOLYGON
```

Examples:

* Equipment Location
* Zones
* Mine Boundaries

---

# Reporting Architecture

Reporting module owns:

* KPI calculations
* Aggregations
* Export generation

Supported Formats:

```text
PDF

Excel

CSV
```

Heavy reports must execute asynchronously.

---

# Event Architecture

Current Phase

```text
Synchronous
```

Future Phase

```text
Domain Events
```

Examples:

```text
EquipmentCreatedEvent

WorkOrderCreatedEvent

MaintenanceCompletedEvent
```

---

# Caching Strategy

Technology:

```text
Spring Cache
```

Future Provider:

```text
Redis
```

Cache Candidates:

* Dashboard KPIs
* Reference Data
* Reporting Metrics

---

# File Storage Strategy

Initial Phase

```text
Local Storage
```

Future

```text
AWS S3
MinIO
```

Used by:

* Attachments
* Inspection Photos
* Reports

---

# OpenAPI Standards

Endpoint documentation required.

Technology:

```text
springdoc-openapi
```

Available:

```text
/swagger-ui
```

---

# Testing Strategy

Unit Tests

```text
JUnit 5
Mockito
```

Integration Tests

```text
Spring Boot Test
Testcontainers
```

Architecture Tests

```text
ArchUnit
```

Coverage Goal

```text
80%+
```

Critical Domains

```text
90%+
```

---

# Logging Strategy

Technology

```text
SLF4J
```

Rules:

Never log:

* Passwords
* Tokens
* Sensitive information

Log Levels:

```text
ERROR
WARN
INFO
DEBUG
```

---

# Performance Standards

API Response

```text
< 500ms average
```

Dashboard APIs

```text
< 2s
```

Report Generation

```text
Async
```

---

# Deployment Architecture

```text
Spring Boot

↓

Docker

↓

PostgreSQL

↓

PostGIS

↓

Keycloak

↓

Camunda
```

---

# Future Evolution

Current

```text
Modular Monolith
```

Future

```text
Microservices
```

Candidate Services:

```text
Equipment Service

Maintenance Service

Workflow Service

Reporting Service
```

Migration must preserve domain boundaries.

---

# AI Development Rules

When generating backend code:

* Follow module boundaries.
* Use DTOs.
* Use services for business logic.
* Never expose entities.
* Use MapStruct.
* Use validation annotations.
* Follow REST standards.
* Follow audit requirements.

Generated code that violates this document must be rejected.

---

# Final Principle

MineOps backend is domain-driven.

Business rules belong to domains.

Controllers expose contracts.

Infrastructure supports domains.

The backend must remain maintainable, secure, scalable, and enterprise-ready throughout the evolution of the platform.
