/**
 * @since 0.1.0
 */
import { Eq, fromEquals } from 'fp-ts/lib/Eq'
import { Functor1 } from 'fp-ts/lib/Functor'
import { Monad1 } from 'fp-ts/lib/Monad'
import { Monoid } from 'fp-ts/lib/Monoid'
import { Option, none, some, option } from 'fp-ts/lib/Option'

/**
 * @since 0.1.0
 */
export const URI = 'List'
/**
 * @since 0.1.0
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    readonly [URI]: List<A>
  }
}

/**
 * @since 0.1.0
 */
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

/**
 * @since 0.1.0
 */
export const nil = { type: 'Nil', length: 0 } as const

/**
 * @since 0.1.0
 */
export const cons = <A>(value: A, next: List<A> = nil): List<A> => ({
  type: 'Cons',
  length: next.length + 1,
  value,
  next,
})

/**
 * @since 0.1.0
 */
export const arr2list = <A>(arr: Array<A>): List<A> =>
  arr.reduceRight((p: List<A>, n) => cons(n, p), nil)

/**
 * @since 0.1.0
 */
export const iterate = function*<A>(l: List<A>) {
  while (l.type === 'Cons') {
    yield l.value
    l = l.next
  }
  return
}

/**
 * @since 0.1.0
 */
export const list2arr = <A>(l: List<A>): Array<A> => [...iterate(l)]

/**
 * @since 0.1.0
 */
export const concat = <A>(xs: List<A>, ys: List<A>): List<A> =>
  xs.type === 'Nil'
    ? ys
    : ys.type === 'Nil'
    ? xs
    : cons(xs.value, concat(xs.next, ys))

/**
 * @since 0.1.0
 */
export const update = <A>(xs: List<A>, i: number, y: A): Option<List<A>> =>
  xs.type === 'Nil' || i < 0
    ? none
    : i === 0
    ? some(cons(y, xs.next))
    : option.map(update(xs.next, i - 1, y), (n) => cons(xs.value, n))

/**
 * @since 0.1.0
 */
export const insert = <A>(xs: List<A>, i: number, y: A): List<A> =>
  xs.type === 'Nil' || i < 0
    ? cons(y, xs)
    : i === 0
    ? cons(y, xs)
    : cons(xs.value, insert(xs.next, i - 1, y))

/**
 * @since 0.1.0
 */
export const reverse = <A>(xs: List<A>, reversed: List<A> = nil): List<A> =>
  xs.type === 'Nil' ? reversed : reverse(xs.next, cons(xs.value, reversed))

/**
 * @since 0.1.0
 */
export const list: Functor1<URI> & Monad1<URI> = {
  URI,

  /* functor */
  map: (fa, f) =>
    fa.type === 'Nil' ? fa : cons(f(fa.value), list.map(fa.next, f)),

  /* apply */
  ap: (fab, fa) =>
    fab.type === 'Nil' || fa.type === 'Nil'
      ? nil
      : concat(list.map(fa, fab.value), list.ap(fab.next, fa)),
  /* applicative */
  of: (a) => cons(a),

  chain: (fa, f) =>
    fa.type === 'Nil' ? fa : concat(f(fa.value), list.chain(fa.next, f)),
}

/**
 * @since 0.1.0
 */
export const getMonoid = <A>(): Monoid<List<A>> => ({
  empty: nil,
  concat,
})

/**
 * @since 0.1.0
 */
export const getEq = <A>(eqa: Eq<A>): Eq<List<A>> => {
  const S: Eq<List<A>> = fromEquals((x, y) => {
    if (x.type === 'Nil' && y.type === 'Nil') return true
    if (x.type === 'Cons' && y.type === 'Cons') {
      return eqa.equals(x.value, y.value) && S.equals(x.next, y.next)
    }
    return false
  })
  return S
}
