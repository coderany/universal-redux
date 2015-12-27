'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = deprecateObjectProperties;

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _warning = require('./warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var useMembrane = false; /*eslint no-empty: 0*/

try {
  Object.defineProperty({}, 'x', {
    get: function get() {
      return true;
    }
  }).x;
  useMembrane = true;
} catch (e) {}

// wraps an object in a membrane to warn about deprecated property access
function deprecateObjectProperties(object, message) {
  if (!useMembrane) return object;

  var membrane = {};

  var _loop = function _loop(prop) {
    if (typeof object[prop] === 'function') {
      membrane[prop] = function () {
        (0, _warning2.default)(false, message);
        return object[prop].apply(object, arguments);
      };
    } else {
      (0, _defineProperty2.default)(membrane, prop, {
        configurable: false,
        enumerable: true,
        get: function get() {
          (0, _warning2.default)(false, message);
          return object[prop];
        }
      });
    }
  };

  for (var prop in object) {
    _loop(prop);
  }

  return membrane;
}