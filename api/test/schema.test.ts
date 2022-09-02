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
  GetMetaDocument,
} from '../src/generated/schema/types'

import {
  Database,
  getDatabase,
  initializeDatabase,
} from '../../backend/src'

import {
  InitialData,
  createInitialData,
} from '../src/mocking'

let client: MongoClient
let replset: MongoMemoryReplSet

type ContextType = {
  db: Database
}
let contextValue: ContextType

let initial_data: InitialData

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

  initial_data = await createInitialData(db)
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
  const meta = (data as any).meta // this cast to any is kind of nasty... see https://github.com/dotansimha/graphql-typed-document-node/issues/68
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
