import {
  Collection,
  OptionalId,
} from 'mongodb'

import {
  User,
} from './user'

import {
  Room,
} from './room'

export interface Database {
  rooms: Collection<OptionalId<Room>>
  users: Collection<OptionalId<User>>
}
