import {
  MongoMemoryReplSet,
} from 'mongodb-memory-server'

import {
  MongoClient,
  ObjectId,
} from 'mongodb'

import {
  startServer,
} from './environment'

import {
  Database,
} from '../src'

import {
  getDatabase,
  initializeDatabase,
} from '../src/utils'

import {
  makeMeta,
  ensureMeta,
  updateMeta,
  MetaModel,
} from '../src/meta'

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
})

test('database starts without a meta', async () => {
  await expect(db.meta.findOne({})).resolves.toBeNull()
})

test('meta can be ensured', async () => {
  const expected = makeMeta()
  const meta = await ensureMeta(db)
  expect(meta).toHaveProperty('name', expected.name)
  expect(meta).toHaveProperty('description', expected.description)
})

test('meta can be updated', async () => {
  const expected: Partial<MetaModel> = {
    name: 'a new name for fictionary',
    description: 'a new description for fictionary',
  }
  const meta = await updateMeta(db, expected)
  expect(meta).toHaveProperty('name', expected.name)
  expect(meta).toHaveProperty('description', expected.description)
})
