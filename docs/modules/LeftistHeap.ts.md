---
title: LeftistHeap.ts
nav_order: 4
parent: Modules
---

## LeftistHeap overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [LeftistHeap (type alias)](#leftistheap-type-alias)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [leaf](#leaf)
  - [leftistHeap](#leftistheap)
  - [makeT](#maket)
  - [node](#node)
  - [rank](#rank)

---

# utils

## LeftistHeap (type alias)

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

## URI

**Signature**

```ts
export declare const URI: 'LeftistHeap'
```

Added in v0.1.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.1.0

## leaf

**Signature**

```ts
export declare const leaf: { readonly type: 'Leaf' }
```

Added in v0.1.0

## leftistHeap

**Signature**

```ts
export declare const leftistHeap: PHeap<'LeftistHeap'>
```

Added in v0.1.0

## makeT

**Signature**

```ts
export declare const makeT: <A>(value: A, a: LeftistHeap<A>, b: LeftistHeap<A>) => LeftistHeap<A>
```

Added in v0.1.0

## node

**Signature**

```ts
export declare const node: <A>({
  rank,
  left,
  value,
  right,
}: {
  rank?: number
  left?: LeftistHeap<A>
  value: A
  right?: LeftistHeap<A>
}) => LeftistHeap<A>
```

Added in v0.1.0

## rank

**Signature**

```ts
export declare const rank: <A>(h: LeftistHeap<A>) => number
```

Added in v0.1.0
