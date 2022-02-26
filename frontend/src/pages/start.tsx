import React from 'react';
import {
  useState,
  useEffect,
} from 'react';

import {
  Redirect,
} from 'react-router-dom';

import {
  Box,
  Typography,
  Link,
  IconButton,
  Divider,
  Radio,
} from '@material-ui/core';

import {
  makeStyles
} from '@material-ui/core/styles';

import LoopRoundedIcon from '@material-ui/icons/LoopRounded';
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import LaunchRoundedIcon from '@material-ui/icons/Launch';

import {
  SessionSelector,
  Sluicebox,
} from '../components';

import {
  roomByTag,
  suggestId,
  preventDefault,
  gqlop,
} from '../utility';

import {
  version
} from '../ver';

const useStyles = makeStyles({
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
});

const Component = (props: any) => {
  const [tag, settag] = useState(suggestId());
  const [idactive, setIDActive] = useState<boolean>(false);
  const [start, setStart] = useState(false);

  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  const tagActive = async (session_tag: string) => {
    const room = await roomByTag(session_tag);
    const exists = (room !== null);
    return exists;
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
                  <span>create a unique identifier for your game</span>
                  <ul style={{listStyle: 'none'}}>
                    <li>
                      <IconButton color='primary' size='small'>
                        <AddCircleOutlineRoundedIcon />
                      </IconButton>
                      <span>create a new game</span>
                    </li>
                    <li>
                      <IconButton color='primary' size='small'>
                        <ArrowForwardRoundedIcon />
                      </IconButton>
                      <span>join an existing game</span>
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
                  <span>add made-up definitions to other players' words</span>
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
              {bull}
              <Link href='' target='_blank' rel='noreferrer'>
                v{version}
              </Link>
            </Typography>
          </Sluicebox>
        </Box>
      </Box>

      {start && <Redirect to={`/fictionary/${tag}`}/>}
    </>
  );
}

export default Component;
