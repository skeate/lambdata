import * as fc from 'fast-check'
import { eqBoolean } from 'fp-ts/lib/Eq'
import { ordBoolean, ordNumber, ordString } from 'fp-ts/lib/Ord'
import * as laws from 'fp-ts-laws'
import * as BT from '../src/BinaryTree'
import { itObeysPSet, itObeysFoldable } from './utils'

describe('BinaryTree', () => {
  it('obeys Eq laws', () => {
    laws.eq(
      BT.getEq(eqBoolean),
      fc
        .array(fc.boolean())
        .map((xs) =>
          xs.reduce(
            (t, x) => BT.getSet(ordBoolean).insert(x, t),
            BT.leaf as BT.BinaryTree<boolean>,
          ),
        ),
    )
    expect(BT.getEq(eqBoolean).equals({ type: 'Leaf' }, { type: 'Leaf' })).toBe(
      true,
    )
  })

  it('obeys Ord laws', () => {
    laws.ord(
      BT.getOrd(ordNumber),
      fc
        .array(fc.integer())
        .map((xs) =>
          xs.reduce(
            (t, x) => BT.getSet(ordNumber).insert(x, t),
            BT.leaf as BT.BinaryTree<number>,
          ),
        ),
    )
    laws.ord(
      BT.getOrd(ordBoolean),
      fc
        .array(fc.boolean())
        .map((xs) =>
          xs.reduce(
            (t, x) => BT.getSet(ordBoolean).insert(x, t),
            BT.leaf as BT.BinaryTree<boolean>,
          ),
        ),
    )
    expect(
      BT.getOrd(ordBoolean).compare({ type: 'Leaf' }, { type: 'Leaf' }),
    ).toBe(0)
  })

  itObeysPSet('integers', BT.getSet(ordNumber), () => fc.integer())
  itObeysPSet('hexadecimal strings', BT.getSet(ordString), () => fc.hexa())

  itObeysFoldable(BT.binaryTree)((xs) =>
    xs.reduce(
      (t, x) => BT.getSet(ordNumber).insert(x, t),
      BT.leaf as BT.BinaryTree<number>,
    ),
  )

  it('performs minimal comparisons for membership check', () => {
    const s = BT.getSet(ordNumber)
    function depth<A>(n: BT.BinaryTree<A>): number {
      return n.type === 'Leaf' ? 0 : 1 + Math.max(depth(n.left), depth(n.right))
    }

    fc.assert(
      fc.property(
        fc.integer(-60, 60),
        fc
          .array(fc.integer(-50, 50), 20, 30)
          .map((xs) => xs.reduce((bt, x) => s.insert(x, bt), s.empty)),
        (x, bt) => {
          const spiedCompare = jest.spyOn(ordNumber, 'compare')
          s.member(x, bt)
          expect(spiedCompare.mock.calls.length).toBeLessThan(
            depth(bt) + 1,
          )
          spiedCompare.mockRestore()
        },
      ),
    )
  })
})
