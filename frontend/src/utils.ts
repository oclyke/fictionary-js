import {
  Resolvers,
  Room,
  Player,
  Word,
  VoteTuple,
  ScoreTuple,
  ProposalTuple,
} from '../../api/src/generated/graphql'

import {
  GQL_ENDPOINT,
} from './constants'

type Doc = {
  [key: string]: any
}

export async function gqlFetch(query: string, variables?: Doc) {
  const r = await fetch(GQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    })
  });
  const data = await r.json();
  if (data.errors) {
    throw new Error(data.errors.map(e => `error from graphql resolver: ${e.message}`));
  }
  return data;
}



export function gqlFields(type: null
  | Room
  | Player
  | Word
  | VoteTuple
  | ProposalTuple
  | ScoreTuple
  | Room
): string {
  if (type === null) {
    return ''
  } else {


    // recursively generate keys for type excluding any beginning with two underscores



  }
}

export function makeSingle<
  Targs = any,
  Tgen = unknown,
  TReturn = any,
  TNext = unknown
> (
  generator_factory: (...args: Targs[]) => Generator<Tgen, TReturn, TNext>
) {
  let globalNonce
  return async function(...args: Targs[]) {
    const localNonce = globalNonce = new Object()

    const iter = generator_factory(...args)
    let resumeValue
    for (;;) {
      const n = iter.next(resumeValue)
      if (n.done) {
        return n.value // final return value of passed generator
      }

      // whatever the generator yielded, _now_ run await on it
      resumeValue = await n.value
      if (localNonce !== globalNonce) {
        return // a new call was made
      }
      // next loop, we give resumeValue back to the generator
    }
  };
}
