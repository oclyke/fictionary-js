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
  nodeInterface,
} from './node'

import {
  PlayerConnection,
  PlayerFilterInputType,
} from './player'

import {
  WordType,
} from './word'

import {
  resolverWithDatabase,
  PaginationInputType,
  StringFilterInputType,
} from './utils'

import {
  UnimplementedError,
} from './errors'

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
        
        // i am also not sure exactly how the server should decide how many documents to return to the client -- 
        // it seems like it could be arbitrary??? (e.g. the client asks for 10e13 but the server says thats whack
        // and just gives it 69 instead...)
        // oh well, for now I will make the cursor into an array and return that haha
        const users = await cursor.toArray()

        // it would be nice to build a generic "connectionFromMongoDbCursor" function in the future...
        return {
          pageInfo: {
            start: 'the beginning cursor',
            end: 'the conclusion cursor',
            hasNextPage: false,
            hasPreviousPage: false,
          },
          edges: users.map(u => ({
            node: {
              ...u,
              id: u._id.toString(),
            },
            cursor: u._id.toString(), // I'm not sure if I can just use the mongodb id as the cursor... need to check on this
          }))
        }
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
      // resolve: (payload) => getGame(payload.gameid),
      resolve: (payload) => null,
    },
  },
  mutateAndGetPayload: ({ name }) => {
    // const newGame = createGame(name);
    // return {
    //   gameid: newGame.id,
    // };
    return null
  },
});

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
