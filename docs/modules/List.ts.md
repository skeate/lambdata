---
title: List.ts
nav_order: 5
parent: Modules
---

## List overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [List (type alias)](#list-type-alias)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [arr2list](#arr2list)
  - [concat](#concat)
  - [cons](#cons)
  - [getEq](#geteq)
  - [getMonoid](#getmonoid)
  - [insert](#insert)
  - [iterate](#iterate)
  - [list](#list)
  - [list2arr](#list2arr)
  - [nil](#nil)
  - [reverse](#reverse)
  - [update](#update)

---

# utils

## List (type alias)

**Signature**

```ts
export type List<A> =
  | {
      readonly type: 'Nil'
      readonly length: 0
    }
  | {
      readonly type: 'Cons'
      readonly length: number
      readonly value: A
      readonly next: List<A>
    }
```

Added in v0.1.0

## URI

**Signature**

```ts
export declare const URI: 'List'
```

Added in v0.1.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.1.0

## arr2list

**Signature**

```ts
export declare const arr2list: <A>(arr: A[]) => List<A>
```

Added in v0.1.0

## concat

**Signature**

```ts
export declare const concat: <A>(xs: List<A>, ys: List<A>) => List<A>
```

Added in v0.1.0

## cons

**Signature**

```ts
export declare const cons: <A>(value: A, next?: List<A>) => List<A>
```

Added in v0.1.0

## getEq

**Signature**

```ts
export declare const getEq: <A>(eqa: Eq<A>) => Eq<List<A>>
```

Added in v0.1.0

## getMonoid

**Signature**

```ts
export declare const getMonoid: <A>() => Monoid<List<A>>
```

Added in v0.1.0

## insert

**Signature**

```ts
export declare const insert: <A>(xs: List<A>, i: number, y: A) => List<A>
```

Added in v0.1.0

## iterate

**Signature**

```ts
export declare const iterate: <A>(l: List<A>) => Generator<A, void, unknown>
```

Added in v0.1.0

## list

**Signature**

```ts
export declare const list: Functor1<'List'> & Monad1<'List'>
```

Added in v0.1.0

## list2arr

**Signature**

```ts
export declare const list2arr: <A>(l: List<A>) => A[]
```

Added in v0.1.0

## nil

**Signature**

```ts
export declare const nil: { readonly type: 'Nil'; readonly length: 0 }
```

Added in v0.1.0

## reverse

**Signature**

```ts
export declare const reverse: <A>(xs: List<A>, reversed?: List<A>) => List<A>
```

Added in v0.1.0

## update

**Signature**

```ts
export declare const update: <A>(xs: List<A>, i: number, y: A) => Option<List<A>>
```

Added in v0.1.0
