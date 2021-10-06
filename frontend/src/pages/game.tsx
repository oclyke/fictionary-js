import React from 'react';
import {
  useEffect,
} from 'react';

import {
  withRouter,
  useRouteMatch,
  useParams,
} from 'react-router-dom';

import {
  Box,
  Container,
  Typography,
  Tooltip,
  Link,
  IconButton,
  Divider,
  Grid,
  useMediaQuery,
} from '@material-ui/core';

import LaunchRoundedIcon from '@material-ui/icons/Launch';

import {
  WordProposer,
  WordCard,
  PlayerCard,
  Sluicebox,
} from '../components';

import {
  useUser,
  playersIdentical,
  useRoom,
} from '../hooks';

import {
  joinRoom as requestUserJoinRoom,
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

const Component = withRouter(({ history }) => {
  const { _tag } = useParams<{_tag: string}>();
  const [user, updateUser] = useUser();
  const [room, joinRoom, leaveRoom] = useRoom();

  // an effect that runs on first render
  useEffect(() => {
    window.addEventListener('beforeunload', (e) => {
      console.log('unloading window - disconnecting user');
      leaveRoom();
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // an effect when the user navigates
  useEffect(() => history.listen(() => {
    console.log('user is leaving the page!')
    leaveRoom();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [])

  // ensure tag is up to date
  if(room.tag !== _tag){
    joinRoom(_tag);
  }

  // ensure player is in the game
  useEffect(() => {
    
    if ((typeof user.id !== 'undefined') && (typeof room.id !== 'undefined')){
      console.log('checking users status in game', user.id, room.players)
      if(!room.players.includes(user.id)) {
        requestUserJoinRoom(room.id, user.id)
          .then((r) => {
            console.log('added player to room', user.id, r);
          })
          .catch((e) => { console.error('failed to add player to room', e); })
      }
    }
  }, [user.id, room.id])
  

  const narrowscreen = !useMediaQuery('(min-width:450px)');

  let rootroute = useRouteMatch();
  const shareurl = `https://games.oclyke.dev${rootroute.url}`;

  const getPlayerItemWidth = (room: Room) => {
    let useritemwidth: 2 | 3 | 4 | 6 = 2;
    let useritemdivision = 0;
    if(room.players){
      useritemdivision = 12/room.players.length;
    }
    if(useritemdivision >= 3){
      useritemwidth = 3;
    }
    if(useritemdivision >= 4){
      useritemwidth = 4;
    }
    if(useritemdivision >= 6){
      useritemwidth = 6;
    }
    return useritemwidth;
  }


  // make an ordered users list
  const sorted_user_ids = [user.id, ...room.players.filter(id => (id !== user.id)).sort((a, b) => room.scores[b] - room.scores[a])];

  return <>
    {/* flexbox for header-users-words-suggestions */}
    <Box display='flex' flexDirection='column' justifyContent='space-between' style={{width: '100%', height: '100%'}}>

      {/* header */}
      <Container style={{paddingBottom: '0px'}}>
        <Typography variant='h1' align='center' style={{fontSize: 36}}>
          <Link href='/fictionary'>
            fictionary
          </Link>
          {!narrowscreen &&
          <span style={{fontSize: 16, marginLeft: '24px', position: 'relative', top: '-4px'}}>
            {room.tag}
          </span>}
          <Tooltip title='copy game link'>
            <IconButton
              className='copybtn'
              style={{margin: 0}}
              color='primary'
              data-clipboard-text={shareurl}
            >
              <LaunchRoundedIcon />
            </IconButton>
          </Tooltip>
        </Typography>
      </Container>

      {/* users */}
      <Box p={1} style={{paddingTop: 0, paddingBottom: 0}}>
        <Grid item container>
          {sorted_user_ids.map((id, idx) => {return <React.Fragment key={`user.${idx}.${id}.info`}>
            <Grid item xs={getPlayerItemWidth(room)} >
              <PlayerCard 
                userid={id}
              />
            </Grid> 
          </React.Fragment>})}
        </Grid>
      </Box>
      <Divider style={{marginLeft: '8px', marginRight: '8px'}}/>

      {/* words */}
      <Box flexGrow={1} style={{overflow: 'auto'}}>
        <Sluicebox>
          <Box display='flex' flexDirection='column'>
            {room.words && room.words.map((word, idx) => { return <>
              <Box key={`words.${idx}.${word.id}`} style={{alignSelf: `flex-${(word.author === user.id) ? 'end' : 'start'}`}}>
                <WordCard word={word} />
              </Box> 
            </>})}
          </Box>
        </Sluicebox>
      </Box>

      {/* suggestions */}
      <Box display={'flex'}>
        <Sluicebox>
          <WordProposer />
        </Sluicebox>
      </Box>
    </Box>
  </>
});

export default Component;
