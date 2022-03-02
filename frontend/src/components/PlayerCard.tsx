import React from 'react'
import {
  useState,
} from 'react';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import SettingsIcon from '@material-ui/icons/Settings';

import { SliderPicker } from 'react-color'

import {
  Dict,
} from '../utility/dicts';

import {
  useUser,
  useRoom,
  usePlayersInfo,
  Room,
  User,
} from '../hooks';

type PlayerCardProps = {
  userid: string,
}

const PlayerCard = (props: PlayerCardProps) => {
  const [user, updateUser] = useUser();
  const [room] = useRoom();
  const id = props.userid;
  const [players] = usePlayersInfo();

  const [want_editing, setEditing] = useState<boolean>(false);
  const [idchanged, setIdChanged] = useState<boolean>(false);
  const [newcolor, setNewColor] = useState('#7540bf'); // solve the white color bug by using one of the output colors from the slider chooser as initial state
  const [newid, setNewId] = useState('');
  const confirmEdits = () => {
    let to = { ...user };
    if(idchanged){
      to.name = newid;
    }
    updateUser(to);
  }
  
  const getScore = (user_id: string, room: Room) => {
    console.error('todo: add scoring by changing the room.scores dict')
    const score = room.scores[user_id];
    if(typeof score === 'undefined'){ return 0; }
    return score;
  }

  const editable = (id === user.id);
  const editing = editable && want_editing;


  let display = {
    ...user,
  };
  if (id !== user.id) {
    try {
    const cached = players[id];
    display.name = cached.name;
    display.color = cached.color;
    } catch {
      display.name = 'unknown';
      display.color = '#ffffff';
    }
  }

  const score = getScore(id, room);

  return <>
    <Box p={1}>
      <Paper
        style={{backgroundColor: display.color}}
        onClick={(e) => {
          setEditing(true);
        }}
      >
        <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'>

          {/* score + id */}
          {(!editing || !editable) && <>
            <Typography style={{paddingLeft: '8px', paddingTop: '4px', paddingBottom: '4px'}}>
              {`${(((score) ? score : 0) > 0) ? '+' : ''}${score} : `}{display.name}
            </Typography> </>}

          {/* id edit input */}
          {editing && <>
            <Box flexGrow={1} style={{marginLeft: '8px'}}>
              <InputBase
                fullWidth
                value={newid}
                // size='small'
                autoFocus={true}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                // onFocus={(e) => {
                //   setEditId(true);
                // }}
                onChange={(e) => {
                  setNewId(e.target.value);
                  setIdChanged(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter'){
                    setEditing(false);
                    confirmEdits();
                  }
                }}
                // onBlur={(e) => {
                //   setEditing(false);
                //   confirmEdits();
                // }}
              />
            </Box> 
          </>}

          {/* edit / accept toggle button */}
          {editable && <>
            <Box>
              <Tooltip title={(editing) ? 'accept changes' : 'edit player'}>
                <IconButton
                  color='primary'
                  size='small'
                  style={{ color: (editing) ? undefined : '#B6B6B6'}}
                  onClick={(e) => {
                    e.stopPropagation();
                    if(editing){
                      setEditing(false);
                      confirmEdits();
                    }else{
                      setEditing(true);
                    }
                  }}
                >
                  {(editing) ? <CheckRoundedIcon /> : <SettingsIcon /> }
                </IconButton>
              </Tooltip>
            </Box> 
          </>}
        </Box>
      </Paper>
    </Box>

    {/* color selector */}
    {editing && <>
      <Box p={1}>
        <SliderPicker
          color={newcolor}
          onChange={(c) => {
            setNewColor(c.hex);
          }}
          onChangeComplete={(c) => {
            let to = {...user};
            to.color = c.hex;
            updateUser(to);
          }}
        />
      </Box> </>}
  </>
}


export default PlayerCard;
