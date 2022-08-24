import {
  ObjectId,
  WithId,
} from 'mongodb'

import {
  Database,
  DBRoom,
} from '.'

import {
  User,
  makeUser,
} from './user'

import {
  Room,
  ListRoomsInput,
  Maybe,
} from '../../api/src/generated/graphql'

export {
  Room,
}

export function isDBroom (r: any): r is DBRoom {
  if (r === null) { return false }
  return true
}

function makeRoom(tag: string): Omit<Room, '_id'> {
  return {
    tag,
    players: [],
    words: [],
    scores: [],
  }
}

export async function createRoom(db: Database, tag: string) {
  const room = makeRoom(tag)
  const { insertedId } = await db.rooms.insertOne(room)
  return {
    ...room,
    _id: insertedId,
  }
}

export async function getRoom(db: Database, _id: ObjectId) {
  return await db.rooms.findOne({_id})
}

export async function getRoomByTag(db: Database, tag: string) {
  return await db.rooms.findOne({tag})
}

export async function deleteRoom(db: Database, _id: ObjectId) {
  return await db.rooms.deleteOne({_id})
}

export async function getRoomsCursor(db: Database, input?: Maybe<ListRoomsInput>) {
  const filter: {
    tag?: {
      eq?: string
    },
    id?: {
      eq?: string
    },
  } = {}
  if (input !== null && typeof input !== 'undefined'){
    if (input.tag !== null) {
      filter.tag = {}
      if (input.tag.eq !== null) { filter.tag.eq = input.tag.eq }
    }
    if (input.id !== null) {
      filter.id = {}
      if (input.id.eq !== null) { filter.id.eq = input.id.eq }
    }
  }
  return db.rooms.find(filter)
}

export async function addPlayerToRoom(db: Database, _id: ObjectId, userid: ObjectId) {
  const player = {...makeUser(), _id: userid.toString()}
  const {value} = await db.rooms.findOneAndUpdate({_id}, {$push: {players: player}}, {returnDocument: 'after'})
  return value
}
