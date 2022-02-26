import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import {
  Game,
  Start,
} from './pages';

const Component = () => {
  return <>
    <Router>
      <Switch>
        <Route path='/fictionary/:_tag' component={Game}/>
        <Route path='/fictionary' component={Start}/>
      </Switch>
    </Router>
  </>
}

export default Component;
