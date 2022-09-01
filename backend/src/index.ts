import {
  Collection,
} from 'mongodb'

import {
  UserModel,
} from './user'

import {
  GameModel,
} from './game'

import {
  MetaModel,
} from './meta'

export interface Database {
  games: Collection<GameModel>
  users: Collection<UserModel>
  meta: Collection<MetaModel>
}

export declare type WithDatabase<TSchema> = Omit<TSchema, 'db'> & {
  db: Database
}

export function isDatabase (obj: any): obj is Database {
  let result = false
  if (typeof obj === 'object') {
    if ( true
      && (typeof obj.games !== 'undefined')
      && (typeof obj.users !== 'undefined')
      && (typeof obj.meta !== 'undefined')
    ) {
      result = true
    }
  }
  return result
}

export {
  MetaModel,
  GameModel,
  UserModel,
}

export {
  getDatabase,
  initializeDatabase,
} from './utils'
