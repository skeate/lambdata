---
title: RBTree.ts
nav_order: 8
parent: Modules
---

# RBTree overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [RBTree (type alias)](#rbtree-type-alias)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [getSet](#getset)
- [leaf](#leaf)
- [node](#node)
- [rbTree](#rbtree)

---

# RBTree (type alias)

**Signature**

```ts
export type RBTree<A> = { readonly type: 'Leaf' } | Node<A>
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
export const URI: "RBTree" = ...
```

Added in v0.1.0

# getSet

**Signature**

```ts
export const getSet = <A>(ord: Ord<A>): PSet<URI, A> => ...
```

Added in v0.1.0

# leaf

**Signature**

```ts
{ readonly type: "Leaf"; }
```

Added in v0.1.0

# node

**Signature**

```ts
export const node = <A>(
  color: Color,
  left: RBTree<A>,
  value: A,
  right: RBTree<A>,
): Node<A> => ...
```

Added in v0.1.0

# rbTree

**Signature**

```ts
export const rbTree: Foldable1<URI> = ...
```

Added in v0.1.0
