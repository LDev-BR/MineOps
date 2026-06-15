# MineOps - AI Development Rules

Version: 1.0

Status: Mandatory

---

# Purpose

This document defines the rules that all AI coding assistants must follow when generating, modifying, reviewing, or refactoring code for MineOps.

Applicable to:

* Claude
* ChatGPT
* Gemini
* GitHub Copilot
* Cursor
* Windsurf
* Future AI Agents

This document exists to prevent architectural drift and maintain long-term consistency.

---

# Primary Objective

AI assistants must prioritize:

1. Architecture consistency
2. Maintainability
3. Scalability
4. Readability
5. Business correctness

Above:

* Shorter code
* Clever code
* Premature optimization

---

# Source of Truth

Before generating code, AI assistants must consider:

1. PROJECT-CONTEXT.md
2. PRD.md
3. BUSINESS-RULES.md
4. SYSTEM-ARCHITECTURE.md
5. DATABASE-DESIGN.md
6. FRONTEND-ARCHITECTURE.md
7. BACKEND-ARCHITECTURE.md
8. API-SPECIFICATION.md
9. UI-UX-DESIGN-SYSTEM.md

If a generated solution conflicts with any document:

The document wins.

---

# Architecture Preservation Rule

AI assistants must never:

* Replace architecture patterns.
* Introduce new architectural styles.
* Introduce alternative folder structures.
* Introduce competing state management solutions.
* Create duplicate abstractions.

Examples:

Forbidden:

```text
Introducing NgRx because it is popular.
```

When architecture defines:

```text
Angular Signals
```

Forbidden:

```text
Adding Redux.
```

Forbidden:

```text
Adding Zustand.
```

---

# Frontend Rules

Technology stack:

* Angular 20
* TypeScript
* Angular Signals
* Angular Material
* Leaflet

No alternatives unless explicitly requested.

---

# Standalone Components Rule

All new Angular components must be:

```text
standalone: true
```

Do not generate NgModules.

---

# Feature Ownership Rule

Business logic belongs inside feature domains.

Example:

Allowed:

```text
features/equipment
```

Forbidden:

```text
shared/equipment
```

---

# Component Size Rule

Target:

```text
< 300 lines
```

Warning:

```text
> 500 lines
```

Refactor required.

---

# Service Rule

Services handle:

* API communication
* Data transformation

Services do NOT:

* Render UI
* Navigate routes
* Manage layouts

---

# Store Rule

Feature stores manage:

* Feature state
* Loading state
* Error state

Stores do NOT:

* Call DOM APIs
* Handle presentation concerns

---

# Shared Component Rule

Shared components must be reusable.

Forbidden:

```text
EquipmentTableComponent
```

inside:

```text
shared/
```

Allowed:

```text
DataTableComponent
```

---

# Backend Rules

Technology:

```text
Spring Boot
```

Architecture:

```text
Modular Monolith
```

AI assistants must preserve modular boundaries.

---

# Domain Isolation Rule

Each domain owns:

* Controllers
* Services
* DTOs
* Repositories

Cross-domain access must occur through services.

Never access repositories across domains.

---

# Controller Rule

Controllers:

* Receive requests
* Validate input
* Return responses

Controllers must not contain business logic.

---

# Service Rule

Business logic belongs in services.

Services must remain cohesive.

---

# DTO Rule

Entities must never be exposed directly.

Always use DTOs.

---

# Repository Rule

Repositories only perform persistence operations.

Repositories must not contain business logic.

---

# Database Rules

Never remove audit columns.

Required:

```sql
created_at
created_by

updated_at
updated_by
```

---

Never physically delete business records.

Use soft delete.

---

# Geospatial Rules

All location-aware entities must support PostGIS.

Do not store latitude and longitude separately if PostGIS geometry is available.

Preferred:

```sql
geometry(Point, 4326)
```

---

# API Rules

Follow:

```text
API-SPECIFICATION.md
```

Do not invent endpoints.

Do not invent response structures.

Do not invent naming conventions.

---

# Security Rules

Authentication:

```text
Keycloak
```

Authorization:

```text
RBAC
```

Never generate custom authentication systems.

Never generate custom password storage.

Never bypass authorization checks.

---

# Workflow Rules

Workflow orchestration belongs to:

```text
Camunda BPM
```

Business services must not implement workflow engines.

---

# Testing Rules

All generated code should be testable.

Avoid:

* Static state
* Hidden dependencies
* Tight coupling

Prefer:

* Dependency Injection
* Clear interfaces
* Small units

---

# Naming Rules

Classes:

```text
PascalCase
```

Variables:

```text
camelCase
```

Database:

```text
snake_case
```

Endpoints:

```text
kebab-case
```

---

# Refactoring Rules

Before refactoring:

1. Preserve behavior.
2. Preserve contracts.
3. Preserve architecture.

Refactoring must not introduce breaking changes unless explicitly requested.

---

# UI Rules

Follow:

```text
UI-UX-DESIGN-SYSTEM.md
```

Do not invent colors.

Do not invent typography.

Do not invent spacing systems.

---

# Documentation Rules

Every major feature must include:

* Purpose
* Responsibilities
* Dependencies

Every public service must contain documentation.

---

# Performance Rules

Avoid:

* N+1 queries
* Duplicate API calls
* Unnecessary rerenders

Prefer:

* Pagination
* Lazy loading
* Caching where appropriate

---

# AI Self-Validation Checklist

Before generating code, verify:

□ Follows architecture

□ Follows domain boundaries

□ Follows business rules

□ Uses approved technologies

□ Uses approved folder structure

□ Uses approved API contracts

□ Preserves auditability

□ Preserves security requirements

□ Preserves maintainability

---

# Final Principle

AI assistants are contributors, not architects.

Architecture decisions are defined by MineOps documentation.

Generated code must adapt to the architecture.

The architecture must never adapt to the generated code.
