import * as fc from 'fast-check'
import { none, some } from 'fp-ts/lib/Option'
import * as laws from 'fp-ts-laws'
import * as L from '../src/List'

function assert(condition: boolean): asserts condition {
  expect(condition).toBeTruthy()
}

const lift = <A>(arb: fc.Arbitrary<A>): fc.Arbitrary<L.List<A>> =>
  fc.oneof(
    arb.map(() => L.nil),
    arb.map((v) => L.node(v)),
  )

describe('List', () => {
  it('obeys laws', () => {
    laws.functor(L.list)(lift, L.getEq)
    laws.applicative(L.list)(lift, L.getEq)
    laws.monad(L.list)(L.getEq)
  })

  it('provides a length', () => {
    const list = L.node(1, L.node(2, L.nil))
    expect(list.length).toBe(2)
  })

  describe('conversion helpers', () => {
    it('converts to/from array', () => {
      const node = jest.spyOn(L, 'node')
      const arr = [1, 2, 3]
      const l = L.arr2list(arr)
      expect(node).toHaveBeenCalledTimes(3)
      expect(l.length).toBe(3)
      node.mockRestore()
      expect(l).toMatchObject(L.node(1, L.node(2, L.node(3, L.nil))))
      expect(L.list2arr(l)).toEqual(arr)
    })
  })

  describe('concat', () => {
    it('concats two empty lists', () => {
      expect(L.concat(L.nil, L.nil)).toBe(L.nil)
    })

    it('concats a list with empty and get out the same list', () => {
      const list = L.node(1, L.node(2, L.nil))

      expect(L.concat(list, L.nil)).toBe(list)
      expect(L.concat(L.nil, list)).toBe(list)
    })

    it('concats two lists', () => {
      const a = L.node(1, L.node(2, L.nil))
      const b = L.node(3, L.node(5, L.nil))

      const ab = L.concat(a, b)
      expect(ab).toMatchObject({
        value: 1,
        next: {
          value: 2,
          next: { value: 3, next: { value: 5, next: L.nil } },
        },
      })
      assert(ab.type === 'node')
      assert(ab.next.type === 'node')
      expect(ab.next.next).toBe(b)

      const ba = L.concat(b, a)
      expect(ba).toMatchObject({
        value: 3,
        next: {
          value: 5,
          next: { value: 1, next: { value: 2, next: L.nil } },
        },
      })
      assert(ba.type === 'node')
      assert(ba.next.type === 'node')
      expect(ba.next.next).toBe(a)

      expect(ab.next.next).toBe(b)
    })
  })

  describe('update', () => {
    it('handles empty lists', () => {
      expect(L.update(L.nil, 24, 'bah')).toBe(none)
    })

    it('updates a list', () => {
      const list = L.node(1, L.node(2, L.nil))

      // expect(L.update(list, 0, 4)).toM(list)
      expect(L.concat(L.nil, list)).toBe(list)
    })

    it('should concatenate two lists', () => {
      const a = L.node(1, L.node(2, L.nil))
      const b = L.node(3, L.node(5, L.nil))

      const ab = L.concat(a, b)
      expect(ab).toMatchObject({
        value: 1,
        next: {
          value: 2,
          next: { value: 3, next: { value: 5, next: L.nil } },
        },
      })
      assert(ab.type === 'node')
      assert(ab.next.type === 'node')
      expect(ab.next.next).toBe(b)

      const ba = L.concat(b, a)
      expect(ba).toMatchObject({
        value: 3,
        next: {
          value: 5,
          next: { value: 1, next: { value: 2, next: L.nil } },
        },
      })
      assert(ba.type === 'node')
      assert(ba.next.type === 'node')
      expect(ba.next.next).toBe(a)

      expect(ab.next.next).toBe(b)
    })
  })
})
