/*
// This file is subject to the terms and conditions defined in
// file 'LICENSE.md', which is part of this source code package.
*/

import {
  PlayerInput,
} from './../API';

const PLAYER_KEY = 'player';

export const getLocalPlayer = (): (PlayerInput | null) => {
  const s = localStorage.getItem(PLAYER_KEY);
  if(s){
    const obj = JSON.parse(s);
    if((typeof(obj.id) === 'string') && (typeof(obj.name) === 'string') && (typeof(obj.color) === 'string')){
      const player: PlayerInput = {
        id: obj.id,
        name: obj.name,
        color: obj.color,
      }
      return player;
    }
  }
  return null;
}

export const setLocalPlayer = (player: PlayerInput) => {
  localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
}
