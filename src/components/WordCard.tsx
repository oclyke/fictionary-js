import React, {useState, useEffect} from 'react';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';

import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
// import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Popover from '@material-ui/core/Popover';

import Radio from '@material-ui/core/Radio';

import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';

import SendRoundedIcon from '@material-ui/icons/SendRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import SettingsIcon from '@material-ui/icons/Settings';

import {
  CreateSessionInput,
  DefinitionInput,
  UpdateSessionInput,
  WordStatus,
  WordInput,
  PlayerInput,
} from './../API';

import { usePlayer } from './../hooks/usePlayer';
import { useSession } from './../hooks/useSession';
import { requestUpdateSession } from '../utility/db';

import { 
  getNumberVoters,
  playerHasVoted,
  playerCanVote,
  playerCanPose,
  getStatus,
  getMaxVotes,
  getPosersList,
} from './../utility/words';

import { v4 as uuidv4 } from 'uuid';

const shuffle = (array: any[]) => {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
})
);

type VotesIndicatorProps = {
  session: CreateSessionInput,
  word: WordInput,
  def: DefinitionInput,
}

const VotesIndicator = (props: VotesIndicatorProps) => {
  const session = props.session;
  const maxvotes = getMaxVotes(props.word);
  const def = props.def;

  let spaces = maxvotes;
  let voters: PlayerInput[] = [];
  if(def.votes){
    spaces -= def.votes.length;
    voters = def.votes.map(id => {
      const matches = session.players?.filter(p => (p.id === id));
      if(matches && matches.length){
        return matches[0]
      }
      return {
        id,
        name: '',
        color: '#000000',
      }
    });
  }

  return <>
    {[...([...Array(spaces)].map(_ => '#ffffff')), ...(voters.map(voter => voter.color))].map(color => {
      return <>
        <span 
          style={{
            display: 'inline-block',
            backgroundColor: color,
            height: '12px',
            width: '12px',
          }}
        /> 
      </>
    })}
  </>
}

const null_definition: DefinitionInput = {
  id: '',
  author: '',
  text: '',
  votes: [],
}

type WordCardProps = {
  word: WordInput,
}

const WordCard = (props: WordCardProps) => {
  const [session_ref] = useSession();
  const [player_ref] = usePlayer();
  const word = props.word;

  const player = player_ref.current;
  const session = session_ref.current;

  // html stuff
  const classes = useStyles();
  const [settingsanchorref, setSettingsAnchorRef] = React.useState<any>(null);
  const showsettings = Boolean(settingsanchorref);

  // definitions
  //    posing: the one a player writes, 
  //    shuffled: an array of all definitions shuffled once, 
  //    selected: the index of the selected definition within the shuffled array
  const [posing, setPosing] = useState<DefinitionInput>(null_definition);
  const [shuffled, setShuffled] = useState<(DefinitionInput | null)[]>([]);
  const [selected, setSelected] = useState<null | DefinitionInput>(null);

  const status: WordStatus = getStatus(word);
  const defined = ((status === WordStatus.VOTING) || (status === WordStatus.CLOSED));
  const voted = (status === WordStatus.CLOSED);

  useEffect(() => {
    if(defined){ // only runs when defined changes to true (when all definitions provided)
      setShuffled(shuffle((word.definitions) ? word.definitions : []));
    }

    if(voted){  // when the votes are cast update the shuffled deck with (we're flirting with a silly bug here - the shuffled set of definitions doesn't update with props any more)
      const ordered = ((word.definitions) ? word.definitions : []).sort((a, b) => {
        const av = (a) ? (a.votes) ? a.votes : [] : [];
        const bv = (b) ? (b.votes) ? b.votes : [] : [];
        return (bv.length - av.length);
      });
      setShuffled(ordered);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defined, voted]);

  const deleteSelf = async () => {
    if(typeof(session.id) === 'undefined' || session.id === null){
      throw new Error('you must have a session to delete a word')
    }

    let words: WordInput[] | undefined = session.words?.filter(w => w.id !== word.id);
    const update: UpdateSessionInput = {
      id: session.id,
      words
    }
    await requestUpdateSession(update);
  }

  const updateSelf = async (input: WordInput) => {
    if(typeof(session.id) === 'undefined' || session.id === null){
      throw new Error('you must have a session to update a word')
    }

    const others: WordInput[] | undefined = session.words?.filter(w => w.id !== word.id);
    let words: WordInput[] = [];
    if(others){
      words = [...others];
    }
    words.push({...input, id: word.id});

    const update: UpdateSessionInput = {
      id: session.id,
      words
    }
    await requestUpdateSession(update);
  }

  const pose = async () => {
    if(typeof(session.id) === 'undefined' || session.id === null){
      throw new Error('you must have a session to propose')
    }

    // get the session words, add the definition to this word, and update the session
    const words: WordInput[] | undefined = session.words?.map(w => {
      if(w.id !== word.id){ return w; }
      let definitions: DefinitionInput[] =  [];
      if(w.definitions){
        definitions = w.definitions;
      }
      definitions.push({
        ...posing,
        id: uuidv4(),
        author: player.id
      })
      return {...w, definitions};
    })

    const update: UpdateSessionInput = {
      id: session.id,
      words
    }
    await requestUpdateSession(update);
    setPosing(null_definition);
  }

  return <>
    <Box m={1} >
      <Card className={classes.root}>
        <CardContent>

          {/* word info */}
          <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'>
            <Typography variant="h6" component="h2">
              {props.word.text}
            </Typography>

            {/* word settings show/hide */}
            <>
              <Tooltip title='settings'>
                <IconButton
                  ref={settingsanchorref}
                  color='primary'
                  size='small'
                  style={{color: '#B6B6B6'}}
                  onClick={(e) => {
                    setSettingsAnchorRef(e.currentTarget);
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>


              <Popover
                // id={id}
                open={showsettings}
                anchorEl={settingsanchorref}
                onClose={(e) => {
                  setSettingsAnchorRef(null);
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <Box p={1} display='flex' flexDirection='column'>
                  <IconButton
                    ref={settingsanchorref}
                    color='primary'
                    size='small'
                    style={{color: '#B6B6B6'}}
                    onClick={(e) => { deleteSelf(); }}
                  >
                    <CloseRoundedIcon />
                  </IconButton>

                  {status !== WordStatus.CLOSED && <>
                    <IconButton
                      ref={settingsanchorref}
                      color='primary'
                      size='small'
                      style={{color: '#B6B6B6'}}
                      onClick={(e) => {
                        let status_override = WordStatus.NONE;
                        let committee = word.committee;
                        switch (word.status_override) {
                        case WordStatus.NONE :
                        case WordStatus.OPEN :
                          status_override = WordStatus.VOTING;
                          committee = getPosersList(word);  // overwrite the committee to only include players who have posed definitions
                          break;
                        case WordStatus.VOTING :
                          status_override = WordStatus.CLOSED;
                          break
                        default:
                          throw new Error('invalid word status')
                        }
                        updateSelf({...word, committee, status_override});
                      }}
                    >
                      <CheckRoundedIcon />
                    </IconButton>
                  </>}
                </Box>
              </Popover>
            </>

          </Box>
          {status === WordStatus.OPEN &&
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              {`definitions: ${(word.definitions) ? word.definitions.length : ''}/${(word.committee) ? word.committee.length + 1 : ''}`}
            </Typography>}
          {status === WordStatus.VOTING &&
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              {`votes: ${getNumberVoters(word)}/${(word.committee) ? word.committee.length : ''}`}
            </Typography>}
            
          
          {/* definitions */}
          {shuffled.filter(def => ((status !== WordStatus.CLOSED) ? (!playerHasVoted(word, player) ? (!(word.author === player.id) ? !(def?.author === player.id) : true) : true) : true)).map((def, idx) => {
            if(!def){
              throw new Error('a definition is null...')
            }
            return <>
              <Box fontWeight={((def.author !== word.author) || (status !== WordStatus.CLOSED)) ? 'fontWeightLight' : 'fontWeightBold'} key={`words.${idx}.${word.id}.defs.${def.id}`}>
              
                {/* display votes at the end */}
                {(status === WordStatus.CLOSED) && <VotesIndicator session={session} word={word} def={def} />}

                {/* radio buttons for voting */}
                {(status === WordStatus.VOTING) && playerCanVote(word, player) && 
                <Radio
                  style={{color: session.players?.filter(p => p.id === word.author)[0].color}}
                  checked={(selected === null) ? false : (selected.id === def.id)}
                  onChange={(e) => {
                    setSelected((selected === null) ? def : (selected.id === def.id) ? null : def);
                  }}
                  inputProps={{ 'aria-label': `definition ${idx}: ${def.text}` }}
                />}
                {def.text}
              </Box>
            </>})}

        </CardContent>

        {/* <CardActions style={{backgroundColor: word.author.color}}> */}
        <CardActions>

          {/* phony definition suggestion */}
          {playerCanPose(word, player) && <>
            <InputBase
              className={classes.input}
              value={posing.text}
              placeholder='phony definition'
              onChange={(e) => {
                setPosing(prev => {return {...prev, text: e.target.value.toLowerCase()}});
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if(posing.text !== ''){
                    pose();
                  }
                }
              }}
            />
            <Divider className={classes.divider} orientation="vertical" />
            <Tooltip title={`${(posing.text === '') ? 'phony definition required' : 'pose phony definition'}`}>
              <span>
                <IconButton
                  disabled={posing.text === ''}
                  color='primary'
                  className={classes.iconButton}
                  onClick={(e) => {
                    pose();
                  }}
                >
                  <SendRoundedIcon />
                </IconButton>
              </span>
            </Tooltip>
          </>}

          {/* vote confirmation */}
          {(status === WordStatus.VOTING) && playerCanVote(word, player) && <>
            <Button
              disabled={(selected === null)}
              variant='contained'
              color='primary'
              onClick={(e) => {
                if(selected !== null){
                  let definitions: DefinitionInput[] | null | undefined = word.definitions?.map(def => {
                    if(def.id !== selected.id){ return def; }
                    let votes: string[] = [];
                    if((typeof(def.votes) !== 'undefined') && (def.votes !== null)){
                      votes = def.votes;
                    }
                    votes.push(player.id);
                    const updated: DefinitionInput = {
                      ...def,
                      votes
                    }
                    return updated;
                  })
                  if(!definitions){
                    definitions = null;
                  }
                  updateSelf({...word, definitions});
                }else{
                  console.warn('you cant submit a vote without a selection!');
                }
              }}
            >
            vote
            </Button>
          </>}

    
        </CardActions>
      </Card>
    </Box>
  </>
}

export default WordCard;
