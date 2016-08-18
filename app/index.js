import React from 'react';
import {render} from 'react-dom';
import {Router, hashHistory} from 'react-router';
import routes from './routes';
import './styles/app.global.css'
import './styles/react-virtualized.global.css'
import './styles/react-select-box.global.css'


render(
  <Router history={hashHistory} routes={routes} />,
  document.getElementById('root')
);
