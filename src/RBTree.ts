/**
 * @since 0.1.0
 */
import { Foldable1 } from 'fp-ts/lib/Foldable'
import { Ord } from 'fp-ts/lib/Ord'
import { leaf } from './BinaryTree'
import { PSet } from './PSet'

/**
 * @since 0.1.0
 */
export const URI = 'RBTree'

/**
 * @since 0.1.0
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    readonly [URI]: RBTree<A>
  }
}

type Color = 'R' | 'B'
type Node<A> = {
  readonly type: 'Node'
  readonly color: Color
  readonly left: RBTree<A>
  readonly value: A
  readonly right: RBTree<A>
}

/**
 * @since 0.1.0
 */
export type RBTree<A> = { readonly type: 'Leaf' } | Node<A>

export {
  /**
   * @since 0.1.0
   */
  leaf,
}

/**
 * @since 0.1.0
 */
export const node = <A>(
  color: Color,
  left: RBTree<A>,
  value: A,
  right: RBTree<A>,
): Node<A> => ({
  type: 'Node',
  color,
  left,
  value,
  right,
})

/**
 * @since 0.1.0
 */
export const rbTree: Foldable1<URI> = {
  URI,

  foldMap: (M) => (fa, f) =>
    fa.type === 'Leaf'
      ? M.empty
      : M.concat(
          M.concat(rbTree.foldMap(M)(fa.left, f), f(fa.value)),
          rbTree.foldMap(M)(fa.right, f),
        ),

  reduce: (fa, b, f) =>
    fa.type === 'Leaf'
      ? b
      : f(rbTree.reduce(fa.right, rbTree.reduce(fa.left, b, f), f), fa.value),

  reduceRight: (fa, b, f) =>
    fa.type === 'Leaf'
      ? b
      : f(
          fa.value,
          rbTree.reduceRight(fa.left, rbTree.reduceRight(fa.right, b, f), f),
        ),
}

function lbalance<A>(
  color: Color,
  left: RBTree<A>,
  value: A,
  right: RBTree<A>,
): Node<A> {
  if (color === 'B') {
    if (left.type === 'Node' && left.color === 'R') {
      if (left.left.type === 'Node' && left.left.color === 'R') {
        return node(
          'R',
          node('B', left.left.left, left.left.value, left.left.right),
          left.value,
          node('B', left.right, value, right),
        )
      }
      if (left.right.type === 'Node' && left.right.color === 'R') {
        return node(
          'R',
          node('B', left.left, left.value, left.right.left),
          left.right.value,
          node('B', left.right.right, value, right),
        )
      }
    }
  }
  return node(color, left, value, right)
}

function rbalance<A>(
  color: Color,
  left: RBTree<A>,
  value: A,
  right: RBTree<A>,
): Node<A> {
  if (color === 'B') {
    if (right.type === 'Node' && right.color === 'R') {
      if (right.left.type === 'Node' && right.left.color === 'R') {
        return node(
          'R',
          node('B', left, value, right.left.left),
          right.left.value,
          node('B', right.left.right, right.value, right.right),
        )
      }
      if (right.right.type === 'Node' && right.right.color === 'R') {
        return node(
          'R',
          node('B', left, value, right.left),
          right.value,
          node('B', right.right.left, right.right.value, right.right.right),
        )
      }
    }
  }
  return node(color, left, value, right)
}

/**
 * @since 0.1.0
 */
export const getSet = <A>(ord: Ord<A>): PSet<URI, A> => {
  const S: PSet<URI, A> = {
    empty: leaf,
    member: (x, t) => {
      if (t.type === 'Leaf') return false
      switch (ord.compare(x, t.value)) {
        case -1:
          return S.member(x, t.left)
        case 1:
          return S.member(x, t.right)
        default:
          return true
      }
    },
    insert: (x, t) => {
      const ins = (s: RBTree<A>): Node<A> => {
        if (s.type === 'Leaf') return node('R', leaf, x, leaf)
        switch (ord.compare(x, s.value)) {
          case -1:
            return lbalance(s.color, ins(s.left), s.value, s.right)
          case 1:
            return rbalance(s.color, s.left, s.value, ins(s.right))
          default:
            return s
        }
      }
      const { left, value, right } = ins(t)
      return node('B', left, value, right)
    },
  }
  return S
}
