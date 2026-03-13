# Formatting Rules

These rules define the formatting style to use when writing new code or modifying existing code.

## Scope

- Apply these rules to code you generate or directly edit.
- Do **not** reformat unrelated existing code.
- Do **not** perform formatting-only rewrites across entire files.
- Keep formatting changes limited to the specific lines or blocks being modified.
- For untouched code, preserve the existing style.

## General Principles

- Prioritize correctness first.
- Prefer minimal diffs.
- Keep formatting consistent in the code you touch.
- Use the preferred style below for all newly written code.

## Preferred Formatting

### Quotes

- Always use double quotes `"` instead of single quotes `'`.
- Use double quotes for strings, imports, and quoted keys when needed.
- Do not convert untouched existing code from single quotes to double quotes unless that exact line is already being modified.

### Functions

- Prefer arrow functions instead of `function` declarations or expressions whenever possible.
- Use arrow functions for callbacks, helpers, local utilities, and component-local logic.
- Prefer parentheses around parameters, even when there is only one parameter.

Examples:

```js
const formatUserName = (user) => {
    return user.name.trim();
};

const ids = items.map((item) => {
    return item.id;
});
```

### Indentations

- Use 4 spaces for indentation.
- Never use tabs.
- Keep indentation consistent within the edited block.

### Semicolons

- Always use semicolons at the end of statements that require them.
- Do not omit semicolons.
- Do not add semicolons after control-flow blocks such as `if`, `else`, `for`, `while`, `switch`, or `try`.

### Comments

- Write comments only when they add useful context.
- Avoid comments that merely restate the code.
- Preserve existing comments unless they become inaccurate because of the change.

## Priority Order

When making formatting decisions, use this order:
1. Correctness
2. Minimal diff
3. Consistency within the edited area
4. Preferred formatting rules in this document

## Summary

For all newly written or modified code:
- use double quotes
- use arrow functions whenever possible
- use 4 spaces for indentation
- use semicolons on statements
- use braces for control-flow blocks
- ensure a trailing newline at the end of every file
- avoid reformatting untouched code
- keep formatting changes local to the edited code
