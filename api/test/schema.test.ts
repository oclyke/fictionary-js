import {
  graphql,
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


test('meta', async () => {
  const source = `
  query {
    meta {
      name
      description
    }
  }
  `
  const { data: { meta: { description, name} } }: any = await graphql({ schema, source })
  expect(name).toBe('fictionary')
  expect(description).toBe('a game of camouflage, misdirection, and astonishment in which players guess the true definition of obscure words')
})
