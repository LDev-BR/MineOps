# MineOps - System Architecture

Version: 1.0

Status: Approved

---

# Purpose

This document defines the architectural structure of MineOps.

Its purpose is to provide a single source of truth for:

* System boundaries
* Application modules
* Domain ownership
* Integration points
* Backend architecture
* Frontend architecture
* Infrastructure responsibilities

All future implementations must follow this architecture unless explicitly superseded.

---

# High-Level Architecture

MineOps follows a modular enterprise architecture.

The system is composed of five major layers:

1. Presentation Layer
2. Application Layer
3. Domain Layer
4. Infrastructure Layer
5. Data Layer

```text
Angular Frontend

        ↓

Spring Boot API

        ↓

Business Domains

        ↓

Infrastructure Services

        ↓

PostgreSQL + PostGIS
```

External Systems:

```text
Keycloak
Camunda BPM
Future AI Services
```

---

# Architectural Principles

## AP-001

Separation of Concerns

Each module owns its own business logic.

---

## AP-002

High Cohesion

Business logic must remain inside its corresponding domain.

---

## AP-003

Low Coupling

Modules communicate through contracts.

---

## AP-004

Domain-Oriented Design

Architecture is organized around business capabilities.

Not around database tables.

---

## AP-005

Future Scalability

Architecture must support:

* New modules
* New workflows
* Additional mines
* Large historical datasets

without redesign.

---

# Core Domains

MineOps is divided into bounded contexts.

---

## Mine Domain

Responsible for:

* Mines
* Mine metadata
* Mine lifecycle

Owns:

* Mine entities
* Mine services
* Mine repositories

---

## Zone Domain

Responsible for:

* Operational zones
* Geographic boundaries

Owns:

* Zone entities
* Zone services

---

## Equipment Domain

Responsible for:

* Asset management
* Equipment lifecycle
* Equipment history

Owns:

* Equipment entities
* Equipment status logic
* Equipment location history

---

## Team Domain

Responsible for:

* Teams
* Assignments
* Workforce structure

Owns:

* Team entities
* Assignment history

---

## Work Order Domain

Responsible for:

* Work order creation
* Status management
* Operational tasks

Owns:

* Work Order entities
* Work Order transitions

---

## Maintenance Domain

Responsible for:

* Maintenance execution
* Maintenance scheduling
* Downtime tracking

Owns:

* Maintenance entities
* Maintenance services

---

## Inspection Domain

Responsible for:

* Field inspections
* Inspection findings

Owns:

* Inspection entities

---

## Incident Domain

Responsible for:

* Incident tracking
* Root cause analysis

Owns:

* Incident entities

---

## Reporting Domain

Responsible for:

* Report generation
* Aggregated operational metrics

Owns:

* Reporting services

---

## Geospatial Domain

Responsible for:

* Maps
* Asset positioning
* Geographical visualization

Owns:

* Geospatial services

Uses:

* PostGIS

---

## Workflow Domain

Responsible for:

* Camunda integration
* Workflow synchronization

Owns:

* Workflow references
* Workflow state mapping

---

# Frontend Architecture

Technology:

* Angular 20
* TypeScript
* Signals
* Standalone Components

Architecture Style:

Feature-Based Architecture

---

# Frontend Folder Structure

```text
src/

core/
shared/
layout/

features/

  dashboard/

  equipment/

  teams/

  work-orders/

  maintenance/

  inspections/

  incidents/

  maps/

  reports/

  settings/
```

---

# Core Layer

Contains:

* Authentication
* Guards
* Interceptors
* Global Services
* Configuration

Rules:

No business logic allowed.

---

# Shared Layer

Contains:

* UI Components
* Pipes
* Utilities
* Reusable Models

Rules:

Must not depend on features.

---

# Feature Modules

Each feature owns:

```text
feature/

components/
pages/
services/
models/
store/
routes/
```

Rules:

Business logic stays inside feature.

---

# Backend Architecture

Technology:

* Spring Boot

Architecture:

Modular Monolith

Reason:

Suitable for MVP and early production.

Can evolve to microservices later.

---

# Backend Package Structure

```text
com.mineops

common

auth

mine

zone

equipment

team

workorder

maintenance

inspection

incident

reporting

geospatial

workflow
```

Each module owns:

* Controllers
* Services
* Entities
* DTOs
* Repositories

---

# API Architecture

Pattern:

REST API

Examples:

```http
GET /api/equipment

GET /api/equipment/{id}

POST /api/work-orders

PATCH /api/work-orders/{id}/status
```

Rules:

* Versioned APIs
* DTO-based communication
* No entity exposure

---

# Security Architecture

Authentication:

Keycloak

Protocol:

OpenID Connect

Authorization:

Role-Based Access Control

Roles:

* Operator
* Technician
* Supervisor
* Manager
* Administrator

Frontend never stores passwords.

---

# Database Architecture

Primary Database:

PostgreSQL

Geospatial Extension:

PostGIS

Database Responsibilities:

* Transactional data
* Historical data
* Audit data

---

# Audit Architecture

Every business entity must contain:

```text
created_at
created_by

updated_at
updated_by

deleted_at
deleted_by
```

Soft delete required.

No hard deletes for operational data.

---

# Workflow Architecture

Workflow engine:

Camunda BPM

Business entities never implement workflow logic directly.

Workflow state is controlled by Camunda.

MineOps only stores:

* Process instance id
* Workflow status
* Workflow metadata

---

# Event Strategy

Future capability.

Examples:

```text
EquipmentCreated

EquipmentRetired

WorkOrderCreated

MaintenanceCompleted

IncidentClosed
```

Current MVP:

Synchronous architecture.

Future:

Event-driven architecture.

---

# Geospatial Architecture

Technology:

PostGIS

Responsibilities:

* Mine boundaries
* Zone polygons
* Equipment locations
* Team locations

Spatial Indexes required.

Preferred Geometry Types:

```text
POINT

LINESTRING

POLYGON

MULTIPOLYGON
```

---

# AI Integration Architecture

Future Phase

Capabilities:

* Predictive Maintenance
* Incident Analysis
* Operational Recommendations

Rules:

AI never executes actions.

AI only generates recommendations.

Human approval always required.

---

# Deployment Architecture

Frontend

```text
Angular
↓
Vercel
```

Backend

```text
Spring Boot
↓
Docker
```

Database

```text
PostgreSQL + PostGIS
```

Identity

```text
Keycloak
```

Workflow

```text
Camunda
```

---

# Architecture Decision Record

ADR-001

Architecture Style:
Modular Monolith

Reason:
Simpler deployment and maintenance.

---

ADR-002

Database:
PostgreSQL

Reason:
Reliability and PostGIS support.

---

ADR-003

Authentication:
Keycloak

Reason:
Enterprise-grade identity management.

---

ADR-004

Workflow Engine:
Camunda BPM

Reason:
Industry-standard workflow orchestration.

---

# Final Principle

MineOps is a domain-driven enterprise platform.

Business domains own business logic.

Infrastructure supports business domains.

No module may directly violate domain boundaries.

All future development must respect the architecture defined in this document.
