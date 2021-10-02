import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom';

import {
  Game,
  Start,
} from './pages';

const Games = (props: any) => {
  let root = useRouteMatch();
  return <>
    <Switch>
      <Route path={`${root.url}/:_tag`} component={Game}/>
    </Switch>
  </>
}

const Component = () => {
  return <>
    <Router>
      <Switch>
        <Route path='/fictionary/session' component={Games}/>
        <Route path='/fictionary' component={Start}/>
        {/* <Route path='/fictionary' component={Testcomp}/> */}
      </Switch>
    </Router>
  </>
}

export default Component;
