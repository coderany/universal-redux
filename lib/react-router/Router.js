'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _setPrototypeOf = require('babel-runtime/core-js/object/set-prototype-of');

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _createHashHistory = require('history/lib/createHashHistory');

var _createHashHistory2 = _interopRequireDefault(_createHashHistory);

var _RouteUtils = require('./RouteUtils');

var _RoutingContext = require('./RoutingContext');

var _RoutingContext2 = _interopRequireDefault(_RoutingContext);

var _useRoutes = require('./useRoutes');

var _useRoutes2 = _interopRequireDefault(_useRoutes);

var _PropTypes = require('./PropTypes');

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

function _objectWithoutProperties(obj, keys) {
  var target = {};for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
  }return target;
}

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
var func = _React$PropTypes.func;
var object = _React$PropTypes.object;

/**
 * A <Router> is a high-level API for automatically setting up
 * a router that renders a <RoutingContext> with all the props
 * it needs each time the URL changes.
 */

var Router = (function (_Component) {
  _inherits(Router, _Component);

  function Router(props, context) {
    _classCallCheck(this, Router);

    _Component.call(this, props, context);

    this.state = {
      location: null,
      routes: null,
      params: null,
      components: null
    };
  }

  Router.prototype.handleError = function handleError(error) {
    if (this.props.onError) {
      this.props.onError.call(this, error);
    } else {
      // Throw errors by default so we don't silently swallow them!
      throw error; // This error probably occurred in getChildRoutes or getComponents.
    }
  };

  Router.prototype.componentWillMount = function componentWillMount() {
    var _this = this;

    var _props = this.props;
    var history = _props.history;
    var children = _props.children;
    var routes = _props.routes;
    var parseQueryString = _props.parseQueryString;
    var stringifyQuery = _props.stringifyQuery;

    var createHistory = history ? function () {
      return history;
    } : _createHashHistory2.default;

    this.history = (0, _useRoutes2.default)(createHistory)({
      routes: (0, _RouteUtils.createRoutes)(routes || children),
      parseQueryString: parseQueryString,
      stringifyQuery: stringifyQuery
    });

    this._unlisten = this.history.listen(function (error, state) {
      if (error) {
        _this.handleError(error);
      } else {
        _this.setState(state, _this.props.onUpdate);
      }
    });
  };

  /* istanbul ignore next: sanity check */

  Router.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(nextProps.history === this.props.history, 'You cannot change <Router history>; it will be ignored') : undefined;

    process.env.NODE_ENV !== 'production' ? (0, _warning2.default)((nextProps.routes || nextProps.children) === (this.props.routes || this.props.children), 'You cannot change <Router routes>; it will be ignored') : undefined;
  };

  Router.prototype.componentWillUnmount = function componentWillUnmount() {
    if (this._unlisten) this._unlisten();
  };

  Router.prototype.render = function render() {
    var _state = this.state;
    var location = _state.location;
    var routes = _state.routes;
    var params = _state.params;
    var components = _state.components;
    var _props2 = this.props;
    var RoutingContext = _props2.RoutingContext;
    var createElement = _props2.createElement;

    var props = _objectWithoutProperties(_props2, ['RoutingContext', 'createElement']);

    if (location == null) return null; // Async match

    // Only forward non-Router-specific props to routing context, as those are
    // the only ones that might be custom routing context props.
    (0, _keys2.default)(Router.propTypes).forEach(function (propType) {
      return delete props[propType];
    });

    return _react2.default.createElement(RoutingContext, _extends({}, props, {
      history: this.history,
      createElement: createElement,
      location: location,
      routes: routes,
      params: params,
      components: components
    }));
  };

  return Router;
})(_react.Component);

Router.propTypes = {
  history: object,
  children: _PropTypes.routes,
  routes: _PropTypes.routes, // alias for children
  RoutingContext: func.isRequired,
  createElement: func,
  onError: func,
  onUpdate: func,
  parseQueryString: func,
  stringifyQuery: func
};

Router.defaultProps = {
  RoutingContext: _RoutingContext2.default
};

exports.default = Router;