/* 
// This file is subject to the terms and conditions defined in
// file 'LICENSE.md', which is part of this source code package.
*/

import React from 'react';
import {
  useState,
  useEffect,
  useRef,
} from 'react';

import {
  CreateSessionInput,
} from './../API';

import {
  requestSessionByTag,
  requestCreateSessionWithTag,
  onUpdateSessionByID,
} from './../utility/db';

import {
  useBetween
} from 'use-between';

const null_session: CreateSessionInput = {
  id: null,
  tag: '',
  players: [],
  words: [],
}

const useSessionCore = (): [React.MutableRefObject<CreateSessionInput>, string, React.Dispatch<React.SetStateAction<string>>, (val: CreateSessionInput) => void] => {
  const [, setCount] = useState<number>(0);
  const [tag, setTag] = useState<string>('');
  const sessionid = useRef<string>('');
  const session = useRef<CreateSessionInput>(null_session);

  // psuedo-dispatcher for session that is guaranteed to cause a re-render
  const setSession = (val: CreateSessionInput) => {
    session.current = val;
    setCount(prev => prev + 1);
  }

  useEffect(() => {
    if(tag === ''){ return; }

    let cleanup = undefined;

    const executor = async () => {
      let initial_session: CreateSessionInput = null_session;

      // ensure that a session exists
      const result = await requestSessionByTag(tag);
      const data = ((result as any).data as { sessionByTag: { items: CreateSessionInput[]} });
      const matches = data.sessionByTag.items;
      if(matches.length === 0){
        const result = await requestCreateSessionWithTag(tag);
        const data = ((result as any).data as {createSession: CreateSessionInput});
        initial_session = data.createSession;
      }else{
        initial_session = matches[0];
      }

      // ensure id
      if(!(initial_session.id)){
        throw new Error('found a session without an id...');
      }

      // set the session id
      sessionid.current = initial_session.id;

      // set the session
      setSession(initial_session);

      // subscribe to changes
      console.log('subscribing to session with id: ', initial_session.id);
      const subscription = onUpdateSessionByID(initial_session.id, (payload) => {
        const pl = (payload as {value: { data: { onUpdateSession: CreateSessionInput }}});
        const updated_session = pl.value.data.onUpdateSession;
        if(updated_session.id !== sessionid.current){
          console.warn('ignoring update from other session'); // todo: make it so that the subscription only applies to sessions with the indicated session id (as originally intended)
          return;
        }
        setSession(updated_session);
      }, () => {
        window.dispatchEvent(new CustomEvent('addsubscription', { detail: initial_session }));
      });
      if(typeof(subscription) !== 'undefined'){
        cleanup = () => {
          console.log('unsubscribing to session updates', subscription);
          (subscription as any).unsubscribe();
        }
      }
    };

    executor();

    return cleanup;
  }, [tag]);

  return [session, tag, setTag, setSession];
}

export const useSession = () => useBetween(useSessionCore);
