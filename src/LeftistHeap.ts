import { none, some } from 'fp-ts/lib/Option'
import { Ord } from 'fp-ts/lib/Ord'

import { leaf } from './BinaryTree'
import { PHeap } from './PHeap'

export const URI = 'LeftistHeap'
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    readonly [URI]: LeftistHeap<A>
  }
}

export type LeftistHeap<A> =
  | { readonly type: 'Leaf' }
  | {
      readonly type: 'Node'
      readonly rank: number
      readonly left: LeftistHeap<A>
      readonly value: A
      readonly right: LeftistHeap<A>
    }

export { leaf }

export const node = <A>({
  rank = 1,
  left = leaf,
  value,
  right = leaf,
}: {
  rank?: number
  left?: LeftistHeap<A>
  value: A
  right?: LeftistHeap<A>
}): LeftistHeap<A> => ({
  type: 'Node',
  rank,
  left,
  value,
  right,
})

export const rank = <A>(h: LeftistHeap<A>): number =>
  h.type === 'Leaf' ? 0 : h.rank

export const makeT = <A>(
  value: A,
  a: LeftistHeap<A>,
  b: LeftistHeap<A>,
): LeftistHeap<A> => {
  const ra = rank(a)
  const rb = rank(b)
  if (ra >= rb) return node({ rank: rb + 1, value, left: a, right: b })
  else return node({ rank: ra + 1, value, left: b, right: a })
}

const merge = <A>(ord: Ord<A>) => (
  a: LeftistHeap<A>,
  b: LeftistHeap<A>,
): LeftistHeap<A> => {
  if (a.type === 'Leaf') return b
  if (b.type === 'Leaf') return a
  if (ord.compare(a.value, b.value) <= 0) {
    return makeT(a.value, a.left, merge(ord)(a.right, b))
  } else {
    return makeT(b.value, b.left, merge(ord)(a, b.right))
  }
}

export const leftistHeap: PHeap<URI> = {
  empty: () => leaf,
  isEmpty: () => ({ type }) => type === 'Leaf',

  merge,
  insert: (ord) => (a, heap) => merge(ord)(node({ value: a }), heap),

  findMin: () => (heap) => (heap.type === 'Leaf' ? none : some(heap.value)),
  deleteMin: (ord) => (heap) =>
    heap.type === 'Leaf' ? none : some(merge(ord)(heap.left, heap.right)),
}
