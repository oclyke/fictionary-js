/*
// This file is subject to the terms and conditions defined in
// file 'LICENSE.md', which is part of this source code package.
*/

import { ApolloServer } from 'apollo-server';
import { WebSocketServer, WebSocket } from 'ws';

import {
  Collection,
  ObjectID,
} from 'mongodb';

import typeDefs from './schema/definition';
import resolvers from './resolvers';

import {
  User,
  Room,
} from './schema/implementation';

import {
  debug,
} from './utility';

import {
  collections,
  connectMongo,
} from './db';

debug.log(`rapid-trex welcome! NODE_ENV: ${process.env.NODE_ENV}`);

type ExtendedWebSocket = WebSocket & {isAlive?: boolean, roomID?: string};
type Clients = ExtendedWebSocket[]
type Session = {clients: Clients, room?: Room}
type Sessions = { [key: string]: Session }
export const sessions: Sessions = {};
export const notifyRoom = async (room_id: string): Promise<void> => {
  const { clients } = sessions[room_id];
  clients.forEach((ws) => ws.send('refresh'));
};

const wss = new WebSocketServer({ port: 4001 });

const unregister = (ws: ExtendedWebSocket) => {
  const tag = ws.roomID;
  debug.log('attempting to unregister a client from session: ', tag);

  if (typeof tag !== 'undefined') {
    debug.log('unregistering client from session: ', tag);
    const list = sessions[tag].clients;
    const index = list.indexOf(ws);
    if (index > -1) {
      list.splice(index, 1);
      if (list.length === 0) {
        debug.warn('at this point the database should have the current session removed');

        if (typeof ws.roomID === 'undefined') {
          return;
          throw new Error('cannot remove session with undefined tag');
        }

        const filter = {
          _id: new ObjectID(ws.roomID),
        };
        collections.rooms().deleteOne(filter)
          .then((r) => {
            if (r.deletedCount !== 1) {
              debug.error('failed to delete room as expected');
            } else {
              debug.log('deleted session with tag: ', ws.roomID);
            }
          });
      }
    } else {
      debug.error('could not find the client in the list!');
    }
  } else {
    debug.warn('client did not have a session tag');
  }
};

const register = (ws: ExtendedWebSocket, id: string) => {
  // eslint-disable-next-line no-param-reassign
  ws.roomID = id; // associate tag with this client

  if (typeof sessions[id] === 'undefined') {
    sessions[id] = {
      clients: [],
    };
  }
  const { clients } = sessions[id];
  if (!clients.includes(ws)) {
    clients.push(ws);
  }
};

wss.on('connection', (ws: ExtendedWebSocket) => {
  ws.on('pong', () => {
    // eslint-disable-next-line no-param-reassign
    ws.isAlive = true;
  });
  ws.on('close', () => { unregister(ws); });
  ws.on('message', (message) => {
    const id = message.toString();
    register(ws, id);
  });

  // ws.send('something');
});

// heartbeat monitor
const interval = setInterval(/* ping */() => {
  // debug.log('checking client connections');
  // debug.error('todo: actually test broken connection detection!!!');

  (wss.clients as Set<ExtendedWebSocket>).forEach(/* each */ (ws) => {
    if (ws.isAlive === false) {
      debug.log('client connection broken, terminating');
      unregister(ws);
      ws.terminate();
      return;
    }

    // eslint-disable-next-line no-param-reassign
    ws.isAlive = false;
    ws.ping();
  });
}, 10000); /* 30000 */

const server = new ApolloServer({
  typeDefs,
  // resolvers, // note: just comment out resolvers when running codegen
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    return { token };
  },
});

const run = async () => {
  server.listen().then(() => {
    debug.log('listening on http://localhost:4000');
  });
  await connectMongo();
};

run();
