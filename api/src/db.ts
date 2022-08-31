import {
  MongoClient,
  ServerApiVersion,
} from 'mongodb'

import {
  MongoMemoryReplSet
} from 'mongodb-memory-server'

import {
  getDatabase,
  initializeDatabase,
} from '../../backend/src'

async function startMemoryServer() {
  return new Promise<MongoMemoryReplSet>((resolve, reject) => {
    // see docs for mongodb-memory-server
    // https://github.com/nodkz/mongodb-memory-server
    MongoMemoryReplSet.create({ replSet: { count: 4 } })
    .then(resolve)
    .catch(reject)
  })
}


export async function getDbClient() {
  let client
  if (process.env.NODE_ENV === 'development') {
    // in development create a new in-memory server replset
    const replset = await startMemoryServer()
    const uri = replset.getUri()
    client = new MongoClient(uri)
    const db = getDatabase(client)
    await client.connect()
    await initializeDatabase(db)

  } else if (process.env.NODE_ENV === 'production') {
    // in production connect to the existing database server
    console.log('connecting to remote database')
    if (typeof process.env.DB_PASSWORD === 'undefined') {
      throw new Error('DB_PASSWORD not defined')
    }
    if (typeof process.env.DB_USERNAME === 'undefined') {
      throw new Error('DB_USERNAME not defined')
    }

    const DB_PASSWORD = process.env.DB_PASSWORD
    const DB_USERNAME = process.env.DB_USERNAME
    const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@oclyke-sandboc.k8ns8.gcp.mongodb.net/?retryWrites=true&w=majority`
    client = new MongoClient(uri, { /*useNewUrlParser: true, useUnifiedTopology: true,*/ serverApi: ServerApiVersion.v1 })
  } else {
    throw new Error('unknown environment')
  }

  return client
}
