import {
  Resolvers,
} from '../../api/src/generated/graphql'

import {
  GQL_ENDPOINT,
} from './constants'

type Doc = {
  [key: string]: any
}

export async function fetch_gql(query: string, variables?: Doc) {
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
