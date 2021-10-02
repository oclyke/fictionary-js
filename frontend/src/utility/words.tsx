/* 
// This file is subject to the terms and conditions defined in
// file 'LICENSE.md', which is part of this source code package.
*/

import {
  WordInput,
  DefinitionInput,
  WordStatus,
  PlayerInput,
} from './../API';

export const null_word: WordInput = {
  id: '',
  author: '',
  text: '',
  committee: [],
  definitions: [],
  status_override: WordStatus.NONE,
}

export const getRealDefinition = (w: WordInput): (DefinitionInput | null) => {
  if (typeof(w.definitions) === 'undefined'){ return null; }
  if (w.definitions === null){ return null; }
  return w.definitions.filter(def => def.author === w.author)[0];
}

export const getPlayerDefinition = (w: WordInput, p: PlayerInput): (DefinitionInput | null) => {
  if (typeof(w.definitions) === 'undefined'){ return null; }
  if (w.definitions === null){ return null; }
  const defs = w.definitions.filter(def => (def.author === p.id));
  if(defs.length > 1){
    throw new Error('each player should have at most one definition');
  }
  return defs[0];
}

export const getNumberVoters = (w: WordInput): number => {
  if (typeof(w.definitions) === 'undefined'){ return 0; }
  if (w.definitions === null){ return 0; }
  return w.definitions.map(def => {
    if ((typeof(def.votes) === 'undefined') || (def.votes === null)){ return 0; }
    return def.votes.length;
  }).reduce((acc, num) => acc + num);
}

export const getPosersList = (w: WordInput): string[] | undefined => {
  // return ids of non-author players who have sumbitted a definition
  if(w.definitions){
    let posers: string[] = []
    w.definitions.forEach(def => {
      if(def.author !== w.author){
        posers.push(def.author);
      }
    })
    return posers;
  }
}

export const playerHasVoted = (w: WordInput, player: PlayerInput): boolean => {
  let voted = false;
  w.definitions?.forEach(def => {
    if(def.votes?.includes(player.id)){
      voted = true;
    }
  })
  return voted;
}

export const playerOnCommittee = (w: WordInput, player: PlayerInput) => {
  if(!w.committee){
    return false;
  }
  return w.committee.includes(player.id);
}

export const playerCanVote = (w: WordInput, player: PlayerInput): boolean => {
  return (playerOnCommittee(w, player) && !playerHasVoted(w, player) && !(w.author === player.id));
}

export const playerHasPosed = (w: WordInput, player: PlayerInput): boolean => {
  let posers: string[] = [];
  w.definitions?.forEach(def => posers.push(def.author));
  return (posers.filter(poser => (poser === player.id)).length !== 0);
}

export const playerCanPose = (w: WordInput, player: PlayerInput): boolean => {
  return (playerOnCommittee(w, player) && !playerHasPosed(w, player));
}

export const hasAllDefinitions = (w: WordInput): boolean => {
  if((typeof(w.definitions) === 'undefined') || (w.definitions === null)){
    return false;
  }
  if((typeof(w.committee) === 'undefined') || (w.committee === null)){
    return false;
  }
  return (w.definitions.length === (w.committee.length + 1))
}

export const hasAllVotes = (w: WordInput): boolean => {
  if((typeof(w.committee) === 'undefined') || (w.committee === null)){
    return false;
  }
  const voters = getNumberVoters(w);
  return (voters === w.committee.length)
}

export const getStatus = (w: WordInput): WordStatus => {
  let status: WordStatus = WordStatus.OPEN;
  if(hasAllDefinitions(w) || (w.status_override === WordStatus.VOTING)){
    status = WordStatus.VOTING;
  }
  if(hasAllVotes(w) || (w.status_override === WordStatus.CLOSED)){
    status = WordStatus.CLOSED;
  }
  return status
}

export const getMaxVotes = (w: WordInput): number => {
  let max_votes = 0;
  if(w.definitions){
    w.definitions.forEach(def => {
      if(def.votes){
        if(def.votes.length > max_votes){
          max_votes = def.votes.length;
        }
      }
    });
  }
  return max_votes;
}

