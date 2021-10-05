export type StringDict = { [key: string]: string }
export type IntDict = { [key: string]: number }

export {
  default as Room,
  MongoRoom,
  GQLRoom,
} from './room';

export {
  default as Word,
  MongoWord,
  GQLWord,
} from './word';

export {
  default as User,
  MongoUser,
  GQLUser,
} from './user';

export {
  default as Definition,
  MongoDefinition,
  GQLDefinition,
} from './definition';
