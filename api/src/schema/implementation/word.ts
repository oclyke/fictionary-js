/*
// This file is subject to the terms and conditions defined in
// file 'LICENSE.md', which is part of this source code package.
*/

import {
  ObjectID,
} from 'mongodb';

import {
  Definition,
} from '.';

import {
  Word as GQLWord,
  WordStatus as GQLWordStatus,
  Definition as GQLDefinition,
  Scalars as GQLScalars,
} from '../../generated/graphql';

type BaseType = {
  author_id?: string | GQLScalars['String'],
  text?: string | GQLScalars['String'],
  definitions?: Definition[] | GQLDefinition[],
  comittee_ids?: string[] | GQLScalars['String'][],
  status?: GQLWordStatus,
}

class Word {
  readonly _id?: ObjectID = undefined;
  private author_id = '';
  private text = '';
  private definitions: Definition[] = [];
  private comittee_ids: string[] = [];
  private status: GQLWordStatus = GQLWordStatus.None;

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
    if (typeof base.definitions !== 'undefined') { this.definitions = base.definitions.map((d) => ((d instanceof Definition) ? d : new Definition(d.id, d))); }
  }

  set(base: BaseType): Word {
    this.#copyBase(base);
    return this;
  }

  toGQL(): GQLWord {
    return {
      id: this._id.toHexString(),
      text: this.text,
      author_id: this.author_id,
      comittee_ids: this.comittee_ids,
      definitions: this.definitions.map((d) => (d.toGQL())),
      status: this.status,
    };
  }
}

export default Word;
