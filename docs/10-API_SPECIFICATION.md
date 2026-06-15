# MineOps - API Specification

Version: 1.0

Status: Approved

---

# Purpose

This document defines the official REST API contracts for MineOps.

All frontend, backend, integrations, and future mobile applications must follow these contracts.

---

# API Standards

Base URL

```http
/api/v1
```

Content Type

```http
application/json
```

Authentication

```http
Bearer Token
```

Authorization

```http
OAuth2 / OpenID Connect
```

Identity Provider

```text
Keycloak
```

---

# Standard Response Format

Success

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-01-01T10:00:00Z"
}
```

---

Error

```json
{
  "success": false,
  "error": {
    "code": "WORK_ORDER_NOT_FOUND",
    "message": "Work order not found"
  },
  "timestamp": "2026-01-01T10:00:00Z"
}
```

---

# Pagination Standard

Request

```http
?page=0&size=20
```

Response

```json
{
  "content": [],
  "page": 0,
  "size": 20,
  "totalElements": 125,
  "totalPages": 7
}
```

---

# Mine Endpoints

## Get Mines

```http
GET /api/v1/mines
```

---

## Get Mine By Id

```http
GET /api/v1/mines/{id}
```

---

## Create Mine

```http
POST /api/v1/mines
```

Request

```json
{
  "name": "Serra Norte Mine",
  "description": "Iron Ore Extraction Site"
}
```

---

## Update Mine

```http
PUT /api/v1/mines/{id}
```

---

# Zone Endpoints

## List Zones

```http
GET /api/v1/zones
```

Filters

```http
?mineId=
?status=
```

---

## Get Zone

```http
GET /api/v1/zones/{id}
```

---

## Create Zone

```http
POST /api/v1/zones
```

Request

```json
{
  "mineId": 1,
  "name": "Extraction Zone A"
}
```

---

# Equipment Endpoints

## List Equipment

```http
GET /api/v1/equipment
```

Filters

```http
?status=
?mineId=
?zoneId=
?manufacturer=
```

---

## Get Equipment

```http
GET /api/v1/equipment/{id}
```

---

## Create Equipment

```http
POST /api/v1/equipment
```

Request

```json
{
  "name": "CAT 320 Excavator",
  "manufacturer": "Caterpillar",
  "model": "320",
  "mineId": 1
}
```

---

## Update Equipment

```http
PUT /api/v1/equipment/{id}
```

---

## Retire Equipment

```http
PATCH /api/v1/equipment/{id}/retire
```

---

## Equipment History

```http
GET /api/v1/equipment/{id}/history
```

---

## Equipment Maintenance

```http
GET /api/v1/equipment/{id}/maintenance
```

---

# Team Endpoints

## List Teams

```http
GET /api/v1/teams
```

---

## Team Details

```http
GET /api/v1/teams/{id}
```

---

## Create Team

```http
POST /api/v1/teams
```

---

## Assign Employee

```http
POST /api/v1/teams/{id}/members
```

Request

```json
{
  "employeeId": 100
}
```

---

# Employee Endpoints

## List Employees

```http
GET /api/v1/employees
```

---

## Employee Details

```http
GET /api/v1/employees/{id}
```

---

## Employee Assignment History

```http
GET /api/v1/employees/{id}/assignments
```

---

# Work Order Endpoints

## List Work Orders

```http
GET /api/v1/work-orders
```

Filters

```http
?status=
?priority=
?assignedTeam=
```

---

## Get Work Order

```http
GET /api/v1/work-orders/{id}
```

---

## Create Work Order

```http
POST /api/v1/work-orders
```

Request

```json
{
  "title": "Excavator Hydraulic Failure",
  "description": "Hydraulic pressure issue detected",
  "priority": "HIGH",
  "equipmentId": 10
}
```

---

## Update Work Order

```http
PUT /api/v1/work-orders/{id}
```

---

## Change Status

```http
PATCH /api/v1/work-orders/{id}/status
```

Request

```json
{
  "status": "IN_PROGRESS"
}
```

---

## Work Order Timeline

```http
GET /api/v1/work-orders/{id}/timeline
```

---

# Maintenance Endpoints

## List Maintenance Records

```http
GET /api/v1/maintenance
```

---

## Maintenance Details

```http
GET /api/v1/maintenance/{id}
```

---

## Create Maintenance

```http
POST /api/v1/maintenance
```

---

## Close Maintenance

```http
PATCH /api/v1/maintenance/{id}/complete
```

---

## Maintenance Costs

```http
GET /api/v1/maintenance/costs
```

---

# Inspection Endpoints

## List Inspections

```http
GET /api/v1/inspections
```

---

## Create Inspection

```http
POST /api/v1/inspections
```

---

## Inspection Details

```http
GET /api/v1/inspections/{id}
```

---

# Incident Endpoints

## List Incidents

```http
GET /api/v1/incidents
```

---

## Create Incident

```http
POST /api/v1/incidents
```

---

## Incident Details

```http
GET /api/v1/incidents/{id}
```

---

## Close Incident

```http
PATCH /api/v1/incidents/{id}/close
```

---

# Reporting Endpoints

## Dashboard KPIs

```http
GET /api/v1/reports/dashboard
```

Response

```json
{
  "activeEquipment": 245,
  "activeTeams": 18,
  "openWorkOrders": 34,
  "criticalIncidents": 2
}
```

---

## Equipment Report

```http
GET /api/v1/reports/equipment
```

---

## Maintenance Report

```http
GET /api/v1/reports/maintenance
```

---

## Productivity Report

```http
GET /api/v1/reports/productivity
```

---

# Geospatial Endpoints

## Asset Locations

```http
GET /api/v1/map/assets
```

Response

```json
{
  "equipment": [],
  "teams": []
}
```

---

## Mine Boundaries

```http
GET /api/v1/map/mines
```

---

## Operational Zones

```http
GET /api/v1/map/zones
```

---

# Workflow Endpoints

## Workflow Status

```http
GET /api/v1/workflows/{entityId}
```

---

## Workflow Tasks

```http
GET /api/v1/workflows/tasks
```

---

## Approve Workflow Step

```http
POST /api/v1/workflows/tasks/{taskId}/approve
```

---

## Reject Workflow Step

```http
POST /api/v1/workflows/tasks/{taskId}/reject
```

---

# Audit Endpoints

## Entity History

```http
GET /api/v1/audit/{entity}/{id}
```

---

## Audit Events

```http
GET /api/v1/audit/events
```

---

# Health Endpoints

## Application Health

```http
GET /actuator/health
```

---

## Metrics

```http
GET /actuator/metrics
```

---

# Future API Extensions

Planned modules:

* IoT Telemetry
* AI Recommendations
* Predictive Maintenance
* Inventory Management
* Spare Parts Management
* Procurement
* Vendor Management

These modules must follow the same API standards defined in this document.

---

# Final Principle

The API contract is owned by the backend but serves as the single source of truth for all clients.

No frontend application should depend on internal backend implementation details.
