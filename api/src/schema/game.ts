import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql'

import {
  globalIdField,
  connectionFromArray,
  connectionArgs,
  connectionDefinitions,
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  nodeInterface,
} from './node'

import {
  PlayerConnection,
} from './player'

import {
  WordType,
} from './word'

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
      args: connectionArgs,
      resolve: (game, args) =>
        // connectionFromArray(game.players.map(getPlayer), args),
        null,
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
