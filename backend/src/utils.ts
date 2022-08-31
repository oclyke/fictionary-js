import {
  MongoClient,
  ServerApiVersion,
} from 'mongodb'

import {
  Database,
} from '.'

const DBNAME = 'fictionary'

export function getDatabase(client: MongoClient, dbname?: string): Database {
  const name = (typeof dbname === 'undefined') ? DBNAME : dbname
  return {
    games: client.db(name).collection('games'),
    users: client.db(name).collection('users'),
    meta: client.db(name).collection('meta'),
  }
}

export async function initializeDatabase(db: Database) {
  // this is to be called on brand-new databases
  const result = await db.games.createIndex({name: 'text'}, {unique: true})
}

export function shuffle<T>(array: Array<T>) {
  // https://bost.ocks.org/mike/shuffle/
  var m = array.length
  let t, i
  while (m) {
    i = Math.floor(Math.random() * m--)
    t = array[m]
    array[m] = array[i]
    array[i] = t
  }
  return array
}
