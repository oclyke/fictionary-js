
export const preventDefault = (event: React.SyntheticEvent) => event.preventDefault();

export { suggestId } from './id';
export { gqlop } from './graphql';

export {
  roomByTag,
  roomByID,
  makeRoom,
  createUser,
  updateUser,
  getUser,
  joinRoom,
} from './db';

export {
  setLocalUserId,
  getLocalUserId,
} from './local';
