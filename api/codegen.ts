import {
  ApolloServer,
} from 'apollo-server'

import {
  get_schema,
} from './src/utils'

import {
  prepare,
} from './codegen.schema'

async function run () {
  const schema = await prepare()
  const server = new ApolloServer({
    persistedQueries: false,
    // typeDefs: get_schema(),
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
