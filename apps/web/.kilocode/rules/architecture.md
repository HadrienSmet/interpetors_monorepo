# Frontend Architecture

This document describes the structure and architectural conventions of the frontend codebase.

The goal is to maintain a clear separation between **global application code** and **feature-specific modules**, ensuring that the project remains scalable, maintainable, and easy to navigate.

KiloCode must respect this structure when creating or modifying code.

---

# Core Principle

The codebase is divided into two main categories:

1. **Global application code**
2. **Feature-specific modules**

Global code lives directly inside `src`.

Feature-specific logic lives inside `src/modules`.

KiloCode must always place new code in the **most appropriate location** based on its scope.

---

# Placement Decision Guide

When creating new code, follow this decision order:

1. Is the code specific to a feature?
   → place it in `src/modules/<module>`

2. Is the code reusable across features?
   → place it in a global folder inside `src`

3. Is it an API call?
   → place it in `services`

4. Is it UI only?
   → place it in `components`

5. Is it logic without UI?
   → place it in `hooks` or `utils`

---

# Root Structure

The main frontend code lives in the `src` directory.

Example structure:
```
src/
	app/
	components/
	context/
	hooks/
	i18n/
	layout/
	utils/
	views/
	modules/
```
Each folder has a specific responsibility.

---

# app

`src/app`
This folder contains the core application setup.

It includes:

- `App.tsx`
- global SCSS files

No feature-specific logic should be placed here.

---

# components

`src/components`

This folder contains **global reusable UI components**.

These components:

- are not tied to a specific feature
- can be reused across multiple modules
- are purely UI or generic components

Examples:

- Button
- Modal
- Dropdown
- Input
- Tooltip

If a component is only used by a specific module, it should be placed inside that module instead.

---

# contexts

`src/contexts`

This folder contains **global React contexts**.

Contexts placed here must be:

- application-wide
- not tied to a single feature

Examples:

- Theme context
- Authentication state shared across the entire app
- Global settings

Contexts used only inside a specific feature should live inside that feature module.

---

# hooks

`src/hooks`

This folder contains **global reusable hooks**.

Hooks placed here should:

- be generic
- not depend on a specific module
- be reusable across multiple parts of the application

Examples:

- useDebounce
- useLocalStorage
- useWindowSize

Feature-specific hooks should be placed inside their module.

---

# i18n

`src/i18n`

This folder contains everything related to internationalization.

Examples:

- translation files
- i18n configuration
- language initialization

All translation-related logic must live here.

---

# layout

`src/layout`

This folder contains layout components responsible for the **overall structure of pages**.

Examples:

- page wrappers
- navigation layout
- sidebar layout
- header/footer layout
- base page structure

These components define how pages are visually structured.

They are not tied to a single feature.

---

# utils

`src/utils`

This folder contains **global utility functions**.

Utilities placed here should:

- be generic
- not depend on a specific module
- not contain UI logic

Examples:

- formatting helpers
- date utilities
- string manipulation
- generic helper functions

If a utility is only used by a module, it should live inside that module.

---

# views

`src/views`

This folder contains the **pages of the application**.

Each view typically represents a page or route.

Examples:

- Home page
- Dashboard
- Settings page
- Login page

Views assemble components, layouts, and modules to build the final UI shown to the user.

---

# modules

`src/modules`


This folder contains **feature-based modules**.

Each module represents a **specific functionality of the application**.

Examples:
```
modules/
	auth/
	colorPanel/
	files/
```
Each module is self-contained and contains its own logic, components, hooks, and contexts.

---

# Module Structure

Each module follows a structure similar to the global `src` directory.

Example:
```
modules/
	auth/
		components/
		contexts/
		hooks/
		services/
		utils/
```