export const preventDefault = (event: React.SyntheticEvent) => event.preventDefault();

export {
  computeScore,
  sortPlayers,
  suggestId,
} from './interactions';

export {
  requestSessionByTag,
  requestUpdateSession,
  requestDeleteSession,
  requestCreateSessionWithTag,
  onUpdateSessionByID,
} from './db';
