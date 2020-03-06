---
title: BinaryTree.ts
nav_order: 1
parent: Modules
---

# BinaryTree overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [BinaryTree (type alias)](#binarytree-type-alias)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [binaryTree](#binarytree)
- [getEq](#geteq)
- [getOrd](#getord)
- [getSet](#getset)
- [leaf](#leaf)
- [node](#node)

---

# BinaryTree (type alias)

**Signature**

```ts
export type BinaryTree<A> =
  | {
      readonly type: 'Leaf'
    }
  | {
      readonly type: 'Node'
      readonly left: BinaryTree<A>
      readonly value: A
      readonly right: BinaryTree<A>
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
export const URI: "BinaryTree" = ...
```

Added in v0.1.0

# binaryTree

**Signature**

```ts
export const binaryTree: Foldable1<URI> = ...
```

Added in v0.1.0

# getEq

**Signature**

```ts
export const getEq = <A>(eqa: Eq<A>): Eq<BinaryTree<A>> => ...
```

Added in v0.1.0

# getOrd

**Signature**

```ts
export const getOrd = <A>(ord: Ord<A>): Ord<BinaryTree<A>> => ...
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
export const leaf: { readonly type: "Leaf"; } = ...
```

Added in v0.1.0

# node

**Signature**

```ts
export const node = <A>(
  left: BinaryTree<A>,
  value: A,
  right: BinaryTree<A>,
): BinaryTree<A> => ...
```

Added in v0.1.0
