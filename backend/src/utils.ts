import {
  MongoClient,
  ServerApiVersion,
} from 'mongodb';

import {
  MongoMemoryReplSet
} from 'mongodb-memory-server';

import {
  Database,
} from '.';

export {
  shuffle,

  startServer,
  getDatabase,
  initializeDatabase,
  getDbClient,
}

const DBNAME = 'fictionary';

function memorydb_allowed() {
  return (typeof process.env.ALLOW_MEMORY_DB !== 'undefined') ? true : false;
}

async function getDbClient() {
  let client;
  if (process.env.NODE_ENV === 'development'){
    console.log('using in-memory mongodb');
    const mongoserver = await startServer();
    const uri = mongoserver.getUri();
    client = new MongoClient(uri);
    
  } else if (process.env.NODE_ENV === 'production') {

    console.log('connecting to remote database');
    if (typeof process.env.DB_PASSWORD === 'undefined') {
      throw new Error('DB_PASSWORD not defined');
    }
    if (typeof process.env.DB_USERNAME === 'undefined') {
      throw new Error('DB_USERNAME not defined');
    }

    const DB_PASSWORD = process.env.DB_PASSWORD;
    const DB_USERNAME = process.env.DB_USERNAME;
    const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@oclyke-sandboc.k8ns8.gcp.mongodb.net/?retryWrites=true&w=majority`;
    client = new MongoClient(uri, { /*useNewUrlParser: true, useUnifiedTopology: true,*/ serverApi: ServerApiVersion.v1 });

  } else {
    throw new Error('unknown environment');
  }

  return client;
}

async function startServer() {
  return new Promise<MongoMemoryReplSet>((resolve, reject) => {
    if((process.env.NODE_ENV === 'production') && (!memorydb_allowed())){
      reject('memory server not allowed');
    }

    // see docs for mongodb-memory-server
    // https://github.com/nodkz/mongodb-memory-server
    MongoMemoryReplSet.create({ replSet: { count: 4 } })
    .then(resolve)
    .catch(reject);
  });
}

function getDatabase(client: MongoClient) {
  const db: Database = {
    games: client.db(DBNAME).collection('games'),
    users: client.db(DBNAME).collection('users'),
  };
  return db;
}

async function initializeDatabase(db: Database) {
  // this is to be called on brand-new databases
  const result = await db.games.createIndex({name: 'text'}, {unique: true});
}

function shuffle<T>(array: Array<T>) {
  // https://bost.ocks.org/mike/shuffle/
  var m = array.length
  let t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}
