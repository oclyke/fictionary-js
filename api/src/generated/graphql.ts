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

export type DefinitionTuple = {
  __typename?: 'DefinitionTuple';
  id: Scalars['ID'];
  value: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPlayer: Maybe<Player>;
  createRoom: Maybe<Room>;
};


export type MutationCreateRoomArgs = {
  tag: Scalars['String'];
};

export type Player = {
  __typename?: 'Player';
  _id: Maybe<Scalars['ID']>;
  color: Scalars['String'];
  overallScore: Maybe<Scalars['Int']>;
  tag: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getPlayerById: Maybe<Player>;
  getRoomById: Maybe<Room>;
  getRoomByTag: Maybe<Room>;
};


export type QueryGetPlayerByIdArgs = {
  id: Scalars['ID'];
};


export type QueryGetRoomByIdArgs = {
  id: Scalars['ID'];
};


export type QueryGetRoomByTagArgs = {
  tag: Scalars['String'];
};

export type Room = {
  __typename?: 'Room';
  _id: Maybe<Scalars['ID']>;
  players: Array<Player>;
  scores: Array<ScoreTuple>;
  tag: Scalars['String'];
  words: Array<Word>;
};

export type ScoreTuple = {
  __typename?: 'ScoreTuple';
  id: Scalars['ID'];
  score: Scalars['Int'];
};

export type VoteTuple = {
  __typename?: 'VoteTuple';
  id: Scalars['ID'];
  proposerid: Scalars['ID'];
};

export type Word = {
  __typename?: 'Word';
  authorid: Scalars['ID'];
  definitions: Array<DefinitionTuple>;
  state: WordState;
  voters: Array<Scalars['ID']>;
  votes: Array<VoteTuple>;
};

export enum WordState {
  Closed = 'CLOSED',
  Open = 'OPEN',
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
  DefinitionTuple: ResolverTypeWrapper<DefinitionTuple>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Mutation: ResolverTypeWrapper<{}>;
  Player: ResolverTypeWrapper<Player>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Query: ResolverTypeWrapper<{}>;
  Room: ResolverTypeWrapper<Room>;
  ScoreTuple: ResolverTypeWrapper<ScoreTuple>;
  VoteTuple: ResolverTypeWrapper<VoteTuple>;
  Word: ResolverTypeWrapper<Word>;
  WordState: WordState;
  AdditionalEntityFields: AdditionalEntityFields;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  DefinitionTuple: DefinitionTuple;
  ID: Scalars['ID'];
  String: Scalars['String'];
  Mutation: {};
  Player: Player;
  Int: Scalars['Int'];
  Query: {};
  Room: Room;
  ScoreTuple: ScoreTuple;
  VoteTuple: VoteTuple;
  Word: Word;
  AdditionalEntityFields: AdditionalEntityFields;
  Boolean: Scalars['Boolean'];
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

export type DefinitionTupleResolvers<ContextType = any, ParentType extends ResolversParentTypes['DefinitionTuple'] = ResolversParentTypes['DefinitionTuple']> = {
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  value: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createPlayer: Resolver<Maybe<ResolversTypes['Player']>, ParentType, ContextType>;
  createRoom: Resolver<Maybe<ResolversTypes['Room']>, ParentType, ContextType, RequireFields<MutationCreateRoomArgs, 'tag'>>;
};

export type PlayerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player']> = {
  _id: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  color: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  overallScore: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  tag: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getPlayerById: Resolver<Maybe<ResolversTypes['Player']>, ParentType, ContextType, RequireFields<QueryGetPlayerByIdArgs, 'id'>>;
  getRoomById: Resolver<Maybe<ResolversTypes['Room']>, ParentType, ContextType, RequireFields<QueryGetRoomByIdArgs, 'id'>>;
  getRoomByTag: Resolver<Maybe<ResolversTypes['Room']>, ParentType, ContextType, RequireFields<QueryGetRoomByTagArgs, 'tag'>>;
};

export type RoomResolvers<ContextType = any, ParentType extends ResolversParentTypes['Room'] = ResolversParentTypes['Room']> = {
  _id: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  players: Resolver<Array<ResolversTypes['Player']>, ParentType, ContextType>;
  scores: Resolver<Array<ResolversTypes['ScoreTuple']>, ParentType, ContextType>;
  tag: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  words: Resolver<Array<ResolversTypes['Word']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ScoreTupleResolvers<ContextType = any, ParentType extends ResolversParentTypes['ScoreTuple'] = ResolversParentTypes['ScoreTuple']> = {
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  score: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VoteTupleResolvers<ContextType = any, ParentType extends ResolversParentTypes['VoteTuple'] = ResolversParentTypes['VoteTuple']> = {
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  proposerid: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WordResolvers<ContextType = any, ParentType extends ResolversParentTypes['Word'] = ResolversParentTypes['Word']> = {
  authorid: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  definitions: Resolver<Array<ResolversTypes['DefinitionTuple']>, ParentType, ContextType>;
  state: Resolver<ResolversTypes['WordState'], ParentType, ContextType>;
  voters: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  votes: Resolver<Array<ResolversTypes['VoteTuple']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  DefinitionTuple: DefinitionTupleResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  Player: PlayerResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  Room: RoomResolvers<ContextType>;
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