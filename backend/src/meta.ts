import {
  ObjectId,
  OptionalId,
  WithId,
} from 'mongodb'

import {
  Database,
} from '.'

export type MetaModel = OptionalId<{
  name: string
  description: string
  created: string
  updated: string
}>

export function makeMeta (): MetaModel {
  const now = new Date().toString()
  return {
    name: 'fictionary',
    description: 'a game of camouflage, misdirection, and astonishment in which players guess the true definition of obscure words',
    created: now,
    updated: now,
  }
}

export async function ensureMeta(db: Database) {
  let meta: MetaModel | null = await db.meta.findOne({})
  if (meta === null) {
    meta = makeMeta()
    await db.meta.insertOne(meta)
  }
  return meta
}

export async function updateMeta(db: Database, meta: Partial<MetaModel>) {
  const now = new Date().toString()
  const { value } = await db.meta.findOneAndUpdate({}, {$set: {...meta, updated: now}}, { returnDocument: 'after' })
  return value
}
