import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum WordStatus {
  OPEN = "OPEN",
  VOTING = "VOTING",
  CLOSED = "CLOSED"
}

export declare class Player {
  readonly id: string;
  readonly name: string;
  readonly color: string;
  constructor(init: ModelInit<Player>);
}

export declare class Definition {
  readonly id: string;
  readonly text: string;
  readonly author: string;
  readonly votes?: string[];
  constructor(init: ModelInit<Definition>);
}

export declare class Word {
  readonly id: string;
  readonly text: string;
  readonly author: string;
  readonly committee?: string[];
  readonly definitions?: Definition[];
  readonly status: WordStatus | keyof typeof WordStatus;
  constructor(init: ModelInit<Word>);
}

export declare class Session {
  readonly id: string;
  readonly tag: string;
  readonly players?: Player[];
  readonly words?: Word[];
  constructor(init: ModelInit<Session>);
  static copyOf(source: Session, mutator: (draft: MutableModel<Session>) => MutableModel<Session> | void): Session;
}