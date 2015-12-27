'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _PropTypes = require('./PropTypes');

/**
 * A mixin that adds the "history" instance variable to components.
 */
var History = {

  contextTypes: {
    history: _PropTypes.history
  },

  componentWillMount: function componentWillMount() {
    this.history = this.context.history;
  }

};

exports.default = History;