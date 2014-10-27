var Sister = require('sister'),
    rebound = require('rebound'),
    Card = require('./card.js');

function Stack (config) {
    if (!(this instanceof Stack)) {
        return new Stack(config);
    }

    this.config = config || {};
    this.config.throwOut = this.config.throwOut ? this.config.throwOut : this.throwOut;
    this.config.throwOutDistance = this.config.throwOutDistance ? this.config.throwOutDistance : this.throwOutDistance;

    this.springSystem = new rebound.SpringSystem();
}

/**
 * Method used to determine whether element should be thrown out of the stack.
 * Default behavior is to throw out element if it has been moved at least 10px
 * outside of the box of the dragStart location.
 * 
 * @param {Number} offset Distance from the dragStart.
 * @param {Number} elementWidth Width of the element being dragged.
 * @return {Boolean}
 */
Stack.prototype.throwOut = function (offset, elementWidth) {
    return Math.max(Math.abs(offset) - elementWidth, 0) > 10;
};

/**
 * @return {Number}
 */
Stack.prototype.throwOutDistance = function () {
    return getRandomInt(400, 500);
};

/**
 * @return {Card}
 */
Stack.prototype.createCard = function (targetElement) {
    return new Card(this, targetElement);
};

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = Stack;