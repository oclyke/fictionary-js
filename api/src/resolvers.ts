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
  Definition,
  MongoUser,
  Room,
  User,
  Word,
} from './schema/implementation';

import {
  Dict,
} from './utility/dicts';

import {
  notifyRoom,
} from '.';

import {
  debug,
} from './utility';

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

      // get the room
      const query = prune({
        _id: (args.id) ? new ObjectID(args.id) : undefined,
        tag: (args.tag) ? args.tag : undefined,
      });
      const cursor = await collections.rooms().find(query, {}); // note: should probably be using collection.findOne() instead...
      if (await cursor.count() !== 1) { return null; }
      const [base] = await cursor.toArray();

      // cache player info
      // get all the users who are in the room...
      const players_query = {
        _id: {$in: base.players.map(id => new ObjectID(id))}
      };
      const players_cursor = await collections.users().find(players_query, {});
      const players = await players_cursor.toArray();

      // create new fields (we will be caching all the users that exist - this will either create or update)
      const room = new Room(base._id, { mongo: base });
      players.forEach((player) => {
        const key = player._id.toString();
        room.aliases[key] = new User(player._id, {mongo: player});
      });

      // create the operation to update the room with cached info
      const room_filter = {
        _id: new ObjectID(base._id),
      };
      const room_update = {
        $set: room.toMongoDB()
      };
      const { ok, value } = await collections.rooms().findOneAndUpdate(room_filter, room_update, { returnDocument: 'after' });
      if ((!ok) || (value === null) || (typeof value === 'undefined')) {
        throw new Error('failed to update room');
      }

      return room.toGQL(); // ideally we would return the value that came back from the database here
    },

    getUser: async (parent, args) => {
      const query = {
        _id: new ObjectID(args.id),
      };
      const cursor = await collections.users().find(query, {}); // note: should probably be using collection.findOne() instead...
      if (await cursor.count() !== 1) { return null; }
      const [base] = await cursor.toArray();
      return new User(base._id, { mongo: base }).toGQL();
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
      const cursor = await collections.rooms().find(query, options); // note: should probably be using collection.findOne() instead...
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
      // todo: currently rooms are not notified when users are updated.... this would be nice. Maybe room id that the user is in could be added as an argument?
      return new User(value._id, { mongo: value }).toGQL();
    },

    joinRoom: async (parent, args) => {
      const filter = {
        _id: new ObjectID(args.room_id),
      };
      const update = {
        $addToSet: {
          players: args.user_id,
        },
      };
      const { ok, value } = await collections.rooms().findOneAndUpdate(filter, update, { returnDocument: 'after' });
      if ((!ok) || (value === null) || (typeof value === 'undefined')) {
        throw new Error('failed to update room');
      }
      try {
        await notifyRoom(args.room_id);
      } catch (e) {
        debug.error('could not notify room: ', e);
      }
      return new Room(value._id, { mongo: value }).toGQL();
    },

    proposeWord: async (parent, args) => {
      // note: we are manually creating ObjectIDs for the definition and word because mongodb won't automatically create them for sub-documents. this *shouldnt* cause any collisions but it would be good to keep in mind
      const definition = new Definition(new ObjectID(), {gql: {text: args.definition, author: args.user_id}})
      const word = new Word(new ObjectID(), {gql: {author: args.user_id, text: args.word, definitions: [definition.toGQL()]}})

      const filter = {
        _id: new ObjectID(args.room_id),
      };
      const update = {
        $addToSet: {
          words: word.toMongoDB(),
        },
      };

      const { ok, value } = await collections.rooms().findOneAndUpdate(filter, update, { returnDocument: 'after' });
      if ((!ok) || (value === null) || (typeof value === 'undefined')) {
        throw new Error('failed to update room');
      }
      try {
        await notifyRoom(args.room_id);
      } catch (e) {
        debug.error('could not notify room: ', e);
      }

      return word.toGQL()
    }
  },
};

export default resolvers;
