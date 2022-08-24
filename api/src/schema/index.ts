import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLList,
} from 'graphql'

import {
  nodeDefinitions,
  globalIdField,
  fromGlobalId,

  connectionFromArray,

  connectionArgs,
  connectionDefinitions,

  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  getMeta,
} from './meta'

import {
  getPlayer,
} from './player'

import {
  getGame,
} from './game'

/**
 * Using our shorthand to describe type systems, the type system for our
 * example will be the following: (see schema.gql)
 */

/**
 * We get the node interface and field from the relay library.
 *
 * The first method is the way we resolve an ID to its object. The second is the
 * way we resolve an object that implements node to its type.
 */
const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId)
    switch (type) {
      case 'Meta':
        return getMeta(id)
      case 'Definition':
        return (() => { console.warn('unimplemented'); return undefined })()
      case 'Player':
        return (() => { console.warn('unimplemented'); return undefined })()
      case 'Game':
        return (() => { console.warn('unimplemented'); return undefined })()
    }
  },
  (obj) => {
    if (obj.____typename === null || typeof obj.____typename === 'undefined') {
      throw new Error('could not identify object\'s type with \'____typename\' field')
    }
    return obj.____typename
  },
);

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
const PlayerType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Player',
  description: 'Player information.',
  interfaces: [nodeInterface],
  fields: () => ({
    id: globalIdField(),
    name: {
      type: GraphQLString,
      description: 'The players name.',
    },
    description: {
      type: GraphQLString,
      description: 'The description of fictionary.',
    },
    color: {
      type: GraphQLString,
      description: 'The description of fictionary.',
    },
    overallScore: {
      type: GraphQLInt,
      description: 'The players overall score.',
    },
    gameHistoryConnection: {
      type: gameConnection,
      description: 'Individual Games of fictionary.',
      args: connectionArgs,
      resolve: (meta, args) =>
        connectionFromArray(meta.games.map(getGame), args),
    },
  }),
});

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
const DefinitionType: GraphQLObjectType = new GraphQLObjectType({
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
      type: playerConnection,
      description: 'Connection to players who contributed the word to fictionary.',
      args: connectionArgs,
      resolve: (meta, args) =>
        connectionFromArray(meta.games.map(getGame), args),
    },
  }),
});

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
 const GameType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Game',
  description: 'Definition of a word.',
  interfaces: [nodeInterface],
  fields: () => ({
    id: globalIdField(),
    name: {
      type: GraphQLString,
      description: 'The name of the game.',
    },
    playersConnection: {
      type: playerConnection,
      description: 'Connection to players who participated in the game.',
      args: connectionArgs,
      resolve: (game, args) =>
        connectionFromArray(game.players.map(getPlayer), args),
    },
    words: {
      type: WordType,
      description: 'Words of the game.',
      resolve: (game, args) =>
        connectionFromArray(game.words, args),
    },
    scores: {
      type: ScoreTupleType,
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
 * Define the Word type.
 *
 * This implements the following type system shorthand:
 * type Word {
 *   value: String!
 *   authorid: ID! # the author's id is used to find the 'true' definition
 *   voters: [ID!]!
 *   definitions: [DefinitionTuple!]!
 *   votes: [VoteTuple!]!
 *   state: WordState!
 * }
 */
 const WordType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Word',
  description: 'In-game Word information.',
  fields: () => ({
    value: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'the '
    },
    authorid: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The ID of the author of the Word.',
    },
    voters: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
      description: 'IDs of players who are allowed to vote on this Word.'
    },
    definitions: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(DefinitionTupleType))),
      description: 'Proposed definitions of the word.'
    },
    votes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(VoteTupleType))),
      description: 'Votes cast for various definitions by eligible players.'
    },
    state: {
      type: new GraphQLNonNull(WordStateType),
      description: 'The Word state.'
    },
  }),
});

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
const MetaType: GraphQLObjectType = new GraphQLObjectType({
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
      type: playerConnection,
      description: 'The Players who have played fictionary.',
      args: connectionArgs,
      resolve: (meta, args) =>
        connectionFromArray(meta.players.map(getPlayer), args),
    },
    games: {
      type: gameConnection,
      description: 'Individual Games of fictionary.',
      args: connectionArgs,
      resolve: (meta, args) =>
        connectionFromArray(meta.games.map(getGame), args),
    },
  }),
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
 * Define the DefinitionTuple type.
 *
 * This implements the following type system shorthand:
 * type DefinitionTuple {
 *   id: ID!         # id of proposer
 *   value: String!  # definition
 * }
 */
 const DefinitionTupleType: GraphQLObjectType = new GraphQLObjectType({
  name: 'DefinitionTuple',
  description: 'Definition information.',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The ID of the player whose definition is recorded in the tuple.',
    },
    value: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The definition associated with this ID.',
    },
  }),
});

/**
 * Define the DefinitionTuple type.
 *
 * This implements the following type system shorthand:
 * type VoteTuple {
 *   id: ID!         # id of voter
 *   proposerId: ID! # id of proposer to which the vote goes
 * }
 */
 const VoteTupleType: GraphQLEnumType = new GraphQLEnumType({
  name: 'VoteTuple',
  description: 'Vote information.',
  values: {
    OPEN: {
      description: 'Word is open for definition proposal.',
    },
    VOTING: {
      description: 'Word is closed for definition proposal and is in voting period.',
    },
    CLOSED: {
      description: 'Word is closed and may be used to compute scores.',
    },
  }
});

/**
 * Define the WordState type.
 *
 * This implements the following type system shorthand:
 * type VoteTuple {
 *   id: ID!         # id of voter
 *   proposerId: ID! # id of proposer to which the vote goes
 * }
 */
 const WordStateType: GraphQLObjectType = new GraphQLObjectType({
  name: 'WordState',
  description: 'Word state information.',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The ID of the player whose vote is recorded in the tuple.',
    },
    proposerId: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the proposer whose definition is voted for.',
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
const { connectionType: playerConnection } = connectionDefinitions({
  nodeType: PlayerType,
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
const { connectionType: gameConnection } = connectionDefinitions({
  nodeType: GameType,
});

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
    gameById: {
      type: GameType,
      resolve: () => { console.warn('unimplemented'); return getGame('0') },
    },
    gameByTag: {
      type: GameType,
      resolve: () => { console.warn('unimplemented'); return getGame('0') },
    },
    player: {
      type: PlayerType,
      resolve: () => { console.warn('unimplemented'); return getPlayer('0') },
    },
    meta: {
      type: MetaType,
      // resolve: () => { console.warn('unimplemented'); return getMeta('naught') },
      resolve: () => ({id: "sdfsdf"}),
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
 *   createRoom(tag: String!): Room
 *   createPlayer: Player
 * }
 */
 const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // introduceShip: shipMutation,
  }),
});


/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export const schema: GraphQLSchema = new GraphQLSchema({
  query: queryType,
  // mutation: mutationType,
});
