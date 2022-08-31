import * as express from 'express'
import * as playground from 'graphql-playground-middleware-express'
import * as expressGraphQL from 'express-graphql'

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
  getDbClient,
} from './db'

import {
  Database,
} from '../../backend/src'

import {
  getDatabase,
} from '../../backend/src/utils';

import {
  schema,
} from './schema'

import {
  start_wss
} from './sessions';

// let's drop Apollo - they seem a little too hand-holdy for me
// (but thanks Apollo - I did start graphql learning with your tutorials after all)
// instead, let's try this stack:
// https://medium.com/swlh/building-a-relay-compliant-schema-with-node-express-7064085f3cc4

export let db: Database;
export let wss: WebSocketServer;

const DEFAULT_SESSION_PORT = 8042;
const DEFAULT_API_PORT = 4000;
const DEFAULT_API_EXPLORER_PATH = '/gql'
const DEFAULT_API_ENDPOINT_PATH = '/graphql'

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

  // graphql server
  const api_server = express();
  api_server.get(DEFAULT_API_EXPLORER_PATH, playground.default({ endpoint: '/graphql' }))
  api_server.use(
    DEFAULT_API_ENDPOINT_PATH,
    expressGraphQL.graphqlHTTP((req, res, graphQLParams) => ({
      schema,
      graphiql: false,
      context: {
        db,
      },
    })),
  )
  api_server.listen(DEFAULT_API_PORT, () => {
    console.log(`API server (graphql) listening on ${DEFAULT_API_PORT}`)
    console.log(`explorer: http://localhost:${DEFAULT_API_PORT}${DEFAULT_API_EXPLORER_PATH}`)
    console.log(`endpoint: http://localhost:${DEFAULT_API_PORT}/graphql`)
  })
};

run();
