import * as fc from 'fast-check'
import { Kind, URIS } from 'fp-ts/lib/HKT'
import { isSome, some, none } from 'fp-ts/lib/Option'
import { ordNumber } from 'fp-ts/lib/Ord'
import { PHeap } from '../src/PHeap'

type Model = number[]

export function itObeysPHeap<H extends URIS>(pheap: PHeap<H>): void {
  const isEmpty = pheap.isEmpty(ordNumber)
  const empty = pheap.empty(ordNumber)
  const insert = pheap.insert(ordNumber)
  const merge = pheap.merge(ordNumber)
  const findMin = pheap.findMin(ordNumber)
  const deleteMin = pheap.deleteMin(ordNumber)

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
