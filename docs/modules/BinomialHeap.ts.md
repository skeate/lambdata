---
title: BinomialHeap.ts
nav_order: 2
parent: Modules
---

## BinomialHeap overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [BinomialHeap (type alias)](#binomialheap-type-alias)
  - [BinomialTree (type alias)](#binomialtree-type-alias)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [binomialHeap](#binomialheap)
  - [insert](#insert)
  - [link](#link)
  - [merge](#merge)
  - [node](#node)

---

# utils

## BinomialHeap (type alias)

**Signature**

```ts
export type BinomialHeap<A> = L.List<BinomialTree<A>>
```

Added in v0.1.0

## BinomialTree (type alias)

**Signature**

```ts
export type BinomialTree<A> = {
  rank: number
  value: A
  children: L.List<BinomialTree<A>>
}
```

Added in v0.1.0

## URI

**Signature**

```ts
export declare const URI: 'BinomialHeap'
```

Added in v0.1.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.1.0

## binomialHeap

**Signature**

```ts
export declare const binomialHeap: PHeap<'BinomialHeap'>
```

Added in v0.1.0

## insert

**Signature**

```ts
export declare const insert: <A>(ord: Ord<A>) => (a: A, heap: L.List<BinomialTree<A>>) => L.List<BinomialTree<A>>
```

Added in v0.1.0

## link

**Signature**

```ts
export declare const link: <A>(
  ord: Ord<A>
) => (a: BinomialTree<A>, b: BinomialTree<A>) => { rank: number; value: A; children: L.List<BinomialTree<A>> }
```

Added in v0.1.0

## merge

**Signature**

```ts
export declare const merge: <A>(
  ord: Ord<A>
) => (a: L.List<BinomialTree<A>>, b: L.List<BinomialTree<A>>) => L.List<BinomialTree<A>>
```

Added in v0.1.0

## node

**Signature**

```ts
export declare const node: <A>(
  rank: number,
  value: A,
  children: L.List<BinomialTree<A>>
) => { rank: number; value: A; children: L.List<BinomialTree<A>> }
```

Added in v0.1.0
