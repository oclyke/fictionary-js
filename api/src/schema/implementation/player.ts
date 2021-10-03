/*
// This file is subject to the terms and conditions defined in
// file 'LICENSE.md', which is part of this source code package.
*/

import {
  ObjectID,
} from 'mongodb';

import {
  Player as GQLPlayer,
  Scalars as GQLScalars,
} from '../../generated/graphql';

type BaseType = {
  name?: string | GQLScalars['String'],
  color?: string | GQLScalars['String'],
}

class Player {
  readonly _id?: ObjectID = undefined;
  private name = '';
  private color = '';

  // class methods will not be preserved in storage
  constructor(id?: string | ObjectID, base?: BaseType) {
    if (id) {
      if (id instanceof ObjectID) {
        this._id = id;
      } else {
        this._id = new ObjectID(id);
      }
    }
    if (base) {
      this.#copyBase(base);
    }
  }

  #copyBase(base: BaseType): void {
    if (typeof base.name !== 'undefined') { this.name = base.name; }
    if (typeof base.color !== 'undefined') { this.color = base.color; }
  }

  set(base: BaseType): Player {
    this.#copyBase(base);
    return this;
  }

  toGQL(): GQLPlayer {
    return {
      id: (this._id) ? this._id : null,
      name: this.name,
      color: this.color,
    };
  }
}

export default Player;
