'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _createMemoryHistory = require('history/lib/createMemoryHistory');

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

var _useBasename = require('history/lib/useBasename');

var _useBasename2 = _interopRequireDefault(_useBasename);

var _RouteUtils = require('./RouteUtils');

var _useRoutes = require('./useRoutes');

var _useRoutes2 = _interopRequireDefault(_useRoutes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _extends = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var createHistory = (0, _useRoutes2.default)((0, _useBasename2.default)(_createMemoryHistory2.default));

/**
 * A high-level API to be used for server-side rendering.
 *
 * This function matches a location to a set of routes and calls
 * callback(error, redirectLocation, renderProps) when finished.
 *
 * Note: You probably don't want to use this in a browser. Use
 * the history.listen API instead.
 */
function match(_ref, callback) {
  var routes = _ref.routes;
  var location = _ref.location;
  var parseQueryString = _ref.parseQueryString;
  var stringifyQuery = _ref.stringifyQuery;
  var basename = _ref.basename;

  !location ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'match needs a location') : (0, _invariant2.default)(false) : undefined;

  var history = createHistory({
    routes: (0, _RouteUtils.createRoutes)(routes),
    parseQueryString: parseQueryString,
    stringifyQuery: stringifyQuery,
    basename: basename
  });

  // Allow match({ location: '/the/path', ... })
  if (typeof location === 'string') location = history.createLocation(location);

  history.match(location, function (error, redirectLocation, nextState) {
    callback(error, redirectLocation, nextState && _extends({}, nextState, { history: history }));
  });
}

exports.default = match;