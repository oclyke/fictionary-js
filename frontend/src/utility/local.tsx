const PLAYERID_KEY = 'playerid';

export const getLocalUserId = () => {
  return localStorage.getItem(PLAYERID_KEY);
}

export const setLocalUserId = (id: string) => {
  if(typeof id === 'undefined') {
    throw new Error('bad to set id as undefined locally!')
  }
  localStorage.setItem(PLAYERID_KEY, id);
}
