import { binomialHeap } from '../src/BinomialHeap'
import {itObeysPHeap} from './utils'

describe('BinomialHeap', () => {
  itObeysPHeap(binomialHeap)
})
