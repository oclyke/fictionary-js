import React, {useState} from 'react';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import SendRoundedIcon from '@material-ui/icons/SendRounded';

import {
  Word,
  useRoom,
  useUser,
} from '../hooks'

import {
  proposeWord as requestProposeWord,
} from '../utility'

type WordProposerProps = {
}

type WordInput = {
  word: string, definition: string
}

const initial_input: WordInput = {
  word: '',
  definition: '',
}

const WordProposer = (props: WordProposerProps) => {
  const [room] = useRoom();
  const [input, setInput] = useState<WordInput>(initial_input)
  const [user] = useUser();

  const propose = async () => {
    await requestProposeWord(room.id, user.id, input.word, input.definition);
  }
  const disabled = ((input.word === '') || (input.definition === '') || (typeof room.id === 'undefined'));

  return <>
    <Box m={1} style={{width: '100%'}}>
      <Paper style={{backgroundColor: 'whitesmoke'}}>
        <Box p={1} display='flex'>
          <Box>
            <input
              value={input.word}
              placeholder={'your word'}
              onChange={(e) => { setInput(prev => ({...prev, word: e.target.value})) }}
            />
          </Box>
          <Divider orientation="vertical" style={{height: '100%', margin: 4}}/>
          <Box flexGrow={1}>
            <TextareaAutosize
              value={input.definition}
              placeholder='real definition'
              style={{width: `100%`, height: `90%`}}
              onChange={(e) => { setInput(prev => ({...prev, definition: e.target.value})) }}
            />
          </Box>
          <Box>
            <Tooltip title={`add word ${(disabled) ? '(enter word + def)' : ''}`}>
              <span>
                <IconButton
                  disabled={disabled}
                  color='primary'
                  onClick={(e) => {
                    propose();
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
