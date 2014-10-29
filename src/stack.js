var Stack,
    Sister = require('sister'),
    rebound = require('rebound'),
    Card = require('./card.js');

/**
 * @param {Object} config
 */
Stack = function (config) {
    var stack = {},
        springSystem = new rebound.SpringSystem(),
        eventEmitter = new Sister();

    /**
     * Get the configuration object.
     * 
     * @return {Object}
     */
    stack.config = function () {
        return config;
    };

    /**
     * Get a singleton instance of the SpringSystem physics engine.
     * 
     * @return {Sister}
     */
    stack.springSystem = function () {
        return springSystem;
    };

    /**
     * Get a singleton instance of the Sister event emitter.
     * 
     * @return {Sister}
     */
    stack.eventEmitter = function () {
        return eventEmitter;
    };

    /**
     * Proxy to the instance of the event emitter.
     * 
     * @param {String} eventName
     * @param {String} listener
     */
    stack.on = function (eventName, listener) {
        stack.eventEmitter().on(eventName, listener);
    };

    /**
     * @return {Card}
     */
    stack.createCard = function (targetElement) {
        return new Card(this, targetElement);
    };

    return stack;
};

module.exports = Stack;