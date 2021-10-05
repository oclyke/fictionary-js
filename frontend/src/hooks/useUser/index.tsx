import React, { useEffect } from 'react';
import {
  useState,
} from 'react';

import {
  useBetween,
} from 'use-between';

import {
  useRoom,
} from '../useRoom';

import {
  suggestId,
  createUser,
  getUser,
  updateUser as requestUpdateUser,
  getLocalUserId,
  setLocalUserId,
} from '../../utility';

import {
  User,
} from './classes';

export {
  User,
} from './classes';

const palette = ['#EB9694', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB'];

export const equal = (a: User, b: User) => {
  if ((a.id === null) || (b.id === null)) {
    throw new Error('should not be comparing identity of users with no id...');
    return false;
  }
  return (a.id === b.id);
}

const useUserCore = (): [User, (p: Partial<User>) => void] => {
  const [user, setUser] = useState<User>(new User(undefined));
  const [room] = useRoom();

  const updateUser = (p: Partial<User>): void => {

  }

  // initialize user
  if (typeof user.id === 'undefined') {
    console.log('user does not have id...')
    const local = getLocalUserId();
    console.warn(local, typeof local)
    if ((typeof local === 'undefined') || (local === null)) {
      console.log('we need to create a user!')
      const p = {
        name: suggestId(),
        color: palette[Math.floor(Math.random() * palette.length - 0.001)],
      }
      createUser(new User(undefined, p))
        .then((base) => {
          console.log('got new user: ', base)
          const created_user = new User(base.id, base);
          setUser(created_user);
          setLocalUserId(created_user.id);
        });
    } else {
      console.log('local id was: ', local);
      console.log('retrieve user from database')
      getUser(local)
        .then((base) => {
          const got_user = new User(base.id, base)
          setUser(got_user);
        });
    }
  }

  // // allow the user to make modifications to the user
  // const updateUser = async (p: Partial<User>) => {
  //   if ((room.id !== null) && (user.id !== null)) {
  //     // attempt to update user in the current room too
  //     const base = await requestUpdateUser(p.id, p);
  //     setUser(new User(base.id, base));
  //   }
  // }

  // // perform initialization of user
  // if (!initialized) {
  //   setInitialized(true);
  //   const local = getLocalUser();
  //   if (local !== null) {
  //     setUser(local);
  //   } else {
  //     const base: Partial<User> = {
  //       name: suggestId(),
  //       color: palette[Math.floor(Math.random() * palette.length - 0.001)],
  //     };
  //     updateUser(new User(undefined, base));
  //   }
  // }

  // // only users with ids are in the game...
  // if ((user.id === null) && (room.id !== null)) {
  //   const executor = async () => {
  //     const user_input = {
  //       name: user.name,
  //       color: user.color,
  //     };
  //     const dbuser = await createUser(room.id, user_input);
  //     updateUser(dbuser);
  //   }
  //   executor();
  // }

  return [user, updateUser];
}

export const useUser = () => useBetween(useUserCore);