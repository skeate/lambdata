---
title: PSet.ts
nav_order: 7
parent: Modules
---

## PSet overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [PSet (interface)](#pset-interface)

---

# utils

## PSet (interface)

Typeclass for persistent sets.

**Signature**

```ts
export interface PSet<S extends URIS, A> {
  readonly empty: Kind<S, A>
  readonly insert: (a: A, s: Kind<S, A>) => Kind<S, A>
  readonly member: (a: A, s: Kind<S, A>) => boolean

  // Not part of Okasaki's original specification
  readonly union: (s: Kind<S, A>, t: Kind<S, A>) => Kind<S, A>
  readonly fromArray: (xs: Array<A>) => Kind<S, A>
  readonly toArray: (s: Kind<S, A>) => Array<A>
}
```

Added in v0.1.0
