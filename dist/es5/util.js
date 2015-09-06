'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashArrayRemove = require('lodash/array/remove');

var _lodashArrayRemove2 = _interopRequireDefault(_lodashArrayRemove);

var _lodashObjectAssign = require('lodash/object/assign');

var _lodashObjectAssign2 = _interopRequireDefault(_lodashObjectAssign);

var _lodashNumberRandom = require('lodash/number/random');

var _lodashNumberRandom2 = _interopRequireDefault(_lodashNumberRandom);

var _lodashCollectionFind = require('lodash/collection/find');

var _lodashCollectionFind2 = _interopRequireDefault(_lodashCollectionFind);

var _lodashCollectionWhere = require('lodash/collection/where');

var _lodashCollectionWhere2 = _interopRequireDefault(_lodashCollectionWhere);

var util = undefined;

util = {};

util.remove = _lodashArrayRemove2['default'];
util.assign = _lodashObjectAssign2['default'];
util.random = _lodashNumberRandom2['default'];
util.find = _lodashCollectionFind2['default'];
util.where = _lodashCollectionWhere2['default'];

/**
 * Return direct children elements.
 *
 * @see http://stackoverflow.com/a/27102446/368691
 * @param {HTMLElement} element
 * @return {Array}
 */
util.elementChildren = function (element) {
    return util.where(element.childNodes, {
        nodeType: 1
    });
};

/**
 * @see http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
 * @return {Boolean}
 */
util.isTouchDevice = function () {
    return 'ontouchstart' in window || navigator.msMaxTouchPoints;
};

exports['default'] = util;
module.exports = exports['default'];
//# sourceMappingURL=util.js.map