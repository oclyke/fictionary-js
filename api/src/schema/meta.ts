import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

import {
  globalIdField,
} from 'graphql-relay'

import {
  nodeInterface,
} from './node'

import {
  PlayerConnection,
  PlayerFilterInputType,
  playerConnectionFromCursor,
} from './player'

import {
  GameConnection,
  GameFilterInputType,
  gameConnectionFromCursor,
} from './game'

import {
  resolverWithDatabase,
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
      resolve: resolverWithDatabase(async (meta, args, context) => {
        if (args.paged) {
          // handle pagination requests here
        }
        if (args.filter) {
          // handle filter requests here
        }
        const cursor = context.db.users.find()
        return await playerConnectionFromCursor(cursor)
      }),
    },
    games: {
      type: GameConnection,
      description: 'Individual Games of fictionary.',
      args: {
        paged: {
          type: PaginationInputType,
        },
        filter: {
          type: GameFilterInputType,
        }
      },
      resolve: resolverWithDatabase(async (meta, {paged, filter}, context, info) => {
        // const {first, last, before, after} = paged
        // const { name } = filter
        const cursor = context.db.games.find()
        return await gameConnectionFromCursor(cursor)
      }),
    },
  }),
});
