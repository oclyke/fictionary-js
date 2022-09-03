import * as path from 'node:path'
import * as fs from 'fs'

import {
  printSchema,
} from 'graphql'

import {
  generate,
} from '@graphql-codegen/cli'

import {
  schema,
} from './src/schema'

const OUTPUT_DIR = path.join(__dirname, 'src/generated/schema')
const type_files = [
  path.join(__dirname, 'src/generated/schema/types.ts'),
  path.join(__dirname, '../frontend/src/generated/schema/types.ts'),
]

async function run () {
  console.log('node is running version: ', process.version)
  
  // prepare the schema in SDL format
  const schemaSDLPath = path.join(OUTPUT_DIR, 'schema.graphql')
  const schemaSDL = printSchema(schema)

  // save the raw SDL
  fs.writeFileSync(schemaSDLPath, schemaSDL);

  // use the schema SDL definition to generate types
  const config = {
    schema: schemaSDL,
    documents: path.join(__dirname, 'src/schema/operations/**/*.graphql'),
    generates: type_files.reduce((acc: any, file) => {
      acc[file] = {
        plugins: [
          'typescript',
          'typescript-resolvers',
          'typescript-operations',
          'typed-document-node',
        ],
      }
      return acc
    }, {}),
  }
  const generatedFiles = await generate(config, true) // true option allows 'generate' to save the files to disk

  // signal completion
  console.log('codegen complete')
}
run()
