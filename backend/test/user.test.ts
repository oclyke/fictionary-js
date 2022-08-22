import {
  MongoMemoryReplSet,
} from 'mongodb-memory-server';

import {
  MongoClient,
  ObjectId,
} from 'mongodb';

import {
  Database,
} from '../src';

import {
  getDatabase,
  initializeDatabase,
  startServer,
} from '../src/utils';

import {
  createUser,
  getUser,
  deleteUser,
} from '../src/user';


///////////
// fixtures

let db: Database
let client: MongoClient;
let replset: MongoMemoryReplSet;

const user_tag = 'test_user';

// see docs on jest setup / teardown as well as handling async code
// https://jestjs.io/docs/setup-teardown
// https://jestjs.io/docs/asynchronous
beforeAll(async () => {
  replset = await startServer();
  const uri = replset.getUri();
  client = new MongoClient(uri);
  db = getDatabase(client);
  await client.connect();
  await initializeDatabase(db);
});

afterAll(async () => {
  await client.close();
  await replset.stop();
});

beforeEach(async () => {
  // make sure each test starts with clean collections
  await db.rooms.deleteMany({});
  await db.users.deleteMany({});
});

////////
// tests

test('invalid users are not found', async () => {
  await expect(getUser(db, new ObjectId('000000000000000000000000'))).resolves.toBeNull();
});

test('users can be created', async () => {
  const user = await createUser(db);
  expect(user._id).toBeInstanceOf(ObjectId);
});

test('users can be deleted', async () => {
  const { _id } = await createUser(db);
  await expect(getUser(db, _id)).resolves.toHaveProperty('_id', _id)
  await deleteUser(db, _id);
  await expect(getUser(db, _id)).resolves.toBeNull()
});

test('users can be recovered', async () => {
  const { _id } = await createUser(db);
  await expect(getUser(db, _id)).resolves.toHaveProperty('_id', _id);
});
