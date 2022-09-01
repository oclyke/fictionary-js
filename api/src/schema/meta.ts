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

import {
  GameConnection,
} from './game'

/**
 * Define the Meta type.
 *
 * This implements the following type system shorthand:
 * type Meta : Node {
 *   id: ID!
 *   name: String
 *   games(input: listRoomsInput, first: Int, last: Int, after: String, before: String): GameConnection
 *   players(input: listPlayersInput, first: Int, last: Int, after: String, before: String): PlayerConnection
 * }
 */
export const MetaType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Meta',
  description: 'Meta information about fictionary.',
  interfaces: [nodeInterface],
  fields: () => ({
    id: globalIdField(),
    name: {
      type: GraphQLString,
      description: 'The name of fictionary.',
    },
    description: {
      type: GraphQLString,
      description: 'The description of fictionary.',
    },
    players: {
      type: PlayerConnection,
      description: 'The Players who have played fictionary.',
      args: connectionArgs,
      resolve: (meta, args) => {
        // return connectionFromArray(meta.players.map(getPlayer), args)
        return null
      },
    },
    games: {
      type: GameConnection,
      description: 'Individual Games of fictionary.',
      args: connectionArgs,
      resolve: (meta, args) =>
        // connectionFromArray(meta.games.map(getGame), args),
        null,
    },
  }),
});
