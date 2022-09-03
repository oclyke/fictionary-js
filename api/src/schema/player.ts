import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLInputObjectType,
} from 'graphql'

import {
  globalIdField,
  connectionDefinitions,
} from 'graphql-relay'

import {
  FindCursor,
  WithId,
} from 'mongodb'

import {
  nodeInterface,
} from './node'

import {
  GameConnection,
  GameFilterInputType,
} from './game'

import {
  resolverWithDatabase,
  StringFilterInputType,
  PaginationInputType,
} from './utils'

import {
  UnimplementedError,
} from './errors'

import {
  UserModel,
} from '../../../backend/src/user'

/**
 * Define the Player type.
 *
 * This implements the following type system shorthand:
 * type Player : Node {
 *   id: ID!
 *   name: String
 *   color: String
 *   overallScore: Int
 *   gamesHistoryConnection: GameConnection
 * }
 */
export const PlayerType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Player',
  description: 'Player information.',
  interfaces: [nodeInterface],
  fields: () => ({
    id: globalIdField(),
    name: {
      type: GraphQLString,
      description: 'The players name.',
    },
    color: {
      type: GraphQLString,
      description: 'The description of fictionary.',
    },
    overallScore: {
      type: GraphQLInt,
      description: 'The players overall score.',
    },
    // note: so far it has been impossible to keep a direct connection
    // straight to previous game types, due to the inclusion of a circular
    // dependency Player.games.edges.nodes.Game.players.Player.games 
    // and so on...
    // some folk say that TypeScript can support circular type dependencies:
    // https://stackoverflow.com/questions/36966444/how-to-create-a-circularly-referenced-type-in-typescript
    // https://github.com/Microsoft/TypeScript/issues/3496
    // 
    // hmmm... is this the fix??
    // https://github.com/graphql/graphql-spec/issues/91
    //
    // or perhaps the solution was in fact to break the circular dependency as it pertained between
    // the model and the view:
    // https://www.graphql-code-generator.com/plugins/typescript/typescript-resolvers
    // https://youtu.be/tHMaNmqPIC4
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
      resolve: resolverWithDatabase( async (player, args, context, info) => {
        if (typeof args.paged !== 'undefined') {
          throw new UnimplementedError('pagination for games on Player')
        }
        if (typeof args.filter !== 'undefined') {
          throw new UnimplementedError('filter for games on Player')
        }

        const game_ids_subset = player.games // eventually we will be able to choose a subset according to pagination and filter requests
        const cursor = context.db.games.find({_id: {$in: game_ids_subset }})
        // once again this is *NOT* the ideal way to do this - need to find a reasonable way for the server to decide how many documents 
        // to return at once (or possibly just assume a small number like 5 and rely on the client to specify larger values when needed)
        const games = await cursor.toArray()

        return {
          edges: games.map(g => ({
            node: {
              ...g,
              id: g._id.toString(),
            },
            cursor: g._id.toString(),
          })),
          pageInfo: {
            startCursor: 'seventeen',
            endCursor: 'twenty-six',
          }
        }
      }),
    },
  }),
});

/**
 * We define a connection between a Game and its Players.
 *
 * connectionType implements the following type system shorthand:
 *   type PlayerConnection {
 *     edges: [PlayerEdge]
 *     pageInfo: PageInfo!
 *   }
 *
 * connectionType has an edges field - a list of edgeTypes that implement the
 * following type system shorthand:
 *   type PlayerEdge {
 *     cursor: String!
 *     node: Player
 *   }
 */
export const { connectionType: PlayerConnection } = connectionDefinitions({
  nodeType: PlayerType,
  // resolveCursor: (parent, args, context, info) => {
  //   // using the resolveCursor resolver could... uh... well I just don't quite know yet!
  // },
  // resolveNode: (parent, args, context, info) => {
  //   // using the resolveNode resolver could be helpful if, perhaps, the node type
  //   // was nonstandard or if there were edge-related information to extract?
  // }
});


export function playerFromModel (model: WithId<UserModel>) {
  return {
    ...model,
    id: model._id.toString()
  }
}

export async function playerConnectionFromCursor (cursor: FindCursor<WithId<UserModel>>) {
  // todo: replace this with a proper way of converting mongodb cursor to games result
  const users = (await cursor.toArray()).map(playerFromModel)

  // i am also not sure exactly how the server should decide how many documents to return to the client -- 
  // it seems like it could be arbitrary??? (e.g. the client asks for 10e13 but the server says thats whack
  // and just gives it 69 instead...)
  // oh well, for now I will make the cursor into an array and return that haha

  return {
    edges: users.map(u => ({
      node: u,
      cursor: u.id,
    })),
    pageInfo: {
      startCursor: 'seventeen',
      endCursor: 'twenty-six',
    }
  }
}

/**
 * Define a filter type for Players.
 */
export const PlayerFilterInputType = new GraphQLInputObjectType({
  name: 'PlayerFilterInput',
  fields: () => ({
    name: {
      type: StringFilterInputType,
    },
  }),
})
