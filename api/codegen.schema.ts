import {
  StarWarsSchema,
} from './starwars/starWarsSchema'

export async function prepare () {
  console.log('preparing...')
  console.log(StarWarsSchema)
  return StarWarsSchema
}
