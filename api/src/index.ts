import {
  ApolloServer,
} from 'apollo-server';

import {
  WebSocketServer,
  WebSocket,
} from 'ws';

import {
  createServer
} from 'https';

import {
  readFileSync
} from 'fs';

import {
  Database,
} from '../../backend/src'

import {
  getDbClient,
  getDatabase,
} from '../../backend/src/utils';

// import {
//   get_schema,
// } from './utils';

import {
  resolvers,
} from './resolvers';

import {
  schema,
} from './schema'

import {
  start_wss
} from './sessions';

export let db: Database;
export let wss: WebSocketServer;

const DEFAULT_SESSION_PORT = 8042;

function session_using_ssl() {
  return (typeof process.env.SESSION_BYPASS_SSL !== 'undefined') ? false : true;
}

const run = async () => {
  // print debug info
  console.log('starting api')
  console.log('NODE_ENV: ', process.env.NODE_ENV)
  console.log('Session websockets using SSL: ', session_using_ssl());

  // database connection
  const client = await getDbClient();
  try {
    await client.connect();
  } catch (e) {
    console.error('ERROR - db client not connected - ', e);
  }
  db = getDatabase(client);

  // websocket server
  const SESSION_PORT = (typeof process.env.SESSION_PORT !== 'undefined') ? parseInt(process.env.SESSION_PORT) : DEFAULT_SESSION_PORT;
  if(!session_using_ssl()) {
    const wss = new WebSocketServer({ port: SESSION_PORT });
    start_wss(wss);
  } else {
    if (typeof process.env.SSL_CERT === 'undefined') {
      throw new Error('SSL_CERT path not provided in .env');
    }
    if (typeof process.env.SSL_KEY === 'undefined') {
      throw new Error('SSL_KEY path not provided in .env');
    }

    const server = createServer({
      cert: readFileSync(process.env.SSL_CERT),
      key: readFileSync(process.env.SSL_KEY),
    });
    const wss = new WebSocketServer({ server });
    start_wss(wss);
    server.listen(SESSION_PORT);
  }
  console.log(`session websocket server listening on wss://localhost:${SESSION_PORT}`);

  console.warn('ARE YOU USING YOUR RESOLVERS? THAT MIGHT BE CONFUSING YOU... if resolvers is commented out then you might be relying on resolvers defined in code... (schema/index.ts)')

  // graphql server
  const server = new ApolloServer({
    persistedQueries: false,
    typeDefs: schema,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      return { token };
    },
  });
  const server_info = await server.listen();
  console.log(`listening on ${server_info.url}`)
};

run();
