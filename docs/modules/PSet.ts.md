---
title: PSet.ts
nav_order: 7
parent: Modules
---

# PSet overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [PSet (interface)](#pset-interface)

---

# PSet (interface)

Typeclass for persistent sets.

**Signature**

```ts
export interface PSet<S extends URIS, A> {
  readonly empty: Kind<S, A>
  readonly insert: (a: A, s: Kind<S, A>) => Kind<S, A>
  readonly member: (a: A, s: Kind<S, A>) => boolean
}
```

Added in v0.1.0
