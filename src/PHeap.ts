import { URIS, Kind } from 'fp-ts/lib/HKT'
import { Option } from 'fp-ts/lib/Option';
import { Ord } from 'fp-ts/lib/Ord'

export interface PHeap<H extends URIS> {
  readonly empty: <A>(ord: Ord<A>) => Kind<H, A>
  readonly isEmpty: <A>(ord: Ord<A>) => (heap: Kind<H, A>) => boolean

  readonly insert: <A>(ord: Ord<A>) => (a: A, heap: Kind<H, A>) => Kind<H, A>
  readonly merge: <A>(ord: Ord<A>) => (a: Kind<H, A>, b: Kind<H, A>) => Kind<H, A>

  readonly findMin: <A>(ord: Ord<A>) => (heap: Kind<H, A>) => Option<A>
  readonly deleteMin: <A>(ord: Ord<A>) => (heap: Kind<H, A>) => Option<Kind<H, A>>
}
