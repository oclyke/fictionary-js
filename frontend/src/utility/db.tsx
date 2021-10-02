/* 
// This file is subject to the terms and conditions defined in
// file 'LICENSE.md', which is part of this source code package.
*/
import {
  UpdateSessionInput,
  DeleteSessionInput,
} from './../API';
// import {
//   updateSession,
//   deleteSession,
// } from './../graphql/mutations';

// import {
//   API,
//   graphqlOperation,
// } from 'aws-amplify';
// // import { GraphQLResult } from '@aws-amplify/api';
// import { Observable } from 'zen-observable-ts';

type GraphQLResult<T> = {}; 

export const requestSessionByTag = (tag: string): Promise<GraphQLResult<object>> => {
  console.error('unimplemented');
  return Promise.reject('unimplemented');

  // // (using stringified query tested in GraphIQL)
  // return new Promise((resolve, reject) => {
  //   const options = {
  //     query: `
  //       query sessionByTag {
  //         sessionByTag(tag: "${tag}") {
  //           items {
  //             createdAt
  //             id
  //             players {
  //               color
  //               id
  //               name
  //             }
  //             tag
  //             updatedAt
  //             words {
  //               author
  //               committee
  //               definitions {
  //                 author
  //                 text
  //                 id
  //                 votes
  //               }
  //               status_override
  //               id
  //               text
  //             }
  //           }
  //         }
  //       }
  //     `
  //   };

  //   const operation = API.graphql(options);
  //   if(!(operation instanceof Observable)){
  //     operation.then(resolve).catch(reject);
  //   }else{
  //     reject('expected type Promise<GraphQLResult<object>> but received Observable');
  //   }
  // });
}

export const requestUpdateSession = (input: UpdateSessionInput): Promise<GraphQLResult<object>> => {
  console.error('unimplemented');
  return Promise.reject('unimplemented');

  // return new Promise((resolve, reject) => {
  //   const operation = API.graphql(graphqlOperation(updateSession, {input}));
  //   if(!(operation instanceof Observable)){
  //     operation.then(resolve).catch(reject);
  //   }else{
  //     reject('expected type Promise<GraphQLResult<object>> but received Observable');
  //   }
  // });
}

export const requestDeleteSession = (id: string) => {
  console.error('unimplemented');
  return Promise.reject('unimplemented');

  // const input: DeleteSessionInput = { id };

  // return new Promise((resolve, reject) => {
  //   const operation = API.graphql(graphqlOperation(deleteSession, { input }));
  //   if(!(operation instanceof Observable)){
  //     operation.then(resolve).catch(reject);
  //   }else{
  //     reject('expected type Promise<GraphQLResult<object>> but received Observable');
  //   }
  // });
}

export const requestCreateSessionWithTag = (tag: string): Promise<GraphQLResult<object>> => {
  console.error('unimplemented');
  return Promise.reject('unimplemented');

  // // (using stringified query tested in GraphIQL)
  // return new Promise((resolve, reject) => {
  //   const options = {
  //     query: `
  //       mutation createSessionWithTag {
  //         createSession(input: {tag: "${tag}"}) {
  //           createdAt
  //           id
  //           players {
  //             color
  //             id
  //             name
  //           }
  //           tag
  //           updatedAt
  //           words {
  //             author
  //             committee
  //             definitions {
  //               author
  //               text
  //               id
  //               votes
  //             }
  //             status_override
  //             id
  //             text
  //           }
  //         }
  //       }
  //     `
  //   };

  //   const operation = API.graphql(options);
  //   if (!(operation instanceof Observable)) {
  //     operation.then(resolve).catch(reject);
  //   }else{
  //     reject('expected type Promise<GraphQLResult<object>> but received Observable');
  //   }
  // });
}

export const onUpdateSessionByID = (id: string, callback: (payload: object) => void, onSuccess: () => void) => {
  console.error('unimplemented');
  return Promise.reject('unimplemented');

  // const options = {
  //   query: `
  //     subscription onUpdateSessionWithID {
  //       onUpdateSession(id: "${id}") {
  //         createdAt
  //         id
  //         players {
  //           color
  //           id
  //           name
  //         }
  //         tag
  //         updatedAt
  //         words {
  //           author
  //           committee
  //           definitions {
  //             author
  //             text
  //             id
  //             votes
  //           }
  //           status_override
  //           id
  //           text
  //         }
  //       }
  //     }
  //   `
  // }

  // let subscription = undefined;
  // const operation = API.graphql(options);
  // if (operation instanceof Observable) {
  //   subscription = operation.subscribe({
  //     next: callback
  //   });
  //   onSuccess();
  // }
  // return subscription;
};