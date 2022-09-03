import {
  GraphQLFieldResolver,
  GraphQLInputObjectType,
  GraphQLResolveInfo,
  GraphQLString,
  GraphQLList,
} from 'graphql'

import {
  connectionArgs,
} from 'graphql-relay'

import {
  DatabaseContextError,
} from './errors'

import {
  isDatabase,
  WithDatabase,
} from '../../../backend/src'

function contextHasDatabase<TSchema> (context: unknown): context is WithDatabase<TSchema> {
  let result = false
  if (typeof context === 'object') {
    if (isDatabase((context as any).db)) {
      result = true
    }
  }
  return result
}

// decorator for resolvers
export function resolverWithDatabase<Tsource, Tcontext, Targs = any, Tresult=unknown>(resolver: GraphQLFieldResolver<Tsource, WithDatabase<Tcontext>, Targs, Tresult>) {
  const wrapped: GraphQLFieldResolver<Tsource, Tcontext, Targs, Tresult> = (parent, args, context, info) => {
    if (!contextHasDatabase(context)) {
      throw new DatabaseContextError()
    }
    return resolver(parent, args, context, info)
  }
  return wrapped
}

type MutatorFn <
  Targs,
  Tcontext,
  Tresult = unknown
> = (
  args: Targs,
  context: WithDatabase<Tcontext>,
  info: GraphQLResolveInfo
) => Tresult

export function mutatorWithDatabase<Targs, Tcontext, Tresult = unknown> (mutator: MutatorFn<Targs, Tcontext, Tresult>) {
  const wrapped: MutatorFn<Targs, Tcontext, Tresult> = (args, context, info) => {
    if (!contextHasDatabase(context)) {
      throw new DatabaseContextError()
    }
    return mutator(args, context, info)
  }
  return wrapped
}

export const StringFilterInputType = new GraphQLInputObjectType({
  name: 'StringFilterInput',
  fields: () => ({
    eq: {
      type: GraphQLString,
    },
    neq: {
      type: GraphQLString,
    },
    in: {
      type: new GraphQLList(GraphQLString),
    },
    nin: {
      type: new GraphQLList(GraphQLString),
    },
    glob: {
      type: GraphQLString,
    },
    regex: {
      type: GraphQLString,
    },
  }),
})

export const PaginationInputType = new GraphQLInputObjectType({
  name: 'PaginationInput',
  fields: () => ({
    ...connectionArgs,
  }),
})
