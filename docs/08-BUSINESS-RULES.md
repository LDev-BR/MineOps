# MineOps - Business Rules

Version: 1.0

Status: Active

---

# Purpose

This document defines the business rules that govern MineOps.

These rules represent operational constraints, validation logic, workflow requirements, and domain behavior.

Business rules must be enforced regardless of frontend, backend, database, or API implementation.

---

# Equipment Rules

## BR-EQ-001

Every equipment must belong to exactly one mining site.

Equipment cannot exist without a mine assignment.

---

## BR-EQ-002

Equipment may belong to one operational zone at a time.

Historical zone assignments must be preserved.

---

## BR-EQ-003

Equipment status must always be defined.

Allowed statuses:

* Active
* Idle
* Maintenance
* Offline
* Retired

No other status values are allowed.

---

## BR-EQ-004

Retired equipment cannot receive new work orders.

---

## BR-EQ-005

Retired equipment cannot receive new maintenance requests.

---

## BR-EQ-006

Equipment in maintenance cannot be assigned to operational activities.

---

## BR-EQ-007

Equipment location updates must store timestamp information.

Historical positioning must be preserved.

---

# Team Rules

## BR-TEAM-001

Every team must have exactly one supervisor.

---

## BR-TEAM-002

A supervisor may supervise multiple teams.

---

## BR-TEAM-003

Teams may contain multiple members.

---

## BR-TEAM-004

Employee assignment history must be preserved.

Assignments must never be deleted.

---

## BR-TEAM-005

Inactive employees cannot be assigned to teams.

---

## BR-TEAM-006

Inactive employees cannot receive work orders.

---

# Employee Rules

## BR-EMP-001

Employees are linked to Keycloak identities.

Authentication data must not be stored in MineOps.

---

## BR-EMP-002

Employee email addresses must be unique.

---

## BR-EMP-003

Inactive employees cannot:

* Receive assignments
* Create work orders
* Approve workflows

---

## BR-EMP-004

Employees may have multiple historical roles.

Role history must be auditable.

---

# Work Order Rules

## BR-WO-001

Every work order must be associated with:

* A mine
* A creator
* A priority
* A status

---

## BR-WO-002

Priority values:

* Low
* Medium
* High
* Critical

Only these values are allowed.

---

## BR-WO-003

Status values:

* Open
* Under Review
* Approved
* In Progress
* Completed
* Cancelled

Only these values are allowed.

---

## BR-WO-004

Every status change must generate a history record.

History records cannot be modified.

---

## BR-WO-005

Completed work orders are immutable.

Only administrators may reopen them.

---

## BR-WO-006

Cancelled work orders require cancellation reason.

---

## BR-WO-007

Critical work orders must generate operational alerts.

---

## BR-WO-008

A work order may only be assigned to active teams.

---

# Maintenance Rules

## BR-MAINT-001

Every maintenance record must reference equipment.

---

## BR-MAINT-002

Maintenance types:

* Preventive
* Corrective
* Predictive
* Emergency

Only these values are allowed.

---

## BR-MAINT-003

Maintenance start date must be earlier than completion date.

---

## BR-MAINT-004

Emergency maintenance automatically receives Critical priority.

---

## BR-MAINT-005

Maintenance activities must record downtime.

Downtime cannot be negative.

---

## BR-MAINT-006

Maintenance cost cannot be negative.

---

## BR-MAINT-007

Equipment under maintenance must automatically change status to Maintenance.

---

## BR-MAINT-008

Completed maintenance automatically restores previous operational status.

Unless manually overridden.

---

# Inspection Rules

## BR-INSP-001

Every inspection must have an inspector.

---

## BR-INSP-002

Every inspection must have a timestamp.

---

## BR-INSP-003

Risk classification values:

* Low
* Medium
* High
* Critical

Only these values are allowed.

---

## BR-INSP-004

Critical inspection findings automatically create work orders.

---

## BR-INSP-005

Inspection records cannot be deleted.

---

# Incident Rules

## BR-INC-001

Every incident must have severity.

Allowed values:

* Low
* Medium
* High
* Critical

---

## BR-INC-002

Critical incidents require root cause analysis.

---

## BR-INC-003

Critical incidents require manager approval before closure.

---

## BR-INC-004

Incident history must be preserved permanently.

---

## BR-INC-005

Closed incidents become read-only.

---

# Geospatial Rules

## BR-GEO-001

Every mine must contain geographic boundaries.

---

## BR-GEO-002

Every operational zone must belong to a mine.

---

## BR-GEO-003

Equipment locations must belong inside mine boundaries.

---

## BR-GEO-004

Geospatial records must store coordinate reference system metadata.

---

## BR-GEO-005

Location updates must preserve historical records.

---

# Workflow Rules

## BR-WF-001

Workflow instances are managed by Camunda.

MineOps stores only business references.

---

## BR-WF-002

Workflow state must remain synchronized with business state.

---

## BR-WF-003

Workflows cannot skip mandatory approval stages.

---

## BR-WF-004

All workflow decisions must be auditable.

---

## BR-WF-005

Workflow approvals require authenticated users.

---

# Reporting Rules

## BR-REP-001

Reports must only include data users are authorized to view.

---

## BR-REP-002

Generated reports must preserve generation timestamp.

---

## BR-REP-003

Report generation must record author information.

---

# Audit Rules

## BR-AUD-001

All business entities must contain:

* created_at
* created_by
* updated_at
* updated_by

---

## BR-AUD-002

Deletion of operational records is prohibited.

Soft delete must be used.

---

## BR-AUD-003

Critical actions must be logged.

Examples:

* Status changes
* Approvals
* Workflow decisions
* Equipment retirement

---

## BR-AUD-004

Audit records must be immutable.

---

# Security Rules

## BR-SEC-001

Authentication is delegated to Keycloak.

---

## BR-SEC-002

Authorization is role-based.

---

## BR-SEC-003

Every API request must contain authenticated user context.

---

## BR-SEC-004

Administrative operations require Administrator role.

---

## BR-SEC-005

All approval actions require authenticated identity.

---

# Data Retention Rules

## BR-DATA-001

Equipment history is never deleted.

---

## BR-DATA-002

Maintenance history is never deleted.

---

## BR-DATA-003

Incident history is never deleted.

---

## BR-DATA-004

Inspection history is never deleted.

---

## BR-DATA-005

Work order history is never deleted.

---

# Future AI Rules

## BR-AI-001

AI recommendations must never execute actions automatically.

---

## BR-AI-002

AI recommendations require human approval.

---

## BR-AI-003

AI-generated recommendations must be traceable.

---

# Final Principle

MineOps is designed around auditability, operational safety, workflow integrity, and historical traceability.

No business-critical information should ever be physically deleted.

All operational decisions must be traceable and auditable.
