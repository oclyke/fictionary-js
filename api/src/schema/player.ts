// the Player type holds information about fictionary players
interface Player {
  id: string
  name: string
  color: string
  overallScore: number
  // gamesHistoryConnection: GameConnection
}

// meta is hardcoded right now
const allPlayers: Player[] = [...new Array(130)].map((_, idx) => ({
  id: String(idx),
  name: `name-${idx}`,
  color: `color-${idx}`,
  overallScore: idx,
}))

export function getPlayer(id: string) {
  return allPlayers.find(m => m.id === id)
}
