# MineOps - Development Guidelines

Version: 1.0

Status: Approved

---

# Purpose

This document defines the official development guidelines for MineOps.

Its objective is to ensure:

* Consistency
* Maintainability
* Scalability
* Code quality
* Team alignment
* AI-assisted development standards

All contributors must follow these guidelines.

---

# Core Principles

## DG-001

Code must be written for humans first.

Computers execute code.

Humans maintain it.

---

## DG-002

Clarity is more important than cleverness.

Prefer simple solutions.

---

## DG-003

Consistency beats personal preference.

Follow project standards.

---

## DG-004

Business logic must be explicit.

Hidden behavior is forbidden.

---

## DG-005

Every feature must be maintainable by another developer.

---

# Architecture First

Before implementing any feature:

1. Read PRD
2. Read Architecture Documents
3. Identify domain ownership
4. Define API contracts
5. Define data model
6. Implement

Never start coding without understanding the architecture.

---

# Development Workflow

Feature implementation order:

```text
Requirements

↓

Database

↓

Backend

↓

API Contract

↓

Frontend

↓

Testing

↓

Documentation
```

Never start with UI only.

Business model comes first.

---

# Branch Strategy

Main Branches

```text
main
develop
```

Feature Branches

```text
feature/equipment-module

feature/work-order-kanban

feature/maintenance-history
```

Bug Fixes

```text
fix/work-order-filter

fix/dashboard-loading
```

Hotfixes

```text
hotfix/security-patch
```

---

# Commit Convention

Format

```text
type(scope): description
```

Examples

```text
feat(equipment): add equipment history endpoint

fix(workorder): resolve status transition validation

refactor(team): simplify assignment logic

docs(api): update swagger documentation
```

Allowed Types

```text
feat
fix
refactor
test
docs
chore
perf
build
```

---

# Pull Request Standards

Every PR must contain:

* Purpose
* Scope
* Screenshots (if UI)
* Testing Evidence
* Related Requirement

Example:

```text
Implements FR-008

Adds work order creation endpoint

Includes validation

Unit tests added
```

---

# Code Review Rules

Reviewers must verify:

* Architecture compliance
* Naming consistency
* Security concerns
* Test coverage
* Performance impact

Never approve code you do not understand.

---

# Naming Conventions

## Classes

```java
EquipmentService

CreateWorkOrderUseCase

MaintenanceRepository
```

---

## Interfaces

```java
EquipmentRepository

NotificationService
```

Avoid prefixes:

```java
IEquipmentService
```

---

## Methods

```java
createWorkOrder()

findEquipmentById()

assignTechnician()
```

Use verbs.

---

## Variables

```java
equipmentId

workOrderStatus

maintenanceRecord
```

Avoid abbreviations.

---

## Constants

```java
MAX_PAGE_SIZE

DEFAULT_TIMEOUT

WORK_ORDER_LIMIT
```

Upper snake case.

---

# Backend Guidelines

---

## Controllers

Responsibilities:

* Validate input
* Delegate work
* Return responses

Must NOT:

* Query database
* Execute business rules
* Perform calculations

---

## Services

Responsibilities:

* Business rules
* Use cases
* Domain orchestration

Must NOT:

* Handle HTTP concerns

---

## Repositories

Responsibilities:

* Persistence

Must NOT:

* Implement business rules

---

## DTOs

Required for:

* Requests
* Responses

Entities never cross API boundaries.

---

# Frontend Guidelines

---

## Components

Components render UI.

Must NOT:

* Call APIs directly
* Store business rules

---

## Pages

Pages orchestrate:

* State
* Navigation
* Data loading

---

## Services

Responsible for:

* API communication
* Data transformation

---

## Shared Components

Must remain generic.

Example:

```text
app-table
app-card
app-dialog
```

Forbidden:

```text
equipment-card-inside-shared
```

Business components belong to features.

---

# Database Guidelines

---

## Migrations Only

Schema changes must be versioned.

Use:

```text
Flyway
```

Never modify production schema manually.

---

## Foreign Keys

Always required.

Unless explicitly justified.

---

## Audit Fields

Required:

```sql
created_at
created_by

updated_at
updated_by

deleted_at
deleted_by
```

---

## Soft Delete

Mandatory for business entities.

---

# API Guidelines

Versioning:

```text
/api/v1
```

Future:

```text
/api/v2
```

Never break existing contracts.

---

## REST Standards

Examples:

```http
GET /equipment

GET /equipment/{id}

POST /equipment

PUT /equipment/{id}

DELETE /equipment/{id}
```

---

## Status Codes

Success

```text
200
201
204
```

Client Errors

```text
400
401
403
404
409
```

Server Errors

```text
500
503
```

---

# Security Guidelines

Never trust frontend validation.

Backend validation is mandatory.

---

Never expose:

* Passwords
* Tokens
* Internal secrets

---

Secrets must come from:

```text
Environment Variables
```

Never hardcode credentials.

---

# Logging Guidelines

Allowed

```java
log.info("Work order created");
```

Forbidden

```java
log.info("Password: {}", password);
```

Never log sensitive data.

---

# Error Handling

Use domain-specific exceptions.

Example:

```java
EquipmentNotFoundException

WorkOrderValidationException
```

Avoid generic exceptions.

---

# Testing Guidelines

Testing Pyramid

```text
Unit Tests

↓

Integration Tests

↓

E2E Tests
```

---

## Unit Tests

Focus:

* Business logic
* Services
* Validators

Target:

```text
80%+
```

---

## Integration Tests

Focus:

* Database
* API
* Security

Use:

```text
Testcontainers
```

---

## E2E Tests

Future:

```text
Playwright
```

Critical flows only.

---

# Performance Guidelines

Avoid:

```java
N+1 queries
```

---

Use:

```java
Pagination
```

for large datasets.

---

Never load:

```text
Entire tables
```

into memory.

---

# Documentation Guidelines

Every feature must update:

* PRD (if requirements change)
* API Documentation
* Database Documentation

Documentation is part of development.

Not optional.

---

# Refactoring Rules

Allowed when:

* Improves readability
* Improves maintainability
* Reduces duplication

Refactoring must not change business behavior.

---

# Technical Debt

When debt is introduced:

Create:

```text
Technical Debt Ticket
```

Include:

* Reason
* Risk
* Proposed solution

---

# AI-Assisted Development Rules

AI is allowed.

AI is not authoritative.

Every generated code must be reviewed.

---

Developers remain responsible for:

* Security
* Performance
* Correctness
* Maintainability

---

Never merge AI-generated code without validation.

---

# Definition of Done

A feature is complete only when:

✓ Requirements implemented

✓ Tests passing

✓ Code reviewed

✓ Documentation updated

✓ API documented

✓ No critical defects

✓ Build passing

---

# Anti-Patterns

Forbidden:

* God Classes
* Massive Controllers
* Business Logic in UI
* Direct Database Access from Controllers
* Hardcoded Secrets
* Copy-Paste Development
* Unreviewed AI Code
* Circular Dependencies

---

# Engineering Culture

MineOps values:

* Simplicity
* Ownership
* Quality
* Transparency
* Continuous Improvement

Developers should optimize for long-term maintainability, not short-term speed.

---

# Final Principle

Every line of code becomes future maintenance.

Write code as if another engineer will be responsible for it in five years.

Because eventually, someone will.
