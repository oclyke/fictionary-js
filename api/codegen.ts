import {
  ApolloServer,
} from 'apollo-server'

import {
  schema,
} from './src/schema'

async function run () {
  const server = new ApolloServer({
    persistedQueries: false,
    typeDefs: schema,
    // resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      return { token };
    },
  });
  const server_info = await server.listen({
    port: 4001
  });
  console.log(`listening on ${server_info.url}`)
}
run()
