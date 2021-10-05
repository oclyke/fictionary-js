/* 
// This file is subject to the terms and conditions defined in
// file 'LICENSE.md', which is part of this source code package.
*/

// import {
//   PlayerInput,
//   CreateSessionInput,
//   WordStatus,
// } from './../API';

// import {
//   equal
// } from './players';
// import {
//   getRealDefinition,
//   getPlayerDefinition,
//   getNumberVoters,
//   getStatus,
// } from './words';

export const computeScore = (session: any, player: any): any => {
  console.error('unimplemented');
  return null;
// export const computeScore = (session: CreateSessionInput, player: PlayerInput): number => {
//   // compute the player's score
//   let score = 0;

//   if (typeof(session.words) === 'undefined'){ return score; }
//   if (session.words === null){ return score; }

//   session.words.forEach(word => {
//     if((getStatus(word) !== WordStatus.CLOSED)){ return; }

//     const real = getRealDefinition(word);
//     if(!real){
//       throw new Error('found word without a real defition during scoring');
//     } // don't score words without a real definition

//     const player_def = getPlayerDefinition(word, player);

//     // if the real definition is not selected at all the word author gets as many points as there were voters
//     if(word.author === player.id){
//       if((typeof(real.votes) === 'undefined') || (real.votes === null)  || (real.votes.length === 0)){
//         score += getNumberVoters(word);
//       }
//     }

//     // if the voter guesses the correct definition they are awarded +2 points
//     // (word authors cannot vote and so cannot earn points this way)
//     if((typeof(real.votes) !== 'undefined') && (real.votes !== null) && (real.votes.filter(voter => voter === player.id).length !== 0)){
//       score += 2;
//     }

//     // players are awarded +1 point for every vote received by their phony definition
//     if(player_def){
//       if(!(word.author === player.id)){ // ensures that word authors do not score for votes on the correct definition
//         if(player_def.votes){
//           score += player_def.votes.length;
//         }
//       }
//     }
//   });
//   return score;
}

export const sortPlayers = (session: any, player: any): (any[] | null) => {
  console.error('unimplemented');
  return null;
// export const sortPlayers = (session: CreateSessionInput, player: PlayerInput): (PlayerInput[] | null) => {
//   if (typeof(session.players) === 'undefined'){ return null; }
//   if (session.players === null){ return null; }
//   return [...session.players.filter(p => equal(p, player)), ...session.players.filter(p => !equal(p, player)).sort((a, b) => computeScore(session, b) - computeScore(session, a))];
};



