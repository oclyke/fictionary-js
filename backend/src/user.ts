import {
  ObjectId,
  OptionalId,
  WithId,
} from 'mongodb'

// @ts-ignore
import * as greg from 'greg'

import {
  Database,
} from '.'

export type UserModel = OptionalId<{
  name: string
  color: string
  overallScore: number
  games: string[]
}>

function makeUserObject(name: string): UserModel {
  const now = new Date().toString()
  return {
    name,
    color: '#ffffff',
    overallScore: 0,
    games: [],
  }
}

function get_random_name() {
  const sentence = greg.sentence();
  const tokens = sentence.split(' ');
  return [tokens[1], tokens[2]].join('-');
}

export async function createUser(db: Database): Promise<WithId<UserModel>> {
  const user = makeUserObject(get_random_name())
  const { insertedId } = await db.users.insertOne(user)
  return {
    ...user,
    _id: insertedId,
  }
}

export async function deleteUser(db: Database, _id: ObjectId) {
  return await db.users.deleteOne({_id})
}

export async function getUser(db: Database, _id: ObjectId) {
  return db.users.findOne({_id})
}

export async function setUserColor(db: Database, _id: ObjectId, color: string) {
  const {value} = await db.users.findOneAndUpdate({_id}, {$set: {color}}, {returnDocument: 'after'})
  return value
}

// export async function user_set_tag(db: Database, _id: ObjectId, tag: string) {
//   const {value} = await db.users.findOneAndUpdate({_id}, {$set: {tag}}, {returnDocument: 'after'})
//   return value
// }
