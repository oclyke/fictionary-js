import {
  ObjectId,
} from 'mongodb'

import {
  Database,
} from '.'

import {
  User,
  makeUser,
} from './user'

import {
  Room,
} from '../../api/src/generated/graphql'

export {
  Room,
}

function makeRoom(tag: string): Room {
  return {
    tag,
    players: [],
    words: [],
    scores: [],
  }
}

export async function createRoom(db: Database, tag: string) {
  const room = makeRoom(tag)
  const result = await db.rooms.insertOne(room)
  return result.insertedId
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

export async function addPlayerToRoom(db: Database, _id: ObjectId, userid: ObjectId) {
  const {value} = await db.rooms.findOneAndUpdate({_id}, {$push: {players: {id: userid.toString(), player: makeUser()}}}, {returnDocument: 'after'})
  return value
}
