// import { expect } from 'chai';
// import { describe, it } from 'mocha';
import { graphqlSync } from 'graphql';

// import { StarWarsSchema as schema } from './starWarsSchema';
import { schema } from '../src/schema';

function testStarWarsEmpireShips() {
  const source = `
  {
    empire {
      name
      ships {
        edges {
          node {
            name
            id
          }
        }
      }
    }
  }
  `
  const result: any = graphqlSync({ schema, source })
  console.log(result.data.empire.ships.edges.map((s: any) => s.node))
  console.log('PARTY')
}
// testStarWarsEmpireShips()


function testSchemaMeta () {
  const source = `
  {
    meta {
      id
      name
    }
  }
  `
  const result: any = graphqlSync({ schema, source })
  console.log(result)
}
const result = testSchemaMeta()
