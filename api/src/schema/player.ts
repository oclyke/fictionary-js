import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} from 'graphql'

import {
  globalIdField,
  connectionFromArray,
  connectionArgs,
  connectionDefinitions,
} from 'graphql-relay'

import {
  nodeInterface,
} from './node'

import {
  GameConnection,
} from './game'

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
      args: connectionArgs,
      resolve: (meta, args) =>
        // connectionFromArray(meta.games.map(getGame), args),
        null,
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
});


// the Player type holds information about fictionary players
interface Player {
  id: string
  name: string
  color: string
  overallScore: number
  // gamesHistoryConnection: GameConnection
}
