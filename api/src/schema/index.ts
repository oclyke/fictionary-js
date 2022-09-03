import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
} from 'graphql'

import {
  queryType,
} from './query'

import {
  mutationType,
} from './mutation'

// trying to ensure efficient pagination of the returned data
// https://www.reindex.io/blog/relay-graphql-pagination-with-mongodb/
// https://blog.logrocket.com/properly-designed-graphql-resolvers/

/**
 * Using our shorthand to describe type systems, the type system for our
 * example will be the following: (see schema.gql)
 */

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export const schema: GraphQLSchema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
