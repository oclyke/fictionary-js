/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateSessionInput = {
  id?: string | null,
  tag: string,
  players?: Array< PlayerInput > | null,
  words?: Array< WordInput > | null,
};

export type PlayerInput = {
  id: string,
  name: string,
  color: string,
};

export type WordInput = {
  id: string,
  text: string,
  author: string,
  committee?: Array< string > | null,
  definitions?: Array< DefinitionInput > | null,
  status_override?: WordStatus | null,
};

export type DefinitionInput = {
  id: string,
  text: string,
  author: string,
  votes?: Array< string > | null,
};

export enum WordStatus {
  NONE = "NONE",
  OPEN = "OPEN",
  VOTING = "VOTING",
  CLOSED = "CLOSED",
}


export type ModelSessionConditionInput = {
  tag?: ModelStringInput | null,
  and?: Array< ModelSessionConditionInput | null > | null,
  or?: Array< ModelSessionConditionInput | null > | null,
  not?: ModelSessionConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type Session = {
  __typename: "Session",
  id?: string,
  tag?: string,
  players?:  Array<Player > | null,
  words?:  Array<Word > | null,
  createdAt?: string,
  updatedAt?: string,
};

export type Player = {
  __typename: "Player",
  id?: string,
  name?: string,
  color?: string,
};

export type Word = {
  __typename: "Word",
  id?: string,
  text?: string,
  author?: string,
  committee?: Array< string > | null,
  definitions?:  Array<Definition > | null,
  status_override?: WordStatus | null,
};

export type Definition = {
  __typename: "Definition",
  id?: string,
  text?: string,
  author?: string,
  votes?: Array< string > | null,
};

export type UpdateSessionInput = {
  id: string,
  tag?: string | null,
  players?: Array< PlayerInput > | null,
  words?: Array< WordInput > | null,
};

export type DeleteSessionInput = {
  id?: string | null,
};

export type ModelSessionFilterInput = {
  id?: ModelIDInput | null,
  tag?: ModelStringInput | null,
  and?: Array< ModelSessionFilterInput | null > | null,
  or?: Array< ModelSessionFilterInput | null > | null,
  not?: ModelSessionFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelSessionConnection = {
  __typename: "ModelSessionConnection",
  items?:  Array<Session | null > | null,
  nextToken?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type CreateSessionMutationVariables = {
  input?: CreateSessionInput,
  condition?: ModelSessionConditionInput | null,
};

export type CreateSessionMutation = {
  createSession?:  {
    __typename: "Session",
    id: string,
    tag: string,
    players?:  Array< {
      __typename: "Player",
      id: string,
      name: string,
      color: string,
    } > | null,
    words?:  Array< {
      __typename: "Word",
      id: string,
      text: string,
      author: string,
      committee?: Array< string > | null,
      definitions?:  Array< {
        __typename: "Definition",
        id: string,
        text: string,
        author: string,
        votes?: Array< string > | null,
      } > | null,
      status_override?: WordStatus | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateSessionMutationVariables = {
  input?: UpdateSessionInput,
  condition?: ModelSessionConditionInput | null,
};

export type UpdateSessionMutation = {
  updateSession?:  {
    __typename: "Session",
    id: string,
    tag: string,
    players?:  Array< {
      __typename: "Player",
      id: string,
      name: string,
      color: string,
    } > | null,
    words?:  Array< {
      __typename: "Word",
      id: string,
      text: string,
      author: string,
      committee?: Array< string > | null,
      definitions?:  Array< {
        __typename: "Definition",
        id: string,
        text: string,
        author: string,
        votes?: Array< string > | null,
      } > | null,
      status_override?: WordStatus | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteSessionMutationVariables = {
  input?: DeleteSessionInput,
  condition?: ModelSessionConditionInput | null,
};

export type DeleteSessionMutation = {
  deleteSession?:  {
    __typename: "Session",
    id: string,
    tag: string,
    players?:  Array< {
      __typename: "Player",
      id: string,
      name: string,
      color: string,
    } > | null,
    words?:  Array< {
      __typename: "Word",
      id: string,
      text: string,
      author: string,
      committee?: Array< string > | null,
      definitions?:  Array< {
        __typename: "Definition",
        id: string,
        text: string,
        author: string,
        votes?: Array< string > | null,
      } > | null,
      status_override?: WordStatus | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetSessionQueryVariables = {
  id?: string,
};

export type GetSessionQuery = {
  getSession?:  {
    __typename: "Session",
    id: string,
    tag: string,
    players?:  Array< {
      __typename: "Player",
      id: string,
      name: string,
      color: string,
    } > | null,
    words?:  Array< {
      __typename: "Word",
      id: string,
      text: string,
      author: string,
      committee?: Array< string > | null,
      definitions?:  Array< {
        __typename: "Definition",
        id: string,
        text: string,
        author: string,
        votes?: Array< string > | null,
      } > | null,
      status_override?: WordStatus | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListSessionsQueryVariables = {
  filter?: ModelSessionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSessionsQuery = {
  listSessions?:  {
    __typename: "ModelSessionConnection",
    items?:  Array< {
      __typename: "Session",
      id: string,
      tag: string,
      players?:  Array< {
        __typename: "Player",
        id: string,
        name: string,
        color: string,
      } > | null,
      words?:  Array< {
        __typename: "Word",
        id: string,
        text: string,
        author: string,
        committee?: Array< string > | null,
        status_override?: WordStatus | null,
      } > | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type SessionByTagQueryVariables = {
  tag?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelSessionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type SessionByTagQuery = {
  sessionByTag?:  {
    __typename: "ModelSessionConnection",
    items?:  Array< {
      __typename: "Session",
      id: string,
      tag: string,
      players?:  Array< {
        __typename: "Player",
        id: string,
        name: string,
        color: string,
      } > | null,
      words?:  Array< {
        __typename: "Word",
        id: string,
        text: string,
        author: string,
        committee?: Array< string > | null,
        status_override?: WordStatus | null,
      } > | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type OnCreateSessionSubscriptionVariables = {
  id?: string | null,
};

export type OnCreateSessionSubscription = {
  onCreateSession?:  {
    __typename: "Session",
    id: string,
    tag: string,
    players?:  Array< {
      __typename: "Player",
      id: string,
      name: string,
      color: string,
    } > | null,
    words?:  Array< {
      __typename: "Word",
      id: string,
      text: string,
      author: string,
      committee?: Array< string > | null,
      definitions?:  Array< {
        __typename: "Definition",
        id: string,
        text: string,
        author: string,
        votes?: Array< string > | null,
      } > | null,
      status_override?: WordStatus | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateSessionSubscriptionVariables = {
  id?: string | null,
};

export type OnUpdateSessionSubscription = {
  onUpdateSession?:  {
    __typename: "Session",
    id: string,
    tag: string,
    players?:  Array< {
      __typename: "Player",
      id: string,
      name: string,
      color: string,
    } > | null,
    words?:  Array< {
      __typename: "Word",
      id: string,
      text: string,
      author: string,
      committee?: Array< string > | null,
      definitions?:  Array< {
        __typename: "Definition",
        id: string,
        text: string,
        author: string,
        votes?: Array< string > | null,
      } > | null,
      status_override?: WordStatus | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteSessionSubscriptionVariables = {
  id?: string | null,
};

export type OnDeleteSessionSubscription = {
  onDeleteSession?:  {
    __typename: "Session",
    id: string,
    tag: string,
    players?:  Array< {
      __typename: "Player",
      id: string,
      name: string,
      color: string,
    } > | null,
    words?:  Array< {
      __typename: "Word",
      id: string,
      text: string,
      author: string,
      committee?: Array< string > | null,
      definitions?:  Array< {
        __typename: "Definition",
        id: string,
        text: string,
        author: string,
        votes?: Array< string > | null,
      } > | null,
      status_override?: WordStatus | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
