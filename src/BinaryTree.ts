import { Eq, fromEquals } from 'fp-ts/lib/Eq'
import { Ord } from 'fp-ts/lib/Ord'
import { Functor1 } from 'fp-ts/lib/Functor'
import { Traversable1 } from 'fp-ts/lib/Traversable'
import { Applicative } from 'fp-ts/lib/Applicative'
import { identity } from 'fp-ts/lib/function'
import { HKT } from 'fp-ts/lib/HKT'

import { PSet } from './PSet'

export const URI = 'BinaryTree'
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    readonly [URI]: BinaryTree<A>
  }
}

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

export const leaf = {
  type: 'Leaf',
} as const

export const node = <A>({
  left = leaf,
  value,
  right = leaf,
}: {
  left?: BinaryTree<A>
  value: A
  right?: BinaryTree<A>
}): BinaryTree<A> => ({
  type: 'Node',
  left,
  value,
  right,
})

export const member = <A>(ord: Ord<A>) => (
  x: A,
  tree: BinaryTree<A>,
): boolean => {
  if (tree.type === 'Leaf') return false
  const { left, value, right } = tree
  switch (ord.compare(x, value)) {
    case -1:
      return member(ord)(x, left)
    case 1:
      return member(ord)(x, right)
    default:
      return true
  }
}

export const insert = <A>(ord: Ord<A>) => (
  x: A,
  tree: BinaryTree<A>,
): BinaryTree<A> => {
  if (tree.type === 'Leaf') return node({ value: x })
  const { left, value, right } = tree
  switch (ord.compare(x, value)) {
    case -1:
      return node({ left: insert(ord)(x, left), value, right })
    case 1:
      return node({ left, value, right: insert(ord)(x, right) })
    default:
      return tree
  }
}

export const binaryTree: Functor1<URI> & Traversable1<URI> = {
  URI,

  map: (fa, f) =>
    fa.type === 'Leaf'
      ? fa
      : node({
          left: binaryTree.map(fa.left, f),
          value: f(fa.value),
          right: binaryTree.map(fa.right, f),
        }),

  foldMap: (M) => (fa, f) =>
    fa.type === 'Leaf'
      ? M.empty
      : M.concat(
          M.concat(binaryTree.foldMap(M)(fa.left, f), f(fa.value)),
          binaryTree.foldMap(M)(fa.right, f),
        ),

  reduce: (fa, b, f) =>
    fa.type === 'Leaf'
      ? b
      : f(
          binaryTree.reduce(fa.right, binaryTree.reduce(fa.left, b, f), f),
          fa.value,
        ),

  reduceRight: (fa, b, f) =>
    fa.type === 'Leaf'
      ? b
      : f(
          fa.value,
          binaryTree.reduceRight(
            fa.left,
            binaryTree.reduceRight(fa.right, b, f),
            f,
          ),
        ),

  sequence: <F>(
    F: Applicative<F>,
  ): (<A>(ta: BinaryTree<HKT<F, A>>) => HKT<F, BinaryTree<A>>) => {
    const traverseF = binaryTree.traverse(F)
    return (ta) => traverseF(ta, identity)
  },

  traverse: <F>(F: Applicative<F>) => <A, B>(
    ta: BinaryTree<A>,
    f: (a: A) => HKT<F, B>,
  ): HKT<F, BinaryTree<B>> => {
    if (ta.type === 'Leaf') return F.of(ta)
    const { left, value, right } = ta
    return F.ap(
      F.ap(
        F.map(
          binaryTree.traverse(F)(left, f),
          (left: BinaryTree<B>) => (value: B) => (right: BinaryTree<B>) =>
            node({ left, value, right }),
        ),
        f(value),
      ),
      binaryTree.traverse(F)(right, f),
    )
  },
}

export const getSet = <A>(ord: Ord<A>): PSet<URI, A> => ({
  empty: leaf,
  insert: insert(ord),
  member: member(ord),
})

export const getEq = <A>(eqa: Eq<A>): Eq<BinaryTree<A>> => {
  const S: Eq<BinaryTree<A>> = fromEquals((x, y) => {
    if (x.type === 'Leaf' && y.type === 'Leaf') return true
    if (x.type === 'Node' && y.type === 'Node') {
      return (
        x.value === y.value &&
        S.equals(x.left, y.left) &&
        S.equals(x.right, y.right)
      )
    }
    return false
  })
  return S
}
