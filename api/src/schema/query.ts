import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
} from 'graphql'

import {
  ObjectId,
} from 'mongodb'

import {
  MetaType,
} from './meta'

import {
  PlayerType,
} from './player'

import {
  GameType,
} from './game'

import {
  nodeField,
} from './node'

import {
  resolverWithDatabase,
} from './utils'

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
export const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    game: {
      type: GameType,
      args: {
        id: {
          type: GraphQLID,
        },
        name: {
          type: GraphQLString,
        },
      },
      resolve: resolverWithDatabase(async (parent, {id, name}, context, info) => {
        let filter: {name?: string, _id?: ObjectId} = {}
        if (typeof name !== 'undefined') { filter.name = name }
        if (typeof id !== 'undefined') { filter._id = new ObjectId(id) }
        const game = await context.db.games.findOne(filter)
        if (!game) { return null }
        return {
          ...game,
          id: game._id.toString(),
        }
      }),
    },
    player: {
      type: PlayerType,
      resolve: (parent, args, context, info) => {
        console.log('trying to get player!')
        console.log({parent, args, info})
        // return getPlayer('0')
        return null
      },
    },
    meta: {
      type: MetaType,
      resolve: resolverWithDatabase((parent, args, context, info) => {
        console.log({ context })
        return 1
      }),
    },
    node: nodeField,
  }),
})
