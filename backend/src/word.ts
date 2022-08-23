import {
  ObjectId,
} from 'mongodb'

import {
  Database,
} from '.'

import {
  Word,
  WordState,
} from '../../api/src/generated/graphql'

export {
  Word,
}

export function makeWord(authorid: string, definition: string, voters: string[]): Word {
  return {
    authorid,
    voters,
    definitions: [
      {id: authorid, value: definition},
    ],
    votes: [],
    state: WordState.Open,
  }
}

export async function addWordToRoom(db: Database, roomid: ObjectId, authorid: ObjectId, definition: string) {
  const room = await db.rooms.findOne({_id: roomid});
  if (room === null) {
    return null
  }
  const author_id_string = authorid.toString()
  const voters: string[] = room.players.map(t => t._id).filter(id => (isString(id) && (id !== author_id_string))) as string[]
  
  const {value} = await db.rooms.findOneAndUpdate({_id: roomid}, {$push: {words: makeWord(author_id_string, definition, voters)}}, {returnDocument: 'after'})
  return value
}

function isString(id: any): id is string {
  return (typeof id === 'string') ? true : false
}
