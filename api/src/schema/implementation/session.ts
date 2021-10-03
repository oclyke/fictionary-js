/*
// This file is subject to the terms and conditions defined in
// file 'LICENSE.md', which is part of this source code package.
*/

import {
  ObjectID,
} from 'mongodb';

import {
  Player,
  Word,
} from '.';

import {
  Session as GQLSession,
  Player as GQLPlayer,
  Word as GQLWord,
  Scalars as GQLScalars,
} from '../../generated/graphql';

type BaseType = {
  tag?: string | GQLScalars['String'],
  players?: Player[] | GQLPlayer[],
  words?: Word[] | GQLWord[],
}

class Session {
  // bare properties will be persisted in storage
  readonly _id?: ObjectID = undefined;
  private tag = '';
  private players: Player[] = [];
  private words: Word[] = [];

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
    if (typeof base.tag !== 'undefined') { this.tag = base.tag; }
    if (typeof base.players !== 'undefined') { this.players = base.players.map((p) => ((p instanceof Player) ? p : new Player(p.id, p))); }
    if (typeof base.words !== 'undefined') { this.words = base.words.map((w) => ((w instanceof Word) ? w : new Word(w.id, w))); }
  }

  set(base: BaseType): Session {
    this.#copyBase(base);
    return this;
  }

  toGQL(): GQLSession {
    return {
      id: this._id.toHexString(),
      tag: this.tag,
      players: this.players.map((p) => p.toGQL()),
      words: this.words.map((w) => w.toGQL()),
    };
  }
}

export default Session;
