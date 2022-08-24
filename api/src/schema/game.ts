import {
  PlayerConnection,
} from '.'

// the Game type holds information about fictionary games
interface Game {
  id: string
  name: string
  players: typeof PlayerConnection
  words: Word[]
  scores: {[key: string]: number} // map player ids to their scores
  created: string
  updated: string

  // addPlayer(userid: ID!): AddPlayerPayload
}

interface Word {
  authorid: string
  voters: string[]
  definitions: {[key: string]: string} // map player ids to their definitions for this word
  votes: {[key: string]: string} // map player ids to the player id for whose definition they voted
  state: WordState
}

enum WordState {
  OPEN,
  VOTING,
  CLOSED,
}

function makeWord(players: string[]): Word {
  function get_random_player() {
    const num_players = players.length
    return players[Math.floor(Math.random() * num_players)]
  }
  const authorid = get_random_player()
  return {
    authorid,
    voters: players.filter(id => id !== authorid),
    definitions: {},
    votes: {},
    state: WordState.OPEN,
  }
}

// meta is hardcoded right now
import { getMeta } from './meta'
const meta = getMeta('naught')

function makeGame (idx: number) {
  if (typeof meta === 'undefined') {
    throw new Error('could not get root meta type')
  }
  return ({
    id: String(idx),
    name: `game-name-${idx}`,
    players: PlayerConnection,
    words: [...new Array(idx)].map((_ => makeWord(meta.players))),
    scores: {},
    created: new Date().toDateString(),
    updated: new Date().toDateString(),
  })
}

const allGames: Game[] = [...new Array(7)].map((_, idx) => makeGame(idx))

export function getGame(id: string) {
  const game = allGames.find(g => g.id === id)
  if(typeof game === 'undefined'){
    return null
  }
  return game
}
