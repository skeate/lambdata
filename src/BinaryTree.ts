import { Eq, fromEquals } from 'fp-ts/lib/Eq'
import { Ord } from 'fp-ts/lib/Ord'
import { Foldable1 } from 'fp-ts/lib/Foldable'

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

export const node = <A>(
  left: BinaryTree<A>,
  value: A,
  right: BinaryTree<A>,
): BinaryTree<A> => ({
  type: 'Node',
  left,
  value,
  right,
})

export const binaryTree: Foldable1<URI> = {
  URI,

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
}

export const getSet = <A>(ord: Ord<A>): PSet<URI, A> => {
  const S: PSet<URI, A> = {
    empty: leaf,
    member: (x, tree) => {
      if (tree.type === 'Leaf') return false
      const { left, value, right } = tree
      switch (ord.compare(x, value)) {
        case -1:
          return S.member(x, left)
        case 1:
          return S.member(x, right)
        default:
          return true
      }
    },

    insert: (x, tree) => {
      if (tree.type === 'Leaf') return node(leaf, x, leaf)
      const { left, value, right } = tree
      switch (ord.compare(x, value)) {
        case -1:
          return node(S.insert(x, left), value, right)
        case 1:
          return node(left, value, S.insert(x, right))
        default:
          return tree
      }
    },
  }
  return S
}

export const getEq = <A>(eqa: Eq<A>): Eq<BinaryTree<A>> => {
  const S: Eq<BinaryTree<A>> = fromEquals((x, y) => {
    if (x.type === 'Leaf' && y.type === 'Leaf') return true
    if (x.type === 'Node' && y.type === 'Node') {
      return (
        eqa.equals(x.value, y.value) &&
        S.equals(x.left, y.left) &&
        S.equals(x.right, y.right)
      )
    }
    return false
  })
  return S
}
