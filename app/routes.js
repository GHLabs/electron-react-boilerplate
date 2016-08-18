import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import Permits from './components/Permits'


export default (
  <Route path="/" component={App}>
    <IndexRoute component={Permits} />
  </Route>
);
