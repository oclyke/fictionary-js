/* eslint-disable max-len */
/*
// This file is subject to the terms and conditions defined in
// file 'LICENSE.md', which is part of this source code package.
*/

import {
  ObjectID,
} from 'mongodb';

import {
  Definition as GQLDefinition,
} from '../../generated/graphql';

export {
  Definition as GQLDefinition,
} from '../../generated/graphql';

export type MongoDefinition = {
  _id: ObjectID,
  author: string | null,
  text: string | null,
  voters: string[] | null,
}

class Definition {
  // bare properties will be persisted in storage
  readonly _id: ObjectID = undefined;
  author: string | null = null;
  text: string | null = null;
  voters: string[] | null = null;

  // class methods will not be preserved in storage
  constructor(id?: string | ObjectID, base?: { mongo?: Partial<MongoDefinition>, gql?: Partial<GQLDefinition> }) {
    if (id) {
      if (id instanceof ObjectID) {
        this._id = id;
      } else {
        this._id = new ObjectID(id);
      }
    }
    if (base) {
      if (base.mongo) {
        this.fromMongoDB(base.mongo);
      }
      if (base.gql) {
        this.fromGQL(base.gql);
      }
    }
  }

  fromGQL(gql: Partial<GQLDefinition>): Definition {
    if (typeof gql.author !== 'undefined') { this.author = gql.author; }
    if (typeof gql.text !== 'undefined') { this.text = gql.text; }
    if (typeof gql.voters !== 'undefined') { this.voters = gql.voters; }
    return this;
  }

  fromMongoDB(mongo: Partial<MongoDefinition>): Definition {
    if (typeof mongo.author !== 'undefined') { this.author = mongo.author; }
    if (typeof mongo.text !== 'undefined') { this.text = mongo.text; }
    if (typeof mongo.voters !== 'undefined') { this.voters = mongo.voters; }
    return this;
  }

  toGQL(): GQLDefinition {
    return {
      id: this._id.toHexString(),
      author: this.author,
      text: this.text,
      voters: this.voters,
    };
  }

  toMongoDB(): MongoDefinition {
    return {
      _id: this._id,
      author: this.author,
      text: this.text,
      voters: this.voters,
    };
  }

  static gqlFields(): string {
    return `
      id
      text
      author
      voters
    `;
  }
}

export default Definition;
