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
      return getRoom(db, new ObjectId(args.id)).then(r => ((r === null) ? r : {...r, _id: r._id.toString()}))
    },
    [`getRoomByTag`]: async (parent, args) => {
      return getRoomByTag(db, args.tag).then(r => ((r === null) ? r : {...r, _id: r._id.toString()}))
    },
  },
  Mutation: {
    [`createRoom`]: async (parent, args) => {
      return createRoom(db, args.tag).then(r => ((r === null) ? r : {...r, _id: r._id.toString()}))
    },
    [`createPlayer`]: async (parent, args) => {
      return await createUser(db).then(u => ((u === null) ? u : {...u, _id: u._id.toString()}))
    },
  },

  ///////////
  // 
  Player: {
    [`_id`]: async (parent) => { return parent._id },
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
    [`_id`]: async (parent) => { return parent._id },
    [`tag`]: async (parent) => { return parent.tag },
    [`players`]: async (parent) => { return parent.players },
    [`words`]: async (parent) => { return parent.words },
    [`scores`]: async (parent) => { return parent.scores },
  },

  ///////////
  //
  ProposalTuple: {
    [`id`]: async (parent) => { return parent.id },
    [`value`]: async (parent) => { return parent.value },
  },
  VoteTuple: {
    [`id`]: async (parent) => { return parent.id },
    [`proposerid`]: async (parent) => { return parent.proposerid },
  },
  ScoreTuple: {
    [`id`]: async (parent) => { return parent.id },
    [`score`]: async (parent) => { return parent.score },
  }
}
