import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  IntDict: any;
  StringDict: any;
  Upload: any;
  UserDict: any;
};

export type AdditionalEntityFields = {
  path: Maybe<Scalars['String']>;
  type: Maybe<Scalars['String']>;
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type Definition = {
  __typename?: 'Definition';
  author: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
  text: Maybe<Scalars['String']>;
  voters: Array<Scalars['ID']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: Maybe<User>;
  joinRoom: Maybe<Room>;
  makeRoom: Maybe<Room>;
  proposeWord: Maybe<Word>;
  updateUser: Maybe<User>;
};


export type MutationCreateUserArgs = {
  input: Maybe<UserInput>;
};


export type MutationJoinRoomArgs = {
  room_id: Scalars['ID'];
  user_id: Scalars['ID'];
};


export type MutationMakeRoomArgs = {
  tag: Scalars['String'];
};


export type MutationProposeWordArgs = {
  definition: Scalars['String'];
  room_id: Scalars['ID'];
  user_id: Scalars['ID'];
  word: Scalars['String'];
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID'];
  input: UserInput;
};

export type Query = {
  __typename?: 'Query';
  getRoom: Maybe<Room>;
  getUser: Maybe<User>;
};


export type QueryGetRoomArgs = {
  id: Maybe<Scalars['ID']>;
  tag: Maybe<Scalars['String']>;
};


export type QueryGetUserArgs = {
  id: Scalars['ID'];
};

export type Room = {
  __typename?: 'Room';
  aliases: Scalars['UserDict'];
  id: Scalars['ID'];
  players: Array<Scalars['ID']>;
  scores: Scalars['IntDict'];
  tag: Maybe<Scalars['String']>;
  words: Array<Word>;
};

export type RoomInput = {
  tag: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  color: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Maybe<Scalars['String']>;
};

export type UserInput = {
  color: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
};

export type Word = {
  __typename?: 'Word';
  author: Maybe<Scalars['ID']>;
  comittee: Array<Scalars['ID']>;
  definitions: Array<Definition>;
  id: Scalars['ID'];
  status: Maybe<WordStatus>;
  text: Maybe<Scalars['String']>;
};

export enum WordStatus {
  None = 'NONE'
}



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
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

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
  AdditionalEntityFields: AdditionalEntityFields;
  String: ResolverTypeWrapper<Scalars['String']>;
  CacheControlScope: CacheControlScope;
  Definition: ResolverTypeWrapper<Definition>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  IntDict: ResolverTypeWrapper<Scalars['IntDict']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Room: ResolverTypeWrapper<Room>;
  RoomInput: RoomInput;
  StringDict: ResolverTypeWrapper<Scalars['StringDict']>;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  User: ResolverTypeWrapper<User>;
  UserDict: ResolverTypeWrapper<Scalars['UserDict']>;
  UserInput: UserInput;
  Word: ResolverTypeWrapper<Word>;
  WordStatus: WordStatus;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AdditionalEntityFields: AdditionalEntityFields;
  String: Scalars['String'];
  Definition: Definition;
  ID: Scalars['ID'];
  IntDict: Scalars['IntDict'];
  Mutation: {};
  Query: {};
  Room: Room;
  RoomInput: RoomInput;
  StringDict: Scalars['StringDict'];
  Upload: Scalars['Upload'];
  User: User;
  UserDict: Scalars['UserDict'];
  UserInput: UserInput;
  Word: Word;
  Boolean: Scalars['Boolean'];
  Int: Scalars['Int'];
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

export type CacheControlDirectiveArgs = {
  maxAge: Maybe<Scalars['Int']>;
  scope: Maybe<CacheControlScope>;
};

export type CacheControlDirectiveResolver<Result, Parent, ContextType = any, Args = CacheControlDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type DefinitionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Definition'] = ResolversParentTypes['Definition']> = {
  author: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  text: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  voters: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface IntDictScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['IntDict'], any> {
  name: 'IntDict';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createUser: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, never>>;
  joinRoom: Resolver<Maybe<ResolversTypes['Room']>, ParentType, ContextType, RequireFields<MutationJoinRoomArgs, 'room_id' | 'user_id'>>;
  makeRoom: Resolver<Maybe<ResolversTypes['Room']>, ParentType, ContextType, RequireFields<MutationMakeRoomArgs, 'tag'>>;
  proposeWord: Resolver<Maybe<ResolversTypes['Word']>, ParentType, ContextType, RequireFields<MutationProposeWordArgs, 'definition' | 'room_id' | 'user_id' | 'word'>>;
  updateUser: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'id' | 'input'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getRoom: Resolver<Maybe<ResolversTypes['Room']>, ParentType, ContextType, RequireFields<QueryGetRoomArgs, never>>;
  getUser: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserArgs, 'id'>>;
};

export type RoomResolvers<ContextType = any, ParentType extends ResolversParentTypes['Room'] = ResolversParentTypes['Room']> = {
  aliases: Resolver<ResolversTypes['UserDict'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  players: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  scores: Resolver<ResolversTypes['IntDict'], ParentType, ContextType>;
  tag: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  words: Resolver<Array<ResolversTypes['Word']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface StringDictScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['StringDict'], any> {
  name: 'StringDict';
}

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  color: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface UserDictScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UserDict'], any> {
  name: 'UserDict';
}

export type WordResolvers<ContextType = any, ParentType extends ResolversParentTypes['Word'] = ResolversParentTypes['Word']> = {
  author: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  comittee: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  definitions: Resolver<Array<ResolversTypes['Definition']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status: Resolver<Maybe<ResolversTypes['WordStatus']>, ParentType, ContextType>;
  text: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Definition: DefinitionResolvers<ContextType>;
  IntDict: GraphQLScalarType;
  Mutation: MutationResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  Room: RoomResolvers<ContextType>;
  StringDict: GraphQLScalarType;
  Upload: GraphQLScalarType;
  User: UserResolvers<ContextType>;
  UserDict: GraphQLScalarType;
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
  cacheControl: CacheControlDirectiveResolver<any, any, ContextType>;
};

import { ObjectID } from 'mongodb';