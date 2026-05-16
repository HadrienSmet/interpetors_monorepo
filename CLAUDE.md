# CLAUDE.md

## Project: Leonor's App

Leonor's App is a fullstack web application designed for professional interpreters preparing multilingual meetings.

The application helps users:
- organize preparation material
- annotate PDFs
- extract and manage multilingual vocabulary
- centralize notes and references
- work securely with potentially sensitive documents

The product targets interpreters working for international organizations, especially in Europe.

---

# Core principles

When working on this codebase:

- prioritize simplicity over cleverness
- preserve existing architecture unless explicitly asked otherwise
- avoid unnecessary abstractions
- favor maintainable and explicit code
- keep business logic understandable
- minimize side effects
- avoid large rewrites

This project is developed mainly by a solo fullstack developer.

---

# Tech stack

Frontend:
- React
- TypeScript

Backend:
- NestJS
- TypeScript

Database:
- PostgreSQL

ORM:
- Prisma

Infrastructure:
- European hosting providers preferred
- GDPR/privacy-conscious architecture

---

# Domain model overview

Main hierarchy:

User
→ Workspace
→ Preparation
→ Folder
→ File
→ PDF annotations / notes / vocabulary

## Important entities

### Workspace
A workspace groups:
- languages
- preparations
- vocabulary
- color panels

### Preparation
Represents a meeting or assignment being prepared.

### File
Usually a PDF or source document uploaded into a preparation.

### Vocabulary
Vocabulary extracted from documents and aggregated at workspace level.

### Notes
Annotations or notes attached to PDF content or document areas.

### Color panels
Used as cognitive and visual organization tools for interpreters.

---

# Coding guidelines

## TypeScript

- Keep strict typing.
- Avoid `any`.
- Prefer explicit DTOs/types for public APIs.
- Keep backend/frontend contracts clear and predictable.

## React

- Keep components focused and reasonably small.
- Extract reusable logic only when duplication becomes meaningful.
- Avoid premature optimization.
- Prefer readability over over-engineering.

## NestJS

- Keep controllers thin.
- Put business logic inside services.
- Validate inputs properly.
- Preserve clear module boundaries.

## Prisma / Database

- Keep schema explicit and readable.
- Avoid overly complex relational logic when simpler alternatives exist.
- Be careful with cascading effects and ownership validation.

---

# Comments policy

Do NOT add excessive comments.

Add comments ONLY when:
- business rules are non-obvious
- technical constraints are important
- behavior is surprising
- there are temporary workarounds/hacks
- security/privacy implications matter

Avoid obvious comments.

Bad:
```ts
// Increment counter
counter++;
```

Good:
```ts
// Important: PDF coordinates are stored relative to the original page size
// because viewport dimensions vary between users/devices.
```

---

# Security and privacy

This application may process sensitive documents from international organizations.

Always keep in mind:
- GDPR/privacy concerns
- user ownership validation
- workspace isolation
- avoiding data leaks
- avoiding unnecessary logging of document content
- minimizing exposure of internal file paths or IDs

Never assume resources belong to the authenticated user without verification.

---

# Architecture expectations

Before implementing a feature:
1. Understand the data flow
2. Identify impacted types/services/components
3. Minimize the number of modified files
4. Preserve existing conventions
5. Consider edge cases

When proposing changes:
- explain the implementation plan first
- identify assumptions
- mention risks
- prefer minimal viable modifications

---

# Preferred collaboration workflow

For feature work:
1. Analyze existing architecture
2. Identify impacted files
3. Propose implementation plan
4. Wait for validation if architecture changes are significant
5. Implement incrementally

For debugging:
- Identify likely root cause
- Explain reasoning
- Propose smallest safe fix first

For refactoring:
- preserve behavior
- avoid hidden architectural rewrites
- improve readability and maintainability incrementally

---

# What to avoid

Avoid:
- massive rewrites
- unnecessary dependencies
- introducing complex patterns too early
- magic abstractions
- generic enterprise-style overengineering
- excessive state management complexity
- comment bloat

---

# Output expectations

When generating code:
- provide complete snippets when possible
- specify exactly where code belongs
- explain modified files
- preserve existing style and conventions
- avoid pseudo-code unless requested

When uncertain:
- explicitly state assumptions
- ask focused clarification questions only if necessary

---

# Product philosophy

This is a specialized productivity tool, not a generic collaboration platform.

The UX should remain:
- focused
- fast
- cognitively lightweight
- reliable
- professional

Interpreter workflow efficiency is more important than feature quantity.