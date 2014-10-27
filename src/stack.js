var Sister = require('sister'),
    rebound = require('rebound'),
    Card = require('./card.js');

function Stack (config) {
    if (!(this instanceof Stack)) {
        return new Stack(config);
    }

    this.config = config || {};
    this.config.throwOut = this.config.throwOut ? this.config.throwOut : this.throwOut;

    this.config.minThrowOutDistance = this.config.minThrowOutDistance ? this.config.minThrowOutDistance : 400;
    this.config.maxThrowOutDistance = this.config.maxThrowOutDistance ? this.config.maxThrowOutDistance : 500;

    this.config.isThrowOut = this.config.isThrowOut ? this.config.isThrowOut : this.isThrowOut;
    this.config.throwOutDistance = this.config.throwOutDistance ? this.config.throwOutDistance : this.throwOutDistance;

    this.springSystem = new rebound.SpringSystem();

    this.eventEmitter = new Sister();
}

/**
 * Get instance of the event emitter.
 * 
 * @return {Sister}
 */
Stack.prototype.getEventEmitter = function () {
    return this.eventEmitter;
};

/**
 * Proxy to the instance of the event emitter.
 * 
 * @param {String} eventName
 * @param {String} listener
 */
Stack.prototype.on = function (eventName, listener) {
    this.getEventEmitter().on(eventName, listener);
};

/**
 * Determine if element is being thrown out of the stack.
 * Element is considered to be throw out if it has been moved at least 10px
 * outside of the stack box.
 * 
 * @param {Number} offset Distance from the dragStart.
 * @param {Number} elementWidth Width of the element being dragged.
 * @return {Boolean}
 */
Stack.prototype.isThrowOut = function (offset, elementWidth) {
    return Math.max(Math.abs(offset) - elementWidth, 0) > 10;
};

/**
 * Invoked when card is added to the stack.
 * The card is thrown to this offset from the stack.
 * The value is a random number between minThrowOutDistance and maxThrowOutDistance.
 * 
 * @return {Number}
 */
Stack.prototype.throwOutDistance = function () {
    return getRandomInt(this.minThrowOutDistance, this.maxThrowOutDistance);
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