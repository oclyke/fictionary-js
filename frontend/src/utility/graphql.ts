
const GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql'

export const gqlop = async (query: string, variables?: any) => {
  const r = await fetch(GRAPHQL_ENDPOINT, {
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
    // console.error(data.errors);
    throw new Error(data.errors.map(e => `error from graphql resolver: ${e.message}`));
  }
  return data;
}
