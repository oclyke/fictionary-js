import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLEnumType,
  GraphQLList,
} from 'graphql'

/**
 * Define the Word type.
 *
 * This implements the following type system shorthand:
 * type Word {
 *   value: String!
 *   authorid: ID! # the author's id is used to find the 'true' definition
 *   voters: [ID!]!
 *   definitions: [DefinitionTuple!]!
 *   votes: [VoteTuple!]!
 *   state: WordState!
 * }
 */
export const WordType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Word',
  description: 'In-game Word information.',
  fields: () => ({
    value: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'the '
    },
    authorid: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The ID of the author of the Word.',
    },
    voters: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
      description: 'IDs of players who are allowed to vote on this Word.'
    },
    definitions: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(DefinitionTupleType))),
      description: 'Proposed definitions of the word.'
    },
    votes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(VoteTupleType))),
      description: 'Votes cast for various definitions by eligible players.'
    },
    state: {
      type: new GraphQLNonNull(WordStateType),
      description: 'The Word state.'
    },
  }),
});

/**
 * Define the WordState type.
 *
 * This implements the following type system shorthand:
 * type VoteTuple {
 *   id: ID!         # id of voter
 *   proposerId: ID! # id of proposer to which the vote goes
 * }
 */
const WordStateType: GraphQLEnumType = new GraphQLEnumType({
  name: 'WordState',
  description: 'Vote information.',
  values: {
    OPEN: {
      description: 'Word is open for definition proposal.',
    },
    VOTING: {
      description: 'Word is closed for definition proposal and is in voting period.',
    },
    CLOSED: {
      description: 'Word is closed and may be used to compute scores.',
    },
  }
});

/**
 * Define the VoteTuple type.
 *
 * This implements the following type system shorthand:
 * type VoteTuple {
 *   id: ID!         # id of voter
 *   proposerId: ID! # id of proposer to which the vote goes
 * }
 */
const VoteTupleType: GraphQLObjectType = new GraphQLObjectType({
  name: 'VoteTuple',
  description: 'Word state information.',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The ID of the player whose vote is recorded in the tuple.',
    },
    proposerId: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the proposer whose definition is voted for.',
    },
  }),
});

/**
 * Define the DefinitionTuple type.
 *
 * This implements the following type system shorthand:
 * type DefinitionTuple {
 *   id: ID!         # id of proposer
 *   value: String!  # definition
 * }
 */
const DefinitionTupleType: GraphQLObjectType = new GraphQLObjectType({
  name: 'DefinitionTuple',
  description: 'Definition information.',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The ID of the player whose definition is recorded in the tuple.',
    },
    value: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The definition associated with this ID.',
    },
  }),
});


// function makeWord(authorid: string, playerids: string[]): Word {
//   // function get_random_player() {
//   //   const num_players = players.length
//   //   return players[Math.floor(Math.random() * num_players)]
//   // }
//   // const authorid = get_random_player()

//   return {
//     value: '',
//     authorid,
//     voters: playerids.filter(id => id !== authorid),
//     definitions: [],
//     votes: [],
//     state: WordState.Open,
//   }
// }

// export function createWord(authorid: string)
