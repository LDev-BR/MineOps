# MineOps - Security Architecture

Version: 1.0

Status: Approved

---

# Purpose

This document defines the security architecture of MineOps.

Its purpose is to establish:

* Authentication standards
* Authorization model
* Identity management
* API security
* Data protection
* Audit requirements
* Security monitoring
* Compliance principles

All platform components must comply with this document.

---

# Security Principles

## SEC-001

Security is mandatory.

Not optional.

---

## SEC-002

Least Privilege Principle.

Users receive only the permissions required.

---

## SEC-003

Defense in Depth.

Multiple security layers must exist.

---

## SEC-004

Zero Trust Mindset.

Every request must be authenticated and authorized.

---

## SEC-005

Auditability is mandatory.

Every critical action must be traceable.

---

# Security Domains

MineOps security architecture consists of:

```text
Identity Security

↓

Authentication

↓

Authorization

↓

API Security

↓

Data Security

↓

Audit Security

↓

Infrastructure Security
```

---

# Identity Management

Provider

```text
Keycloak
```

Responsibilities:

* Authentication
* User federation
* Session management
* Role management
* MFA support
* SSO support

MineOps never manages passwords directly.

---

# Authentication Architecture

Protocol

```text
OpenID Connect (OIDC)
```

Authorization Framework

```text
OAuth2
```

Token Format

```text
JWT
```

---

# Authentication Flow

```text
User

↓

Angular Frontend

↓

Keycloak Login

↓

Access Token

↓

Spring Boot API

↓

Authorized Resource
```

---

# Token Strategy

Access Token

Purpose:

```text
API Access
```

Lifetime

```text
15 Minutes
```

---

Refresh Token

Purpose:

```text
Session Renewal
```

Lifetime

```text
8 Hours
```

---

ID Token

Purpose:

```text
User Identity
```

Used by:

```text
Frontend
```

---

# Session Management

Managed by:

```text
Keycloak
```

Requirements:

* Session expiration
* Session revocation
* Forced logout
* Concurrent session control

---

# Multi-Factor Authentication

Future Requirement

Supported Factors:

```text
TOTP

Authenticator Apps

Email Verification

Hardware Tokens
```

Roles requiring MFA:

```text
Manager

Administrator
```

---

# Authorization Model

Model

```text
RBAC
```

Role-Based Access Control

---

# Platform Roles

```text
ROLE_OPERATOR

ROLE_TECHNICIAN

ROLE_SUPERVISOR

ROLE_MANAGER

ROLE_ADMIN
```

---

# Role Hierarchy

```text
ADMIN

↓

MANAGER

↓

SUPERVISOR

↓

TECHNICIAN

↓

OPERATOR
```

Higher roles inherit lower permissions.

---

# Permission Categories

Operational Permissions

```text
equipment.read

equipment.write

equipment.delete
```

---

Maintenance Permissions

```text
maintenance.read

maintenance.execute

maintenance.approve
```

---

Work Order Permissions

```text
workorder.read

workorder.create

workorder.approve

workorder.close
```

---

Reporting Permissions

```text
reports.read

reports.export
```

---

Administration Permissions

```text
users.manage

roles.manage

settings.manage
```

---

# Authorization Strategy

Backend is the source of truth.

Frontend permissions are cosmetic only.

Every API request must be validated server-side.

---

# Spring Security Architecture

Authentication

```text
JWT Resource Server
```

Authorization

```text
Method Security
```

Examples:

```java
@PreAuthorize("hasRole('SUPERVISOR')")
```

```java
@PreAuthorize("hasAuthority('workorder.approve')")
```

---

# API Security

All APIs require authentication.

Except:

```text
/health

/swagger (non-production)

/actuator/health
```

---

# API Versioning

```text
/api/v1
```

Required for all endpoints.

---

# HTTPS Requirements

Mandatory.

Minimum Version:

```text
TLS 1.3
```

Allowed:

```text
TLS 1.2
TLS 1.3
```

Forbidden:

```text
SSL

TLS 1.0

TLS 1.1
```

---

# CORS Policy

Allowed Origins:

Development

```text
http://localhost:4200
```

Production

```text
Configured Environment Variable
```

Wildcard origins forbidden.

---

# Input Validation

All requests must be validated.

Layers:

```text
Frontend

↓

API Validation

↓

Domain Validation

↓

Database Constraints
```

Never trust client-side validation.

---

# OWASP Compliance

The system must mitigate:

* Injection Attacks
* Broken Authentication
* Sensitive Data Exposure
* Security Misconfiguration
* XSS
* CSRF
* SSRF
* Broken Access Control

Reference:

```text
OWASP Top 10
```

---

# SQL Injection Protection

Required:

```text
JPA

Prepared Statements
```

Forbidden:

```java
String sql =
"SELECT * FROM equipment WHERE id=" + id;
```

---

# XSS Protection

Rules:

* Sanitize user input
* Escape rendered content
* Avoid raw HTML rendering

Angular default protections must remain enabled.

---

# CSRF Strategy

Frontend:

```text
OIDC Token-Based Authentication
```

Risk Level:

```text
Low
```

Future support:

```text
CSRF Tokens
```

for stateful sessions.

---

# Rate Limiting

Future Requirement

Protection Targets:

```text
Authentication Endpoints

Public APIs

Report Generation
```

Suggested Technology:

```text
Bucket4j
```

---

# Secret Management

Secrets must never be stored in source code.

Allowed Sources:

```text
Environment Variables

Secret Manager

Vault
```

Forbidden:

```text
application.properties

application.yml

Git Repository
```

---

# Database Security

Principles:

* Least privilege
* Dedicated application user
* No superuser access

---

Application Account

Allowed:

```text
CRUD Operations
```

Forbidden:

```text
Schema Ownership

Database Administration
```

---

# Data Classification

Public

```text
System Metadata
```

---

Internal

```text
Operational Records
```

---

Confidential

```text
Employee Information

Incident Records
```

---

Restricted

```text
Security Logs

Audit Records
```

---

# Sensitive Data Protection

Encryption Required:

```text
Passwords

Tokens

Secrets
```

Managed by:

```text
Keycloak
```

or

```text
External Secret Store
```

---

# Audit Architecture

Every critical action must generate audit records.

Examples:

```text
Login

Logout

Role Changes

Work Order Approval

Maintenance Completion

Incident Closure
```

---

# Audit Log Structure

Required Fields:

```text
Timestamp

User

Action

Entity

Entity Id

Previous State

New State

IP Address
```

---

# Security Logging

Log Categories:

```text
Authentication

Authorization

Audit

System Security
```

---

Never Log:

```text
Passwords

JWT Tokens

Refresh Tokens

Secrets
```

---

# Monitoring

Security events must be monitored.

Examples:

```text
Failed Logins

Permission Denials

Role Escalation

Token Errors

Suspicious Activity
```

---

# Incident Response

Security incidents must support:

```text
Detection

Investigation

Containment

Recovery

Post-Mortem
```

---

# Account Lockout Policy

Failed Attempts:

```text
5
```

Lock Duration:

```text
15 Minutes
```

Managed by:

```text
Keycloak
```

---

# Password Policy

Managed by Keycloak.

Requirements:

```text
Minimum 12 Characters

Uppercase

Lowercase

Numbers

Special Characters
```

---

# Backup Security

Backups must be:

```text
Encrypted

Versioned

Access Controlled
```

---

# Infrastructure Security

Containers

```text
Non-Root Users
```

Required.

---

Dependencies

```text
Vulnerability Scanning
```

Required.

---

Images

Use only:

```text
Official Images
```

or

```text
Verified Images
```

---

# Compliance Goals

Target Standards:

```text
OWASP ASVS
```

Future:

```text
ISO 27001

SOC 2
```

---

# Security Testing

Required:

* Authentication Tests
* Authorization Tests
* Penetration Testing
* Dependency Scanning
* Static Analysis

---

# Security Checklist

Before Production:

✓ HTTPS Enabled

✓ JWT Validation Active

✓ RBAC Configured

✓ Secrets Externalized

✓ Audit Logging Enabled

✓ Backups Encrypted

✓ Dependency Scan Completed

✓ Security Tests Passed

---

# AI Security Rules

AI-generated code must never be trusted automatically.

Developers must review:

* Authentication
* Authorization
* Input Validation
* Secret Handling
* Logging

before merge.

---

# Final Principle

Security is a platform responsibility.

Every component must assume hostile input.

Authentication verifies identity.

Authorization verifies permission.

Auditability verifies accountability.

No feature is complete unless it is secure.
