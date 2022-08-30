import {
  MongoMemoryReplSet,
} from 'mongodb-memory-server'

import {
  MongoClient,
  ObjectId,
} from 'mongodb'

import {
  Database,
} from '../src'

import {
  getDatabase,
  initializeDatabase,
  startServer,
} from '../src/utils'

import {
  createGame,
  getGame,
  getGameByName,
  deleteGame,
} from '../src/game'

let db: Database
let client: MongoClient
let replset: MongoMemoryReplSet

const game_tag = 'test_game'

// see docs on jest setup / teardown as well as handling async code
// https://jestjs.io/docs/setup-teardown
// https://jestjs.io/docs/asynchronous
beforeAll(async () => {
  replset = await startServer()
  const uri = replset.getUri()
  client = new MongoClient(uri)
  db = getDatabase(client)
  await client.connect()
  await initializeDatabase(db)
})

afterAll(async () => {
  await client.close()
  await replset.stop()
})

beforeEach(async () => {
  // make sure each test starts with clean collections
  await db.games.deleteMany({})
  await db.users.deleteMany({})
})

test('invalid games are not found', async () => {
  await expect(getGame(db, new ObjectId('000000000000000000000000'))).resolves.toBeNull()
})

test('games can be created', async () => {
  const game = await createGame(db, game_tag)
  expect(game).toHaveProperty('name', game_tag)
  expect(game._id).toBeInstanceOf(ObjectId)

})

test('two identical tags to fail', async () => {
  await createGame(db, game_tag)
  await expect(createGame(db, game_tag)).rejects.toThrow('duplicate key error')
})

test('games can be recovered', async () => {
  const { _id } = await createGame(db, game_tag)
  await expect(getGame(db, new ObjectId(_id))).resolves.toHaveProperty('_id', _id)
})

test('games can be recovered by tag', async () => {
  const special_tag = 'unique_game_tag'
  await createGame(db, special_tag)
  await expect(getGameByName(db, special_tag)).resolves.toHaveProperty('name', special_tag)
})

test('games can be deleted', async () => {
  const { _id } = await createGame(db, game_tag)
  await expect(getGame(db, _id)).resolves.toHaveProperty('_id', _id)
  await deleteGame(db, _id)
  await expect(getGame(db, _id)).resolves.toBeNull()
})
