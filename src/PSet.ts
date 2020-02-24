import { URIS, Kind } from 'fp-ts/lib/HKT'

export interface PSet<S extends URIS, A> {
  readonly empty: Kind<S, A>
  readonly insert: (a: A, s: Kind<S, A>) => Kind<S, A>
  readonly member: (a: A, s: Kind<S, A>) => boolean
}
