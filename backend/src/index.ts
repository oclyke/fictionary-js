import {
  Collection,
} from 'mongodb'

import {
  UserModel,
} from './user'

import {
  GameModel,
} from './game'

export interface Database {
  games: Collection<GameModel>
  users: Collection<UserModel>
}
