import React, { useEffect } from 'react';
import {
  useState,
} from 'react';

import {
  useBetween,
} from 'use-between';

import {
  useRoom,
} from '.';

import {
  suggestId,
  createUser,
  updateUser as requestUpdateUser,
  getLocalUser,
  setLocalUser,
} from '../utility';

type GQLUser = any;
class User {
  _id = undefined
  constructor(arg?: any, arg2?: any){
  }
  fromGQL(p: Partial<GQLUser>){
    return this;
  }
}

const palette = ['#EB9694', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB'];

export const equal = (a: User, b: User) => {
  if ((a._id === null) || (b._id === null)) {
    throw new Error('should not be comparing identity of users with no id...');
    return false;
  }
  return (a._id === b._id);
}

const useUserCore = (): [User, (p: Partial<GQLUser>) => void] => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [user, setUser] = useState<User>(new User(undefined));
  const [room] = useRoom();

  // allow the user to make modifications to the user
  const updateUser = async (p: Partial<GQLUser>) => {
    if ((room._id !== null) && (user._id !== null)) {
      // attempt to update user in the current room too
      await requestUpdateUser(p.id, p);
    }
    const updated = user.fromGQL(p)
    setLocalUser(updated);
    setUser(updated);
  }

  // perform initialization of user
  if (!initialized) {
    setInitialized(true);
    const local = getLocalUser();
    if (local !== null) {
      setUser(local);
    } else {
      const base: Partial<GQLUser> = {
        name: suggestId(),
        color: palette[Math.floor(Math.random() * palette.length - 0.001)],
      };
      updateUser(new User(undefined, { gql: base }));
    }
  }

  // only users with ids are in the game...
  if ((user._id === null) && (room._id !== null)) {
    const executor = async () => {
      // const user_input = {
      //   name: user.name,
      //   color: user.color,
      // };
      // const dbuser = await createU(room.id, user_input);
      // updateUser(dbuser);
      console.error('todo: put user id into game room')
    }
    executor();
  }

  // // use room state for user if available
  // if (room.id !== null) {
  //   const candidates = room.users.filter((p) => p.id === user.id);
  //   if (candidates.length === 1){
  //     user = candidates[0];
  //   }
  // }

  return [user, updateUser];
}

export const useUser = () => useBetween(useUserCore);
