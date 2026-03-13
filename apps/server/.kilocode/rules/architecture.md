# Architecture

This document explains the backend architecture of the project.

The server follows a **standard NestJS architecture** organized around modules representing application features.
Each module groups together controllers, services, and related data structures.

The goal of this architecture is to keep the backend **predictable, maintainable, and easy to navigate**.

KiloCode must respect this structure when creating or modifying code.

---

## Root Project Structure

At the root of the project there are three main directories:
- prisma
- src
- test

### 1. prisma

The `prisma` directory contains the database schema.

Main file: `schema.prisma`

This file defines:
- database models
- relations
- migrations configuration

KiloCode must not modify the Prisma schema unless the user explicitly asks for a database change.

### 2. src
The `src` directory contains the entire application source code.

It is divided into two main directories:
- common
- modules

#### 2.1 common
The `src/common` directory contains **shared infrastructure utilities** used across the application.

These elements are not tied to a specific feature.

Typical subdirectories include:
- decorators
- guards
- interceptors
- utils

##### 2.1.1 decorators

Contains custom NestJS decorators used throughout the application.

Examples include decorators for:
- extracting user information
- validating request context
- simplifying controller logic

Decorators defined here must be reusable across multiple modules.

##### 2.1.2 guards

Contains NestJS guards responsible for:
- authentication
- authorization
- access control

Guards should be reusable and independent from specific modules whenever possible.

##### 2.1.3 interceptors

Contains NestJS interceptors.

Interceptors are typically used for:
- request transformation
- response transformation
- logging
- performance measurement
- error formatting

They should remain generic and reusable.

##### 2.1.4 utils

Contains utility functions used across the backend.

These utilities must remain:
- generic
- stateless
- reusable

They must not depend on a specific module.

If a helper is only used inside one module, it should stay inside that module instead of being placed in `common`.

---

### 2.2 modules

The `src/modules` directory contains the core application logic.

Each folder inside `modules` represents a feature module.

A module corresponds to a group of related endpoints and business logic.

Examples of modules could include:
- auth
- users
- files
- ...

Each module must remain self-contained and responsible only for its own feature.

#### Module Structure

Each module must contain the following three files:
- `<moduleName>.module.ts`
- `<moduleName>.service.ts`
- `<moduleName>.controller.ts`

Example for a module named `users`:
- `users.module.ts`
- `users.service.ts`
- `users.controller.ts`

##### module file

The `module` file defines the NestJS module.

It is responsible for:
- registering providers
- registering controllers
- importing other modules if needed

Example role:
- module configuration
- dependency wiring

##### service file

The `service` file contains the business logic of the module.

Responsibilities include:
- handling application logic
- interacting with the database
- coordinating domain operations

Services should remain independent from HTTP concerns.

Controllers should delegate business logic to services.

##### controller file

The `controller` file defines the HTTP endpoints of the module.

Controllers are responsible for:
- handling requests
- validating inputs
- calling services
- returning responses

Controllers should remain thin and avoid containing business logic.

##### DTO Directory

Modules may contain an additional directory:
- dto

The `dto` directory contains Data Transfer Objects used to validate and type incoming data.

Each DTO should be placed in its own file.

Example structure inside a module:
- dto/create-user.dto.ts
- dto/update-user.dto.ts
- dto/login.dto.ts

DTOs are typically used for:
- request body validation
- request query validation
- request parameter validation

DTOs must remain simple and focused on describing input data.

---

## Module Isolation

Modules should be independent whenever possible.

KiloCode should follow these rules:
- avoid tight coupling between modules
- access other modules only through properly exported services
- keep business logic inside services
- keep controllers thin

---

## Where New Code Should Be Added

When adding new code, KiloCode must follow these rules:

If the code is:
- Global infrastructure → place it in `src/common`
- Feature logic → place it in the corresponding module
- Request validation → place it inside the module's `dto` directory
- Business logic → place it inside the module service
- HTTP endpoints → place them inside the module controller

---

## Expected Module Layout

A typical module should follow this structure:

```
modules
	users
		dto
			create-user.dto.ts
			update-user.dto.ts
		users.controller.ts
		users.service.ts
		users.module.ts
```

---

## Summary

The backend architecture follows these principles:
- feature-based modules
- thin controllers
- business logic in services
- shared infrastructure in `common`
- input validation through DTOs
- database schema managed in Prisma

KiloCode must always respect this structure when creating or modifying backend code.
