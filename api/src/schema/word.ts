import {
  Word,
  WordState,
} from '../generated/graphql'

function makeWord(authorid: string, playerids: string[]): Word {
  // function get_random_player() {
  //   const num_players = players.length
  //   return players[Math.floor(Math.random() * num_players)]
  // }
  // const authorid = get_random_player()

  return {
    value: '',
    authorid,
    voters: playerids.filter(id => id !== authorid),
    definitions: [],
    votes: [],
    state: WordState.Open,
  }
}

// export function createWord(authorid: string)
