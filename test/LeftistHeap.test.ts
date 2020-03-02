import { leftistHeap } from '../src/LeftistHeap'
import {itObeysPHeap} from './utils'

describe('LeftistHeap', () => {
  itObeysPHeap(leftistHeap)
})
