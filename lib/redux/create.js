'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createStore;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _reduxLogger = require('redux-logger');

var _reduxLogger2 = _interopRequireDefault(_reduxLogger);

var _reduxSimpleRouter = require('redux-simple-router');

var _redux = require('redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import path from 'path';
function createStore(customMiddleware, reducers, data) {
  var defaultMiddleware = [];
  var middleware = defaultMiddleware.concat(customMiddleware);

  if (__CLIENT__ && __LOGGER__) {
    middleware.push((0, _reduxLogger2.default)({ collapsed: true }));
  }

  var finalCreateStore = undefined;
  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    var _require = require('redux-devtools');

    var persistState = _require.persistState;

    var DevTools = require('../containers/DevTools/DevTools').default;
    finalCreateStore = (0, _redux.compose)(_redux.applyMiddleware.apply(undefined, (0, _toConsumableArray3.default)(middleware)), window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(), persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)))(_redux.createStore);
  } else {
    finalCreateStore = _redux.applyMiddleware.apply(undefined, (0, _toConsumableArray3.default)(middleware))(_redux.createStore);
  }

  var reducer = (0, _redux.combineReducers)((0, _assign2.default)({}, reducers, { routing: _reduxSimpleRouter.routeReducer }));

  var store = finalCreateStore(reducer, data);

  // if (__DEVELOPMENT__ && module.hot) {
  //   module.hot.accept(__REDUCER_INDEX__, () => {
  //   module.hot.accept('../../../../src/redux/modules/index', () => {
  //     store.replaceReducer(require(path.resolve(__REDUCER_INDEX__)));
  //     store.replaceReducer(require('../../../../src/redux/modules/index'));
  //   });
  // }

  return store;
}