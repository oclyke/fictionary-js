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

/** A faction in the Star Wars saga */
export type Faction = Node & {
  __typename?: 'Faction';
  /** The ID of an object */
  id: Scalars['ID'];
  /** The name of the faction. */
  name: Maybe<Scalars['String']>;
  /** The ships used by the faction. */
  ships: Maybe<ShipConnection>;
};


/** A faction in the Star Wars saga */
export type FactionShipsArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
};

export type IntroduceShipInput = {
  clientMutationId: InputMaybe<Scalars['String']>;
  factionId: Scalars['ID'];
  shipName: Scalars['String'];
};

export type IntroduceShipPayload = {
  __typename?: 'IntroduceShipPayload';
  clientMutationId: Maybe<Scalars['String']>;
  faction: Maybe<Faction>;
  ship: Maybe<Ship>;
};

export type Mutation = {
  __typename?: 'Mutation';
  introduceShip: Maybe<IntroduceShipPayload>;
};


export type MutationIntroduceShipArgs = {
  input: IntroduceShipInput;
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

export type Query = {
  __typename?: 'Query';
  empire: Maybe<Faction>;
  /** Fetches an object given its ID */
  node: Maybe<Node>;
  rebels: Maybe<Faction>;
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};

/** A ship in the Star Wars saga */
export type Ship = Node & {
  __typename?: 'Ship';
  /** The ID of an object */
  id: Scalars['ID'];
  /** The name of the ship. */
  name: Maybe<Scalars['String']>;
};

/** A connection to a list of items. */
export type ShipConnection = {
  __typename?: 'ShipConnection';
  /** A list of edges. */
  edges: Maybe<Array<Maybe<ShipEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ShipEdge = {
  __typename?: 'ShipEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node: Maybe<Ship>;
};

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
  Faction: ResolverTypeWrapper<Faction>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  IntroduceShipInput: IntroduceShipInput;
  IntroduceShipPayload: ResolverTypeWrapper<IntroduceShipPayload>;
  Mutation: ResolverTypeWrapper<{}>;
  Node: ResolversTypes['Faction'] | ResolversTypes['Ship'];
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Query: ResolverTypeWrapper<{}>;
  Ship: ResolverTypeWrapper<Ship>;
  ShipConnection: ResolverTypeWrapper<ShipConnection>;
  ShipEdge: ResolverTypeWrapper<ShipEdge>;
  AdditionalEntityFields: AdditionalEntityFields;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Faction: Faction;
  ID: Scalars['ID'];
  String: Scalars['String'];
  Int: Scalars['Int'];
  IntroduceShipInput: IntroduceShipInput;
  IntroduceShipPayload: IntroduceShipPayload;
  Mutation: {};
  Node: ResolversParentTypes['Faction'] | ResolversParentTypes['Ship'];
  PageInfo: PageInfo;
  Boolean: Scalars['Boolean'];
  Query: {};
  Ship: Ship;
  ShipConnection: ShipConnection;
  ShipEdge: ShipEdge;
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

export type FactionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Faction'] = ResolversParentTypes['Faction']> = {
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ships: Resolver<Maybe<ResolversTypes['ShipConnection']>, ParentType, ContextType, Partial<FactionShipsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IntroduceShipPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['IntroduceShipPayload'] = ResolversParentTypes['IntroduceShipPayload']> = {
  clientMutationId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  faction: Resolver<Maybe<ResolversTypes['Faction']>, ParentType, ContextType>;
  ship: Resolver<Maybe<ResolversTypes['Ship']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  introduceShip: Resolver<Maybe<ResolversTypes['IntroduceShipPayload']>, ParentType, ContextType, RequireFields<MutationIntroduceShipArgs, 'input'>>;
};

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'Faction' | 'Ship', ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  empire: Resolver<Maybe<ResolversTypes['Faction']>, ParentType, ContextType>;
  node: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'id'>>;
  rebels: Resolver<Maybe<ResolversTypes['Faction']>, ParentType, ContextType>;
};

export type ShipResolvers<ContextType = any, ParentType extends ResolversParentTypes['Ship'] = ResolversParentTypes['Ship']> = {
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShipConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ShipConnection'] = ResolversParentTypes['ShipConnection']> = {
  edges: Resolver<Maybe<Array<Maybe<ResolversTypes['ShipEdge']>>>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShipEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ShipEdge'] = ResolversParentTypes['ShipEdge']> = {
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<Maybe<ResolversTypes['Ship']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Faction: FactionResolvers<ContextType>;
  IntroduceShipPayload: IntroduceShipPayloadResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  Node: NodeResolvers<ContextType>;
  PageInfo: PageInfoResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  Ship: ShipResolvers<ContextType>;
  ShipConnection: ShipConnectionResolvers<ContextType>;
  ShipEdge: ShipEdgeResolvers<ContextType>;
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