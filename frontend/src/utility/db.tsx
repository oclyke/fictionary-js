import {
  gqlop,
} from '.';

// import {
//   GQLUser,
//   GQLRoom,
//   Room,
//   User,
// } from '../../../api/src/schema/implementation';

type GQLUser = any;
class User {
  _id = undefined
  constructor(arg?: any, arg2?: any){
  }
  fromGQL(p: Partial<GQLUser>){
    return this;
  }
  static gqlFields(){
    return 'error - this is not real code!!!'
  }
  toGQL(){
    return this;
  }
}
type GQLRoom = any;
class Room {
  constructor(arg?: any, arg2?: any){
  }
  static gqlFields(){
    return 'error - this is not real code!!!'
  }
  toGQL(){
    return this;
  }
}

export const roomByTag = async (tag: string): Promise<GQLRoom> => {
  const query = `query ($tag: String!){ getRoom(tag: $tag){ ${Room.gqlFields()} }}`;
  const variables = {
    tag,
  }
  const { data } = await gqlop(query, variables);
  return new Room(data.id, { gql: data }).toGQL();
}

export const roomByID = async (id: string): Promise<GQLRoom> => {
  const query = `query ($id: ID!){ getRoom(id: $id){ ${Room.gqlFields()} }}`;
  const variables = {
    id,
  }
  const { data } = await gqlop(query, variables);
  return new Room(data.id, { gql: data }).toGQL();
}

export const makeRoom = async (tag: string): Promise<GQLRoom> => {
  const query = `mutation ($tag: String!){ makeRoom(tag: $tag){ ${Room.gqlFields()} }}`;
  const variables = {
    tag,
  }
  const { data } = await gqlop(query, variables);
  return new Room(data.id, { gql: data }).toGQL();
}

export const createUser = async (input: Partial<GQLUser>): Promise<GQLUser> => {
  const query = `mutation ($input: UserInput){ createUser(input: $input){ ${User.gqlFields()} }}`;
  const variables = {
    input,
  }
  const { data } = await gqlop(query, variables);
  return new User(data.id, { gql: data }).toGQL();
}

export const updateUser = async (id: string, input: Partial<GQLUser>): Promise<GQLUser> => {
  const query = `mutation ($id: ID!, $input: UserInput){ updateUser(id: $room_id, input: $input){ ${User.gqlFields()} }}`;
  const variables = {
    id,
    input,
  }
  const { data } = await gqlop(query, variables);
  return new User(data.id, { gql: data }).toGQL();
}
