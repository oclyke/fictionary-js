import {
  graphqlSync,
} from 'graphql'

import {
  schema,
} from '../src/schema'


// see docs on jest setup / teardown as well as handling async code
// https://jestjs.io/docs/setup-teardown
// https://jestjs.io/docs/asynchronous
beforeAll(async () => {
  // run before all tests
})

afterAll(async () => {
  // run after all tests
})

beforeEach(async () => {
  // run before each test
})


test('empire', async () => {

  // const source = `
  // {
  //   empire {
  //     name
  //     ships {
  //       edges {
  //         node {
  //           name
  //           id
  //         }
  //       }
  //     }
  //   }
  // }
  // `
  // const result: any = graphqlSync({ schema, source })
  // console.log(result.data.empire.ships.edges.map((s: any) => s.node))
  // console.log('PARTY')

  expect(false).toBeTruthy()

  // await expect(get_user(db, new ObjectId('000000000000000000000000'))).resolves.toBeNull();
})


test('meta object', async () => {
  // const source = `
  // {
  //   meta {
  //     id
  //     name
  //   }
  // }
  // `
  // const result: any = graphqlSync({ schema, source })
  // console.log(result)

  expect(false).toBeTruthy()
})
