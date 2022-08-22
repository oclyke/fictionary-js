import {
  ObjectId,
} from 'mongodb'

// @ts-ignore
import * as greg from 'greg'

import {
  Database,
} from '.'

import {
  Player as User,
} from '../../api/src/generated/graphql'

export {
  User,
}

// stand-in functions to help make new users
function get_random_color() {
  return '#ffffff';
}

function get_random_tag() {
  const sentence = greg.sentence();
  const tokens = sentence.split(' ');
  return [tokens[1], tokens[2]].join('-');
}

export function makeUser(): Omit<User, '_id'> {
  return {
    tag: get_random_tag(),
    color: get_random_color(),
    overallScore: 0,
  }
}

export async function createUser(db: Database) {
  const user = makeUser()
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

export async function user_set_tag(db: Database, _id: ObjectId, tag: string) {
  const {value} = await db.users.findOneAndUpdate({_id}, {$set: {tag}}, {returnDocument: 'after'})
  return value
}
