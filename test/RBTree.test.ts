import * as fc from 'fast-check'
import { ordNumber, ordString } from 'fp-ts/lib/Ord'
import * as RBT from '../src/RBTree'
import { itObeysFoldable, itObeysPSet } from './utils'

describe('RBTree', () => {
  itObeysPSet('integers', RBT.getSet(ordNumber), () => fc.integer())
  itObeysPSet('hexadecimal strings', RBT.getSet(ordString), () => fc.hexa())

  itObeysFoldable(RBT.rbTree)((xs) =>
    xs.reduce((f, x) => RBT.getSet(ordNumber).insert(x, f), RBT.leaf as RBT.RBTree<number>),
  )
})
