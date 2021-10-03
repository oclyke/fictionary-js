/*
// This file is subject to the terms and conditions defined in
// file 'LICENSE.md', which is part of this source code package.
*/

import {
  ObjectID,
} from 'mongodb';

import {
  Definition as GQLDefinition,
  Scalars as GQLScalars,
} from '../../generated/graphql';

type BaseType = {
  author_id?: string | GQLScalars['String'],
  text?: string | GQLScalars['String'],
  voter_ids?: string[] | GQLScalars['String'][],
}

class Definition {
  // bare properties will be persisted in storage
  readonly _id?: ObjectID = undefined;
  private author_id = '';
  private text = '';
  private voter_ids: string[] = [];

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
    if (typeof base.author_id !== 'undefined') { this.author_id = base.author_id; }
    if (typeof base.text !== 'undefined') { this.text = base.text; }
    if (typeof base.voter_ids !== 'undefined') { this.voter_ids = base.voter_ids; }
  }

  set(base: BaseType): Definition {
    this.#copyBase(base);
    return this;
  }

  toGQL(): GQLDefinition {
    return {
      id: this._id.toHexString(),
      author_id: this.author_id,
      text: this.text,
      voter_ids: this.voter_ids,
    };
  }
}

export default Definition;
