/**
 * @since 0.1.0
 */
import { Option, option, some, none } from 'fp-ts/lib/Option'
import { Ord } from 'fp-ts/lib/Ord'

import { PHeap } from './PHeap'
import * as L from './List'

/**
 * @since 0.1.0
 */
export const URI = 'BinomialHeap'

/**
 * @since 0.1.0
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    readonly [URI]: BinomialHeap<A>
  }
}

/**
 * @since 0.1.0
 */
export type BinomialTree<A> = {
  rank: number
  value: A
  children: L.List<BinomialTree<A>>
}

/**
 * @since 0.1.0
 */
export const node = <A>(
  rank: number,
  value: A,
  children: L.List<BinomialTree<A>>,
) => ({ rank, value, children })

/**
 * @since 0.1.0
 */
export type BinomialHeap<A> = L.List<BinomialTree<A>>

/**
 * @since 0.1.0
 */
export const link = <A>(ord: Ord<A>) => (
  a: BinomialTree<A>,
  b: BinomialTree<A>,
) =>
  ord.compare(a.value, b.value) <= 0
    ? node(a.rank + 1, a.value, L.insert(a.children, 0, b))
    : node(a.rank + 1, b.value, L.insert(b.children, 0, a))

const insTree = <A>(ord: Ord<A>) => (
  tree: BinomialTree<A>,
  h: BinomialHeap<A>,
): BinomialHeap<A> =>
  h.type === 'Nil' || tree.rank < h.value.rank
    ? L.insert(h, 0, tree)
    : insTree(ord)(link(ord)(tree, h.value), h.next)

/**
 * @since 0.1.0
 */
export const insert = <A>(ord: Ord<A>) => (a: A, heap: BinomialHeap<A>) =>
  insTree(ord)(node(0, a, L.nil), heap)

/**
 * @since 0.1.0
 */
export const merge = <A>(ord: Ord<A>) => (
  a: BinomialHeap<A>,
  b: BinomialHeap<A>,
): BinomialHeap<A> => {
  if (a.type === 'Nil') return b
  if (b.type === 'Nil') return a
  if (a.value.rank < b.value.rank) {
    return L.insert(merge(ord)(a.next, b), 0, a.value)
  }
  if (b.value.rank < a.value.rank) {
    return L.insert(merge(ord)(a, b.next), 0, b.value)
  }
  return insTree(ord)(link(ord)(a.value, b.value), merge(ord)(a.next, b.next))
}

const removeMinTree = <A>(ord: Ord<A>) => (
  heap: BinomialHeap<A>,
): Option<[BinomialTree<A>, BinomialHeap<A>]> =>
  heap.type === 'Nil'
    ? none
    : heap.length === 1
    ? some([heap.value, L.nil])
    : option.map(removeMinTree(ord)(heap.next), ([tree, heap2]) =>
        ord.compare(heap.value.value, tree.value) <= 0
          ? [heap.value, heap.next]
          : [tree, L.insert(heap2, 0, heap.value)],
      )

const findMin = <A>(ord: Ord<A>) => (heap: BinomialHeap<A>): Option<A> =>
  option.map(removeMinTree(ord)(heap), ([tree]) => tree.value)

const deleteMin = <A>(ord: Ord<A>) => (
  heap: BinomialHeap<A>,
): Option<BinomialHeap<A>> =>
  option.map(removeMinTree(ord)(heap), ([tree, rest]) =>
    merge(ord)(L.reverse(tree.children), rest),
  )

/**
 * @since 0.1.0
 */
export const binomialHeap: PHeap<URI> = {
  empty: () => L.nil,
  isEmpty: () => (heap) => heap.type === 'Nil',

  insert,
  merge,

  findMin,
  deleteMin,
}
