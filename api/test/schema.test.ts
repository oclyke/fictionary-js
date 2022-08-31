import {
  execute,
  graphql,
  graphqlSync,
} from 'graphql'

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
  DatabaseContextError,
} from '../src/schema/errors'

import {
  schema,
} from '../src/schema'

import {
  ensureMeta,
  updateMeta,
} from '../../backend/src/meta'

import {
  Meta,

  GetGameDocument,
  GetGameQuery,
  GetGameQueryVariables,

  GetMetaDocument,
  GetMetaQuery,
  GetMetaQueryVariables,
} from '../src/generated/schema/types'

import {
  Database,
  MetaModel,
  UserModel,
  GameModel,

  getDatabase,
  initializeDatabase,
  
} from '../../backend/src'



let client: MongoClient
let replset: MongoMemoryReplSet

type ContextType = {
  db: Database
}
let contextValue: ContextType

type InitialData = {
  meta: Partial<MetaModel>
  games: GameModel[]
  users: UserModel[]
}
const initial_data: InitialData = {
  meta: {
    name: 'fictionary-api-schema-test',
    description: 'a version of the fictionary database used for testing the schema',
  },
  games: [],
  users: [],
}

// see docs on jest setup / teardown as well as handling async code
// https://jestjs.io/docs/setup-teardown
// https://jestjs.io/docs/asynchronous
beforeAll(async () => {
  // run before all tests
  replset = await startServer()
  const uri = replset.getUri()
  client = new MongoClient(uri)
  const db: Database = getDatabase(client, 'fictionary-api-test')
  await client.connect()
  await initializeDatabase(db)

  // set the context
  contextValue = {
    db,
  }

  // set up mock data
  // // meta
  await ensureMeta(db)
  await updateMeta(db, initial_data.meta)

  // // games



})

afterAll(async () => {
  // run after all tests
  await client.close()
  await replset.stop()
})

beforeEach(async () => {
  // run before each test
})

test('database context error generated', async () => {
  const noDatabaseContext: { db?: Database } = {...contextValue}
  delete noDatabaseContext.db
  const source = `
  query {
    meta {
      id
    }
  }
  `
  const { errors } = await graphql({ schema, source, contextValue: noDatabaseContext })
  expect(errors).toBeDefined()
  expect(errors).toHaveLength(1)
  expect(errors).toContainEqual<DatabaseContextError>(new DatabaseContextError())
})

test('meta scalars', async () => {
  const source = `
  query {
    meta {
      name
      description
    }
  }
  `
  const { data, errors } = await graphql({ schema, source, contextValue })
  expect(errors).toBeUndefined()
  const meta = (data as any).meta
  expect(meta.name).toBe(initial_data.meta.name)
  expect(meta.description).toBe(initial_data.meta.description)
})

test('meta scalars w/ TypedDocumentNode', async () => {
  const { data, errors } = await execute({
    document: GetMetaDocument,
    schema,
    contextValue,
    variableValues: {

    }
  })

  // the idea here would be to get benefits of static typing
  // using the TypedDocumentNode plugin for graphql-codegen
  //
  // maybe need to look into upgrading 
  // @graphql-codegen/typed-document-node from 2.3.3 to ^3.1.1
  console.log({ data, errors })
  expect(false).toBeTruthy()
})
