import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql'


import {
  MetaType,
} from './meta'

import {
  PlayerType,
} from './player'

import {
  GameType,
  createGameMutation,
} from './game'

import {
  nodeField,
} from './node'

import {
  resolverWithDatabase,
} from './utils'

/**
 * Using our shorthand to describe type systems, the type system for our
 * example will be the following: (see schema.gql)
 */

/**
 * This is the type that will be the root of our query, and the
 * entry point into our schema.
 *
 * This implements the following type system shorthand:
 * type Query {
 *   gameById(id: ID!): Game
 *   gameByTag(tag: String!): Game
 *   player(id: ID!): Player
 *   meta: Meta
 *   node(id: ID!): Node
 * }
 */
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    game: {
      type: GameType,
      resolve: (parent, args, context, info) => { console.warn('unimplemented'); /* return getGame('0') */ return null },
    },
    player: {
      type: PlayerType,
      resolve: (parent, args, context, info) => {
        console.log('trying to get player!')
        console.log({parent, args, info})
        // return getPlayer('0')
        return null
      },
    },
    meta: {
      type: MetaType,
      resolve: resolverWithDatabase((parent, args, context, info) => {
        // console.log({parent, args, info})
        console.log({ context })

        // return getMeta('naught')
        return null
      }),
    },
    node: nodeField,
  }),
});

/**
 * This is the type that will be the root of our mutations, and the
 * entry point into performing writes in our schema.
 *
 * This implements the following type system shorthand:
 * type Mutation {
 *   createGame(tag: String!): Game
 *   createPlayer: Player
 * }
 */
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createGame: createGameMutation,
  }),
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export const schema: GraphQLSchema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
