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

  useEffect(() => {
    async function executor () {
      await connect()
      const playerid = await ensurePlayer()

      if (typeof tag === 'undefined') {
        throw new Error('expected tag to be defined')
      }
      if (playerid === null) {
        throw new Error('expected playerid to be defined')
      }

      join(tag, playerid)
    }
    executor()
  }, [tag, userid])

  return <>
    game page

    <button
      onClick={clearStorage}
    >
      clear storage
    </button>
  </>
}
