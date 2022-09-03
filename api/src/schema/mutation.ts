import {
  GraphQLObjectType,
} from 'graphql'

import {
  createGameMutation,
} from './game'

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
export const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createGame: createGameMutation,
  }),
})
