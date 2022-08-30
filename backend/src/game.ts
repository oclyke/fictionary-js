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
  players: string[]
  words: {
    value: string
    author: string
    voters: string[]
    definitions: {
      id: string
      value: string
    }[]
    votes: {
      id: string
      proposerId: string
    }[]
    state: 'OPEN' | 'VOTING' | 'CLOSED'
  }[]
  scores: {
    id: string
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

// export async function addPlayerToGame(db: Database, _id: ObjectId, userid: ObjectId) {
//   const player = {...makeUser(), _id: userid.toString()}
//   const {value} = await db.games.findOneAndUpdate({_id}, {$push: {players: player}}, {returnDocument: 'after'})
//   return value
// }
