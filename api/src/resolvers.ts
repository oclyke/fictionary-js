import {
  ObjectId,
} from 'mongodb';

import {
  Resolvers,
} from './generated/graphql'

import {
  getRoom,
  createRoom,
  getRoomByTag,
} from '../../backend/src/room';

// import {
//   db,
// } from '.';

// import {
//   notify_room,
// } from './sessions';

// export const resolvers: Resolvers = {
//   Query: {
//     getRoomById: async (parent: any, args: any) => {
//       return await get_room(db, new ObjectId(args.id));
//     },
//     getRoomByTag: async (parent: any, args: any) => {
//       return await get_room_by_tag(db, args.tag);
//     },
//   },
//   Mutation: {
//     createRoom: async (parent: any, args: any) => {
//       return await create_room(db, args.tag);
//     },
//   }
// }
