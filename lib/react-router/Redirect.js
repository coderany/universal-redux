'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setPrototypeOf = require('babel-runtime/core-js/object/set-prototype-of');

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _RouteUtils = require('./RouteUtils');

var _PatternUtils = require('./PatternUtils');

var _PropTypes = require('./PropTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function, not ' + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
  }subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
}

var _React$PropTypes = _react2.default.PropTypes;
var string = _React$PropTypes.string;
var object = _React$PropTypes.object;

/**
 * A <Redirect> is used to declare another URL path a client should
 * be sent to when they request a given URL.
 *
 * Redirects are placed alongside routes in the route configuration
 * and are traversed in the same manner.
 */

var Redirect = (function (_Component) {
  _inherits(Redirect, _Component);

  function Redirect() {
    _classCallCheck(this, Redirect);

    _Component.apply(this, arguments);
  }

  /* istanbul ignore next: sanity check */

  Redirect.prototype.render = function render() {
    !false ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '<Redirect> elements are for router configuration only and should not be rendered') : (0, _invariant2.default)(false) : undefined;
  };

  return Redirect;
})(_react.Component);

Redirect.createRouteFromReactElement = function (element) {
  var route = (0, _RouteUtils.createRouteFromReactElement)(element);

  if (route.from) route.path = route.from;

  route.onEnter = function (nextState, replaceState) {
    var location = nextState.location;
    var params = nextState.params;

    var pathname = undefined;
    if (route.to.charAt(0) === '/') {
      pathname = (0, _PatternUtils.formatPattern)(route.to, params);
    } else if (!route.to) {
      pathname = location.pathname;
    } else {
      var routeIndex = nextState.routes.indexOf(route);
      var parentPattern = Redirect.getRoutePattern(nextState.routes, routeIndex - 1);
      var pattern = parentPattern.replace(/\/*$/, '/') + route.to;
      pathname = (0, _PatternUtils.formatPattern)(pattern, params);
    }

    replaceState(route.state || location.state, pathname, route.query || location.query);
  };

  return route;
};

Redirect.getRoutePattern = function (routes, routeIndex) {
  var parentPattern = '';

  for (var i = routeIndex; i >= 0; i--) {
    var route = routes[i];
    var pattern = route.path || '';
    parentPattern = pattern.replace(/\/*$/, '/') + parentPattern;

    if (pattern.indexOf('/') === 0) break;
  }

  return '/' + parentPattern;
};

Redirect.propTypes = {
  path: string,
  from: string, // Alias for path
  to: string.isRequired,
  query: object,
  state: object,
  onEnter: _PropTypes.falsy,
  children: _PropTypes.falsy
};

exports.default = Redirect;