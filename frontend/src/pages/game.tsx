import {
  default as React,
  useState,
  useEffect,
} from 'react'

import {
  useParams,
} from 'react-router-dom'

import {
  useConnection,
  usePlayer,
  useRoom,
} from '../hooks'

import {
  gqlFetch,
} from '../utils'

export default function () {
  const {
    tag
  } = useParams()

  const [
    userid,
    {
      ensure: ensurePlayer,
      signOut,
      clearStorage,
    }
  ] = usePlayer()

  const [
    room,
    roomid,
    {
      join,
      update,
    }
  ] = useRoom()

  const [
    connected,
    {
      connect,
      disconnect,
      associate,
    }
  ] = useConnection(handleConnectionEvent)

  async function handleConnectionEvent (event) {

  }

  // manage session
  useEffect(() => {
    connect()
    if (roomid !== null) {
      console.log('associating roomid')
      associate({roomid})
    }
    if (userid !== null && typeof userid !== 'undefined') {
      console.log('associating userid')
      associate({userid})
    }
    return function cleanup () {
      disconnect()
    }
  }, [roomid, userid])

  // manage player
  useEffect(() => {
    ensurePlayer()
  }, [userid])

  // manage room
  useEffect(() => {
    
    if ( typeof tag !== 'undefined' && userid !== null) {
      join(tag, userid)
    }
  }, [tag, userid])

  console.log({userid, tag, room})

  return <>
    game page

    <button
      onClick={clearStorage}
    >
      clear storage
    </button>
  </>
}
