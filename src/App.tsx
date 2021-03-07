/* 
// This file is subject to the terms and conditions defined in
// file 'LICENSE.md', which is part of this source code package.
*/

// owen todo:
// - add cookies to retain user info like name + color

import React, {
  useState,
  useEffect,
} from 'react';
import {
  BrowserRouter as Router,
  withRouter,
  Switch,
  Route,
  Redirect,
  useRouteMatch,
  useParams,
} from 'react-router-dom';

import ClipboardJS from 'clipboard';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import Radio from '@material-ui/core/Radio';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import LaunchRoundedIcon from '@material-ui/icons/Launch';
import LoopRoundedIcon from '@material-ui/icons/LoopRounded';
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded';
import SendRoundedIcon from '@material-ui/icons/SendRounded';

import SessionSelector from './components/SessionSelector';
import WordProposer from './components/WordProposer';
import WordCard from './components/WordCard';
import PlayerCard from './components/PlayerCard';

import { useSession } from './hooks/useSession';
import { usePlayer } from './hooks/usePlayer';
import {
  sortPlayers,
  suggestId,
} from './utility/interactions';
import {
  CreateSessionInput, UpdateSessionInput,
} from './API';

import {
  requestDeleteSession,
  requestUpdateSession,
  requestSessionByTag,
} from './utility/db';

new ClipboardJS('.copybtn');

const useStyles = makeStyles({
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
});

const preventDefault = (event: React.SyntheticEvent) => event.preventDefault();

const Sluicebox = (props: {children: any}) => {
  return (
    <Grid container>
      <Grid item xs={1}  sm={2}  md={3}/>
      <Grid item xs={10} sm={8}  md={6}>
        {props.children}
      </Grid>
      <Grid item xs={1}  sm={2}  md={3}/>
    </Grid>
  );
}

/**************************************************************
                            Game Page
**************************************************************/

const Game = withRouter(({ history }) => {
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

const Games = (props: any) => {
  let root = useRouteMatch();
  return (
    <Switch>
      <Route path={`${root.url}/:_tag`} component={Game}/>
    </Switch>
  );
}

/**************************************************************
                            Start Page
**************************************************************/

const Start = (props: any) => {
  const [tag, settag] = useState(suggestId());
  const [idactive, setIDActive] = useState<boolean>(false);
  const [start, setStart] = useState(false);

  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  const tagActive = async (session_tag: string) => {
    const result = await requestSessionByTag(session_tag);
    const data = (result.data as { sessionByTag: { items: CreateSessionInput[]} });
    const matches = data.sessionByTag.items;
    return (matches.length) ? true : false;
  }

  // an effect that runs on first render
  useEffect(() => {
    const checkTag = async () => {
      const active: boolean = await tagActive(tag);
      setIDActive(active);
    }
    checkTag();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box display='flex' flexDirection='column' justifyContent='space-between' style={{width: '100%', height: '100%'}}>
        {/* <Grid item container direction='column'> */}
        <Box>
          <Sluicebox>
            <Typography variant='h1' align='center' style={{fontSize: 36, marginTop: '12px'}}>
              fictionary
            </Typography>
            <Box style={{marginTop: '16px'}}>
              <SessionSelector
                id={tag}
                join={idactive}
                onSuggest={async (e) => {
                  const newid = suggestId();
                  settag(newid);
                  const active: boolean = await tagActive(newid);
                  setIDActive(active);
                }}
                onChange={async (e) => {
                  const newid = e.target.value;
                  settag(newid);
                  const active: boolean = await tagActive(newid);
                  setIDActive(active);
                }}
                onSubmit={(e) => {
                  preventDefault(e);
                  setStart(true);
                }}
              />
            </Box>
            <Typography color='textSecondary' style={{fontSize: 24, marginTop: '16px'}}>
              fic{bull}tion{bull}ar{bull}y
            </Typography>
            <Typography color='textSecondary' style={{fontSize: 14, marginTop: '8px'}}>
              /'fikSHə,nerē/ {bull} <i>noun</i>
            </Typography>
            <Typography>
              a game of camouflage, misdirection, and astonishment in which players guess the true definition of obscure words
            </Typography>
            <Divider style={{marginTop: '8px'}}/>
            <Typography color='textSecondary' style={{fontSize: 24, marginTop: '8px'}}>
              how to play
            </Typography>
          </Sluicebox>
        </Box>


        <Box flexGrow={1} style={{overflow: 'auto'}}>
          <Sluicebox>
            {/* starting a game */}
            <Typography color='textSecondary' style={{marginBottom: '0px', paddingBottom: '0px'}}>
              <i>setup</i>
            </Typography>
            <Typography component={'span'}>
              <ul style={{marginTop: 0, listStyle: 'none'}}>
                <li>
                  <IconButton color='primary' size='small'>
                    <LoopRoundedIcon />
                  </IconButton>
                  <span>create a unique identifier for your group session</span>
                  <ul style={{listStyle: 'none'}}>
                    <li>
                      <IconButton color='primary' size='small'>
                        <AddCircleOutlineRoundedIcon />
                      </IconButton>
                      <span>create a new session</span>
                    </li>
                    <li>
                      <IconButton color='primary' size='small'>
                        <ArrowForwardRoundedIcon />
                      </IconButton>
                      <span>join an existing session</span>
                    </li>
                  </ul>
                </li>
                <li>
                  <IconButton color='primary' size='small'>
                    <LaunchRoundedIcon />
                  </IconButton>
                  <span>copy the link to share with friends</span>
                </li>
              </ul>
            </Typography>

            {/* playing the game */}
            <Typography color='textSecondary' style={{marginBottom: '0px', paddingBottom: '0px'}}>
              <i>gameplay</i>
            </Typography>
            <Typography component={'span'}>
              <ul style={{marginTop: 0, listStyle: 'none'}}>
                <li>
                  <IconButton color='primary' size='small'>
                    <SendRoundedIcon />
                  </IconButton>
                  <span>add unique words with their real definitions</span>
                </li>
                <li>
                  <IconButton color='primary' size='small'>
                    <SendRoundedIcon />
                  </IconButton>
                  <span>add made-up definitions to other player's words</span>
                </li>
                <li>
                  {/* radio button */}
                  <Radio
                    color='primary'
                    checked={true}
                    style={{marginLeft: '-7px', marginRight: '-5px'}}
                  />
                  <span>vote on the definitions you think are real</span>
                </li>
              </ul>
            </Typography>

            {/* scoring */}
            <Typography color='textSecondary' style={{marginBottom: '0px', paddingBottom: '0px'}}>
              <i>scoring as a voter</i>
            </Typography>
            <Typography component={'span'}>
              <ul style={{marginTop: 0, listStyle: 'none'}}>
                <li>
                  <span>+1 when your false definition is voted for</span>
                </li>
                <li>
                  <span>+2 when you vote for the true definition</span>
                </li>
              </ul>
            </Typography>
            <Typography color='textSecondary' style={{marginBottom: '0px', paddingBottom: '0px'}}>
              <i>scoring as the proposer</i>
            </Typography>
            <Typography component={'span'}>
              <ul style={{marginTop: 0, listStyle: 'none'}}>
                <li>
                  <span>a point for every voter - if the real definition receives no votes</span>
                </li>
              </ul>
            </Typography>
          </Sluicebox>
        </Box>

        <Box>
          <Sluicebox>
            <Divider style={{marginTop: '8px'}}/>
            <Typography variant='subtitle2' align='center' style={{paddingBottom: '8px', paddingTop: '8px'}}>
              <Link href='https://oclyke.dev' target='_blank' rel='noreferrer'>
                oclyke
              </Link>
              {bull}
              <Link href='https://github.com/oclyke-dev/fictionary' target='_blank' rel='noreferrer'>
                GitHub
              </Link>
            </Typography>
          </Sluicebox>
        </Box>
      </Box>

      {start && <Redirect to={`/fictionary/session/${tag}`}/>}
    </>
  );
}

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path='/fictionary/session' component={Games}/>
        <Route path='/fictionary' component={Start}/>
      </Switch>
    </Router>
  );
}

export default App;
