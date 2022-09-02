import {
  GraphQLFieldResolver,
  GraphQLInputObjectType,
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
export function resolverWithDatabase (resolver?: GraphQLFieldResolver<any, WithDatabase<{}>, any, unknown>) {
  if (typeof resolver === 'undefined') {
    return undefined
  } else {
    const wrapped: GraphQLFieldResolver<any, unknown, any, unknown> = (parent, args, context, info) => {
      if (!contextHasDatabase(context)) {
        throw new DatabaseContextError()
      }
      return resolver(parent, args, context, info)
    }
    return wrapped
  }
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
