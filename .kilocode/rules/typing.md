# Typing Rules

These rules define how types should be written in order to keep the codebase readable, consistent, and predictable.

KiloCode must prioritize clarity and consistency over clever or overly complex typing.

---

## Core Principle

Types must be easy to read and consistent across the codebase.

Prefer simple, explicit, and standardized type expressions.

Do not introduce advanced or overly abstract typing unless it is clearly necessary for correctness.

---

## Scope

- Apply these rules to newly written code and directly modified code.
- Do **not** rewrite unrelated existing types just to match these preferences.
- Do **not** perform type-only refactors outside the requested scope.
- Keep typing changes limited to the code being added or edited.

---

## Prefer Readonly By Default

Fields, properties, and values should be marked as `readonly` whenever possible.

Use `readonly` by default unless doing so would create a real TypeScript error or block a valid use case.

Examples:

```ts
type User = {
    readonly id: string;
    readonly email: string;
};
```

---

## Prefer Array<T> Over T[]

Always use `Array<T>` instead of `T[]`.

Good:

```ts
const users: Array<User> = [];
type UserIds = Array<string>;
```

Bad:
```ts
const users: User[] = [];
type UserIds = string[];
```
This rule applies to all array type declarations unless a framework or language constraint makes it impossible.

---

## Prefer Record<K, V> Over Index Signatures

Always prefer `Record<KeyType, ValueType>` over inline index signature objects when possible.

Good:
```ts
type Metadata = Record<string, string>;
type UnknownMap = Record<any, any>;
```

Bad:
```ts
type Metadata = {
    [key: string]: string;
};

type UnknownMap = {
    [key: any]: any;
};
```

Use Record for readability and consistency.

---

## Avoid Interfaces by default

Do not use `interface` unless it is genuinely necessary.
Prefer `type` aliases in most cases.

Good:
```ts
type User = {
    readonly id: string;
    readonly name: string;
};
```

Avoid:
```ts
interface User {
    id: string;
    name: string;
}
```

Use `interface` only when there is a clear technical reason to do so, such as a requirement for declaration merging or another TypeScript-specific constraint that cannot be handled cleanly with `type`.

If no strong reason exists, always prefer `type`.

---

## Prefer Explicit Types For Public Shapes

For exported types, shared data structures, function parameters, and return types, prefer explicit type declarations when they improve readability.

Examples:

```ts
type CreateUserPayload = {
    readonly email: string;
    readonly displayName: string;
};

const createUser = (payload: CreateUserPayload): Promise<User> => {
    // ...
};
```

Do not add unnecessary explicit types to every local variable if inference is already clear and readable.

---

## Prefer Simple Types

Prefer straightforward type expressions over deeply nested, overly generic, or difficult-to-read types.

Avoid introducing complex utility types unless they clearly improve correctness and maintainability.

Prefer:
- simple object types
- named type aliases
- readable generic usage

Avoid:
- deeply nested inline types
- excessive conditional types
- hard-to-read type compositions
- clever type tricks

## Prefer Named Types Over Repeated Inline Types

If the same object shape appears multiple times, extract it into a named `type` alias.

Good: 
```ts
type UserSummary = {
    readonly id: string;
    readonly displayName: string;
};

const formatUser = (user: UserSummary): string => {
    return user.displayName;
};

const sortUsers = (users: Array<UserSummary>): Array<UserSummary> => {
    return users;
};
```

Avoid repeating the same inline object type in multiple places.

---

## Keep Object Types Readable

Object types should be formatted clearly and kept easy to scan.

Prefer multi-line formatting for object shapes with multiple fields.

Good:

```ts
type Product = {
    readonly id: string;
    readonly name: string;
    readonly price: number;
};
```
Avoid dense one-line object type declarations when readability suffers.

---

## Prefer Specific Types Over any

Avoid `any` unless there is a real reason it is necessary.

Prefer more specific types whenever they are known.

Use `any` only when:
- the actual type is genuinely unknown
- typing it correctly would be disproportionately complex for the task
- external constraints require it

When a flexible dictionary is needed and the real types are unknown, prefer:

```ts
type Any = Record<any, any>;
```

over:

```ts
type Any = { [key: any]: any }
```
---

## Prefer Nullable Types To Be Explicit

When a value can be absent, make that explicit in the type.

Examples:
```ts
type User = {
    readonly id: string;
    readonly middleName: string | null;
};

let selectedUser: User | null = null;
```

Do not hide nullable behavior behind vague typing.

---

## Function Typing

Function parameter and return types should be clear when they improve readability, especially for exported functions and shared utilities.

Good:

```ts
const formatPrice = (value: number): string => {
    return value.toFixed(2);
};
```

For short local callbacks, rely on inference when the type is already obvious.

---

## Prefer Stable, Predictable Typing

Choose typing patterns that are easy to understand for any developer reading the file.

Prefer consistency over novelty.

Do not mix multiple typing styles for the same kind of structure in the same file or feature unless required.

---

## Avoid Unnecessary Type Complexity

Do not introduce advanced typing patterns only because they are possible.

Avoid unnecessary use of:

conditional types

mapped types

infer

overloads

complex generic constraints

Use them only when they are clearly required for correctness or API design.

---

## Editing Existing Code

When editing existing code:
- apply these typing preferences to newly added or directly modified code
- do not rewrite unrelated existing types
- do not replace interfaces, arrays, or index signatures across the whole file unless required by the requested change
- keep typing changes targeted and minimal

---

## Priority Order

When making typing decisions, follow this order:

1. Correctness
2. Readability
3. Consistency with these rules
4. Minimal diff

---

## Summary

When writing or editing TypeScript:
- prefer readonly by default for properties and fields
- use `Array<T>` instead of `T[]`
- use `Record<K, V>` instead of inline index signatures
- prefer `type` over `interface`
- keep types simple, explicit, and readable
- prefer specific types over `any`
- make nullability explicit
- avoid unnecessary advanced typing
- keep type changes local to the edited code