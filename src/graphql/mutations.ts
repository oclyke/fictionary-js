/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSession = /* GraphQL */ `
  mutation CreateSession(
    $input: CreateSessionInput!
    $condition: ModelSessionConditionInput
  ) {
    createSession(input: $input, condition: $condition) {
      id
      tag
      players {
        id
        name
        color
      }
      words {
        id
        text
        author
        committee
        definitions {
          id
          text
          author
          votes
        }
        status_override
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateSession = /* GraphQL */ `
  mutation UpdateSession(
    $input: UpdateSessionInput!
    $condition: ModelSessionConditionInput
  ) {
    updateSession(input: $input, condition: $condition) {
      id
      tag
      players {
        id
        name
        color
      }
      words {
        id
        text
        author
        committee
        definitions {
          id
          text
          author
          votes
        }
        status_override
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteSession = /* GraphQL */ `
  mutation DeleteSession(
    $input: DeleteSessionInput!
    $condition: ModelSessionConditionInput
  ) {
    deleteSession(input: $input, condition: $condition) {
      id
      tag
      players {
        id
        name
        color
      }
      words {
        id
        text
        author
        committee
        definitions {
          id
          text
          author
          votes
        }
        status_override
      }
      createdAt
      updatedAt
    }
  }
`;
