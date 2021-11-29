/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */

import {
  ObjectID,
} from 'mongodb';

import {
  User,
  Word,
  IntDict,
  StringDict,
  MongoUser,
  MongoWord,
} from '.';

import {
  Room as GQLRoom,
} from '../../generated/graphql';

export {
  Room as GQLRoom,
} from '../../generated/graphql';

export type MongoRoom = {
  _id?: ObjectID,
  tag: string | null,
  players: MongoUser[],
  scores: IntDict,
  colors: StringDict,
  words: MongoWord[],
}

class Room {
  // bare properties will be persisted in storage
  readonly _id?: ObjectID = undefined;
  tag: string | null = null;
  players: User[] = [];
  scores: IntDict = {}; // map of player ids to their scores
  colors: StringDict = {}; // map of player ids to their in-game colors
  words: Word[] | null = null;

  // class methods will not be preserved in storage
  constructor(id?: string | ObjectID, base?: {gql?: Partial<GQLRoom>, mongo?: Partial<MongoRoom>}) {
    if (id) {
      if (id instanceof ObjectID) {
        this._id = id;
      } else {
        this._id = new ObjectID(id);
      }
    }
    if (base) {
      if (base.gql) {
        this.fromGQL(base.gql);
      }
      if (base.mongo) {
        this.fromMongoDB(base.mongo);
      }
    }
  }

  fromGQL(gql: Partial<GQLRoom>): Room {
    if (typeof gql.tag !== 'undefined') { this.tag = gql.tag; }
    if (typeof gql.players !== 'undefined') { this.players = (gql.players !== null) ? gql.players.map((u) => new User(u.id).fromGQL(u)) : []; }
    if (typeof gql.scores !== 'undefined') { this.scores = gql.scores; }
    if (typeof gql.colors !== 'undefined') { this.colors = gql.colors; }
    if (typeof gql.words !== 'undefined') { this.words = (gql.words !== null) ? gql.words.map((w) => new Word(w.id).fromGQL(w)) : null; }
    return this;
  }

  fromMongoDB(mongo: Partial<MongoRoom>): Room {
    if (typeof mongo.tag !== 'undefined') { this.tag = mongo.tag; }
    if (typeof mongo.players !== 'undefined') { this.players = (mongo.players !== null) ? mongo.players.map((u) => new User(u._id).fromMongoDB(u)) : []; }
    if (typeof mongo.scores !== 'undefined') { this.scores = mongo.scores; }
    if (typeof mongo.colors !== 'undefined') { this.colors = mongo.colors; }
    if (typeof mongo.words !== 'undefined') { this.words = (mongo.words !== null) ? mongo.words.map((w) => new Word(w._id).fromMongoDB(w)) : null; }
    return this;
  }

  toGQL(): GQLRoom {
    return {
      id: this._id.toHexString(),
      tag: this.tag,
      players: this.players.map((u) => u.toGQL()),
      scores: this.scores,
      colors: this.colors,
      words: (this.words !== null) ? this.words.map((w) => w.toGQL()) : [],
    };
  }

  toMongoDB(): MongoRoom {
    return {
      _id: this._id,
      tag: this.tag,
      players: (this.players !== null) ? this.players.map((u) => u.toMongoDB()) : [],
      scores: this.scores,
      colors: this.colors,
      words: (this.words !== null) ? this.words.map((w) => w.toMongoDB()) : [],
    };
  }

  static gqlFields(): string {
    return `
      id
      tag
      players
      scores
      colors
      words {
        ${Word.gqlFields()}
      }
    `;
  }
}

export default Room;
