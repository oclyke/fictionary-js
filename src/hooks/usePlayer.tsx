/* 
// This file is subject to the terms and conditions defined in
// file 'LICENSE.md', which is part of this source code package.
*/

import React, { useEffect } from 'react';
import {
  useRef,
} from 'react';

import {
  PlayerInput,
  CreateSessionInput,
  UpdateSessionInput,
} from './../API';

import { v4 as uuidv4 } from 'uuid';
import { useSession } from './useSession';
import { useBetween } from 'use-between';

import {
  requestUpdateSession,
} from './../utility/db';
import { suggestId } from '../utility/interactions';

import {
  getLocalPlayer,
  setLocalPlayer,
} from './../utility/local';

const palette = ['#EB9694', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB'];

const null_player: PlayerInput = {
  id: '',
  name: '',
  color: '',
}


const usePlayerCore = (): [React.MutableRefObject<PlayerInput>, (p: PlayerInput) => void] => {
  const player = useRef<PlayerInput>(null_player);
  const [session_ref,,,setSession] = useSession();
  const session = session_ref.current;

  // create the player if they don't have an id
  if(player.current.id === ''){
    // check local storage
    const local_player = getLocalPlayer();
    if(local_player){
      player.current = local_player;
    }else{
      player.current.id = uuidv4();
    }
  }

  // a fn to run when a subscription is added (right now signalling when the player joins a game...)
  const handleSessionSubscriptionAddition = (e: any) => {
    const initial_session = (e.detail as CreateSessionInput);

    if(player.current.id === ''){
      console.log(player.current.id)
      throw new Error('subscription should not occur without a player set up');
    }

    if(!(initial_session.players?.map(p => p.id).includes(player.current.id))){
      const addPlayer = async () => {
        let existing: PlayerInput[] = [];
        if(initial_session.players){
          existing = initial_session.players;
        }

        const idy = existing.length - 1;
        const idx = palette.length - idy - 1;
        const new_color = palette[((idx > 3) ? (2*(idx-4))+1 : 2*idx ) % palette.length];

        let new_player: PlayerInput = {
          ...player.current,
          name: suggestId(),
          color: new_color,
        }

        const local_player = getLocalPlayer();
        if(local_player){
          new_player = local_player;
        }

        const id = (initial_session.id) ? (initial_session.id) : '';
        const players = [...existing, new_player];
        const update: UpdateSessionInput = {
          id,
          players,
        };

        requestUpdateSession(update).then(() => {
          setLocalPlayer(new_player);
          setSession({...initial_session, players});
        }).catch(e => {
          console.error('failed to add player to session! ', e);
        });
      }
      addPlayer();
    }
  }

  // add an event listener to know when the subscription is added - which we will use to add the player to the session
  useEffect(() => {
    window.addEventListener('addsubscription', handleSessionSubscriptionAddition);
  }, []);

  // allow the user to make modifications to the player
  const setPlayer = (input: PlayerInput) => {
    let others: PlayerInput[] = [];
    if((typeof(session.players) !== 'undefined') && (session.players !== null)){
      others = session.players.filter(elem => (elem.id !== input.id));
    }

    const players = [...others, input];
    const update: UpdateSessionInput = {
      id: (session.id) ? (session.id) : '',
      tag: session.tag,
      players,
      words: session.words,
    };

    setLocalPlayer(input);

    requestUpdateSession(update).catch(e => {
      console.error('failed to add player to session! ', e);
    });
  }

  // retrieve the player from the session
  const candidates = session.players?.filter(p => p.id === player.current.id);
  if(candidates?.length){
    player.current = candidates[0];
  }

  return [player, setPlayer];
}

export const usePlayer = () => useBetween(usePlayerCore);
