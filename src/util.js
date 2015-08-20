import assign from 'lodash/object/assign';


let util;

util = {};

util.assign = assign;

/**
 * Return direct children elements.
 *
 * @see http://stackoverflow.com/a/27102446/368691
 * @param {HTMLElement}
 * @return {Array}
 */
util.elementChildren = (element) => {
    let childNodes,
        children,
        i;

    childNodes = element.childNodes;
    children = [];
    i = childNodes.length;

    while (i--) {
        if (childNodes[i].nodeType === 1) {
            children.unshift(childNodes[i]);
        }
    }

    return children;
};

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
util.randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * @see http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
 * @return {Boolean}
 */
util.isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.msMaxTouchPoints;
};



export default util;
