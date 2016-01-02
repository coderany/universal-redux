import React from 'react';
import { Router, browserHistory } from 'react-router';
import getRoutes from 'routes';

export default () => {
  return (
    <div className="router-wrapper">
      <Router history={browserHistory}>
        {getRoutes()}
      </Router>
    </div>
  )
}