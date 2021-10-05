/* eslint-disable quote-props */

import fetch from 'node-fetch';

const debug = console;

const query = 'query sessionByTag($tag: String!) { getSession(tag: $tag) { id } }';
const variables = {
  tag: 'bad-bats',
};

const body = JSON.stringify({ query, variables });

debug.log(body);

const main = async () => {
  const result = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body,
  });
  const data = await result.json();
  debug.log(data);
};

main();
