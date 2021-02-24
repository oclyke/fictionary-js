// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const WordStatus = {
  "OPEN": "OPEN",
  "VOTING": "VOTING",
  "CLOSED": "CLOSED"
};

const { Session, Player, Definition, Word } = initSchema(schema);

export {
  Session,
  WordStatus,
  Player,
  Definition,
  Word
};