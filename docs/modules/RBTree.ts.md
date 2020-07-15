---
title: RBTree.ts
nav_order: 8
parent: Modules
---

## RBTree overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [RBTree (type alias)](#rbtree-type-alias)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [getSet](#getset)
  - [leaf](#leaf)
  - [node](#node)
  - [rbTree](#rbtree)

---

# utils

## RBTree (type alias)

**Signature**

```ts
export type RBTree<A> = { readonly type: 'Leaf' } | Node<A>
```

Added in v0.1.0

## URI

**Signature**

```ts
export declare const URI: 'RBTree'
```

Added in v0.1.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.1.0

## getSet

**Signature**

```ts
export declare const getSet: <A>(ord: Ord<A>) => PSet<'RBTree', A>
```

Added in v0.1.0

## leaf

**Signature**

```ts
export declare const leaf: { readonly type: 'Leaf' }
```

Added in v0.1.0

## node

**Signature**

```ts
export declare const node: <A>(color: Color, left: RBTree<A>, value: A, right: RBTree<A>) => Node<A>
```

Added in v0.1.0

## rbTree

**Signature**

```ts
export declare const rbTree: Foldable1<'RBTree'>
```

Added in v0.1.0
