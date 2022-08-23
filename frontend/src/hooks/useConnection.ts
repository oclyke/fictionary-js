import {
  useState,
  useRef,
} from 'react'

import {
  SESSION_ENDPOINT,
} from '../constants'

type ConnectionOps = {
  connect: () => Promise<WebSocket>,
  disconnect: () => Promise<void>,
  associate: (opts: {roomid?: string, userid?: string}) => Promise<void>,
}

export function useConnection(onEvent: (e: MessageEvent<any>) => void): [boolean, ConnectionOps] {
  const [connected, setConnected] = useState<boolean>(false);
  const socket = useRef<WebSocket | null>(null);

  // try to join a room by a given tag
  function connect (): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      if (socket.current !== null){
        reject('already connecting...')
      } else {
        // Create WebSocket connection.
        const s = new WebSocket(SESSION_ENDPOINT)

        // cache the socket
        socket.current = s

        // when the socket opens register with the server and get the applicable room
        s.addEventListener('open', async (event) => {
          setConnected(true);
        })

        // handle when the socket closes
        s.addEventListener('close', async (event) => {
          setConnected(false);
        })

        // register a listener for game state changes
        s.addEventListener('message', async (event) => {
          if(typeof onEvent !== 'undefined') {
            await onEvent(event)
          }
        })

        resolve(s)
      }
    });
  }

  const disconnect = () => {
    return new Promise<void>((resolve, reject) => {
      const s = socket.current
      if (s === null) {
        reject('already disconnected')
      } else {
        s.close()
        socket.current = null;
        resolve()
      }
    })
  }

  function associate (opts: {roomid?: string, userid?: string}) {
    return new Promise<void>((resolve, reject) => {
      const s = socket.current
      if(s === null) {
        reject('socket disconnected')
      } else {
        s.send(JSON.stringify(opts))
        resolve()
      }
    })
  }

  return [connected, {connect, disconnect, associate}];
}
