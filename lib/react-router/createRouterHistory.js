'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createRouterHistory;

var _useQueries = require('../../node_modules/history/lib/useQueries');

var _useQueries2 = _interopRequireDefault(_useQueries);

var _useBasename = require('../../node_modules/history/lib/useBasename');

var _useBasename2 = _interopRequireDefault(_useBasename);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createRouterHistory(createHistory) {
  var history = (0, _useBasename2.default)((0, _useQueries2.default)(createHistory))();
  history.__v2_compatible__ = true;
  return history;
}