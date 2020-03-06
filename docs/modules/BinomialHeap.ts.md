---
title: BinomialHeap.ts
nav_order: 2
parent: Modules
---

# BinomialHeap overview

Example of usage:

<iframe height="400px" width="100%" src="https://repl.it/repls/AggressivePitifulTechnician?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [BinomialHeap (type alias)](#binomialheap-type-alias)
- [BinomialTree (type alias)](#binomialtree-type-alias)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [binomialHeap](#binomialheap)
- [insert](#insert)
- [link](#link)
- [merge](#merge)
- [node](#node)

---

# BinomialHeap (type alias)

**Signature**

```ts
export type BinomialHeap<A> = L.List<BinomialTree<A>>
```

Added in v0.1.0

# BinomialTree (type alias)

**Signature**

```ts
export type BinomialTree<A> = {
  rank: number
  value: A
  children: L.List<BinomialTree<A>>
}
```

Added in v0.1.0

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.1.0

# URI

**Signature**

```ts
export const URI: "BinomialHeap" = ...
```

Added in v0.1.0

# binomialHeap

**Signature**

```ts
export const binomialHeap: PHeap<URI> = ...
```

Added in v0.1.0

# insert

**Signature**

```ts
export const insert = <A>(ord: Ord<A>) => (a: A, heap: BinomialHeap<A>) => ...
```

Added in v0.1.0

# link

**Signature**

```ts
export const link = <A>(ord: Ord<A>) => (
  a: BinomialTree<A>,
  b: BinomialTree<A>,
) => ...
```

Added in v0.1.0

# merge

**Signature**

```ts
export const merge = <A>(ord: Ord<A>) => (
  a: BinomialHeap<A>,
  b: BinomialHeap<A>,
): BinomialHeap<A> => ...
```

Added in v0.1.0

# node

**Signature**

```ts
export const node = <A>(
  rank: number,
  value: A,
  children: L.List<BinomialTree<A>>,
) => ...
```

Added in v0.1.0
