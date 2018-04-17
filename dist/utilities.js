'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTouchDevice = exports.elementChildren = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Return direct children elements.
 *
 * @see http://stackoverflow.com/a/27102446/368691
 * @param {HTMLElement} element
 * @returns {Array}
 */
var elementChildren = function elementChildren(element) {
  return _lodash2.default.filter(element.childNodes, {
    nodeType: 1
  });
};

/**
 * @see http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
 * @returns {boolean}
 */
var isTouchDevice = function isTouchDevice() {
  return 'ontouchstart' in window || navigator.msMaxTouchPoints;
};

exports.elementChildren = elementChildren;
exports.isTouchDevice = isTouchDevice;