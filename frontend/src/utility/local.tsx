const PLAYER_KEY = 'player';

type GQLUser = any;
class User {
  _id = undefined
  constructor(arg?: any, arg2?: any){
  }
  fromGQL(p: Partial<GQLUser>){
    return this;
  }
}

export const getLocalUser = (): (User | null) => {
  const s = localStorage.getItem(PLAYER_KEY);
  if(s){
    const obj = JSON.parse(s);
    if((typeof(obj.name) === 'string') && (typeof(obj.color) === 'string')){
      const base: Partial<GQLUser> = {
        name: obj.name,
        color: obj.color,
      }
      return new User(undefined, { gql: base });
    }
  }
  return null;
}

export const setLocalUser = (player: User) => {
  localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
}
