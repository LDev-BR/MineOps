# MineOps - Frontend Architecture

Version: 1.0

Status: Approved

---

# Purpose

This document defines the frontend architecture of MineOps.

It serves as the official reference for:

* Angular architecture
* Folder structure
* Component organization
* State management
* Routing
* Shared components
* API integration

All frontend development must follow these standards.

---

# Technology Stack

Framework

```text
Angular 20
```

Language

```text
TypeScript
```

Architecture

```text
Standalone Components
```

State Management

```text
Angular Signals
```

Routing

```text
Angular Router
```

UI

```text
Angular Material
```

Maps

```text
Leaflet
```

Charts

```text
ngx-charts
```

Forms

```text
Reactive Forms
```

---

# Architectural Principles

## FE-001

Feature-first organization.

Structure should follow business domains.

Not technical layers.

---

## FE-002

Reusable components belong in Shared.

Business components belong in Features.

---

## FE-003

Pages orchestrate.

Components render.

Services communicate.

---

## FE-004

State should remain local whenever possible.

Avoid global state unless required.

---

## FE-005

No direct API calls from components.

Components communicate through services.

---

# Application Structure

```text
src/

app/

core/

shared/

layout/

features/

assets/

environments/
```

---

# Core Layer

Purpose:

Application-wide infrastructure.

Contains:

```text
auth/
guards/
interceptors/
config/
services/
models/
```

Examples:

```text
auth.service.ts

auth.guard.ts

error.interceptor.ts

api.config.ts
```

---

# Shared Layer

Purpose:

Reusable building blocks.

Contains:

```text
components/
directives/
pipes/
utils/
types/
```

---

# Shared Components

Examples:

```text
app-button

app-card

app-kpi-card

app-data-table

app-status-badge

app-page-header

app-empty-state

app-loading-state

app-confirm-dialog
```

Rules:

Must not contain business logic.

---

# Layout Layer

Purpose:

Application shell.

Contains:

```text
main-layout/

sidebar/

topbar/

bottom-navigation/

breadcrumb/
```

---

# Layout Structure

Desktop

```text
Sidebar

Topbar

Content Area
```

---

Mobile

```text
Topbar

Content Area

Bottom Navigation
```

---

# Feature Modules

Each business domain owns its feature.

---

Dashboard

```text
features/dashboard
```

Responsibilities:

* KPIs
* Charts
* Activity Feed
* Quick Actions

---

Equipment

```text
features/equipment
```

Responsibilities:

* Equipment List
* Equipment Details
* Equipment History

---

Teams

```text
features/teams
```

Responsibilities:

* Team Management
* Assignments

---

Work Orders

```text
features/work-orders
```

Responsibilities:

* Kanban Board
* Work Order Details
* Work Order Creation

---

Maintenance

```text
features/maintenance
```

Responsibilities:

* Maintenance History
* Maintenance Scheduling

---

Inspections

```text
features/inspections
```

Responsibilities:

* Inspection Records

---

Incidents

```text
features/incidents
```

Responsibilities:

* Incident Tracking

---

Maps

```text
features/maps
```

Responsibilities:

* Mine Visualization
* Asset Tracking

---

Reports

```text
features/reports
```

Responsibilities:

* Report Generation
* Analytics

---

Settings

```text
features/settings
```

Responsibilities:

* User Preferences
* Application Settings

---

# Feature Structure

Every feature follows:

```text
feature/

pages/

components/

services/

models/

store/

routes/
```

Example:

```text
equipment/

pages/

components/

services/

models/

store/

routes/
```

---

# Page Structure

Pages represent routes.

Examples:

```text
equipment-list.page.ts

equipment-details.page.ts

equipment-create.page.ts
```

Pages coordinate data.

Pages should remain thin.

---

# Component Structure

Components represent UI.

Examples:

```text
equipment-card.component

equipment-table.component

equipment-history.component
```

Rules:

No API calls.

No route logic.

No business logic.

---

# Service Structure

Purpose:

Communication layer.

Examples:

```text
equipment.service.ts

work-order.service.ts

maintenance.service.ts
```

Responsibilities:

* API communication
* Data transformation
* Caching

---

# State Management

Technology:

```text
Angular Signals
```

Pattern:

Feature Stores

Example:

```text
equipment.store.ts

work-order.store.ts
```

Responsibilities:

* Feature state
* Loading state
* Error state

---

# Routing Strategy

Root Routes

```text
/dashboard

/equipment

/teams

/work-orders

/maintenance

/inspections

/incidents

/maps

/reports

/settings
```

---

# Lazy Loading

All features must be lazy-loaded.

Example:

```typescript
{
  path: 'equipment',
  loadChildren: () =>
    import('./features/equipment/routes')
}
```

---

# Authentication Flow

Provider:

```text
Keycloak
```

Future Architecture:

```text
Angular

↓

Auth Guard

↓

Keycloak

↓

Backend API
```

---

# API Layer

Base URL

```text
/api/v1
```

All API communication must use:

```text
core/services/api.service.ts
```

Purpose:

Centralized HTTP handling.

---

# Error Handling

Centralized.

Handled through:

```text
HTTP Interceptors
```

Responsibilities:

* Unauthorized
* Forbidden
* Server Errors
* Network Errors

---

# Loading Strategy

Every page must support:

```text
loading

success

empty

error
```

states.

---

# Table Standards

All enterprise tables must support:

* Search
* Filters
* Pagination
* Sorting

Reusable component:

```text
app-data-table
```

---

# Form Standards

Technology:

```text
Reactive Forms
```

Requirements:

* Validation
* Error Messages
* Disabled States
* Loading States

---

# Map Architecture

Technology:

```text
Leaflet
```

Layers:

* Mines
* Zones
* Equipment
* Teams

Future:

* PostGIS Integration

---

# Chart Architecture

Technology:

```text
ngx-charts
```

Allowed Types:

* Bar
* Line
* Area
* Donut

---

# Permissions

Future Role Support:

```text
Operator

Technician

Supervisor

Manager

Administrator
```

UI visibility should be permission-driven.

---

# Testing Strategy

Unit Tests

```text
Jasmine
Karma
```

---

Future

```text
Playwright
```

for E2E.

---

# Performance Rules

Use:

```text
OnPush Change Detection
```

everywhere possible.

---

Use:

```text
trackBy
```

for large lists.

---

Avoid:

```text
nested subscriptions
```

---

# Accessibility

Required:

* Keyboard navigation
* Focus states
* ARIA labels
* WCAG AA compliance

---

# AI Development Rules

When generating frontend code:

* Prefer standalone components.
* Prefer Signals.
* Prefer composition over inheritance.
* Keep components small.
* Avoid duplicated UI patterns.
* Follow Design System.
* Follow Feature Architecture.

Never generate code that violates this document.

---

# Final Principle

The frontend is organized around business domains.

Features own business behavior.

Shared owns reusable UI.

Core owns infrastructure.

The architecture must remain scalable as MineOps evolves from MVP to enterprise platform.
