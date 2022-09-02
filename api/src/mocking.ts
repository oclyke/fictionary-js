import {
  ObjectId,
} from 'mongodb'

import {
  Database,
  MetaModel,
  UserModel,
  GameModel,
} from '../../backend/src'

import {
  ensureMeta,
  updateMeta,
} from '../../backend/src/meta'

// import {
//   WordState,
// } from './generated/schema/types'

export type InitialData = {
  meta: Partial<MetaModel>
  games: GameModel[]
  users: UserModel[]
}

export async function createInitialData (db: Database) {
  const gameid = new ObjectId()
  let initial_data: InitialData = {
    meta: {
      name: 'fictionary-api-schema-test',
      description: 'a version of the fictionary database used for testing the schema',
    },
    games: [
      {
        _id: gameid,
        name: 'test-game-1',
        players: [...new Array(4)].map(_ => new ObjectId()),
        words: [...new Array(3)].map((_, idx) => ({
          value: `word-${idx}`,
          author: new ObjectId(),
          definitions: [],
          state: "OPEN",
          voters: [],
          votes: [],
        })),
        scores: [],
        created: '',
        updated: '',
      }
    ],
    users: [],
  }






  // set up mock data
  // // meta
  await ensureMeta(db)
  await updateMeta(db, initial_data.meta)

  // // games
  initial_data.games.forEach(async g => {
    db.games.insertOne(g)
  })

  // // users
  initial_data.games[0].players.forEach(async (id, idx) => {
    const user: UserModel = {
      _id: id,
      name: `user-${idx}`,
      color: `${idx}`,
      overallScore: 0,
      games: [gameid],
    }
    initial_data.users.push(user)
    await db.users.insertOne(user)
  })

  return initial_data
}
