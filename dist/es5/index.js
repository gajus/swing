'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _stack = require('./stack');

var _stack2 = _interopRequireDefault(_stack);

var _card = require('./card');

var _card2 = _interopRequireDefault(_card);

global.gajus = global.gajus || {};

global.gajus.Swing = {
    Stack: _stack2['default'],
    Card: _card2['default']
};

exports.Stack = _stack2['default'];
exports.Card = _card2['default'];
//# sourceMappingURL=index.js.map