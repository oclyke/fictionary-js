/* 
// This file is subject to the terms and conditions defined in
// file 'LICENSE.md', which is part of this source code package.
*/

import {
  DefinitionInput,
} from './../API';

export const null_definition: DefinitionInput = {
  id: '',
  author: '',
  text: '',
  votes: [],
};

// export const real_definition = (w: WordInput): DefinitionInput => {
//   if (typeof(w.definition) === 'undefined'){ return score; }
//   if (w.definition === null){ return score; }

//   return w.definitions.filter(def => def.author.equals(this.author))[0];
// }
