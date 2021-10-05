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


  // // make an ordered users list
  // const room_has_users = ((typeof room.users !== 'undefined') && (room.users !== null));
  // console.log(room_has_users);
  // const sorted_users = [user, ...((room_has_users) ? [] : room.users.filter(p => !usersIdentical(p, user)).sort((a, b) => b.score - a.score))];
  // console.log(sorted_users)
  const sorted_users = [user];

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
          {sorted_users.map((user_mapped, idx) => {return <React.Fragment key={`user.${idx}.${user_mapped._id}.info`}>
            <Grid item xs={getPlayerItemWidth(room)} >
              <PlayerCard 
                player={user_mapped}
                // editable={user_mapped.id === user.id}
                // onPlayerChange={(to) => {
                //   // console.log(to);
                //   updateUser(to);
                // }}
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
