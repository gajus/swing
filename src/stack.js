var Sister = require('sister'),
    rebound = require('rebound'),
    Card = require('./card.js');

/**
 * @param {Object} config
 */
function Stack (config) {
    if (!(this instanceof Stack)) {
        return new Stack(config);
    }

    this._config = config;
    this._springSystem = new rebound.SpringSystem();
    this._eventEmitter = new Sister();
}

/**
 * Get the configuration object.
 * 
 * @return {Object}
 */
Stack.prototype.config = function () {
    return this._config;
};

/**
 * Get a singleton instance of the SpringSystem physics engine.
 * 
 * @return {Sister}
 */
Stack.prototype.springSystem = function () {
    return this._springSystem;
};

/**
 * Get a singleton instance of the Sister event emitter.
 * 
 * @return {Sister}
 */
Stack.prototype.eventEmitter = function () {
    return this._eventEmitter;
};

/**
 * Proxy to the instance of the event emitter.
 * 
 * @param {String} eventName
 * @param {String} listener
 */
Stack.prototype.on = function (eventName, listener) {
    this._eventEmitter.on(eventName, listener);
};

/**
 * @return {Card}
 */
Stack.prototype.createCard = function (targetElement) {
    return new Card(this, targetElement);
};

module.exports = Stack;