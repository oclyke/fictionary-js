import {
	default as React,
  useState,
} from 'react'

import {
  useNavigate,
  Navigate,
  Link,
} from 'react-router-dom'

// @ts-ignore
import * as greg from 'greg';

import {
  fetch_gql,
} from '../utils';

import {
  FRONTEND_MAJOR,
  RELEASE_URL,
  REPO_URL,
} from '../constants'

function suggest_tag () {
  const tokens = greg.sentence().split(' ');
  return [tokens[1], tokens[2]].join('-');
}

function makeSingle(generator) {
  let globalNonce;
  return async function(...args) {
    const localNonce = globalNonce = new Object();

    const iter = generator(...args);
    let resumeValue;
    for (;;) {
      const n = iter.next(resumeValue);
      if (n.done) {
        return n.value;  // final return value of passed generator
      }

      // whatever the generator yielded, _now_ run await on it
      resumeValue = await n.value;
      if (localNonce !== globalNonce) {
        return;  // a new call was made
      }
      // next loop, we give resumeValue back to the generator
    }
  };
}

function* checkTag(value, setter) {
  const result = yield fetch_gql(`query { getRoomByTag(tag: "${value}"){_id}}`); // check with server to see if this tag exists  
  setter(prev => ({...prev, exists: (result.data.getRoomByTag !== null)})); // finally update the tag existence
}
const checkTagSingle = makeSingle(checkTag);

function validate_tag(value: string): string {
  const validated = value.toLowerCase().replace(' ', '-');;
  return validated;
}





export default function () {
  const [tag, setTag] = useState<{value: string, exists: boolean}>({value: '', exists: false})

  const start = false
  const bull = <span className={'bullet'}>•</span>

  return <>
    {start && <Navigate to={`/${tag}`} replace={true} />}
    <div>
      <div>
        <div>
          <h1>
            fictionary
          </h1>
          <div>
            {/* <SessionSelector
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
            /> */}
          </div>
          <h2 color='textSecondary' style={{fontSize: 24, marginTop: '16px'}}>
            fic{bull}tion{bull}ar{bull}y
          </h2>
          <h2 color='textSecondary' style={{fontSize: 14, marginTop: '8px'}}>
            /'fikSHə,nerē/ {bull} <i>noun</i>
          </h2>
          <h2>
            a game of camouflage, misdirection, and astonishment in which players guess the true definition of obscure words
          </h2>
          <hr/>
          <h2 color='textSecondary' style={{fontSize: 24, marginTop: '8px'}}>
            how to play
          </h2>
        </div>
      </div>

      <div>

        {/* starting a game */}
        <h2 color='textSecondary' style={{marginBottom: '0px', paddingBottom: '0px'}}>
          <i>setup</i>
        </h2>
        <span>
          <ul style={{marginTop: 0, listStyle: 'none'}}>
            <li>
              {/* <IconButton color='primary' size='small'>
                <LoopRoundedIcon />
              </IconButton> */}
              <span>create a unique identifier for your group session</span>
              <ul style={{listStyle: 'none'}}>
                <li>
                  {/* <IconButton color='primary' size='small'>
                    <AddCircleOutlineRoundedIcon />
                  </IconButton> */}
                  <span>create a new session</span>
                </li>
                <li>
                  {/* <IconButton color='primary' size='small'>
                    <ArrowForwardRoundedIcon />
                  </IconButton> */}
                  <span>join an existing session</span>
                </li>
              </ul>
            </li>
            <li>
              {/* <IconButton color='primary' size='small'>
                <LaunchRoundedIcon />
              </IconButton> */}
              <span>copy the link to share with friends</span>
            </li>
          </ul>
        </span>

        {/* playing the game */}
        <h2 color='textSecondary' style={{marginBottom: '0px', paddingBottom: '0px'}}>
          <i>gameplay</i>
        </h2>
        <span>
          <ul style={{marginTop: 0, listStyle: 'none'}}>
            <li>
              {/* <IconButton color='primary' size='small'>
                <SendRoundedIcon />
              </IconButton> */}
              <span>add unique words with their real definitions</span>
            </li>
            <li>
              {/* <IconButton color='primary' size='small'>
                <SendRoundedIcon />
              </IconButton> */}
              <span>add made-up definitions to other players' words</span>
            </li>
            <li>
              {/* radio button */}
              {/* <input
                type={'radio'}
                color='primary'
                checked={true}
                style={{marginLeft: '-7px', marginRight: '-5px'}}
              /> */}
              <span>vote on the definitions you think are real</span>
            </li>
          </ul>
        </span>

        {/* scoring */}
        <h2>
          <i>scoring as a voter</i>
        </h2>
        <span>
          <ul style={{marginTop: 0, listStyle: 'none'}}>
            <li>
              <span>+1 when your false definition is voted for</span>
            </li>
            <li>
              <span>+2 when you vote for the true definition</span>
            </li>
          </ul>
        </span>
        <span color='textSecondary' style={{marginBottom: '0px', paddingBottom: '0px'}}>
          <i>scoring as the proposer</i>
        </span>
        <span>
          <ul style={{marginTop: 0, listStyle: 'none'}}>
            <li>
              <span>a point for every voter - if the real definition receives no votes</span>
            </li>
          </ul>
        </span>
      </div>

      {/* footer */}
      <div>
        <div>
          <hr/>
          <h2>
            <a href='https://oclyke.dev' target='_blank' rel='noreferrer'>
              oclyke
            </a>
            {bull}
            <a href={REPO_URL} target='_blank' rel='noreferrer'>
              GitHub
            </a>
            {bull}
            <a href={RELEASE_URL} target='_blank' rel='noreferrer'>
              {FRONTEND_MAJOR}
            </a>
          </h2>
        </div>
      </div>
    </div>
  </>
}
