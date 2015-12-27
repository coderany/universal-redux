'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _prettyError = require('pretty-error');

var _prettyError2 = _interopRequireDefault(_prettyError);

var _lodash = require('lodash');

var _index = require('./react-router/index');

var _reactRedux = require('react-redux');

var _webpackIsomorphicTools = require('webpack-isomorphic-tools');

var _webpackIsomorphicTools2 = _interopRequireDefault(_webpackIsomorphicTools);

var _create = require('./redux/create');

var _create2 = _interopRequireDefault(_create);

var _HtmlShell = require('./containers/HtmlShell/HtmlShell');

var _HtmlShell2 = _interopRequireDefault(_HtmlShell);

var _getStatusFromRoutes = require('./helpers/getStatusFromRoutes');

var _getStatusFromRoutes2 = _interopRequireDefault(_getStatusFromRoutes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// node modules dependencies

var _app = undefined;

// dependencies of serverside render

var hasSetup = false;
var tools = undefined;
var config = require('../config/universal-redux.config.js');
var toolsConfig = require('../config/webpack-isomorphic-tools-config');

/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false; // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

function setupTools() {
  toolsConfig.webpack_assets_file_path = 'node_modules/universal-redux/webpack-assets.json';

  var rootDir = undefined;
  if (config.webpack.config.context) {
    rootDir = _path2.default.resolve(config.webpack.config.context);
  } else {
    rootDir = _path2.default.resolve(__dirname, '..');
  }

  tools = new _webpackIsomorphicTools2.default(toolsConfig);
  tools.development(__DEVELOPMENT__).server(rootDir);
}

function setupAssets() {
  if (config.server.favicon) {
    _app.use((0, _serveFavicon2.default)(_path2.default.resolve(config.server.favicon)));
  }
  if (config.server.staticPath) {
    var maxAge = config.server.maxAge || 0;
    _app.use(_express2.default.static(_path2.default.resolve(config.server.staticPath), { maxage: maxAge }));
  }
}

function setupRenderer() {

  var getRoutes = require(_path2.default.resolve(config.routes)).default;
  var reducers = require(_path2.default.resolve(config.redux.reducers)).default;
  var pretty = new _prettyError2.default();

  var CustomHtml = undefined;
  if (config.htmlShell) {
    CustomHtml = require(_path2.default.resolve(config.htmlShell)).default;
  } else {
    CustomHtml = _HtmlShell2.default;
  }

  _app.use(function (req, res) {

    if (__DEVELOPMENT__) {
      // Do not cache webpack stats: the script file would change since
      // hot module replacement is enabled in the development env
      tools.refresh();
    }

    // assemble custom middleware, pass req, res
    var middleware = [];
    if (config.redux.middleware) {
      var customMiddleware = require(_path2.default.resolve(config.redux.middleware)).default;
      (0, _lodash.each)(customMiddleware, function (customMiddlewareToAdd) {
        if (typeof customMiddlewareToAdd === 'function') {
          middleware.push(customMiddlewareToAdd(req, res));
        }
      });
    }

    var store = (0, _create2.default)(middleware, reducers);

    function hydrateOnClient() {
      res.send('<!doctype html>\n' + _server2.default.renderToString(_react2.default.createElement(CustomHtml, { assets: tools.assets(), store: store, headers: res._headers })));
    }

    if (__DISABLE_SSR__) {
      hydrateOnClient();
      return;
    }

    (0, _index.match)({ routes: getRoutes(store),
      location: req.originalUrl }, function (error, redirectLocation, renderProps) {
      if (redirectLocation) {
        res.redirect(redirectLocation.pathname + redirectLocation.search);
      } else if (error) {
        console.error('ROUTER ERROR:', pretty.render(error));
        res.status(500);
        hydrateOnClient();
      } else if (!renderProps) {
        res.status(500);
        hydrateOnClient();
      } else {
        var component = _react2.default.createElement(
          _reactRedux.Provider,
          { store: store, key: 'provider' },
          _react2.default.createElement(_index.RoutingContext, null)
        );

        var status = (0, _getStatusFromRoutes2.default)(renderProps.routes);
        if (status) {
          res.status(status);
        }
        res.send('<!doctype html>\n' + _server2.default.renderToString(_react2.default.createElement(CustomHtml, { assets: tools.assets(), component: component, store: store, headers: res._headers })));
      }
    });
  });
}

function validateConfig() {
  var errors = [];
  if (!config) {
    errors.push('==>     ERROR: No configuration supplied.');
  }
  if (config.server) {
    if (!config.server.host) {
      errors.push('==>     ERROR: No host parameter supplied.');
    }
    if (!config.server.port) {
      errors.push('==>     ERROR: No port parameter supplied.');
    }
  }
  if (!config.routes) {
    errors.push('==>     ERROR: Must supply routes.');
  }
  if (!config.redux.reducers) {
    errors.push('==>     ERROR: Must supply redux configuration.');
  } else if (!config.redux.reducers) {
    errors.push('==>     ERROR: Must supply reducers.');
  }
  // TODO: check for more
  return errors;
}

var Renderer = (function () {
  function Renderer() {
    (0, _classCallCheck3.default)(this, Renderer);
  }

  (0, _createClass3.default)(Renderer, null, [{
    key: 'configure',
    value: function configure(userConfig, userToolsConfig) {
      if (!hasSetup) {
        Renderer.app();
      }

      config = userConfig;

      // add user defined globals for serverside access
      (0, _lodash.each)(userConfig.globals, function (value, key) {
        global[key] = (0, _stringify2.default)(value);
      });
      global.__REDUCER_INDEX__ = userConfig.redux.reducers;

      if (userToolsConfig) {
        toolsConfig = userToolsConfig;
      }
      var errors = validateConfig();

      if (errors.length > 0) {
        console.log('Configuration errors for universal-redux.');
        (0, _lodash.each)(errors, function (error) {
          console.error(error);
        });
      } else {
        console.log('universal-redux configuration is valid.');
      }

      return errors;
    }
  }, {
    key: 'app',
    value: function app(userSuppliedApp) {
      _app = userSuppliedApp || new _express2.default();
      _app.use((0, _compression2.default)());

      hasSetup = true;

      return _app;
    }
  }, {
    key: 'setup',
    value: function setup(userConfig, userToolsConfig) {
      if (userConfig) {
        var errors = Renderer.configure(userConfig, userToolsConfig);
        if (errors.length > 0) {
          return;
        }
      }

      setupTools();
      setupAssets();
      setupRenderer();
    }
  }, {
    key: 'start',
    value: function start() {
      if (!hasSetup) {
        Renderer.app();
      }

      _app.listen(config.server.port, function (err) {
        if (err) {
          console.error(err);
        }
        console.info('----\n==> ✅  %s is running.', config.app.title);
        console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.server.host, config.server.port);
      });
    }
  }]);
  return Renderer;
})();

exports.default = Renderer;