---
title: List.ts
nav_order: 5
parent: Modules
---

# List overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [List (type alias)](#list-type-alias)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
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

# List (type alias)

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

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v0.1.0

# URI

**Signature**

```ts
export const URI: "List" = ...
```

Added in v0.1.0

# arr2list

**Signature**

```ts
export const arr2list = <A>(arr: Array<A>): List<A> =>
  arr.reduceRight((p: List<A>, n) => ...
```

Added in v0.1.0

# concat

**Signature**

```ts
export const concat = <A>(xs: List<A>, ys: List<A>): List<A> => ...
```

Added in v0.1.0

# cons

**Signature**

```ts
export const cons = <A>(value: A, next: List<A> = nil): List<A> => ...
```

Added in v0.1.0

# getEq

**Signature**

```ts
export const getEq = <A>(eqa: Eq<A>): Eq<List<A>> => ...
```

Added in v0.1.0

# getMonoid

**Signature**

```ts
export const getMonoid = <A>(): Monoid<List<A>> => ...
```

Added in v0.1.0

# insert

**Signature**

```ts
export const insert = <A>(xs: List<A>, i: number, y: A): List<A> => ...
```

Added in v0.1.0

# iterate

**Signature**

```ts
export const iterate: <A>(l: List<A>) => Generator<A, void, unknown> = ...
```

Added in v0.1.0

# list

**Signature**

```ts
export const list: Functor1<URI> & Monad1<URI> = ...
```

Added in v0.1.0

# list2arr

**Signature**

```ts
export const list2arr = <A>(l: List<A>): Array<A> => ...
```

Added in v0.1.0

# nil

**Signature**

```ts
export const nil: { readonly type: "Nil"; readonly length: 0; } = ...
```

Added in v0.1.0

# reverse

**Signature**

```ts
export const reverse = <A>(xs: List<A>, reversed: List<A> = nil): List<A> => ...
```

Added in v0.1.0

# update

**Signature**

```ts
export const update = <A>(xs: List<A>, i: number, y: A): Option<List<A>> =>
  xs.type === 'Nil' || i < 0
    ? none
    : i === 0
    ? some(cons(y, xs.next))
    : option.map(update(xs.next, i - 1, y), (n) => ...
```

Added in v0.1.0
