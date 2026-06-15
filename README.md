# MineOps

## Overview

MineOps is an enterprise-grade mining operations management platform designed to centralize operational, maintenance, workforce, geospatial, and workflow management processes for mining companies.

The platform provides a unified operational environment where managers, supervisors, maintenance teams, and field operators can monitor assets, coordinate activities, manage maintenance operations, track work orders, and visualize field data in real time.

## Documentation

Comprehensive documentation about the platform's architecture, rules, and guidelines can be found in the `/docs` directory. Key documents include:

- **[Project Context & Vision](docs/01-PROJECT_CONTEXT.md)**
- **[Product Requirements Document (PRD)](docs/02-PRD.md)**
- **[System Architecture](docs/03-SYSTEM-ARCHITECTURE.md)**
- **[Database Design](docs/04-DATABASE-DESIGN.md)**
- **[Frontend Architecture](docs/05-FRONTEND-ARCHITECTURE.md)**
- **[Backend Architecture](docs/06-BACKEND-ARCHITECTURE.md)**
- **[Security Architecture](docs/07-SECURITY-ARCHITECTURE.md)**
- **[Development Guidelines](docs/12-DEVELOPMENT-GUIDELINES.md)**
- **[AI Development Rules](docs/13-AI-DEVELOPMENT-RULES.md)**

## Technology Stack (Frontend)

- **Framework:** Angular 21 (with Signals and Standalone Components)
- **Language:** TypeScript
- **Styling:** TailwindCSS 4
- **Components:** Angular Material
- **AI Integration:** Google Gen AI SDK

## Run Locally

**Prerequisites:** Node.js (v20+)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```
   *Alternatively, you can run `npm start` to use the standard Angular CLI serve configuration.*

3. The application will be available at `http://localhost:3000` (if using `npm run dev`) or `http://localhost:4200` (if using `npm start`).

## Project Structure

- `/src` - Application source code.
- `/docs` - System documentation and architectural guidelines.
- `/public` & `/assets` - Static assets.
