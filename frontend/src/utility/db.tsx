import {
  gqlop,
} from './graphql';

import {
  User,
} from '../hooks/useUser';

import {
  Room,
} from '../hooks/useRoom';

export const roomByTag = async (tag: string): Promise<Room> => {
  const query = `query ($tag: String!){ getRoom(tag: $tag){ ${Room.gqlFields()} }}`;
  const variables = {
    tag,
  }
  const { data: { getRoom }} = await gqlop(query, variables);
  const base = getRoom;
  return new Room(base.id, base);
}

export const roomByID = async (id: string): Promise<Room> => {
  const query = `query ($id: ID!){ getRoom(id: $id){ ${Room.gqlFields()} }}`;
  const variables = {
    id,
  }
  const { data: { getRoom } } = await gqlop(query, variables);
  const base = getRoom;
  return new Room(base.id, base);
}

export const makeRoom = async (tag: string): Promise<Room> => {
  const query = `mutation ($tag: String!){ makeRoom(tag: $tag){ ${Room.gqlFields()} }}`;
  const variables = {
    tag,
  }
  const { data: { makeRoom } } = await gqlop(query, variables);
  const base = makeRoom; // note: this probably shadows the function name
  return new Room(base.id, base);
}

export const getUser = async (id: string): Promise<User> => {
  const query = `query ($id: ID!){ getUser(id: $id){ ${User.gqlFields()} }}`;
  const variables = {
    id,
  }
  const { data: { getUser } } = await gqlop(query, variables);
  const base = getUser; // note: this probably shadows the function name
  return new User(base.id, base);
}

export const createUser = async (input: Partial<User>): Promise<User> => {
  const query = `mutation ($input: UserInput){ createUser(input: $input){ ${User.gqlFields()} }}`;
  const variables = {
    input,
  }
  const { data: { createUser } } = await gqlop(query, variables);
  const base = createUser; // note: this probably shadows the function name
  return new User(base.id, base);
}

export const updateUser = async (id: string, input: Partial<User>): Promise<User> => {
  const query = `mutation ($id: ID!, $input: UserInput){ updateUser(id: $room_id, input: $input){ ${User.gqlFields()} }}`;
  const variables = {
    id,
    input,
  }
  const { data: { updateUser } } = await gqlop(query, variables);
  const base = updateUser; // note: this probably shadows the function name
  return new User(base.id, base);
}
