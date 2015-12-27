'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRouterObject = createRouterObject;
exports.createRoutingHistory = createRoutingHistory;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _deprecateObjectProperties = require('./deprecateObjectProperties');

var _deprecateObjectProperties2 = _interopRequireDefault(_deprecateObjectProperties);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createRouterObject(history, transitionManager) {
  return (0, _extends3.default)({}, history, {
    setRouteLeaveHook: transitionManager.listenBeforeLeavingRoute,
    isActive: transitionManager.isActive
  });
}

// deprecated
function createRoutingHistory(history, transitionManager) {
  history = (0, _extends3.default)({}, history, transitionManager);

  if (__DEV__) {
    history = (0, _deprecateObjectProperties2.default)(history, '`props.history` and `context.history` are deprecated; use `props.router` on route components and `context.router` on deeper components.');
  }

  return history;
}