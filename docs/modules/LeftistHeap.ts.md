---
title: LeftistHeap.ts
nav_order: 4
parent: Modules
---

# LeftistHeap overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [LeftistHeap (type alias)](#leftistheap-type-alias)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [leaf](#leaf)
- [leftistHeap](#leftistheap)
- [makeT](#maket)
- [node](#node)
- [rank](#rank)

---

# LeftistHeap (type alias)

**Signature**

```ts
export type LeftistHeap<A> =
  | { readonly type: 'Leaf' }
  | {
      readonly type: 'Node'
      readonly rank: number
      readonly left: LeftistHeap<A>
      readonly value: A
      readonly right: LeftistHeap<A>
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
export const URI: "LeftistHeap" = ...
```

Added in v0.1.0

# leaf

**Signature**

```ts
{ readonly type: "Leaf"; }
```

Added in v0.1.0

# leftistHeap

**Signature**

```ts
export const leftistHeap: PHeap<URI> = ...
```

Added in v0.1.0

# makeT

**Signature**

```ts
export const makeT = <A>(
  value: A,
  a: LeftistHeap<A>,
  b: LeftistHeap<A>,
): LeftistHeap<A> => ...
```

Added in v0.1.0

# node

**Signature**

```ts
export const node = <A>({
  rank = 1,
  left = leaf,
  value,
  right = leaf,
}: {
  rank?: number
  left?: LeftistHeap<A>
  value: A
  right?: LeftistHeap<A>
}): LeftistHeap<A> => ...
```

Added in v0.1.0

# rank

**Signature**

```ts
export const rank = <A>(h: LeftistHeap<A>): number => ...
```

Added in v0.1.0
