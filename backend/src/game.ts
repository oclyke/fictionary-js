import {
  ObjectId,
  OptionalId,
  WithId,
} from 'mongodb'

import {
  Database,
} from '.'

export type GameModel = OptionalId<{
  name: string
  players: ObjectId[]
  words: {
    value: string
    author: ObjectId
    voters: ObjectId[]
    definitions: {
      id: ObjectId
      value: string
    }[]
    votes: {
      id: ObjectId
      proposerId: string
    }[]
    state: 'OPEN' | 'VOTING' | 'CLOSED'
  }[]
  scores: {
    id: ObjectId
    score: number
  }[]
  created: string
  updated: string
}>


function makeGameObject(name: string): GameModel {
  const now = new Date().toString()
  return {
    name,
    players: [],
    words: [],
    scores: [],
    created: now,
    updated: now,
  }
}

export async function findGame(db: Database, filters?: {}) {
  return db.games.find()
}

export async function createGame(db: Database, name: string): Promise<WithId<GameModel>> {
  const game = makeGameObject(name)
  const { insertedId } = await db.games.insertOne(game)
  return {
    ...game,
    _id: insertedId,
  }
}

export async function getGame(db: Database, _id: ObjectId) {
  return await db.games.findOne({_id})
}

export async function getGameByName(db: Database, name: string) {
  return await db.games.findOne({name})
}

export async function deleteGame(db: Database, _id: ObjectId) {
  return await db.games.deleteOne({_id})
}

export async function addPlayerToGame(db: Database, _id: ObjectId, playerid: ObjectId) {
  const { value: game } = await db.games.findOneAndUpdate({_id}, {$push: {players: playerid}}, {returnDocument: 'after'})
  return game
}
