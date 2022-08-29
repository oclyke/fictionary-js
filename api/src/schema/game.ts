import type {
  Game,
  Word,
  PlayerConnection,
} from '../generated/graphql'

// meta is hardcoded right now
import { getMeta } from './meta'
const meta = getMeta('naught')




let nextGameId = 0
function getGameId () {
  const id = nextGameId
  nextGameId += 1
  return String(id)
}

function makeGame (name: string): Game {
  if (typeof meta === 'undefined') {
    throw new Error('could not get root meta type')
  }
  return ({
    id: getGameId(),
    name,
    players: null,
    words: [],
    scores: [],
    created: new Date().toDateString(),
    updated: new Date().toDateString(),
  })
}

const allGames: Game[] = [...new Array(7)].map((_, idx) => makeGame(`game-name-${idx}`))


export function getGame(id: string) {
  const game = allGames.find(g => g.id === id)
  if(typeof game === 'undefined'){
    return null
  }
  return game
}

export function createGame(name: string) {
  const game = makeGame(name)
  game.name = name
  return game
}
