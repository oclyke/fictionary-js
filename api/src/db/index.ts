/*
// This file is subject to the terms and conditions defined in
// file 'LICENSE.md', which is part of this source code package.
*/

import {
  MongoClient,
  Db,
} from 'mongodb';

import {
  debug,
} from '../utility';

const DBNAME = 'fictionary';

// Create a new MongoClient
const uri = `mongodb+srv://${process.env.DBUSERNAME}:${process.env.DBPASSWORD}@${process.env.DBHOST}/${DBNAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export const database = (): Db => client.db(DBNAME);

export const collections = {
  sessions: (): unknown => database().collection('sessions'),
};

export const connectMongo = async (): Promise<void> => {
  debug.log('connecting with: ', uri);

  // Connect the client to the server
  try {
    await client.connect();
  } catch (e) {
    debug.error(e);
  }
  // Establish and verify connection
  await client.db('admin').command({ ping: 1 });
  debug.log('Connected successfully to server');
};
