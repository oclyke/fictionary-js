import {
  ObjectId,
} from 'mongodb';

import {
  connectionFromArray,
} from 'graphql-relay'

import {
  Resolvers,
  Maybe,
  Game,
} from './generated/graphql'

import {
  createGame,
} from '../../backend/src/game'

import {
  db,
} from '.'

import {
  getGame,
} from './schema/game'

export const resolvers: Resolvers = {
  Query: {
    [`gameById`]: async (parent, args) => {
      const game = getGame('0')
      return game
    },
    [`gameByTag`]: async (parent, args) => {
      const game = getGame('0')
      return game
    },
    [`player`]: async (parent, args) => {
      return null
    },
    [`meta`]: async (parent, args) => {
      return null
    },
    [`node`]: async (parent, args) => {
      return null
    },
  },
  Mutation: {
    [`createGame`]: async (parent, args) => {
      const gameModel = await createGame(db, args.input.name)
      const { _id, players } = gameModel
      

      const game: Game = {
        ...gameModel,
        id: (typeof _id === 'undefined') ? '' : _id.toString(),
        players: {
          edges: [],
          pageInfo: {
            startCursor: 'start',
            endCursor: 'end',
            hasNextPage: true,
            hasPreviousPage: false,
          }
        },
        words: []
      }
      
      return {
        game,
        clientMutationId: 'nilch',
      }
    },
  },

  /////////

  Meta: {
    [`id`]: async (parent) => { return parent.id },
    [`name`]: async (parent) => { return parent.name },
    [`description`]: async (parent) => { return parent.description },
    [`games`]: async (parent) => { return parent.games },
    [`players`]: async (parent) => { return parent.players },
  },
  
  Player: {
    [`id`]: async (parent) => { return parent.id },
    [`name`]: async (parent) => { return parent.name },
    [`color`]: async (parent) => { return parent.color },
    [`overallScore`]: async (parent) => { return parent.overallScore },
    [`games`]: async (parent) => { return parent.games },
  },
  Word: {
    [`value`]: async (parent) => { return parent.value },
    [`authorid`]: async (parent) => { return parent.authorid },
    [`voters`]: async (parent) => { return parent.voters },
    [`votes`]: async (parent) => { return parent.votes },
    [`definitions`]: async (parent) => { return parent.definitions },
    [`state`]: async (parent) => { return parent.state },
  },
  Game: {
    [`id`]: async (parent) => { return parent.id },
    [`name`]: async (parent) => { return parent.name },
    [`players`]: async (parent) => { return parent.players },
    [`words`]: async (parent) => { return parent.words },
    [`scores`]: async (parent) => { return parent.scores },
    [`created`]: async (parent) => { return parent.created },
    [`updated`]: async (parent) => { return parent.updated },
  },

  /////////
  
  DefinitionTuple: {
    [`id`]: async (parent) => { return parent.id },
    [`value`]: async (parent) => { return parent.value },
  },
  VoteTuple: {
    [`id`]: async (parent) => { return parent.id },
    [`proposerId`]: async (parent) => { return parent.proposerId },
  },
  ScoreTuple: {
    [`id`]: async (parent) => { return parent.id },
    [`score`]: async (parent) => { return parent.score },
  },

  //////////

  CreateGamePayload: {
    [`clientMutationId`]: async (parent) => { return parent.clientMutationId },
    [`game`]: async (parent) => { return parent.game },
  },


  //////////

  PlayerEdge: {
    [`cursor`]: async (parent) => { return parent.cursor },
    [`node`]: async (parent) => { return parent.node },
  },
  PlayerConnection: {
    [`edges`]: async (parent) => { return parent.edges },
    [`pageInfo`]: async (parent) => { return parent.pageInfo },
  },
  GameEdge: {
    [`cursor`]: async (parent) => { return parent.cursor },
    [`node`]: async (parent) => { return parent.node },
  },
  GameConnection: {
    [`edges`]: async (parent) => { return parent.edges },
    [`pageInfo`]: async (parent) => { return parent.pageInfo },
  },

  //////////

  Node: {
    [`__resolveType`]: async (parent) => { return (typeof parent.__typename === 'undefined') ? null : parent.__typename },
    [`id`]: async (parent) => { return parent.id },
  },
  PageInfo: {
    [`hasPreviousPage`]: async (parent) => { return parent.hasPreviousPage },
    [`hasNextPage`]: async (parent) => { return parent.hasNextPage },
    [`startCursor`]: async (parent) => { return parent.startCursor },
    [`endCursor`]: async (parent) => { return parent.endCursor },
  },
}
