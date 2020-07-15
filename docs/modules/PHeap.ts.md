---
title: PHeap.ts
nav_order: 6
parent: Modules
---

## PHeap overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [PHeap (interface)](#pheap-interface)

---

# utils

## PHeap (interface)

Typeclass for persistent heaps.

**Signature**

```ts
export interface PHeap<H extends URIS> {
  readonly empty: <A>(ord: Ord<A>) => Kind<H, A>
  readonly isEmpty: <A>(ord: Ord<A>) => (heap: Kind<H, A>) => boolean

  readonly insert: <A>(ord: Ord<A>) => (a: A, heap: Kind<H, A>) => Kind<H, A>
  readonly merge: <A>(ord: Ord<A>) => (a: Kind<H, A>, b: Kind<H, A>) => Kind<H, A>

  readonly findMin: <A>(ord: Ord<A>) => (heap: Kind<H, A>) => Option<A>
  readonly deleteMin: <A>(ord: Ord<A>) => (heap: Kind<H, A>) => Option<Kind<H, A>>
}
```

Added in v0.1.0
