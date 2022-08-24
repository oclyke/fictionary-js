import {
  Collection,
} from 'mongodb'

import {
  User,
} from './user'

import {
  Room,
} from './room'

export type DBRoom = Omit<Room, '_id'>
export type DBUser = Omit<User, '_id'>

export interface Database {
  rooms: Collection<DBRoom>
  users: Collection<DBUser>
}
