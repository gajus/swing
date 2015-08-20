let util;

util = {};

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
util.randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default util;
