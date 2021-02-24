/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSession = /* GraphQL */ `
  query GetSession($id: ID!) {
    getSession(id: $id) {
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
export const listSessions = /* GraphQL */ `
  query ListSessions(
    $filter: ModelSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
          status_override
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const sessionByTag = /* GraphQL */ `
  query SessionByTag(
    $tag: String
    $sortDirection: ModelSortDirection
    $filter: ModelSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    sessionByTag(
      tag: $tag
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
          status_override
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
