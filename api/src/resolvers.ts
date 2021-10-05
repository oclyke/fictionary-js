/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */

import {
  ObjectID,
  Collection,
  WithId,
} from 'mongodb';

import {
  QueryResolvers,
  MutationResolvers,
  User as GQLUser,
} from './generated/graphql';

import {
  collections,
} from './db';

import {
  Room,
  User,
} from './schema/implementation';

/*
// remember: resolver args are: (parent, args, context, info)
*/

type UnknownCollection = Collection<{ [key: string]: unknown }>

class InputError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'InputError';
  }
}

const prune = (input: { [key: string]: unknown }, opt?: {null?: boolean, undefined?: boolean}) => {
  const options = {
    null: true,
    undefined: true,
  };
  if (opt) {
    if (opt.null) { options.null = opt.null; }
    if (opt.undefined) { options.undefined = opt.undefined; }
  }
  Object.keys(input).forEach((key) => {
    if (options.null) {
      if (input[key] === null) {
        // eslint-disable-next-line no-param-reassign
        delete input[key];
      }
    }
    if (options.undefined) {
      if (typeof input[key] === 'undefined') {
        // eslint-disable-next-line no-param-reassign
        delete input[key];
      }
    }
  });
  return input;
};

const resolvers: {Query: QueryResolvers, Mutation: MutationResolvers} = {
  Query: {
    getRoom: async (parent, args) => {
      // either returns the session with the requested tag or null

      const query = prune({
        _id: (args.id) ? new ObjectID(args.id) : undefined,
        tag: (args.tag) ? args.tag : undefined,
      });
      const cursor = await collections.rooms().find(query, {});
      if (await cursor.count() !== 1) { return null; }
      const [base] = await cursor.toArray();
      return new Room(base._id, { mongo: base }).toGQL();
    },
  },
  Mutation: {
    makeRoom: async (parent, args) => {
      // either finds or creates a room with the given tag

      // note: there may be a clever way to do this but for now we will just check to see if a session exists and if not create it
      // https://stackoverflow.com/questions/16358857/mongodb-atomic-findorcreate-findone-insert-if-nonexistent-but-do-not-update

      const query = {
        tag: args.tag,
      };
      const options = {};
      const cursor = await collections.rooms().find(query, options);
      if (await cursor.count() === 1) {
        const [base] = await cursor.toArray();
        return new Room(base._id, { mongo: base }).toGQL();
      }

      // in this case there was no existing room so one will be created
      const input = {
        tag: (args.tag),
      };
      const room = new Room(undefined, { mongo: input }); // create new room without id
      const { ops } = await collections.rooms().insertOne(room.toMongoDB()); // mongodb will create _id automatically if it does not exist
      if (ops.length !== 1) { throw new Error('no ops created'); }
      const base = ops[0];
      return new Room(base._id, { mongo: base }).toGQL(); // return the room in GQL format (including automatic id)
    },

    createUser: async (parent, args) => {
      const user = new User(undefined, { gql: ((args.input !== null) ? args.input : undefined) });
      const { ops } = await collections.users().insertOne(user.toMongoDB());
      if (ops.length !== 1) { throw new Error('no ops created'); }
      const base = ops[0];
      return new User(base._id, { mongo: base }).toGQL();
    },

    updateUser: async (parent, args) => {
      const filter = {
        _id: new ObjectID(args.id),
      };
      const update = {
        $set: prune({
          name: args.input.name,
          color: args.input.color,
        }),
      };
      const { ok, value } = await collections.users().findOneAndUpdate(filter, update, { returnDocument: 'after' });
      if ((!ok) || (value === null) || (typeof value === 'undefined')) {
        throw new Error('failed to update user');
      }
      return new User(value._id, { mongo: value }).toGQL();
    },
  },
};

export default resolvers;
