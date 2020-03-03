import * as fc from 'fast-check'
import { eqNumber } from 'fp-ts/lib/Eq'
import { ordNumber, ordString } from 'fp-ts/lib/Ord'
import * as laws from 'fp-ts-laws'
import * as BT from '../src/BinaryTree'
import { itObeysPSet, itObeysTraversable } from './utils'

const lift = <A>(arb: fc.Arbitrary<A>): fc.Arbitrary<BT.BinaryTree<A>> =>
  fc.oneof(
    arb.map(() => BT.leaf),
    arb.map((value) => BT.node({ value })),
  )

describe('BinaryTree', () => {
  it('obeys laws', () => {
    laws.functor(BT.binaryTree)(lift, BT.getEq)
    laws.eq(
      BT.getEq(eqNumber),
      fc
        .array(fc.integer())
        .map((xs) =>
          xs.reduce(
            (t, x) => BT.insert(ordNumber)(x, t),
            BT.leaf as BT.BinaryTree<number>,
          ),
        ),
    )
    expect(BT.getEq(eqNumber).equals({ type: 'Leaf' }, { type: 'Leaf' })).toBe(
      true,
    )
  })

  itObeysPSet('integers', BT.getSet(ordNumber), () => fc.integer())
  itObeysPSet('hexadecimal strings', BT.getSet(ordString), () => fc.hexa())

  itObeysTraversable(BT.binaryTree)(
    (v) => v.map((value) => BT.node({ value })),
    (xs) =>
      xs.reduce(
        (t, x) => BT.insert(ordNumber)(x, t),
        BT.leaf as BT.BinaryTree<number>,
      ),
    BT.getEq,
  )
})
