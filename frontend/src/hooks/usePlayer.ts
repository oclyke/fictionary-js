import {
  useState,
  useRef,
  useEffect,
} from 'react'

import {
  User,
} from '../../../backend/src/user'

import {
  gqlFetch,
} from '../utils'

const user_id_key = 'user_id';

async function ensureUser (tag: string) {
  const { data: { getRoomByTag: room } } = await gqlFetch(`query { getRoomByTag(tag: "${tag}"){ _id } }`)
  let id: string
  if (room !== null) {
    id = room._id
  } else {
    const { data: { createRoom: room } } = await gqlFetch(`mutation { createRoom(tag: "${tag}")}`)
    if (room !== null) {
      id = room._id
    } else {
      throw new Error('room could not be created')
    }
  }
  return id
}

export function isPlayer(object: any): object is User {
  if ( false 
    || (object === null)
    || (typeof object === 'undefined')
    || (typeof object.tag !== 'string')
    || (typeof object.color !== 'string')
    || (typeof object.overallScore !== 'number')
    || (typeof object._id !== 'string' && object._id !== null)
  ) {
    return false
  }
  return true
}

type PersistantStorage = {
  store: (val: string) => void
  load: () => string | null
  remove: (key: string) => void
  clear: () => void
}

type UseUserOps = {
  ensure: () => Promise<string | null>
  signOut: () => void
  clearStorage: () => void
}

export function usePlayerCore(persistence: PersistantStorage): [(string | null), UseUserOps] {
  const [playerid, setPlayerId] = useState<string | null>(null);
  const lock = useRef(false);

  async function ensure() {
    if(lock.current){
      throw new Error('already ensuring user');
    }
    const localid = persistence.load();
    if(!localid){
      lock.current = true; // lock user creation b/c react may load and unload this component while the user is created
      try {
        const { data: { createPlayer: player } } = await gqlFetch(`mutation { createPlayer { _id } }`)
        const playerid = player._id
        persistence.store(playerid);
        setPlayerId(playerid);
      } finally {
        lock.current = false; // unlock
        return playerid
      }
    } else {
      const { data: { getPlayerById: player } } = await gqlFetch(`query { getPlayerById(id: "${localid}"){ _id } }`)
      if(player === null){
        persistence.clear(); // try to remedy this...
        setPlayerId(null)
        return null
      } else {
        setPlayerId(player._id)
        return player._id
      }
    }
  }

  function signOut() {
    // an id in localstorage authorizes use of that user
    // (yeah, not super secure lol but its a silly game)
    // therefore removing that id signs out the user
    persistence.remove(user_id_key);
    setPlayerId(null);
  }

  function clearStorage () {
    persistence.clear();
  }

  const ops = {
    ensure,
    signOut,
    clearStorage,
  }

  return [playerid, ops];
}

// create a useUser hook that uses localstorage to maintain user between tabs
export function usePlayer() {
  const persistent_local_storage: PersistantStorage = {
    store: (val: string) => { localStorage.setItem(user_id_key, val); },
    load: () => { return localStorage.getItem(user_id_key); },
    remove: () => { localStorage.removeItem(user_id_key); },
    clear: () => { localStorage.clear(); },
  }

  return usePlayerCore(persistent_local_storage);
}

// create a useUser hook that uses a ref so that each application has its unique value
export function useTabPlayer() {
  const persistant_session_storage: PersistantStorage = {
    store: (val: string) => { sessionStorage.setItem(user_id_key, val); },
    load: () => { return sessionStorage.getItem(user_id_key); },
    remove: () => { sessionStorage.removeItem(user_id_key); },
    clear: () => { sessionStorage.clear(); },
  }

  return usePlayerCore(persistant_session_storage);
}
