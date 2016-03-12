import _ from 'lodash';

/**
 * Return direct children elements.
 *
 * @see http://stackoverflow.com/a/27102446/368691
 * @param {HTMLElement} element
 * @return {Array}
 */
const elementChildren = (element) => {
    return _.where(element.childNodes, {
        nodeType: 1
    });
};

/**
 * @see http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
 * @return {Boolean}
 */
const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.msMaxTouchPoints;
};

export {
    elementChildren,
    isTouchDevice
};
