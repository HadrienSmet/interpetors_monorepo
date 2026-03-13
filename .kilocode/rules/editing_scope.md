# Editing Scope Rules

These rules define how KiloCode must limit its modifications when working on the codebase.

The goal is to ensure that changes remain predictable, minimal, and strictly aligned with the user request.

---

# Core Principle

KiloCode must **only modify what the user explicitly asked for**.

Never expand the scope of changes without clear justification.

---

# Allowed File Modifications

KiloCode may only modify files that are:

1. Explicitly mentioned in the user prompt
2. Explicitly listed as editable by the user
3. Directly required to complete the requested task

If a file is **not mentioned**, assume it is **read-only**.

---

# Forbidden Actions

Unless the user explicitly asks for it, KiloCode must **NOT**:

- Modify additional files
- Refactor unrelated code
- Rename files
- Move files
- Delete files
- Create new files
- Reorganize folders
- Change project architecture
- Update dependencies
- Reformat entire files
- Introduce new abstractions

Do not perform "nice to have" improvements.

Do not apply stylistic changes outside the edited code.

---

# Minimal Change Principle

All modifications must follow the **smallest possible change** that satisfies the request.

Prefer:

- small edits
- localized modifications
- minimal diff

Avoid:

- rewriting entire functions
- rewriting entire files
- refactoring large blocks of code

If a small patch can solve the issue, always prefer it.

---

# No Assumptions

KiloCode must **not guess missing context**.

If required information is missing:

- ask for clarification
- explain what information is needed

Never invent:

- files
- functions
- APIs
- database tables
- environment variables
- libraries

Only use what exists in the repository or what the user explicitly provides.

---

# Respect Existing Code

When modifying code:

- preserve the existing logic unless the request requires changing it
- avoid altering working code unnecessarily
- do not simplify or refactor unrelated sections

Focus strictly on the requested change.

---

# Creating New Files

New files may only be created if:

- the user explicitly requests them
- they are strictly necessary to implement the requested feature

If unsure, ask the user before creating new files.

---

# Cross-File Changes

If a task appears to require modifying multiple files:

1. Modify only the file requested.
2. Inform the user which additional files would need changes.
3. Wait for confirmation before editing them.

Example:

Instead of modifying files automatically:

"To complete this change correctly, the following files may also require updates:
- fileA.ts
- fileB.ts

Please confirm if I should modify them."

---

# Imports and Dependencies

Do not introduce new libraries or dependencies unless the user explicitly requests them.

If a new dependency would normally be required, ask first.

---

# Large Refactors

Never perform a refactor unless the user explicitly asks for one.

Examples of forbidden refactors:

- renaming variables across files
- splitting files
- reorganizing modules
- changing architecture patterns

Even if it improves code quality.

---

# Handling Unclear Requests

If the prompt is ambiguous:

1. Explain what is unclear
2. Ask for clarification
3. Do not modify the code yet

---

# When Unsure

If you are uncertain whether a modification is allowed:

Do **not** modify the code.

Instead ask the user.

---

# Expected Behavior Summary

KiloCode must:

- modify only requested files
- apply minimal changes
- avoid assumptions
- avoid unrelated refactors
- avoid creating files unless requested
- ask when scope is unclear
- keep diffs small and predictable

The safest behavior is always preferred over speculative changes.