import {
  IntDict,
  StringDict,
  Dict,
} from './dicts';

import {
  User,
} from '..'

// these classes are only meant to deal with the GraphQL interface, so they have similar fields
// todo: generate suitable classes automatically from the api interface code (we mostly have the tech except the bundlers seem to dislike importing from a parent directory)

export class Definition {
  id?: string = undefined;
  author: string | null = null;
  text: string | null = null;
  voters: string[] | null = null;

  constructor(id?: string, base?: Partial<Definition>) {
    if (typeof id !== 'undefined') { this.id = id; }
    if (typeof base !== 'undefined') { this.fromBase(base); }
  }

  fromBase(base: Partial<Definition>): Definition {
    if (typeof base.author !== 'undefined') { this.author = base.author; }
    if (typeof base.text !== 'undefined') { this.text = base.text; }
    if (typeof base.voters !== 'undefined') { this.voters = base.voters; }
    return this;
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

type WordStatus = string;

export class Word {
  id?: string = undefined;
  author: string | null = null;
  text: string | null = null;
  definitions: Definition[] | null = null;
  comittee: string[] | null = null;
  status: WordStatus = 'PROPOSING';

  constructor(id?: string, base?: Partial<Word>) {
    if (typeof id !== 'undefined') { this.id = id; }
    if (typeof base !== 'undefined') { this.fromBase(base); }
  }

  fromBase(base: Partial<Word>): Word {
    if (typeof base.author !== 'undefined') { this.author = base.author; }
    if (typeof base.text !== 'undefined') { this.text = base.text; }
    if (typeof base.definitions !== 'undefined') { this.definitions = (base.definitions !== null) ? base.definitions.map((d) => new Definition(d.id, d)) : null; }
    if (typeof base.comittee !== 'undefined') { this.comittee = base.comittee; }
    if (typeof base.status !== 'undefined') { this.status = base.status; }
    return this;
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

export class Room {
  id?: string = undefined;
  tag: string | null = null;
  players: string[] = [];
  aliases: Dict<User> = {} // cache of players colors and such
  scores: IntDict = {}; // map of player ids to their scores
  words: Word[] = [];

  constructor(id?: string, base?: Partial<Room>) {
    if (typeof id !== 'undefined') { this.id = id; }
    if (typeof base !== 'undefined') { this.fromBase(base); }
  }

  fromBase(base: Partial<Room>): Room {
    if (typeof base.tag !== 'undefined') { this.tag = base.tag; }
    if (typeof base.players !== 'undefined') { this.players = base.players; }
    if (typeof base.aliases !== 'undefined') { this.aliases = base.aliases; }
    if (typeof base.scores !== 'undefined') { this.scores = base.scores; }
    if (typeof base.words !== 'undefined') { this.words = (base.words !== null) ? base.words.map((w) => new Word(w.id, w)) : null; }
    return this;
  }

  static gqlFields(): string {
    return `
      id
      tag
      players
      aliases
      scores
      words {
        ${Word.gqlFields()}
      }
    `;
  }
}
