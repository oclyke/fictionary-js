import {
  ObjectID,
} from 'mongodb';

import {
  User as GQLUser,
} from '../../generated/graphql';

export {
  User as GQLUser,
} from '../../generated/graphql';

export type MongoUser = {
  _id: ObjectID,
  color: string | null,
  name: string | null,
}

class User {
  _id?: ObjectID = undefined;
  name: string | null = null;
  color: string | null = null;

  // class methods will not be preserved in storage
  constructor(id?: string | ObjectID, base?: {mongo?: Partial<MongoUser>, gql?: Partial<GQLUser>}) {
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
      } else if (base.mongo) {
        this.fromMongoDB(base.mongo);
      }
    }
  }

  fromGQL(gql: Partial<GQLUser>): User {
    if (typeof gql.name !== 'undefined') { this.name = gql.name; }
    if (typeof gql.color !== 'undefined') { this.color = gql.color; }
    return this;
  }

  fromMongoDB(mongo: Partial<MongoUser>): User {
    if (typeof mongo.name !== 'undefined') { this.name = mongo.name; }
    if (typeof mongo.color !== 'undefined') { this.color = mongo.color; }
    return this;
  }

  toGQL(): GQLUser {
    return {
      id: (this._id) ? this._id : null,
      name: this.name,
      color: this.color,
    };
  }

  toMongoDB(): MongoUser {
    return {
      _id: this._id,
      name: this.name,
      color: this.color,
    };
  }

  static gqlFields(): string {
    return `
      id
      name
      color
    `;
  }
}

export default User;
