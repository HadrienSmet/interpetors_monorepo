# AI Context — Leonor's App

## Project overview

This is a fullstack application for professional interpreters.  
The goal is to help interpreters prepare meetings efficiently by centralizing documents, notes, annotations, vocabulary and linguistic resources.

The app must stay simple, reliable, secure and compliant with European privacy standards.

## Target users

Professional interpreters working with multilingual meetings, especially in European/international organizations.

They need to:
- organize preparation material by meeting
- annotate PDFs
- extract vocabulary
- keep multilingual notes
- quickly find previous resources
- work with sensitive documents securely

## Tech stack

- Frontend: React + TypeScript
- Backend: NestJS + TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Hosting target: European infrastructure when possible

## Core domain model

Main hierarchy:

User
→ Workspace
→ Preparation
→ Folder
→ File
→ PDF annotations / notes / vocabulary

Important concepts:

### Workspace
A workspace groups preparations, vocabulary, languages and color panels.

### Preparation
A preparation represents a meeting or assignment the interpreter is preparing for.

### File
Usually a PDF or source document uploaded inside a preparation.

### Vocabulary
Vocabulary can be extracted from PDF selections and is aggregated at workspace level.

### Notes
Notes can be linked to PDF files or selected document areas.

### Color panels
Color panels help users visually organize and memorize information.

## Product priorities

When implementing features, prioritize:

1. Type safety
2. Clear domain logic
3. Maintainable architecture
4. Security and privacy
5. Simple UX
6. Avoiding unnecessary abstractions
7. Avoiding large rewrites unless explicitly requested

## Coding preferences

- Use TypeScript strictly.
- Prefer explicit types for public APIs, DTOs, hooks and services.
- Keep components reasonably small.
- Avoid over-commenting obvious code.
- Add comments only for business rules, non-obvious behavior, constraints or temporary workarounds.
- Preserve existing project conventions.
- Do not introduce new dependencies unless there is a strong reason.
- When modifying existing code, explain the minimal set of files that must change.

## When helping with implementation

Before coding, identify:
- the relevant files
- the data flow
- impacted types
- possible edge cases

When proposing code:
- show complete modified snippets when possible
- explain where each snippet goes
- avoid pseudo-code unless explicitly requested
- mention risks or assumptions clearly

## Security and privacy constraints

The app may handle sensitive documents from international organizations.

Therefore:
- avoid logging sensitive document content
- avoid exposing file paths or internal IDs unnecessarily
- validate user ownership before accessing resources
- avoid leaking data across users/workspaces
- keep GDPR/privacy considerations in mind
