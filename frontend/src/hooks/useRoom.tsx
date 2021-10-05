import React from 'react';
import {
  useState,
  useRef,
} from 'react';

import {
  useBetween
} from 'use-between';

import {
  roomByID,
  makeRoom,
} from '../utility';

class Room {
  _id: undefined;
  constructor(arg?: any, arg2?: any){
  }
}

const fictionary_ws_endpoint = 'ws://localhost:4001';

const useRoomCore = (): [Room, (tag: string) => void, () => void] => {
  const [room, setRoom] = useState<Room>(new Room(undefined));
  const id = useRef<string | null>(null);
  const socket = useRef<WebSocket | null>(null);

  // try to join a room by a given tag
  const join = async (tag: string) => {
    if (socket.current !== null){
      // throw new Error('cannot join a room while another room exists!')
      console.error('already connecting...')
      return;
    }
    const executor = async () => {
      // Create WebSocket connection.
      const s = new WebSocket(fictionary_ws_endpoint);
      s.addEventListener('open', async (event) => {
        const r = await makeRoom(tag);        // get room or create if nonexistent
        s.send(r.id);                         // register this connection against this room
        setRoom(new Room(r.id, { gql: r }));  // update room state
        id.current = r.id;                    // update id ref
      });
      s.addEventListener('message', async (event) => {
        // when the server send a message it is simply a force-refresh of room state
        const r = await roomByID(id.current);
        setRoom(new Room(r.id, { gql: r }));
      });
      socket.current = s;
    }
    executor();
  }

  const leave = async () => {
    if (socket.current === null) {
      console.error('already disconnected');
      return;
    }
    socket.current.close();
    socket.current = null;
  }

  return [room, join, leave];
}

export const useRoom = () => useBetween(useRoomCore);
