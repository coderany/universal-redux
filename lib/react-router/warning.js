'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = routerWarning;

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function routerWarning(falseToWarn, message) {
  message = '[react-router] ' + message;
  (0, _warning2.default)(falseToWarn, message);
}