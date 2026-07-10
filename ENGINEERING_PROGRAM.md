# CloudLab JP Engineering Program

> This document defines the complete engineering roadmap for the NovaCommerce project.
>
> It serves as the single source of truth for the entire development team and describes the scope, objectives, deliverables, and evolution of every Engineering Sprint.

---

# Vision

The objective of this program is to simulate the evolution of a real enterprise application following modern software engineering practices.

Instead of building isolated demos, the application will evolve incrementally through multiple Engineering Sprints, introducing new architectural patterns, cloud services, DevOps practices, and AI capabilities over time.

Every Sprint represents a realistic engineering challenge commonly found in software companies.

The final result should demonstrate knowledge in:

- Software Architecture
- Cloud Engineering
- Platform Engineering
- DevOps
- Site Reliability Engineering
- AI Engineering
- Full Stack Development

---

# General Objectives

Throughout the program we will:

- Build a production-ready enterprise application.
- Apply Agile/Scrum practices.
- Follow GitFlow.
- Use Infrastructure as Code from day one.
- Automate CI/CD.
- Maintain engineering documentation.
- Build reusable templates.
- Build an Internal Developer Platform (IDP).
- Build AI-powered features.
- Document every architectural decision.

---

# Engineering Principles

The following principles apply to every Sprint.

## Code Quality

- Clean Code
- SOLID
- DRY
- KISS
- YAGNI

## Git

- GitFlow
- Pull Requests required
- Conventional Commits

## Documentation

Every Sprint must update:

- README
- Wiki
- Architecture diagrams
- ADRs (when applicable)

## Infrastructure

- Infrastructure as Code only.
- No manual infrastructure.
- All AWS resources must be removed after every Sprint.

## Testing

Every Sprint includes:

- Unit Tests
- Integration Tests
- End-to-End Tests (when applicable)

## Quality

Every repository should include:

- SonarCloud
- Code Coverage
- Static Analysis

---

# Existing Repositories

The following repositories already exist and will continue evolving during the program.

| Repository | Purpose |
|------------|---------|
| branding | CloudLab JP branding resources |
| docs | Technical Wiki |
| engineering-template | Base repository template |
| engineering-playbook | Engineering standards and best practices |
| .github | Shared GitHub configuration |

---

# Application

## Project

NovaCommerce

NovaCommerce is an enterprise application that will evolve from a modular monolith into a cloud-native microservices platform.

The application will progressively incorporate:

- Authentication
- Catalog
- Orders
- Inventory
- Notifications
- AI capabilities
- Event-driven communication

---

# Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Sass
- React Router

## Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Spring Validation

## Databases

Initially

- PostgreSQL
- MongoDB

Later

- Amazon RDS
- DynamoDB

## DevOps

- Docker
- GitHub Actions
- Terraform
- CloudFormation/SAM (when appropriate)

## Testing

- JUnit
- Mockito
- Playwright
- Selenium
- k6

## Quality

- SonarCloud
- JaCoCo
- Checkstyle
- SpotBugs

---

# Engineering Roadmap

## Sprint 0

### Objective

Bootstrap the engineering platform.

### Deliverables

- GitHub Organization
- Branding
- Wiki
- Engineering Template
- Engineering Playbook
- AWS Account
- IAM
- GitHub Pages

Status

Completed

---

# Sprint 1 — Launch the MVP

> **Goal:** Build the first production-ready version of NovaCommerce.

---

# Business Context

NovaCommerce is a new e-commerce platform that is preparing to launch its first public release.

At this stage, there is no existing application. The engineering team must deliver a functional Minimum Viable Product (MVP) that provides the core business capabilities while establishing the engineering standards that will be followed throughout the project.

Although the initial architecture will be a modular monolith, every design decision should consider the future migration to a cloud-native microservices architecture.

The objective of this Sprint is not only to deliver software, but also to establish a production-ready engineering foundation that will support the following phases of the project.

---

# Sprint Goal

Deliver the first deployable version of NovaCommerce running on AWS.

The application must be fully automated, documented, tested, and deployed using Infrastructure as Code.

---

# Business Requirements

The MVP should provide the minimum functionality required for an e-commerce platform.

The first version must allow users to:

- Browse products.
- View product details.
- Register an account.
- Authenticate.
- Manage a shopping cart.
- Place orders.
- View their order history.

Administrators should be able to:

- Manage products.
- Manage categories.
- View customers.
- Manage orders.

---

# Technical Objectives

During this Sprint the engineering team will establish the technical standards for the remainder of the project.

This includes:

- Modular Monolith Architecture
- RESTful API
- API Documentation
- CI/CD
- Infrastructure as Code
- Docker
- Cloud Deployment
- Testing Strategy
- Code Quality
- Engineering Documentation

---

# Functional Deliverables

## Backend

- Spring Boot 3
- Java 21
- REST API
- Authentication
- Authorization
- Product Module
- Category Module
- Customer Module
- Shopping Cart
- Orders Module

---

## Frontend

- React
- TypeScript
- Responsive Layout
- Authentication
- Route Guards
- Product Catalog
- Shopping Cart
- Checkout
- Order History

---

## Database

Initially the application will use:

- PostgreSQL
- MongoDB

The architecture must allow future migration to Amazon RDS and DynamoDB without major code changes.

---

# Infrastructure Deliverables

The application must be deployed on AWS.

Infrastructure should include:

- VPC
- Public and Private Subnets
- Security Groups
- EC2
- IAM Roles
- Elastic IP (if required)

Everything must be provisioned using Terraform.

---

# DevOps Deliverables

The project must include:

- Docker
- Docker Compose
- GitHub Actions
- Branch Protection
- Conventional Commits
- GitFlow

---

# Quality Deliverables

The project must include:

- SonarCloud
- JaCoCo
- Checkstyle
- SpotBugs

---

# Testing Deliverables

Testing should include:

- Unit Tests (JUnit)
- Integration Tests
- API Tests
- Frontend Tests
- Selenium
- Playwright

---

# Documentation Deliverables

The following documentation must be created.

Repository:

- README

Wiki:

- Architecture Overview
- Local Development
- Deployment Guide
- Terraform Guide
- Spring Boot Guide
- React Guide

Architecture:

- C4 Context Diagram
- Initial Deployment Diagram

---

# Engineering Repositories

Repositories updated during this Sprint.

- docs
- engineering-template
- engineering-playbook
- ec-001-monolith

---

# Definition of Done

Sprint 1 will be considered complete when:

- The application is running on AWS.
- CI pipeline passes successfully.
- All tests pass.
- SonarCloud Quality Gate passes.
- Docker image builds successfully.
- Terraform provisions the infrastructure successfully.
- Documentation has been updated.
- Wiki has been updated.
- Architecture diagrams have been created.
- Pull Requests have been merged.
- AWS resources have been removed after validation.

---

# LinkedIn Publication

At the end of the Sprint a technical article will be published including:

- Business objective
- Architecture
- Technologies used
- Challenges encountered
- Lessons learned
- Screenshots
- Infrastructure diagrams
- Repository links

---

# Sprint Outcome

At the end of Sprint 1 NovaCommerce will have its first production-ready release.

This release will become the baseline for every architectural evolution during the following Engineering Sprints.

---

# Sprint 2

## Goal

Transform the application into a highly available platform.

### Deliverables

- Application Load Balancer
- Auto Scaling
- CloudWatch
- Logging
- Dashboards
- k6 Load Tests
- Chaos experiments

---

# Sprint 3

## Goal

Design the microservices architecture.

### Deliverables

- DDD
- Event Storming
- C4 Model
- ADR
- Bounded Contexts
- Migration Plan

---

# Sprint 4

## Goal

Extract the Authentication Service.

### Deliverables

- First Microservice
- Spring Boot Microservice Template
- Shared CI/CD
- Shared Docker configuration

---

# Sprint 5

## Goal

Introduce asynchronous communication.

### Deliverables

- SQS
- SNS
- Event-driven communication
- Orders Service

---

# Sprint 6

## Goal

Complete the core microservices architecture.

### Deliverables

- Catalog Service
- Inventory Service
- Notification Service
- API Gateway improvements

---

# Sprint 7

## Goal

Container orchestration.

### Deliverables

- ECS or Kubernetes
- Container Registry
- Rolling Updates
- Health Checks

---

# Sprint 8

## Goal

Adopt managed cloud services.

### Deliverables

- Amazon RDS
- DynamoDB
- Secrets Manager
- Parameter Store

---

# Sprint 9

## Goal

Build the CloudLab Engineering Assistant.

### Deliverables

- RAG
- Knowledge Base
- Documentation indexing
- AI Engineering Assistant

---

# Sprint 10

## Goal

Integrate AI into NovaCommerce.

### Deliverables

- Customer AI Assistant
- Operator AI Assistant
- AI APIs
- AI Observability

---

# Expected Final Deliverables

At the end of the program, CloudLab JP will include:

- Production-ready application
- Cloud-native architecture
- Complete technical documentation
- Engineering Wiki
- Internal Developer Platform
- Microservice Template
- Reusable GitHub Actions
- Infrastructure Modules
- Engineering Playbook
- AI Engineering Assistant
- AI-powered enterprise application

---

# Continuous Deliverables

Every Sprint must finish with:

- Working software
- Pull Request merged
- Updated Wiki
- Updated README
- Updated diagrams
- Updated ADRs (if required)
- LinkedIn technical publication
- AWS cleanup