import {
  Collection,
} from 'mongodb'

import {
  User,
} from './user'

import {
  Room,
} from './room'

export interface Database {
  rooms: Collection<Omit<Room, '_id'>>
  users: Collection<Omit<User, '_id'>>
}
