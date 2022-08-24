// the Meta type holds information about fictionary
// it is not involved in normal gameplay
interface Meta {
  id: string
  name: string
  description: string
  players: string[]
}

// meta is hardcoded right now
const meta: Meta = {
  id: 'naught',
  name: 'fictionary',
  description: 'a game of camouflage, misdirection, and astonishment in which players guess the true definition of obscure words',
  players: [...new Array(13)].map((_, idx) => String(idx)),
}

const allMeta: Meta[] = [meta]

export function getMeta(id: string) {
  return allMeta.find(m => m.id === id)
}
