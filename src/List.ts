import { Eq, fromEquals } from 'fp-ts/lib/Eq'
import { Functor1 } from 'fp-ts/lib/Functor'
import { Monad1 } from 'fp-ts/lib/Monad'
import { Monoid } from 'fp-ts/lib/Monoid'
import { Option, isNone, none, some, option } from 'fp-ts/lib/Option'

export const URI = 'List'
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    readonly [URI]: List<A>
  }
}

export type List<A> =
  | {
      readonly type: 'nil'
      readonly length: 0
    }
  | {
      readonly type: 'node'
      readonly length: number
      readonly value: A
      readonly next: List<A>
    }

export const nil = { type: 'nil', length: 0 } as const

export const node = <A>(value: A, next: List<A> = nil): List<A> => ({
  type: 'node',
  length: next.length + 1,
  value,
  next,
})

export const arr2list = <A>(arr: Array<A>): List<A> =>
  arr.reduceRight((p: List<A>, n) => node(n, p), nil)

export const iterate = function*<A>(l: List<A>) {
  while (l.type === 'node') {
    yield l.value;
    l = l.next;
  }
  return;
}

export const list2arr = <A>(l: List<A>): Array<A> => [...iterate(l)]

export const concat = <A>(xs: List<A>, ys: List<A>): List<A> =>
  xs.type === 'nil'
    ? ys
    : ys.type === 'nil'
    ? xs
    : node(xs.value, concat(xs.next, ys))

export const update = <A>(xs: List<A>, i: number, y: A): Option<List<A>> =>
  xs.type === 'nil'
    ? none
    : i === 0
    ? some(node(y, xs))
    : option.map(update(xs, i - 1, y), (n) => node(xs.value, n))

export const insert = <A>(xs: List<A>, i: number, y: A): List<A> =>
  xs.type === 'nil'
    ? node(y, xs)
    : i === 0
    ? node(y, xs)
    : node(xs.value, insert(xs.next, i - 1, y))

export const suffixes = <A>(xs: List<A>): List<List<A>> =>
  node(xs, xs.type === 'nil' ? xs : suffixes(xs.next))

export const list: Functor1<URI> & Monad1<URI> = {
  URI,

  /* functor */
  map: (fa, f) =>
    fa.type === 'nil' ? fa : node(f(fa.value), list.map(fa.next, f)),

  /* apply */
  ap: (fab, fa) =>
    fab.type === 'nil' || fa.type === 'nil'
      ? nil
      : concat(list.map(fa, fab.value), list.ap(fab.next, fa)),
  /* applicative */
  of: (a) => node(a),

  chain: (fa, f) =>
    fa.type === 'nil' ? fa : concat(f(fa.value), list.chain(fa.next, f)),
}

export const getMonoid = <A>(): Monoid<List<A>> => ({
  empty: nil,
  concat,
})

export const getEq = <A>(eqa: Eq<A>): Eq<List<A>> => {
  const S: Eq<List<A>> = fromEquals((x, y) => {
    if (x.type === 'nil' && y.type === 'nil') return true
    if (x.type === 'node' && y.type === 'node') {
      return eqa.equals(x.value, y.value) && S.equals(x.next, y.next)
    }
    return false
  })
  return S
}
