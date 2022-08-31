import {
  MongoMemoryReplSet
} from 'mongodb-memory-server'

export async function startServer() {
  return new Promise<MongoMemoryReplSet>((resolve, reject) => {
    // see docs for mongodb-memory-server
    // https://github.com/nodkz/mongodb-memory-server
    MongoMemoryReplSet.create({ replSet: { count: 4 } })
    .then(resolve)
    .catch(reject)
  })
}
