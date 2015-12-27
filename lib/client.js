'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _createBrowserHistory = require('history/lib/createBrowserHistory');

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

var _create = require('./redux/create');

var _create2 = _interopRequireDefault(_create);

var _reactRedux = require('react-redux');

var _index = require('../react-router/index');

var _reduxSimpleRouter = require('redux-simple-router');

var _useStandardScroll = require('scroll-behavior/lib/useStandardScroll');

var _useStandardScroll2 = _interopRequireDefault(_useStandardScroll);

var _routes = require('routes');

var _routes2 = _interopRequireDefault(_routes);

var _reducers = require('reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _middleware = require('middleware');

var _middleware2 = _interopRequireDefault(_middleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// assemble custom middleware, pass req, res
/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
// node modules dependencies
var middleware = [];

// dependencies of external source. these resolve via webpack aliases
// as assigned in merge-configs.js

(0, _lodash.each)(_middleware2.default, function (customMiddlewareToAdd) {
  if (typeof customMiddlewareToAdd === 'function') {
    middleware.push(customMiddlewareToAdd());
  }
});

var dest = document.getElementById('content');
var store = (0, _create2.default)(middleware, _reducers2.default, window.__data);
var history = (0, _useStandardScroll2.default)(_createBrowserHistory2.default)();

(0, _reduxSimpleRouter.syncReduxAndRouter)(history, store);

function createElement(Component, propz) {
  if (Component.fetchData) {
    Component.fetchData(store.getState, store.dispatch, propz.location, propz.params);
  }
  return _react2.default.createElement(Component, propz);
}

var component = _react2.default.createElement(
  _index.Router,
  { createElement: createElement, history: history },
  (0, _routes2.default)(store)
);

_reactDom2.default.render(_react2.default.createElement(
  _reactRedux.Provider,
  { store: store, key: 'provider' },
  component
), dest);

if (process.env.NODE_ENV !== 'production') {
  window.React = _react2.default; // enable debugger

  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}

if (__DEVTOOLS__ && !window.devToolsExtension) {
  var DevTools = require('./containers/DevTools/DevTools').default;
  _reactDom2.default.render(_react2.default.createElement(
    _reactRedux.Provider,
    { store: store, key: 'provider' },
    _react2.default.createElement(
      'div',
      null,
      component,
      _react2.default.createElement(DevTools, null)
    )
  ), dest);
}