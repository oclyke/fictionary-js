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
  usePlayer,
  useSession,
} from '../hooks';

import {
  requestDeleteSession,
  requestUpdateSession,
  sortPlayers,
} from '../utility';

import {
  CreateSessionInput,
  UpdateSessionInput,
} from '../API';

const Component = withRouter(({ history }) => {
  const { _tag } = useParams<{_tag: string}>();
  
  const [player_ref, setPlayer] = usePlayer();
  const [session_ref, tag, setTag] = useSession();
  const player = player_ref.current;
  const session = session_ref.current;

  const leaveSession = async () => {
    if(typeof(session_ref.current.id) === 'undefined' || session_ref.current.id === null){
      console.log(session_ref.current.id);
      throw new Error('cannot leave a session without an id');
    }

    const others = session_ref.current.players?.filter(p => p.id !== player_ref.current.id);
    if(typeof(others) === 'undefined' || others.length === 0){
      console.warn('deleting session', session_ref.current.id)
      await requestDeleteSession(session_ref.current.id);
    }else{
      console.warn('removing player', player_ref.current, others);
      const update: UpdateSessionInput = {
        id: session_ref.current.id,
        players: others
      }
      await requestUpdateSession(update);
    }
  }

  // an effect that runs on first render
  useEffect(() => {
    window.addEventListener('beforeunload', (e) => {
      console.log('unloading window - disconnecting user');
      leaveSession();
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // an effect when the user navigates
  useEffect(() => history.listen(() => {
    console.log('user is leaving the page!')
    leaveSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [])

  // ensure tag is up to date
  if(tag !== _tag){
    setTag(_tag);
  }

  const narrowscreen = !useMediaQuery('(min-width:450px)');

  let rootroute = useRouteMatch();
  const shareurl = `https://games.oclyke.dev${rootroute.url}`;


  const getPlayerItemWidth = (session: CreateSessionInput) => {
    let playeritemwidth: 2 | 3 | 4 | 6 = 2;
    let playeritemdivision = 0;
    if(session.players){
      playeritemdivision = 12/session.players.length;
    }
    if(playeritemdivision >= 3){
      playeritemwidth = 3;
    }
    if(playeritemdivision >= 4){
      playeritemwidth = 4;
    }
    if(playeritemdivision >= 6){
      playeritemwidth = 6;
    }
    return playeritemwidth;
  }


  // make an ordered players list
  const ordered_players = sortPlayers(session, player);

  return <>
    {/* flexbox for header-players-words-suggestions */}
    <Box display='flex' flexDirection='column' justifyContent='space-between' style={{width: '100%', height: '100%'}}>

      {/* header */}
      <Container style={{paddingBottom: '0px'}}>
        <Typography variant='h1' align='center' style={{fontSize: 36}}>
          <Link href='/fictionary'>
            fictionary
          </Link>
          {!narrowscreen &&
          <span style={{fontSize: 16, marginLeft: '24px', position: 'relative', top: '-4px'}}>
            {tag}
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

      {/* players */}
      <Box p={1} style={{paddingTop: 0, paddingBottom: 0}}>
        <Grid item container>
          {(ordered_players !== null) && ordered_players.map((player_mapped, idx) => { return <>
            <Grid item xs={getPlayerItemWidth(session)} key={`player.${idx}.${player_mapped.id}.info`}>
              <PlayerCard 
                player={player_mapped}
                editable={player_mapped.id === player.id}
                onPlayerChange={(to) => { setPlayer(to); }}
              />
            </Grid> 
          </>})}
        </Grid>
      </Box>
      <Divider style={{marginLeft: '8px', marginRight: '8px'}}/>

      {/* words */}
      <Box flexGrow={1} style={{overflow: 'auto'}}>
        <Sluicebox>
          <Box display='flex' flexDirection='column'>
            {session.words && session.words.map((word, idx) => { return <>
              <Box key={`words.${idx}.${word.id}`} style={{alignSelf: `flex-${(word.author === player.id) ? 'end' : 'start'}`}}>
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
