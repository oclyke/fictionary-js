import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

import {
  globalIdField,
  connectionFromArray,
  connectionArgs,
} from 'graphql-relay'

import {
  nodeInterface,
} from './node'

import {
  PlayerConnection,
} from './player'

/**
 * Define the Definition type.
 *
 * This implements the following type system shorthand:
 * type Definition : Node {
 *   id: ID!
 *   word: String
 *   definition: String
 *   contributors: PlayerConnection
 * }
 */
export const DefinitionType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Definition',
  description: 'Definition of a word.',
  interfaces: [nodeInterface],
  fields: () => ({
    id: globalIdField(),
    word: {
      type: GraphQLString,
      description: 'The word being defined.',
    },
    definition: {
      type: GraphQLString,
      description: 'The definition of the word.',
    },
    contributorsConnection: {
      type: PlayerConnection,
      description: 'Connection to players who contributed the word to fictionary.',
      args: connectionArgs,
      resolve: (meta, args) =>
        // connectionFromArray(meta.games.map(getGame), args),
        null
    },
  }),
});
