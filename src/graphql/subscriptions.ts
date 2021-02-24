/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateSession = /* GraphQL */ `
  subscription OnCreateSession($id: ID) {
    onCreateSession(id: $id) {
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
export const onUpdateSession = /* GraphQL */ `
  subscription OnUpdateSession($id: ID) {
    onUpdateSession(id: $id) {
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
export const onDeleteSession = /* GraphQL */ `
  subscription OnDeleteSession($id: ID) {
    onDeleteSession(id: $id) {
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
