# Sprint 01 — NovaCommerce MVP

> **Sprint Duration:** 1 Week
>
> **Status:** Planned

---

# Sprint Goal

Deliver the first deployable version of NovaCommerce.

The objective of this Sprint is to establish the engineering foundation of the project by delivering a functional MVP, defining the initial architecture, automating the deployment process, and introducing the engineering practices that will be followed throughout the Engineering Program.

---

# Business Context

NovaCommerce is a new e-commerce platform preparing for its first public release.

The engineering team must deliver a functional application while creating a solid technical foundation capable of evolving into a cloud-native microservices platform during future Sprints.

Although the application will initially be implemented as a modular monolith, every architectural decision should facilitate future decomposition into independently deployable services.

---

# Sprint Objectives

## Business

- Deliver the first functional MVP.
- Enable customers to browse and purchase products.
- Enable administrators to manage the catalog.

## Engineering

- Establish the project architecture.
- Define engineering standards.
- Deploy the application on AWS.
- Automate infrastructure provisioning.
- Configure CI/CD.
- Establish testing and quality standards.

---

# User Stories

## Customer

- Register an account.
- Log in securely.
- Browse the product catalog.
- Search products.
- View product details.
- Add products to the shopping cart.
- Remove products from the shopping cart.
- Complete the checkout process.
- View order history.

---

## Administrator

- Create products.
- Update products.
- Delete products.
- Manage categories.
- View customers.
- Manage customer orders.

---

# Technical Scope

## Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Validation
- Spring Data JPA
- REST API
- Swagger / OpenAPI

Modules

- Authentication
- Users
- Products
- Categories
- Orders
- Shopping Cart

---

## Frontend

- React
- TypeScript
- Vite
- React Router
- Sass

Features

- Authentication
- Route Guards
- Product Catalog
- Shopping Cart
- Checkout
- Order History
- Admin Dashboard

---

## Database

Initial databases

- PostgreSQL
- MongoDB

Database migrations must be supported.

---

## Infrastructure

Provision AWS infrastructure using Terraform.

Infrastructure includes:

- VPC
- Public Subnets
- Private Subnets
- Security Groups
- EC2
- IAM Roles

The entire infrastructure must be disposable.

---

## DevOps

Configure:

- Docker
- Docker Compose
- GitHub Actions
- GitFlow
- Conventional Commits

---

## Quality

Configure:

- SonarCloud
- JaCoCo
- Checkstyle
- SpotBugs

---

## Testing

Implement:

- Unit Tests
- Integration Tests
- API Tests
- Frontend Tests
- Selenium Tests
- Playwright Tests

---

# Documentation

Update:

- README
- Wiki
- Architecture diagrams

Create:

- C4 Context Diagram
- Initial Deployment Diagram

---

# Sprint Tasks

## Planning

- Define project architecture.
- Define repository structure.
- Define branching strategy.

---

## Backend

- Initialize Spring Boot project.
- Configure project structure.
- Configure authentication.
- Implement REST API.
- Implement persistence layer.

---

## Frontend

- Initialize React project.
- Configure routing.
- Configure authentication.
- Build product catalog.
- Build shopping cart.

---

## Infrastructure

- Create Terraform project.
- Provision AWS infrastructure.
- Deploy the application.

---

## DevOps

- Configure Docker.
- Configure GitHub Actions.
- Configure SonarCloud.

---

## Testing

- Implement backend tests.
- Implement frontend tests.
- Execute E2E tests.

---

## Documentation

- Update Wiki.
- Update README.
- Publish architecture diagrams.

---

# Risks

- AWS budget consumption.
- Infrastructure provisioning failures.
- Authentication complexity.
- Initial project setup delays.

---

# Definition of Done

The Sprint will be considered complete when:

- MVP is functional.
- Application is deployed on AWS.
- CI pipeline succeeds.
- Tests pass.
- SonarCloud Quality Gate passes.
- Infrastructure is provisioned automatically.
- Documentation is updated.
- Architecture diagrams are completed.
- Pull Requests are merged.
- AWS resources are destroyed after validation.

---

# Deliverables

- Functional MVP
- Spring Boot Backend
- React Frontend
- PostgreSQL
- MongoDB
- Docker
- Terraform
- GitHub Actions
- SonarCloud
- Documentation
- Wiki
- Architecture Diagrams

---

# Sprint Review

At the end of the Sprint we will evaluate:

- Business objectives achieved.
- Technical objectives achieved.
- Engineering improvements.
- Lessons learned.
- Technical debt.
- Next Sprint preparation.

---

# LinkedIn Publication

A technical article will be published including:

- Project overview
- Architecture
- AWS infrastructure
- Engineering decisions
- Lessons learned
- Repository links
- Screenshots