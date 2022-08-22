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
  createRoom,
  getRoom,
  getRoomByTag,
  deleteRoom,
} from '../src/room';

let db: Database
let client: MongoClient;
let replset: MongoMemoryReplSet;

const room_tag = 'test_room';

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

test('invalid rooms are not found', async () => {
  await expect(getRoom(db, new ObjectId('000000000000000000000000'))).resolves.toBeNull();
});

test('rooms can be created', async () => {
  const room = await createRoom(db, room_tag);
  expect(room).toHaveProperty('tag', room_tag);
  expect(room._id).toBeInstanceOf(ObjectId);

});

test('two identical tags to fail', async () => {
  await createRoom(db, room_tag);
  await expect(createRoom(db, room_tag)).rejects.toThrow('duplicate key error');
})

test('rooms can be recovered', async () => {
  const { _id } = await createRoom(db, room_tag);
  await expect(getRoom(db, new ObjectId(_id))).resolves.toHaveProperty('_id', _id);
});

test('rooms can be recovered by tag', async () => {
  const special_tag = 'unique_room_tag';
  await createRoom(db, special_tag);
  await expect(getRoomByTag(db, special_tag)).resolves.toHaveProperty('tag', special_tag);
});

test('rooms can be deleted', async () => {
  const { _id } = await createRoom(db, room_tag);
  await expect(getRoom(db, _id)).resolves.toHaveProperty('_id', _id)
  await deleteRoom(db, _id);
  await expect(getRoom(db, _id)).resolves.toBeNull()
});
