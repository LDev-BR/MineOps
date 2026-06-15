# MineOps - Database Design

Version: 1.0

Status: Approved

---

# Purpose

This document defines the database architecture of MineOps.

The database must support:

* Multi-year operational history
* Asset management
* Maintenance operations
* Geospatial data
* Workflow integration
* Auditability
* Future AI workloads

Primary Database:

```text
PostgreSQL
```

Geospatial Extension:

```text
PostGIS
```

---

# Design Principles

## DB-001

Data integrity is more important than convenience.

---

## DB-002

Business-critical records are never physically deleted.

---

## DB-003

Historical traceability is mandatory.

---

## DB-004

All operational actions must be auditable.

---

## DB-005

Database structure must support future growth.

---

# Naming Conventions

Tables

```sql
snake_case
```

Examples:

```sql
work_orders
equipment_location_history
maintenance_records
```

---

Columns

```sql
snake_case
```

Examples:

```sql
created_at
updated_at
mine_id
```

---

Primary Keys

```sql
id BIGSERIAL
```

---

Foreign Keys

```sql
entity_name_id
```

Example:

```sql
equipment_id
team_id
mine_id
```

---

# Core Domains

## Mine Domain

Tables:

```text
mines
mine_boundaries
```

---

### mines

Purpose:

Represents mining sites.

Columns:

```sql
id
name
code
description
status
created_at
updated_at
```

---

### mine_boundaries

Purpose:

Stores geographic mine boundaries.

Columns:

```sql
id
mine_id
boundary_geometry
created_at
```

Geometry:

```sql
MULTIPOLYGON
```

---

# Zone Domain

Tables:

```text
zones
```

---

### zones

Purpose:

Operational divisions inside mines.

Columns:

```sql
id
mine_id
name
description
status
geometry
created_at
updated_at
```

Geometry Type:

```sql
POLYGON
```

---

# Employee Domain

Tables:

```text
employees
employee_role_history
```

---

### employees

Purpose:

Stores employee profile information.

Authentication remains in Keycloak.

Columns:

```sql
id
keycloak_user_id
employee_code
first_name
last_name
email
phone
status
created_at
updated_at
```

---

### employee_role_history

Purpose:

Historical role tracking.

Columns:

```sql
id
employee_id
role_name
effective_from
effective_to
```

---

# Team Domain

Tables:

```text
teams
team_members
team_assignment_history
```

---

### teams

Columns:

```sql
id
name
supervisor_id
status
created_at
updated_at
```

---

### team_members

Purpose:

Current membership.

Columns:

```sql
team_id
employee_id
joined_at
```

---

### team_assignment_history

Purpose:

Historical team assignments.

Columns:

```sql
id
employee_id
team_id
assigned_at
removed_at
```

---

# Equipment Domain

Tables:

```text
equipment
equipment_status_history
equipment_location_history
equipment_assignments
```

---

### equipment

Columns:

```sql
id
equipment_code
serial_number
manufacturer
model
acquisition_date
mine_id
zone_id
status
created_at
updated_at
```

---

### equipment_status_history

Purpose:

Tracks status transitions.

Columns:

```sql
id
equipment_id
previous_status
new_status
changed_by
changed_at
```

---

### equipment_location_history

Purpose:

Stores GPS history.

Columns:

```sql
id
equipment_id
location
recorded_at
```

Geometry:

```sql
POINT
```

---

### equipment_assignments

Purpose:

Equipment-to-team assignments.

Columns:

```sql
id
equipment_id
team_id
assigned_at
removed_at
```

---

# Work Order Domain

Tables:

```text
work_orders
work_order_history
work_order_comments
work_order_attachments
```

---

### work_orders

Columns:

```sql
id
title
description
priority
status
equipment_id
team_id
created_by
created_at
due_date
completed_at
```

---

### work_order_history

Purpose:

Status transition history.

Columns:

```sql
id
work_order_id
old_status
new_status
changed_by
changed_at
```

---

### work_order_comments

Columns:

```sql
id
work_order_id
author_id
comment
created_at
```

---

### work_order_attachments

Columns:

```sql
id
work_order_id
file_name
storage_path
uploaded_by
uploaded_at
```

---

# Maintenance Domain

Tables:

```text
maintenance_records
maintenance_technicians
maintenance_parts
```

---

### maintenance_records

Columns:

```sql
id
equipment_id
work_order_id
maintenance_type
start_date
end_date
downtime_minutes
cost
result
created_at
```

---

### maintenance_technicians

Columns:

```sql
maintenance_id
employee_id
```

---

### maintenance_parts

Columns:

```sql
id
maintenance_id
part_name
quantity
unit_cost
```

---

# Inspection Domain

Tables:

```text
inspections
inspection_findings
inspection_photos
```

---

### inspections

Columns:

```sql
id
inspector_id
equipment_id
inspection_date
risk_level
summary
```

---

### inspection_findings

Columns:

```sql
id
inspection_id
description
severity
recommendation
```

---

### inspection_photos

Columns:

```sql
id
inspection_id
file_path
uploaded_at
```

---

# Incident Domain

Tables:

```text
incidents
incident_actions
```

---

### incidents

Columns:

```sql
id
title
description
severity
root_cause
status
reported_by
reported_at
closed_at
```

---

### incident_actions

Columns:

```sql
id
incident_id
action_description
performed_by
performed_at
```

---

# Reporting Domain

Tables:

```text
generated_reports
```

---

### generated_reports

Columns:

```sql
id
report_type
generated_by
generated_at
storage_path
```

---

# Workflow Domain

Tables:

```text
workflow_instances
workflow_tasks
```

---

### workflow_instances

Purpose:

Links business entities to Camunda.

Columns:

```sql
id
process_instance_id
entity_type
entity_id
status
started_at
completed_at
```

---

### workflow_tasks

Columns:

```sql
id
workflow_instance_id
task_id
task_name
assigned_to
status
completed_at
```

---

# Audit Domain

Tables:

```text
audit_log
```

---

### audit_log

Purpose:

Central audit repository.

Columns:

```sql
id
entity_name
entity_id
action_type
performed_by
payload
performed_at
```

---

# Soft Delete Strategy

Every business table should support:

```sql
deleted_at
deleted_by
```

Records are never physically removed.

---

# PostGIS Strategy

Mine Boundaries

```sql
MULTIPOLYGON
```

---

Operational Zones

```sql
POLYGON
```

---

Equipment Locations

```sql
POINT
```

---

Team Locations

```sql
POINT
```

---

# Spatial Indexing

Required:

```sql
GIST
```

Example:

```sql
CREATE INDEX idx_zone_geometry
ON zones
USING GIST (geometry);
```

---

# Standard Indexes

Every table:

```sql
PRIMARY KEY
```

---

Foreign Keys:

```sql
mine_id
team_id
equipment_id
employee_id
```

must be indexed.

---

# Composite Indexes

Equipment

```sql
(status, mine_id)
```

---

Work Orders

```sql
(status, priority)
```

---

Maintenance

```sql
(equipment_id, start_date)
```

---

# Partitioning Strategy

Future Large Tables

```text
audit_log
equipment_location_history
work_order_history
maintenance_records
```

Partition By:

```sql
YEAR(created_at)
```

---

# Database Growth Expectations

Expected Capacity:

* 10,000+ equipment assets
* Millions of GPS records
* Millions of audit records
* Multi-year operational history

---

# Future Modules

Reserved for:

* Inventory Management
* Spare Parts
* Procurement
* Vendor Management
* IoT Telemetry
* AI Recommendations

---

# Final Principle

MineOps is designed around traceability, auditability, and operational history.

Historical data is a strategic asset.

The database must preserve business events, not only current state.
