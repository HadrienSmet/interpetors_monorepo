# Naming Conventions

These rules define how identifiers should be named in order to keep the codebase clear, readable, and self-documenting.

KiloCode must prioritize **clarity and explicitness** over brevity when naming variables, functions, and other identifiers.

---

## Core Principle

Names must clearly describe what the variable, function, or value represents.

Prefer **descriptive names** rather than short or cryptic ones.

Code should remain understandable without requiring additional comments.
Prefer improving a name rather than adding a comment explaining it.

---

##  Avoid Single-Letter Names

Never use single-letter variable names.

Examples of forbidden names:

x  
y  
i  
j  
n  
tmp  

Exceptions are allowed only in **very small and obvious contexts**, such as:

- simple loop counters
- mathematical formulas

Example of acceptable usage:

```js
for (let i = 0; i < items.length; i++) {
}
```

---

## Avoid Abbreviations

Do not use abbreviations unless they are extremely common and universally understood.

Examples of discouraged abbreviations:

usr
cfg
resp
req
val
obj
arr

Prefer full words instead.

Bad:

```ts
const usr = getUsr();
```

Good:
```ts
const user = getUser();
```

---

## Boolean Naming

Boolean variables must clearly indicate a true/false condition.

They should start with a prefix that makes the condition explicit.

Preferred prefixes include:
- is
-has
- did
- can
- should
- will

Examples:

```ts
const isAdmin = user.role === "admin";
const hasPermission = checkPermission(user);
const didFinishLoading = status === "done";
const canEditProfile = permissions.includes("edit_profile");
const shouldRetryRequest = retryCount < maxRetries;
```

---

## Function Names

Function names should describe what the function does.

Prefer verbs or verb phrases.

Examples:

```ts
getUserProfile()
calculateTotalPrice()
validateEmailAddress()
formatCurrency()
sendNotification()
```

Avoid function namùes like:

```ts
processData()
handleStuff()
doThing()
```
