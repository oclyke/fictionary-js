import React, {useState} from 'react';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import SendRoundedIcon from '@material-ui/icons/SendRounded';

// import {
//   DefinitionInput,
//   UpdateSessionInput,
//   WordInput,
// } from './../API';
// import { usePlayer } from '../hooks/usePlayer';
// import { useSession } from '../hooks/useSession';

// import { null_definition } from './../utility/definitions';
// import { null_word } from './../utility/words';
// import { requestUpdateSession } from './../utility/db';

// import { v4 as uuidv4 } from 'uuid';

// const getBlankWord = (): WordInput => {
//   return {...null_word, id: uuidv4()}
// }

// const getBlankDefinition = (): DefinitionInput => {
//   return {...null_definition, id: uuidv4()}
// }

type WordProposerProps = {
  // onSubmit: (word: WordInput) => void
}

const WordProposer = (props: WordProposerProps) => {
  // const [session_ref] = useSession();
  // const [player_ref] = usePlayer();
  // const [word, setWord] = useState<WordInput>(getBlankWord());
  // const [def, setDef] = useState<DefinitionInput>(getBlankDefinition());

  // const player = player_ref.current;
  // const session = session_ref.current;

  // const propose = async () => {
  //   if(typeof(session.id) === 'undefined' || session.id === null){
  //     throw new Error('you must have a session to propose')
  //   }

  //   let words: WordInput[] = [];
  //   if(session.words){
  //     words = session.words;
  //   }
  //   words.push({
  //     ...word,
  //     author: player.id,
  //     committee: session.players?.map(p => p.id).filter(id => (id !== player.id)),
  //   });

  //   const update: UpdateSessionInput = {
  //     id: session.id,
  //     words
  //   }
  //   await requestUpdateSession(update);

  //   setWord(getBlankWord());
  //   setDef(getBlankDefinition());
  // }
  // const disabled = ((word.text === '') || (def.text === ''));
  const disabled = true;

  return <>
    <Box m={1} style={{width: '100%'}}>
      <Paper style={{backgroundColor: 'whitesmoke'}}>
        <Box p={1} display='flex'>
          <Box>
            {/* note: snowpack seems to be having an issue with TextField... temporarily providing a stand-in input field */}
            <input onChange={(e) => { console.log(e.target.value); }}/>
            {/* <TextField 
              // value={word.text}
              label='new word'
              onChange={(e) => {
                // setWord(prev => ({...prev, text: e.target.value}));
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter'){
                  // if(!disabled){
                  //   propose();
                  // }
                }
              }}
            /> */}
          </Box>
          <Divider orientation="vertical" style={{height: '100%', margin: 4}}/>
          <Box flexGrow={1}>
            <TextareaAutosize
              // value={(def.text) ? def.text : ''}
              placeholder='real definition' 
              style={{width: `100%`, height: `90%`}}
              onChange={(e) => {
                // const current: DefinitionInput = {...def, author: player.id, text: e.target.value};
                // setDef(current);
                // setWord(prev => ({...prev, definitions: [current]}));
              }}
            />
          </Box>
          <Box>
            <Tooltip title={`add word ${(disabled) ? '(enter word + def)' : ''}`}>
              <span>
                <IconButton
                  disabled={disabled}
                  color='primary'
                  onClick={(e) => {
                    // propose();
                  }}
                >
                  <SendRoundedIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </Paper>
    </Box>
  </>
}

export default WordProposer;
