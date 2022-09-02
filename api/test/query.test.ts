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
  schema,
} from '../src/schema'

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

test('game by name returns expected name', async () => {
  const game_name = initial_data.games[0].name
  const source = `
  query {
    game(name: "${game_name}") {
      name
    }
  }
  `
  const { data } = await graphql({ schema, source, contextValue })
  const game = (data as any).game
  expect(game.name).toEqual(game_name)
})

test('game by name returns players', async () => {
  const game_name = initial_data.games[0].name
  const source = `
  query {
    game(name: "${game_name}") {
      name
      players {
        edges {
          node {
            id
          }
        }
      }
    }
  }
  `
  const { data } = await graphql({ schema, source, contextValue })

  console.log(data)

  const game = (data as any).game
  expect(game.name).toEqual(game_name)
  expect(game.players.edges).toHaveLength(initial_data.games[0].players.length)
})

test('big game query', async () => {
  const game_name = initial_data.games[0].name
  const source = `
  query {
    game(name: "${game_name}") {
      name
      players {
        edges {
          node {
            id
            name
            color
            overallScore
            games {
              edges {
                node {
                  name
                  id
                }
              }
            }
          }
        }
        pageInfo {
          startCursor
          endCursor
        }
      }
    }
  }
  `
  const { data } = await graphql({ schema, source, contextValue })

  const game = (data as any).game
  expect(game.name).toEqual(game_name)
})
