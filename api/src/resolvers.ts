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
} from './generated/graphql';

import {
  Player,
  Session,
} from './schema/implementation';

import {
  collections,
} from './db';

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

const resolvers: {Query: QueryResolvers, Mutation: MutationResolvers} = {
  Query: {
    getSession: async (parent, args) => {
      if (!args.id) { throw new InputError(); }
      const query = {
        _id: (args.id) ? new ObjectID(args.id) : undefined,
      };
      const cursor = await (collections.sessions() as UnknownCollection).find(query, {});
      if (await cursor.count() !== 1) { return null; }
      const [base] = await cursor.toArray();
      return new Session(base._id, base).toGQL();
    },
  },
  Mutation: {
    createSession: async (parent, args) => {
      if (!args.input) { throw new InputError(); }
      const base = {
        tag: (args.input.tag) ? args.input.tag : undefined,
      };
      const session = new Session(undefined, base); // create new session without id
      const { ops } = await (collections.sessions() as Collection<Session>).insertOne(session); // mongodb will create _id automatically if it does not exist
      if (ops.length !== 1) { throw new Error('no ops created'); }
      return session.toGQL(); // return the session in GQL format (including automatic id)
    },
    addPlayer: async (parent, args) => {
      const base = {
        name: (args.input && args.input.name) ? args.input.name : undefined,
        color: (args.input && args.input.color) ? args.input.color : undefined,
      };
      const player = new Player(new ObjectID(), base); // player ids currrently only unique within session
      const filter = {
        _id: new ObjectID(args.session_id),
      };
      const update = {
        $push: { players: player },
      };
      await (collections.sessions() as UnknownCollection).updateOne(filter, update);
      return player.toGQL();
    },
  },
};

export default resolvers;
