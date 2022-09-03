import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLInputObjectType,
} from 'graphql'

import {
  globalIdField,
  connectionFromArray,
  connectionDefinitions,
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  FindCursor,
  WithId,
} from 'mongodb'

import {
  nodeInterface,
} from './node'

import {
  PlayerConnection,
  PlayerFilterInputType,
  playerConnectionFromCursor,
} from './player'

import {
  WordType,
} from './word'

import {
  resolverWithDatabase,
  mutatorWithDatabase,
  PaginationInputType,
  StringFilterInputType,
} from './utils'

import {
  UnimplementedError,
} from './errors'

import {
  createGame,
  GameModel,
} from '../../../backend/src/game'

/**
 * Define the Game type.
 *
 * This implements the following type system shorthand:
 * type Game : Node {
 *   id: ID!
 *   name: String!
 *   players: PlayerConnection
 *   words: [Word!]!
 *   scores: [ScoreTuple!]!
 *   created: String!
 *   updated: String!

 *   addPlayer(userid: ID!): AddPlayerPayload
 * }
 */
export const GameType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Game',
  description: 'Definition of a word.',
  interfaces: [nodeInterface],
  fields: () => ({
    id: globalIdField(),
    name: {
      type: GraphQLString,
      description: 'The name of the game.',
    },
    players: {
      type: PlayerConnection,
      description: 'Connection to players who participated in the game.',
      args: {
        paged: {
          type: PaginationInputType,
        },
        filter: {
          type: PlayerFilterInputType,
        }
      },
      resolve: resolverWithDatabase( async (game, args, context, info) => {
        if (typeof args.paged !== 'undefined') {
          throw new UnimplementedError('pagination for players on Game')
        }
        if (typeof args.filter !== 'undefined') {
          throw new UnimplementedError('filter for players on Game')
        }
        console.log('heres where you should pay attention to pagination and filtering of connections!')
        const player_ids_subset = game.players // eventually we will be able to choose a subset according to pagination and filter requests

        const cursor = context.db.users.find({_id: {$in: player_ids_subset }})
        return await playerConnectionFromCursor(cursor)
      }),
    },
    words: {
      type: new GraphQLList(WordType),
      description: 'Words of the game.',
      resolve: (game, args) =>
        connectionFromArray(game.words, args),
    },
    scores: {
      type: new GraphQLList(ScoreTupleType),
      description: 'Words of the game.',
      resolve: (game, args) =>
        connectionFromArray(game.words, args),
    },
    created: {
      type: GraphQLString,
      description: 'Date of game creation.',
    },
    updated: {
      type: GraphQLString,
      description: 'Date when game was last updated.',
    },
  }),
});

/**
 * We define a connection to Games.
 *
 * connectionType implements the following type system shorthand:
 *   type GameConnection {
 *     edges: [GameEdge]
 *     pageInfo: PageInfo!
 *   }
 *
 * connectionType has an edges field - a list of edgeTypes that implement the
 * following type system shorthand:
 *   type GameEdge {
 *     cursor: String!
 *     node: Game
 *   }
 */
export const { connectionType: GameConnection } = connectionDefinitions({
  nodeType: GameType,
});

/**
 * Define the ScoreTuple type.
 *
 * This implements the following type system shorthand:
 * type ScoreTuple {
 *   id: ID!         # id of player
 *   score: Int!     # score of the player
 * }
 */
const ScoreTupleType: GraphQLObjectType = new GraphQLObjectType({
  name: 'ScoreTuple',
  description: 'Scoring information.',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The ID of the player whose score is recorded in the tuple.',
    },
    score: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The score associated with this ID.',
    },
  }),
});

/**
 * This will return a GraphQLFieldConfig for our createGame
 * mutation.
 *
 * It creates these two types implicitly:
 *   input CreateGameInput {
 *     clientMutationId: string
 *     name: string!
 *   }
 *
 *   type CreateGamePayload {
 *     clientMutationId: string
 *     game: Game
 *   }
 */
export const createGameMutation = mutationWithClientMutationId({
  name: 'CreateGame',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    game: {
      type: GameType,
      resolve: async (payload, args, context, info) => payload,
    },
  },
  mutateAndGetPayload: mutatorWithDatabase(async ({ name }, context, info) => {
    const game = await createGame(context.db, name)
    return {
      ...game,
      id: game._id.toString(),
    }
  }),
});

export function gameFromModel (model: WithId<GameModel>) {
  return {
    ...model,
    id: model._id.toString()
  }
}

export async function gameConnectionFromCursor (cursor: FindCursor<WithId<GameModel>>) {
  // todo: replace this with a proper way of converting mongodb cursor to games result
  const games = (await cursor.toArray()).map(gameFromModel)

  return {
    edges: games.map(g => ({
      node: g,
      cursor: g.id,
    })),
    pageInfo: {
      startCursor: 'donkykong',
      endCursor: 'diddykong',
    }
  }
}

/**
 * Define a filter type for Players.
 */
 export const GameFilterInputType = new GraphQLInputObjectType({
  name: 'GameFilterInput',
  fields: () => ({
    name: {
      type: StringFilterInputType,
    },
  }),
})
