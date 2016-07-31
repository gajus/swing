'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isTouchDevice = exports.elementChildren = undefined;

var _filter2 = require('lodash/filter');

var _filter3 = _interopRequireDefault(_filter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Return direct children elements.
 *
 * @see http://stackoverflow.com/a/27102446/368691
 * @param {HTMLElement} element
 * @return {Array}
 */
var elementChildren = function elementChildren(element) {
    return (0, _filter3.default)(element.childNodes, {
        nodeType: 1
    });
};

/**
 * @see http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
 * @return {Boolean}
 */
var isTouchDevice = function isTouchDevice() {
    return 'ontouchstart' in window || navigator.msMaxTouchPoints;
};

exports.elementChildren = elementChildren;
exports.isTouchDevice = isTouchDevice;
//# sourceMappingURL=util.js.map
