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
import * as greg from 'greg'

import {
  gqlFetch,
  makeSingle
} from '../utils'

import {
  FRONTEND_MAJOR,
  RELEASE_URL,
  REPO_URL,
} from '../constants'

export default function () {
  const navigate = useNavigate()
  const [tag, setTag] = useState<{value: string, exists: boolean}>({value: '', exists: false})

  function* checkTag(tag: string) {
    // check with server to see if this tag exists
    const { data: { getRoomByTag: room } } = yield gqlFetch(`query { getRoomByTag(tag: "${tag}"){tag}}`)
    const exists = room !== null && room.tag === tag
    setTag(prev => ({...prev, exists }))
  }
  const checkTagSingle = makeSingle(checkTag)

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
          <button onClick={() => {
            const value = suggestTag();
            const validated = validateTag(value);
            setTag(prev => ({...prev, value: validated})); // set tag immediately
            checkTagSingle(validated); // check tag for existence w/ preemption
          }}>
            suggest tag
          </button>
          <div>
            <input
              onChange={async e => {
                const value = e.target.value; // handle the user's typing
                const validated = validateTag(value);
                setTag(prev => ({...prev, value: validated})); // set tag immediately
                checkTagSingle(validated); // check tag for existence w/ preemption
              }}
              onKeyDown={async e => {
                if (e.key === 'Enter') {
                  navigate(`/${tag.value}`);
                }
              }}
            />
            {tag.exists ? '->' : '+'}
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

function suggestTag () {
  const tokens = greg.sentence().split(' ')
  return [tokens[1], tokens[2]].join('-')
}

function validateTag(value: string): string {
  const validated = value.toLowerCase().replace(' ', '-')
  return validated
}
