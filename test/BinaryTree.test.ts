import * as fc from 'fast-check'
import { ordNumber } from 'fp-ts/lib/Ord'
import * as laws from 'fp-ts-laws'
import * as BT from '../src/BinaryTree'

const lift = <A>(arb: fc.Arbitrary<A>): fc.Arbitrary<BT.BinaryTree<A>> =>
  fc.oneof(
    arb.map(() => BT.leaf),
    arb.map((value) => BT.node({ value })),
  )

describe('BinaryTree', () => {
  it('obeys laws', () => {
    laws.functor(BT.binaryTree)(lift, BT.getEq)
  })

  describe('member', () => {
    it('checks membership in empty trees', () => {
      expect(BT.member(ordNumber)(3, BT.leaf)).toBe(false)
    })

    it('checks membership in populated trees', () => {
      const tree = BT.node({
        left: BT.node({ value: 1 }),
        value: 2,
        right: BT.leaf,
      })
      expect(BT.member(ordNumber)(3, tree)).toBe(false)
      expect(BT.member(ordNumber)(2, tree)).toBe(true)
      expect(BT.member(ordNumber)(1, tree)).toBe(true)
      expect(BT.member(ordNumber)(0, tree)).toBe(false)
    })
  })

  describe('insert', () => {
    const insert = BT.insert(ordNumber)

    it('inserts values into a tree', () => {
      const ins1 = insert(1, BT.leaf)
      expect(ins1).toEqual(BT.node({ value: 1 }))
      const ins2 = insert(2, ins1)
      expect(ins2).toEqual(BT.node({ value: 1, right: BT.node({ value: 2 }) }))
      const ins0 = insert(0, ins2)
      expect(ins0).toEqual(
        BT.node({
          left: BT.node({ value: 0 }),
          value: 1,
          right: BT.node({ value: 2 }),
        }),
      )
    })

    it(`doesn't insert existing values into the tree`, () => {
      const ins1 = insert(1, BT.leaf)
      const ins1Twice = insert(1, ins1)
      expect(ins1Twice).toEqual(ins1)
    })
  })
})
