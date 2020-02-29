import * as fc from 'fast-check'
import { eqNumber } from 'fp-ts/lib/Eq'
import { none, some } from 'fp-ts/lib/Option'
import * as laws from 'fp-ts-laws'
import * as L from '../src/List'

function assert(condition: boolean): asserts condition {
  expect(condition).toBeTruthy()
}

const lift = <A>(arb: fc.Arbitrary<A>): fc.Arbitrary<L.List<A>> =>
  fc.oneof(
    arb.map(() => L.nil),
    arb.map((v) => L.cons(v)),
  )

describe('List', () => {
  it('obeys laws', () => {
    laws.functor(L.list)(lift, L.getEq)
    laws.applicative(L.list)(lift, L.getEq)
    laws.monad(L.list)(L.getEq)
    laws.eq(L.getEq(eqNumber), lift(fc.integer()))
    laws.monoid(L.getMonoid<number>(), L.getEq(eqNumber), lift(fc.integer()))
  })

  it('provides a length', () => {
    const list = L.cons(1, L.cons(2, L.nil))
    expect(list.length).toBe(2)
  })

  describe('conversion helpers', () => {
    it('converts to/from array', () => {
      const cons = jest.spyOn(L, 'cons')
      const arr = [1, 2, 3]
      const l = L.arr2list(arr)
      expect(cons).toHaveBeenCalledTimes(3)
      expect(l.length).toBe(3)
      cons.mockRestore()
      expect(l).toMatchObject(L.cons(1, L.cons(2, L.cons(3, L.nil))))
      expect(L.list2arr(l)).toEqual(arr)
    })
  })

  describe('concat', () => {
    it('concats two empty lists', () => {
      expect(L.concat(L.nil, L.nil)).toBe(L.nil)
    })

    it('concats a list with empty and get out the same list', () => {
      const list = L.cons(1, L.cons(2, L.nil))

      expect(L.concat(list, L.nil)).toBe(list)
      expect(L.concat(L.nil, list)).toBe(list)
    })

    it('concats two lists', () => {
      const a = L.cons(1, L.cons(2, L.nil))
      const b = L.cons(3, L.cons(5, L.nil))

      const ab = L.concat(a, b)
      expect(ab).toMatchObject({
        value: 1,
        next: {
          value: 2,
          next: { value: 3, next: { value: 5, next: L.nil } },
        },
      })
      assert(ab.type === 'Cons')
      assert(ab.next.type === 'Cons')
      expect(ab.next.next).toBe(b)

      const ba = L.concat(b, a)
      expect(ba).toMatchObject({
        value: 3,
        next: {
          value: 5,
          next: { value: 1, next: { value: 2, next: L.nil } },
        },
      })
      assert(ba.type === 'Cons')
      assert(ba.next.type === 'Cons')
      expect(ba.next.next).toBe(a)

      expect(ab.next.next).toBe(b)
    })
  })

  describe('update', () => {
    it('handles empty lists', () => {
      expect(L.update(L.nil, 24, 'bah')).toBe(none)
    })

    it('updates a list with minimal replacement', () => {
      const list = L.cons(1, L.cons(2, L.nil))
      expect(L.update(list, 0, 4)).toEqual(some(L.arr2list([4, 2])))
      expect(L.update(list, 1, 4)).toEqual(some(L.arr2list([1, 4])))
      expect(L.update(list, 0, 4)).toEqual(some(L.arr2list([4, 2])))
    })

    it('handles out-of-bounds indices', () => {
      const list = L.cons(1, L.cons(2, L.nil))
      expect(L.update(list, 2, 4)).toEqual(none)
      expect(L.update(list, -1, 4)).toEqual(none)
    })
  })

  describe('insert', () => {
    it('inserts elements', () => {
      expect(L.insert(L.nil, 0, 1)).toEqual(L.cons(1))
      const l = L.arr2list([1, 2, 6, 3])
      expect(L.insert(l, 0, 0)).toEqual(L.arr2list([0, 1, 2, 6, 3]))
      expect(L.insert(l, 1, 0)).toEqual(L.arr2list([1, 0, 2, 6, 3]))
      expect(L.insert(l, 2, 0)).toEqual(L.arr2list([1, 2, 0, 6, 3]))
      expect(L.insert(l, 3, 0)).toEqual(L.arr2list([1, 2, 6, 0, 3]))
      expect(L.insert(l, 4, 0)).toEqual(L.arr2list([1, 2, 6, 3, 0]))
    })

    it('handles out-of-bounds', () => {
      const l = L.arr2list([1, 2, 6, 3])
      expect(L.insert(l, -1, 0)).toEqual(L.arr2list([0, 1, 2, 6, 3]))
      expect(L.insert(l, 5, 0)).toEqual(L.arr2list([1, 2, 6, 3, 0]))
    })
  })

  describe('eq', () => {
    it('checks equality of two lists', () => {
      expect(L.getEq(eqNumber).equals({ type: 'Nil', length: 0 }, L.nil)).toBe(
        true,
      )
      const l1 = L.arr2list([1, 2, 3])
      const l2 = L.arr2list([1, 2, 3])
      const l3 = L.arr2list([4, 1, 2, 3])
      expect(L.getEq(eqNumber).equals(l1, l2)).toBe(true)
      expect(L.getEq(eqNumber).equals(l1, l3)).toBe(false)
      expect(L.getEq(eqNumber).equals(L.insert(l2, 0, 4), l3)).toBe(true)
    })
  })
})
