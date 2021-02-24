/* 
// This file is subject to the terms and conditions defined in
// file 'LICENSE.md', which is part of this source code package.
*/

import {
  PlayerInput,
} from './../API';

export const equal = (a: PlayerInput, b: PlayerInput): boolean => {
  if(a.id !== b.id){ return false; }
  return true;
}
