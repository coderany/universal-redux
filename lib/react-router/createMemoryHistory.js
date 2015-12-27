'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createMemoryHistory;

var _useQueries = require('../../node_modules/history/lib/useQueries');

var _useQueries2 = _interopRequireDefault(_useQueries);

var _createMemoryHistory = require('../../node_modules/history/lib/createMemoryHistory');

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMemoryHistory(options) {
  // signatures and type checking differ between `useRoutes` and
  // `createMemoryHistory`, have to create `memoryHistory` first because
  // `useQueries` doesn't understand the signature
  var memoryHistory = (0, _createMemoryHistory2.default)(options);
  var createHistory = function createHistory() {
    return memoryHistory;
  };
  var history = (0, _useQueries2.default)(createHistory)(options);
  history.__v2_compatible__ = true;
  return history;
}