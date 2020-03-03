import * as fc from 'fast-check'
import * as laws from 'fp-ts-laws'
import { Eq } from 'fp-ts/lib/Eq'
import { array } from 'fp-ts/lib/Array'
import { HKT, Kind, URIS } from 'fp-ts/lib/HKT'
import { monoidSum } from 'fp-ts/lib/Monoid'
import { isSome, some, none } from 'fp-ts/lib/Option'
import { Traversable, Traversable1 } from 'fp-ts/lib/Traversable'
import { ordNumber } from 'fp-ts/lib/Ord'
import { PHeap } from '../src/PHeap'
import { PSet } from '../src/PSet'

export function itObeysPSet<S extends URIS, A>(
  name: string,
  pset: PSet<S, A>,
  arb: () => fc.Arbitrary<A>,
): void {
  type Model = Set<A>
  type Sn = { s: Kind<S, A> }
  type Command = fc.Command<Model, Sn>

  class InsertCmd implements Command {
    constructor(readonly value: A) {}
    check = () => true
    run(m: Model, r: Sn) {
      r.s = pset.insert(this.value, r.s)
      m.add(this.value)
    }
    toString = () => `insert(${this.value})`
  }

  class MemberCmd implements Command {
    constructor(readonly value: A) {}
    check = () => true
    run(m: Model, r: Sn) {
      expect(pset.member(this.value, r.s)).toEqual(m.has(this.value))
    }
    toString = () => `member(${this.value})`
  }

  it(`obeys PSet (data: ${name})`, () => {
    const allCommands = [
      arb().map((v) => new InsertCmd(v)),
      arb().map((v) => new MemberCmd(v)),
    ]

    fc.assert(
      fc.property(fc.commands(allCommands, 100), (cmds) => {
        const s = () => ({ model: new Set<A>(), real: { s: pset.empty } })
        fc.modelRun(s, cmds)
      }),
    )
  })
}

export function itObeysPHeap<H extends URIS>(pheap: PHeap<H>): void {
  const isEmpty = pheap.isEmpty(ordNumber)
  const empty = pheap.empty(ordNumber)
  const insert = pheap.insert(ordNumber)
  const merge = pheap.merge(ordNumber)
  const findMin = pheap.findMin(ordNumber)
  const deleteMin = pheap.deleteMin(ordNumber)

  type Model = number[]
  type Hn = { h: Kind<H, number> }
  type Command = fc.Command<Model, Hn>

  class InsertCmd implements Command {
    constructor(readonly value: number) {}
    check = () => true
    run(m: Model, r: Hn) {
      r.h = insert(this.value, r.h)
      m.push(this.value)
      m.sort((a, b) => a - b)
    }
    toString = () => `insert(${this.value})`
  }

  class IsEmptyCmd implements Command {
    check = () => true
    run(m: Model, r: Hn) {
      expect(isEmpty(r.h)).toEqual(m.length === 0)
    }
    toString = () => 'isEmpty'
  }

  class FindMinCmd implements Command {
    check = () => true
    run(m: Model, r: Hn) {
      if (m.length === 0) {
        expect(findMin(r.h)).toEqual(none)
      } else {
        expect(findMin(r.h)).toEqual(some(m[0]))
      }
    }
    toString = () => 'findMin'
  }

  class DeleteMinCmd implements Command {
    check = () => true
    run(m: Model, r: Hn) {
      if (m.length === 0) {
        expect(deleteMin(r.h)).toEqual(none)
      } else {
        const x = deleteMin(r.h)
        expect(x).not.toEqual(none)
        if (isSome(x)) {
          r.h = x.value
          m.shift()
        }
      }
    }
    toString = () => 'deleteMin'
  }

  class MergeCmd implements Command {
    constructor(readonly m2: Model, readonly r2: Hn) {}
    check = () => true
    run(m: Model, r: Hn) {
      r.h = merge(r.h, this.r2.h)
      m.push(...this.m2)
      m.sort((a, b) => a - b)
    }
    toString = () => `merge([${this.m2.join(',')}])`
  }

  it('obeys PHeap', () => {
    const allCommands = [
      fc.integer().map((v) => new InsertCmd(v)),
      fc.constant(new IsEmptyCmd()),
      fc.constant(new FindMinCmd()),
      fc.constant(new DeleteMinCmd()),
      fc
        .array(fc.integer())
        .map(
          (xs) =>
            new MergeCmd(xs, { h: xs.reduce((h, x) => insert(x, h), empty) }),
        ),
    ]

    fc.assert(
      fc.property(fc.commands(allCommands, 100), (cmds) => {
        const s = () => ({ model: [], real: { h: empty } })
        fc.modelRun(s, cmds)
      }),
    )
  })
}

export function itObeysTraversable<T extends URIS>(
  t: Traversable1<T>,
): (
  lift: <A>(a: fc.Arbitrary<A>) => fc.Arbitrary<Kind<T, A>>,
  convertT: (a: number[]) => Kind<T, number>,
  liftEq: <A>(Sa: Eq<A>) => Eq<Kind<T, A>>,
) => void
export function itObeysTraversable<T>(
  t: Traversable<T>,
): (
  lift: <A>(a: fc.Arbitrary<A>) => fc.Arbitrary<HKT<T, A>>,
  convertT: (a: number[]) => HKT<T, number>,
  liftEq: <A>(Sa: Eq<A>) => Eq<HKT<T, A>>,
) => void
export function itObeysTraversable<T>(
  t: Traversable<T>,
): (
  lift: <A>(a: fc.Arbitrary<A>) => fc.Arbitrary<HKT<T, A>>,
  convertT: <A>(a: A[]) => HKT<T, A>,
  liftEq: <A>(Sa: Eq<A>) => Eq<HKT<T, A>>,
) => void {
  return (lift, convertT, liftEq) => {
    describe('obeys traversable', () => {
      it('obeys functor', () => {
        laws.functor(t)(lift, liftEq)
      })

      describe('implements foldable', () => {
        it('implements reduce', () => {
          fc.assert(
            fc.property(fc.set(fc.integer(-1000, 1000)), (xs) => {
              expect(t.reduce(convertT(xs), 0, (b, a) => b + a)).toEqual(
                xs.reduce((p, n) => p + n, 0),
              )
            }),
          )
        })

        it('implements reduceRight', () => {
          fc.assert(
            fc.property(fc.set(fc.integer(-1000, 1000)), (xs) => {
              expect(t.reduceRight(convertT(xs), 0, (b, a) => b + a)).toEqual(
                xs.reduceRight((p, n) => p + n, 0),
              )
            }),
          )
        })

        it('implements foldMap', () => {
          fc.assert(
            fc.property(fc.set(fc.integer(-1000, 1000)), (xs) => {
              expect(t.foldMap(monoidSum)(convertT(xs), (a) => a)).toEqual(
                xs.reduce((s, n) => s + n, 0),
              )
            }),
          )
        })
      })

      describe('implements traversable', () => {
        it('implements sequence', () => {
          fc.assert(
            fc.property(fc.set(fc.integer(-1000, 1000)), (xs) => {
              expect(
                t.sequence(array)(t.map(convertT(xs), (x) => [x])),
              ).toEqual([convertT(xs)])
            }),
          )
        })

        it('implements traverse', () => {
          fc.assert(
            fc.property(fc.set(fc.integer(-1000, 1000)), (xs) => {
              expect(t.traverse(array)(convertT(xs), (x) => [x])).toEqual([
                convertT(xs),
              ])
            }),
          )
        })
      })
    })
  }
}
