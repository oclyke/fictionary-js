import {
  useState,
  useRef,
} from 'react';

import {
  Room,
} from '../../../backend/src/room'

import {
  gqlFetch,
} from '../utils'

async function ensureRoom (tag: string) {
  const { data: { getRoomByTag: room } } = await gqlFetch(`query { getRoomByTag(tag: "${tag}"){ _id } }`)
  let id: string
  if (room !== null) {
    id = room._id
  } else {
    const { data: { createRoom: room } } = await gqlFetch(`mutation { createRoom(tag: "${tag}"){ _id } }`)
    if (room !== null) {
      id = room._id
    } else {
      throw new Error('room could not be created')
    }
  }
  return id
}

export function isRoom(object: any): object is Room {
  if ( false 
    || (object === null)
    || (typeof object === 'undefined')
    || (typeof object.tag !== 'string')
    || (typeof object._id !== 'string' && object._id !== null)
    || (!Array.isArray(object.players))
    || (!Array.isArray(object.scores))
    || (!Array.isArray(object.words))
  ) {
    return false
  }
  return true
}

type UseRoomOps = {
  update: () => void
  join: (tag: string, userid: string) => void
}

type UseRoomReturn = [
  Room | null,
  string | null,
  UseRoomOps,
]

export function useRoom(): UseRoomReturn {
  const roomid_ref = useRef<string | null>(null)
  const [room, setRoom] = useState<Room | null>(null)  

  async function join(tag: string, userid: string) {
    const roomid = await ensureRoom(tag)
    roomid_ref.current = roomid
    const { data: { getRoomByTag: room } } = await gqlFetch(`query { getRoomById(id: ${roomid}){ players { _id } } }`)
    if (!room.players.includes(userid)) {
      await gqlFetch(`mutation { addPlayerToRoom(roomid: ${roomid}, userid: ${userid}){ { _id players { _id } } } }`)
    }
    update()
  }

  async function update () {
    const { data: { getRoomByTag: room } } = await gqlFetch(`
    query {
      getRoomById(id: "${roomid_ref.current}"){
        _id
        tag
        players {
          _id
          tag
          color
          overallScore
        }
        words {
          authorid
          voters
          definitions {
            id
            value
          }
          votes {
            id
            proposerid
          }
          state
        }
        scores {
          id
          score
        }
      }
    }`)
    if (isRoom(room)) {
      setRoom(room)
    } else {
      throw new Error('expected to get Room type')
    }
  }

  const ops: UseRoomOps = {
    join,
    update,
  }

  return [room, roomid_ref.current, ops];
}




