'use strict';

let dom;

dom = {};

/**
 * Return direct children elements.
 *
 * @see http://stackoverflow.com/a/27102446/368691
 * @param {HTMLElement}
 * @return {Array}
 */
dom.elementChildren = (element) => {
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

export default dom;
