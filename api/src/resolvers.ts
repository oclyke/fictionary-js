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

import {
  createUser,
} from '../../backend/src/user';

import {
  db,
} from '.';

export const resolvers: Resolvers = {
  Query: {
    [`getRoomById`]: async (parent, args) => {
      return await getRoom(db, new ObjectId(args.id));
    },
    [`getRoomByTag`]: async (parent, args) => {
      return await getRoomByTag(db, args.tag);
    },
  },
  Mutation: {
    [`createRoom`]: async (parent, args) => {
      return await (await createRoom(db, args.tag)).toString();
    },
    [`createPlayer`]: async (parent, args) => {
      return await (await createUser(db)).toString();
    },
  },

  ///////////
  // 
  Player: {
    [`tag`]: async (parent) => { return parent.tag },
    [`color`]: async (parent) => { return parent.color },
    [`overallScore`]: async (parent) => { return parent.overallScore },
  },
  Word: {
    [`authorid`]: async (parent) => { return parent.authorid },
    [`voters`]: async (parent) => { return parent.voters },
    [`votes`]: async (parent) => { return parent.votes },
    [`definition`]: async (parent) => { return parent.definition },
    [`proposals`]: async (parent) => { return parent.proposals },
    [`state`]: async (parent) => { return parent.state },
  },
  Room: {
    [`tag`]: async (parent) => { return parent.tag },
    [`players`]: async (parent) => { return parent.players },
    [`words`]: async (parent) => { return parent.words },
  },

  ///////////
  //
  PlayerMapTuple: {
    [`id`]: async (parent) => { return parent.id },
    [`player`]: async (parent) => { return parent.player },
  },
  ProposalTuple: {
    [`id`]: async (parent) => { return parent.id },
    [`value`]: async (parent) => { return parent.value },
  },
  VoteTuple: {
    [`id`]: async (parent) => { return parent.id },
    [`proposerid`]: async (parent) => { return parent.proposerid },
  },
}
