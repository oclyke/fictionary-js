import {
  ObjectId,
} from 'mongodb';

import {
  Resolvers,
  Maybe,
  ListRoomsInput,
  RoomEdge,
  RoomConnection,
} from './generated/graphql'

import {
  Database,
  DBRoom,
} from '../../backend/src'

import {
  getRoom,
  createRoom,
  getRoomByTag,
  addPlayerToRoom,
  getRoomsCursor,
  Room,
  isDBroom,
} from '../../backend/src/room';

import {
  createUser,
  getUser,
} from '../../backend/src/user';

import {
  db,
} from '.';

export const resolvers: Resolvers = {
  Query: {
    [`players`]: async (parent, args) => {
      return null
    },
    [`rooms`]: async (parent, args) => {
      return getRoomsResolver(db, args.input, args.first, args.last, args.after, args.before)
    },
    [`getRoomById`]: async (parent, args) => {
      return getRoom(db, new ObjectId(args.id)).then(r => ((r === null) ? r : {...r, _id: r._id.toString()}))
    },
    [`getRoomByTag`]: async (parent, args) => {
      return getRoomByTag(db, args.tag).then(r => ((r === null) ? r : {...r, _id: r._id.toString()}))
    },
    [`getPlayerById`]: async (parent, args) => {
      return getUser(db, new ObjectId(args.id)).then(p => ((p === null) ? p : {...p, _id: p._id.toString()}))
    },
  },
  Mutation: {
    [`createRoom`]: async (parent, args) => {
      return createRoom(db, args.tag).then(r => ((r === null) ? r : {...r, _id: r._id.toString()}))
    },
    [`createPlayer`]: async (parent, args) => {
      return await createUser(db).then(u => ((u === null) ? u : {...u, _id: u._id.toString()}))
    },
    [`addPlayerToRoom`]: async (parent, args) => {
      return await addPlayerToRoom(db, new ObjectId(args.roomid), new ObjectId(args.userid)).then(u => ((u === null) ? u : {...u, _id: u._id.toString()}))
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
    [`definitions`]: async (parent) => { return parent.definitions },
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
  DefinitionTuple: {
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
  },

  ////////////
  //
  RoomEdge: {
    [`cursor`]: async (parent) => { return parent.cursor },
    [`node`]: async (parent) => { return parent.node },
  },
  PlayerEdge: {
    [`cursor`]: async (parent) => { return parent.cursor },
    [`node`]: async (parent) => { return parent.node },
  },
  PageInfo: {
    [`hasPreviousPage`]: async (parent) => { return parent.hasPreviousPage },
    [`hasNextPage`]: async (parent) => { return parent.hasNextPage },
    [`startCursor`]: async (parent) => { return parent.startCursor },
    [`endCursor`]: async (parent) => { return parent.endCursor },
  },
  PlayerConnection: {
    [`edges`]: async (parent) => { return parent.edges },
    [`pageInfo`]: async (parent) => { return parent.pageInfo },
  },
  RoomConnection: {
    [`edges`]: async (parent) => { return parent.edges },
    [`pageInfo`]: async (parent) => { return parent.pageInfo },
  },
}

export async function getRoomsResolver(
  db: Database,
  input?: Maybe<ListRoomsInput>,
  first?: Maybe<number>,
  last?: Maybe<number>,
  after?: Maybe<string>,
  before?: Maybe<string>
): Promise<RoomConnection>  {


  // validate stuff
  let retrieve = 10
  if (first !== null && typeof first !== 'undefined') {
    if (first < 0) {
      throw new Error('negative slice')
    }
    retrieve = first
  }
  if (last !== null && typeof last !== 'undefined') {
    if (last < 0) {
      throw new Error('negative slice')
    }
    retrieve = last
  }
  if (typeof last !== 'undefined' && typeof first !== 'undefined') {
    // this is an enforcement above and beyond the Relay spec
    // https://relay.dev/graphql/connections.htm
    throw new Error ('cannot get both first and last')
  }

  const cursor = await getRoomsCursor(db, input)
  let allRooms: (DBRoom | null)[] = [...new Array(retrieve)]
  for (let idx = 0; idx < retrieve; idx++) {
    allRooms[idx] = (await cursor.hasNext()) ? await cursor.next() : null
  }
  const allEdges: RoomEdge[] = allRooms.map((r): RoomEdge => ({
    node: r === null ? null : {
      ...r,
      _id: (r as any)._id.toString()
    },
    cursor: r === null ? '' : (r as any)._id.toString()
  }))

  // drop before / after edges
  let edges = allEdges
  if (after !== null && typeof after !== 'undefined') {
    const idx = edges.findIndex(e => e.cursor === after)
    if (idx >= 0) {
      edges.splice(0, idx)
    }
  }
  if (before !== null && typeof before !== 'undefined') {
    const idx = edges.findIndex(e => e.cursor === before)
    if (idx >= 0) {
      edges.splice(-idx, idx)
    }
  }
  if (typeof last !== 'undefined' && typeof first !== 'undefined') {
    // this is an enforcement above and beyond the Relay spec
    // https://relay.dev/graphql/connections.htm
    throw new Error ('cannot get both first and last')
  }

  const hasPreviousPage: boolean = (() => {
    if (last !== null && typeof last !== 'undefined') {
      return (edges.length > last)
    }
    // if (first !== null && typeof first !== 'undefined') {
    //   return 
    // }
    return false
  })()

  const hasNextPage: boolean = (() => {
    if (first !== null && typeof first !== 'undefined') {
      return (edges.length > first)
    }
    // if (first !== null && typeof first !== 'undefined') {
    //   return 
    // }
    return false
  })()

  const startCursor = edges.splice(0)[0].cursor
  const endCursor = edges.splice(-1)[0].cursor

  const connection: RoomConnection = {
    edges,
    pageInfo: {
      hasNextPage,
      hasPreviousPage,
      startCursor,
      endCursor,
    }
  }

  return connection
}
