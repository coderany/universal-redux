/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
// node modules dependencies
import React from 'react';
import { each } from 'lodash';
import ReactDOM from 'react-dom';
import createStore from './redux/create';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import RouterWrapper from './routerWrapper'

// TODO: get useScroll working again with react-router 2
// import useScroll from 'scroll-behavior/lib/useStandardScroll';
// const history = useScroll(browserHistory)();

// dependencies of external source. these resolve via webpack aliases
// as assigned in merge-configs.js
import reducers from 'reducers';
import customMiddleware from 'middleware';

// assemble custom middleware
const middleware = [];
each(customMiddleware, (customMiddlewareToAdd) => {
  if (typeof customMiddlewareToAdd === 'function') {
    middleware.push(customMiddlewareToAdd());
  }
});

const dest = document.getElementById('content');
const store = createStore(middleware, browserHistory, reducers, window.__data);

// function createElement(Component, propz) {
//   if (Component.fetchData) {
//     Component.fetchData(store.getState, store.dispatch,
//                         propz.location, propz.params);
//   }
//   return React.createElement(Component, propz);
// }


const DevTools = require('./containers/DevTools/DevTools').default;
ReactDOM.render(
  <Provider store={store} key="provider">
    <div>
      <RouterWrapper />
      <DevTools />
    </div>
  </Provider>,
  dest
);

