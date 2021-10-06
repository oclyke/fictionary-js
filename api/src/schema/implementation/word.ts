/* eslint-disable no-underscore-dangle */
/*
// This file is subject to the terms and conditions defined in
// file 'LICENSE.md', which is part of this source code package.
*/

import {
  ObjectID,
} from 'mongodb';

import {
  Definition,
  MongoDefinition,
} from '.';

import {
  Word as GQLWord,
  WordStatus as GQLWordStatus,
} from '../../generated/graphql';

export {
  Word as GQLWord,
} from '../../generated/graphql';

export type MongoWord = {
  _id: ObjectID,
  author: string | null,
  text: string | null,
  definitions: MongoDefinition[] | null,
  comittee: string[],
  status: GQLWordStatus | null,
}

class Word {
  _id?: ObjectID = undefined;
  author: string | null = null;
  text: string | null = null;
  definitions: Definition[] | null = null;
  comittee: string[] = [];
  status: GQLWordStatus | null = GQLWordStatus.None;

  // class methods will not be preserved in storage
  constructor(id?: string | ObjectID, base?: {mongo?: Partial<MongoWord>, gql?: Partial<GQLWord>}) {
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

  fromGQL(gql: Partial<GQLWord>): Word {
    if (typeof gql.author !== 'undefined') { this.author = gql.author; }
    if (typeof gql.text !== 'undefined') { this.text = gql.text; }
    if (typeof gql.definitions !== 'undefined') { this.definitions = (gql.definitions !== null) ? gql.definitions.map((d) => new Definition(d.id, { gql: d })) : null; }
    if (typeof gql.comittee !== 'undefined') { this.comittee = gql.comittee; }
    if (typeof gql.status !== 'undefined') { this.status = gql.status; }
    return this;
  }

  fromMongoDB(mongo: Partial<MongoWord>): Word {
    if (typeof mongo.author !== 'undefined') { this.author = mongo.author; }
    if (typeof mongo.text !== 'undefined') { this.text = mongo.text; }
    if (typeof mongo.definitions !== 'undefined') { this.definitions = (mongo.definitions !== null) ? mongo.definitions.map((d) => new Definition(d._id, { mongo: d })) : null; }
    if (typeof mongo.comittee !== 'undefined') { this.comittee = mongo.comittee; }
    if (typeof mongo.status !== 'undefined') { this.status = mongo.status; }
    return this;
  }

  toGQL(): GQLWord {
    return {
      id: this._id.toHexString(),
      text: this.text,
      author: this.author,
      comittee: this.comittee,
      definitions: (this.definitions !== null) ? this.definitions.map((d) => (d.toGQL())) : [],
      status: this.status,
    };
  }

  toMongoDB(): MongoWord {
    return {
      _id: this._id,
      text: this.text,
      author: this.author,
      definitions: (this.definitions) ? this.definitions.map((d) => d.toMongoDB()) : null,
      comittee: this.comittee,
      status: this.status,
    };
  }

  static gqlFields(): string {
    return `
      id
      text
      author
      comittee
      status
      definitions {
        ${Definition.gqlFields()}
      }
    `;
  }
}

export default Word;
