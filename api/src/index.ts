/*
// This file is subject to the terms and conditions defined in
// file 'LICENSE.md', which is part of this source code package.
*/

import { ApolloServer } from 'apollo-server';

import typeDefs from './schema/definition';
import resolvers from './resolvers';

import {
  debug,
} from './utility';

import {
  connectMongo,
} from './db';

debug.log(`rapid-trex welcome! NODE_ENV: ${process.env.NODE_ENV}`);

const server = new ApolloServer({
  typeDefs,
  resolvers, // note: just comment out resolvers when running codegen
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    return { token };
  },
});

const run = async () => {
  server.listen().then(() => {
    debug.log('listening on http://localhost:4000');
  });
  await connectMongo();
};

run();
