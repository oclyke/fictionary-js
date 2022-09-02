import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInputObjectType,
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
  PlayerFilterInputType,
} from './player'

import {
  GameConnection,
} from './game'

import {
  PaginationInputType,
} from './utils'

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
      args: {
        paged: {
          type: PaginationInputType,
        },
        filter: {
          type: PlayerFilterInputType,
        }
      },
      resolve: (meta, args) => {
        if (args.paged) {
          // handle pagination requests here
        }
        if (args.filter) {
          // handle filter requests here
        }
        return {
          pageInfo: {
            start: 'start cursor',
            end: 'end cursor',
            hasNextPage: false,
            hasPreviousPage: false,
          },
          edges: [1, 69], // you would instead use use a query on mongodb here to transform some cursor into the edges which to return
        }
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
