# MineOps - UI/UX Design System

Version: 1.0

Status: Approved

---

# Purpose

This document defines the visual language, design principles, UI patterns, component standards, and user experience guidelines for MineOps.

All interfaces must follow this design system.

This document exists to guarantee consistency across all modules and future development.

---

# Design Philosophy

MineOps is an enterprise industrial platform.

The interface must communicate:

* Reliability
* Operational Control
* Safety
* Professionalism
* Efficiency

The application should feel closer to:

* IBM Maximo
* SAP Fiori
* Microsoft Dynamics
* Oracle Enterprise Applications

and not consumer applications.

---

# Design Principles

## DP-001

Clarity over beauty.

Users must understand information immediately.

---

## DP-002

Information over decoration.

Every visual element should serve a purpose.

---

## DP-003

Operational awareness first.

Users must quickly identify:

* Problems
* Alerts
* Statuses
* Priorities

---

## DP-004

Consistency over creativity.

Predictable interfaces reduce mistakes.

---

## DP-005

Mobile-first design.

Interfaces must work on:

* Mobile
* Tablet
* Desktop

---

# Visual Identity

## Primary Color

Mining Operations Blue

```css
#0F172A
```

Usage:

* Navigation
* Headers
* Main actions

---

## Secondary Color

Industrial Orange

```css
#F97316
```

Usage:

* Highlights
* Important actions
* Key metrics

---

## Success Color

```css
#22C55E
```

---

## Warning Color

```css
#EAB308
```

---

## Danger Color

```css
#EF4444
```

---

## Neutral Colors

```css
#FFFFFF
#F8FAFC
#E2E8F0
#94A3B8
#475569
#1E293B
```

---

# Typography

Primary Font:

```text
Inter
```

Fallback:

```text
system-ui
sans-serif
```

---

# Typography Scale

## H1

```css
32px
700
```

Used for:

* Page titles

---

## H2

```css
24px
600
```

---

## H3

```css
20px
600
```

---

## Body

```css
14px
400
```

---

## Caption

```css
12px
400
```

---

# Spacing System

Base Unit:

```text
8px
```

Allowed spacing:

```text
4
8
12
16
24
32
40
48
64
```

Never use arbitrary spacing values.

---

# Border Radius

Small

```css
8px
```

Medium

```css
12px
```

Large

```css
16px
```

---

# Shadows

Minimal usage.

Prefer hierarchy through spacing.

Use shadows only for:

* Floating cards
* Modals
* Drawers

---

# Layout System

Desktop:

```text
Sidebar
+
Header
+
Content Area
```

---

Mobile:

```text
Header
+
Content
+
Bottom Navigation
```

---

# Sidebar Standards

Desktop Width

```css
280px
```

Collapsed Width

```css
72px
```

Sections:

* Dashboard
* Operations
* Geospatial
* Analytics
* Administration

---

# Header Standards

Contains:

* Search
* Notifications
* User Menu

Sticky behavior preferred.

---

# Card Component

Used for:

* KPIs
* Summaries
* Equipment Data

Structure:

```text
Title

Value

Description
```

---

# KPI Card

Structure:

```text
Icon

Label

Value

Trend
```

Example:

```text
Active Equipment

245

+12%
```

---

# Table Standards

Tables must support:

* Sorting
* Pagination
* Search
* Filtering

Required columns:

* Actions
* Status
* Updated Date

---

# Status Badges

Active

```css
Green
```

Maintenance

```css
Orange
```

Offline

```css
Gray
```

Critical

```css
Red
```

---

# Form Standards

Labels always visible.

Never use placeholder-only fields.

Required fields:

```text
*
```

Validation:

Inline validation.

---

# Button Standards

Primary

Used for main actions.

Color:

```css
#0F172A
```

---

Secondary

Neutral actions.

---

Danger

Destructive actions.

---

# Modal Standards

Used for:

* Creation
* Editing
* Confirmation

Must support:

* Escape close
* Cancel action

---

# Dashboard Standards

Every dashboard must contain:

1. KPI Section

2. Operational Alerts

3. Charts

4. Recent Activities

5. Quick Actions

---

# Chart Standards

Preferred charts:

* Bar Chart
* Line Chart
* Area Chart
* Donut Chart

Avoid:

* 3D charts
* Decorative charts

---

# Map Standards

Map is a first-class citizen.

Display:

* Mines
* Zones
* Equipment
* Teams

Layers must be toggleable.

---

# Work Order Kanban

Columns:

* Open
* Under Review
* Approved
* In Progress
* Completed

Cards show:

* ID
* Priority
* Equipment
* Team
* Due Date

---

# Priority Colors

Low

```css
#22C55E
```

Medium

```css
#3B82F6
```

High

```css
#F97316
```

Critical

```css
#EF4444
```

---

# Empty States

Every page must contain:

* Illustration
* Message
* Action Button

Example:

```text
No Work Orders Found

Create your first work order.
```

---

# Loading States

Use skeleton loaders.

Never use spinner-only pages.

---

# Error States

Show:

* Problem
* Explanation
* Recovery Action

Example:

```text
Unable to load equipment.

Try again.
```

---

# Accessibility

Minimum contrast:

WCAG AA

Support:

* Keyboard navigation
* Screen readers
* Focus indicators

---

# Responsive Rules

Mobile:

1 column

Tablet:

2 columns

Desktop:

3-4 columns

Ultra-wide:

4-6 columns

---

# UX Principles

Users should always know:

* Where they are
* What happened
* What can be done next

No action should create uncertainty.

---

# Final Principle

MineOps is an enterprise operational platform.

Interfaces must prioritize operational efficiency, clarity, and reliability over visual experimentation.

Every screen should help users make decisions faster and with greater confidence.
