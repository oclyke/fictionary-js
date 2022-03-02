import React from 'react';
import {
  useState,
  useRef,
} from 'react';

import {
  useRoom,
  User,
} from '..'

import {
  Dict,
} from '../../utility/dicts';

export const usePlayersInfo = (): [Dict<User>] => {
  const [room] = useRoom();
  const players = room.aliases;
  return [players];
}

// export const useRoom = () => useBetween(usePlayersCore);
// export usePlayers;
