import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreateGameInput = {
  clientMutationId: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type CreateGamePayload = {
  __typename?: 'CreateGamePayload';
  clientMutationId: Maybe<Scalars['String']>;
  game: Maybe<Game>;
};

/** Definition information. */
export type DefinitionTuple = {
  __typename?: 'DefinitionTuple';
  /** The ID of the player whose definition is recorded in the tuple. */
  id: Scalars['String'];
  /** The definition associated with this ID. */
  value: Scalars['String'];
};

/** Definition of a word. */
export type Game = Node & {
  __typename?: 'Game';
  /** Date of game creation. */
  created: Maybe<Scalars['String']>;
  /** The ID of an object */
  id: Scalars['ID'];
  /** The name of the game. */
  name: Maybe<Scalars['String']>;
  /** Connection to players who participated in the game. */
  players: Maybe<PlayerConnection>;
  /** Words of the game. */
  scores: Maybe<Array<Maybe<ScoreTuple>>>;
  /** Date when game was last updated. */
  updated: Maybe<Scalars['String']>;
  /** Words of the game. */
  words: Maybe<Array<Maybe<Word>>>;
};


/** Definition of a word. */
export type GamePlayersArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
};

/** A connection to a list of items. */
export type GameConnection = {
  __typename?: 'GameConnection';
  /** A list of edges. */
  edges: Maybe<Array<Maybe<GameEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type GameEdge = {
  __typename?: 'GameEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node: Maybe<Game>;
};

/** Meta information about fictionary. */
export type Meta = Node & {
  __typename?: 'Meta';
  /** The description of fictionary. */
  description: Maybe<Scalars['String']>;
  /** Individual Games of fictionary. */
  games: Maybe<GameConnection>;
  /** The ID of an object */
  id: Scalars['ID'];
  /** The name of fictionary. */
  name: Maybe<Scalars['String']>;
  /** The Players who have played fictionary. */
  players: Maybe<PlayerConnection>;
};


/** Meta information about fictionary. */
export type MetaGamesArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
};


/** Meta information about fictionary. */
export type MetaPlayersArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createGame: Maybe<CreateGamePayload>;
};


export type MutationCreateGameArgs = {
  input: CreateGameInput;
};

/** An object with an ID */
export type Node = {
  /** The id of the object. */
  id: Scalars['ID'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor: Maybe<Scalars['String']>;
};

/** Player information. */
export type Player = Node & {
  __typename?: 'Player';
  /** The description of fictionary. */
  color: Maybe<Scalars['String']>;
  /** Individual Games of fictionary. */
  games: Maybe<GameConnection>;
  /** The ID of an object */
  id: Scalars['ID'];
  /** The players name. */
  name: Maybe<Scalars['String']>;
  /** The players overall score. */
  overallScore: Maybe<Scalars['Int']>;
};


/** Player information. */
export type PlayerGamesArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
};

/** A connection to a list of items. */
export type PlayerConnection = {
  __typename?: 'PlayerConnection';
  /** A list of edges. */
  edges: Maybe<Array<Maybe<PlayerEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type PlayerEdge = {
  __typename?: 'PlayerEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node: Maybe<Player>;
};

export type Query = {
  __typename?: 'Query';
  gameById: Maybe<Game>;
  gameByTag: Maybe<Game>;
  meta: Maybe<Meta>;
  /** Fetches an object given its ID */
  node: Maybe<Node>;
  player: Maybe<Player>;
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};

/** Scoring information. */
export type ScoreTuple = {
  __typename?: 'ScoreTuple';
  /** The ID of the player whose score is recorded in the tuple. */
  id: Scalars['String'];
  /** The score associated with this ID. */
  score: Scalars['Int'];
};

/** Word state information. */
export type VoteTuple = {
  __typename?: 'VoteTuple';
  /** The ID of the player whose vote is recorded in the tuple. */
  id: Scalars['String'];
  /** The id of the proposer whose definition is voted for. */
  proposerId: Scalars['String'];
};

/** In-game Word information. */
export type Word = {
  __typename?: 'Word';
  /** The ID of the author of the Word. */
  authorid: Scalars['String'];
  /** Proposed definitions of the word. */
  definitions: Array<DefinitionTuple>;
  /** The Word state. */
  state: WordState;
  /** the  */
  value: Scalars['String'];
  /** IDs of players who are allowed to vote on this Word. */
  voters: Array<Scalars['String']>;
  /** Votes cast for various definitions by eligible players. */
  votes: Array<VoteTuple>;
};

/** Vote information. */
export enum WordState {
  /** Word is closed and may be used to compute scores. */
  Closed = 'CLOSED',
  /** Word is open for definition proposal. */
  Open = 'OPEN',
  /** Word is closed for definition proposal and is in voting period. */
  Voting = 'VOTING'
}

export type AdditionalEntityFields = {
  path: InputMaybe<Scalars['String']>;
  type: InputMaybe<Scalars['String']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  CreateGameInput: CreateGameInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  CreateGamePayload: ResolverTypeWrapper<CreateGamePayload>;
  DefinitionTuple: ResolverTypeWrapper<DefinitionTuple>;
  Game: ResolverTypeWrapper<Game>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  GameConnection: ResolverTypeWrapper<GameConnection>;
  GameEdge: ResolverTypeWrapper<GameEdge>;
  Meta: ResolverTypeWrapper<Meta>;
  Mutation: ResolverTypeWrapper<{}>;
  Node: ResolversTypes['Game'] | ResolversTypes['Meta'] | ResolversTypes['Player'];
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Player: ResolverTypeWrapper<Player>;
  PlayerConnection: ResolverTypeWrapper<PlayerConnection>;
  PlayerEdge: ResolverTypeWrapper<PlayerEdge>;
  Query: ResolverTypeWrapper<{}>;
  ScoreTuple: ResolverTypeWrapper<ScoreTuple>;
  VoteTuple: ResolverTypeWrapper<VoteTuple>;
  Word: ResolverTypeWrapper<Word>;
  WordState: WordState;
  AdditionalEntityFields: AdditionalEntityFields;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  CreateGameInput: CreateGameInput;
  String: Scalars['String'];
  CreateGamePayload: CreateGamePayload;
  DefinitionTuple: DefinitionTuple;
  Game: Game;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  GameConnection: GameConnection;
  GameEdge: GameEdge;
  Meta: Meta;
  Mutation: {};
  Node: ResolversParentTypes['Game'] | ResolversParentTypes['Meta'] | ResolversParentTypes['Player'];
  PageInfo: PageInfo;
  Boolean: Scalars['Boolean'];
  Player: Player;
  PlayerConnection: PlayerConnection;
  PlayerEdge: PlayerEdge;
  Query: {};
  ScoreTuple: ScoreTuple;
  VoteTuple: VoteTuple;
  Word: Word;
  AdditionalEntityFields: AdditionalEntityFields;
};

export type UnionDirectiveArgs = {
  discriminatorField: Maybe<Scalars['String']>;
  additionalFields: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type UnionDirectiveResolver<Result, Parent, ContextType = any, Args = UnionDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AbstractEntityDirectiveArgs = {
  discriminatorField: Scalars['String'];
  additionalFields: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type AbstractEntityDirectiveResolver<Result, Parent, ContextType = any, Args = AbstractEntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveArgs = {
  embedded: Maybe<Scalars['Boolean']>;
  additionalFields: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type EntityDirectiveResolver<Result, Parent, ContextType = any, Args = EntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ColumnDirectiveArgs = {
  overrideType: Maybe<Scalars['String']>;
};

export type ColumnDirectiveResolver<Result, Parent, ContextType = any, Args = ColumnDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type IdDirectiveArgs = { };

export type IdDirectiveResolver<Result, Parent, ContextType = any, Args = IdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type LinkDirectiveArgs = {
  overrideType: Maybe<Scalars['String']>;
};

export type LinkDirectiveResolver<Result, Parent, ContextType = any, Args = LinkDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EmbeddedDirectiveArgs = { };

export type EmbeddedDirectiveResolver<Result, Parent, ContextType = any, Args = EmbeddedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MapDirectiveArgs = {
  path: Scalars['String'];
};

export type MapDirectiveResolver<Result, Parent, ContextType = any, Args = MapDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type CreateGamePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateGamePayload'] = ResolversParentTypes['CreateGamePayload']> = {
  clientMutationId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  game: Resolver<Maybe<ResolversTypes['Game']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DefinitionTupleResolvers<ContextType = any, ParentType extends ResolversParentTypes['DefinitionTuple'] = ResolversParentTypes['DefinitionTuple']> = {
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GameResolvers<ContextType = any, ParentType extends ResolversParentTypes['Game'] = ResolversParentTypes['Game']> = {
  created: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  players: Resolver<Maybe<ResolversTypes['PlayerConnection']>, ParentType, ContextType, Partial<GamePlayersArgs>>;
  scores: Resolver<Maybe<Array<Maybe<ResolversTypes['ScoreTuple']>>>, ParentType, ContextType>;
  updated: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  words: Resolver<Maybe<Array<Maybe<ResolversTypes['Word']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GameConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameConnection'] = ResolversParentTypes['GameConnection']> = {
  edges: Resolver<Maybe<Array<Maybe<ResolversTypes['GameEdge']>>>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GameEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameEdge'] = ResolversParentTypes['GameEdge']> = {
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<Maybe<ResolversTypes['Game']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MetaResolvers<ContextType = any, ParentType extends ResolversParentTypes['Meta'] = ResolversParentTypes['Meta']> = {
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  games: Resolver<Maybe<ResolversTypes['GameConnection']>, ParentType, ContextType, Partial<MetaGamesArgs>>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  players: Resolver<Maybe<ResolversTypes['PlayerConnection']>, ParentType, ContextType, Partial<MetaPlayersArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createGame: Resolver<Maybe<ResolversTypes['CreateGamePayload']>, ParentType, ContextType, RequireFields<MutationCreateGameArgs, 'input'>>;
};

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'Game' | 'Meta' | 'Player', ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlayerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player']> = {
  color: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  games: Resolver<Maybe<ResolversTypes['GameConnection']>, ParentType, ContextType, Partial<PlayerGamesArgs>>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  overallScore: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlayerConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlayerConnection'] = ResolversParentTypes['PlayerConnection']> = {
  edges: Resolver<Maybe<Array<Maybe<ResolversTypes['PlayerEdge']>>>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlayerEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlayerEdge'] = ResolversParentTypes['PlayerEdge']> = {
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<Maybe<ResolversTypes['Player']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  gameById: Resolver<Maybe<ResolversTypes['Game']>, ParentType, ContextType>;
  gameByTag: Resolver<Maybe<ResolversTypes['Game']>, ParentType, ContextType>;
  meta: Resolver<Maybe<ResolversTypes['Meta']>, ParentType, ContextType>;
  node: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'id'>>;
  player: Resolver<Maybe<ResolversTypes['Player']>, ParentType, ContextType>;
};

export type ScoreTupleResolvers<ContextType = any, ParentType extends ResolversParentTypes['ScoreTuple'] = ResolversParentTypes['ScoreTuple']> = {
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  score: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VoteTupleResolvers<ContextType = any, ParentType extends ResolversParentTypes['VoteTuple'] = ResolversParentTypes['VoteTuple']> = {
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  proposerId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WordResolvers<ContextType = any, ParentType extends ResolversParentTypes['Word'] = ResolversParentTypes['Word']> = {
  authorid: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  definitions: Resolver<Array<ResolversTypes['DefinitionTuple']>, ParentType, ContextType>;
  state: Resolver<ResolversTypes['WordState'], ParentType, ContextType>;
  value: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  voters: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  votes: Resolver<Array<ResolversTypes['VoteTuple']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  CreateGamePayload: CreateGamePayloadResolvers<ContextType>;
  DefinitionTuple: DefinitionTupleResolvers<ContextType>;
  Game: GameResolvers<ContextType>;
  GameConnection: GameConnectionResolvers<ContextType>;
  GameEdge: GameEdgeResolvers<ContextType>;
  Meta: MetaResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  Node: NodeResolvers<ContextType>;
  PageInfo: PageInfoResolvers<ContextType>;
  Player: PlayerResolvers<ContextType>;
  PlayerConnection: PlayerConnectionResolvers<ContextType>;
  PlayerEdge: PlayerEdgeResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  ScoreTuple: ScoreTupleResolvers<ContextType>;
  VoteTuple: VoteTupleResolvers<ContextType>;
  Word: WordResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  union: UnionDirectiveResolver<any, any, ContextType>;
  abstractEntity: AbstractEntityDirectiveResolver<any, any, ContextType>;
  entity: EntityDirectiveResolver<any, any, ContextType>;
  column: ColumnDirectiveResolver<any, any, ContextType>;
  id: IdDirectiveResolver<any, any, ContextType>;
  link: LinkDirectiveResolver<any, any, ContextType>;
  embedded: EmbeddedDirectiveResolver<any, any, ContextType>;
  map: MapDirectiveResolver<any, any, ContextType>;
};

import { ObjectId } from 'mongodb';