'use strict';

var _chai = require('chai');

var _getStatusFromRoutes = require('../getStatusFromRoutes');

var _getStatusFromRoutes2 = _interopRequireDefault(_getStatusFromRoutes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('getStatusFromRoutes', function () {

  it('should return null when no routes have status code', function () {
    var status = (0, _getStatusFromRoutes2.default)([{}, {}]);

    (0, _chai.expect)(status).to.equal(null);
  });

  it('should return the only status code', function () {
    var status = (0, _getStatusFromRoutes2.default)([{ status: 404 }]);

    (0, _chai.expect)(status).to.equal(404);
  });

  it('should return the only status code when other routes have none', function () {
    var status = (0, _getStatusFromRoutes2.default)([{ status: 404 }, {}, {}]);

    (0, _chai.expect)(status).to.equal(404);
  });

  it('should return the last status code when later routes have none', function () {
    var status = (0, _getStatusFromRoutes2.default)([{ status: 200 }, { status: 404 }, {}]);

    (0, _chai.expect)(status).to.equal(404);
  });

  it('should return the last status code when previous routes have one', function () {
    var status = (0, _getStatusFromRoutes2.default)([{ status: 200 }, {}, { status: 404 }]);

    (0, _chai.expect)(status).to.equal(404);
  });

  it('should return the last status code', function () {
    var status = (0, _getStatusFromRoutes2.default)([{}, {}, { status: 404 }]);

    (0, _chai.expect)(status).to.equal(404);
  });
});