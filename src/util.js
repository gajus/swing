import remove from 'lodash/array/remove';
import assign from 'lodash/object/assign';
import random from 'lodash/number/random';
import find from 'lodash/collection/find';
import where from 'lodash/collection/where';

let util;

util = {};

util.remove = remove;
util.assign = assign;
util.random = random;
util.find = find;
util.where = where;

/**
 * Return direct children elements.
 *
 * @see http://stackoverflow.com/a/27102446/368691
 * @param {HTMLElement}
 * @return {Array}
 */
util.elementChildren = (element) => {
    return util.where(element.childNodes, {
        nodeType: 1
    });
};

/**
 * @see http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
 * @return {Boolean}
 */
util.isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.msMaxTouchPoints;
};

export default util;
