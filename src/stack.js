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
        eventEmitter = Sister();

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
    //stack.eventEmitter = function () {
    //    return eventEmitter;
    //};

    /**
     * Proxy to the instance of the event emitter.
     * 
     * @param {String} eventName
     * @param {String} listener
     */
    stack.on = function (eventName, listener) {
        eventEmitter.on(eventName, listener);
    };

    /**
     * @return {Card}
     */
    stack.createCard = function (targetElement) {
        var card = new Card(this, targetElement);

        // Proxy Card events to the Stack.
        card.on('throwout', eventEmitter.trigger.bind(null, 'throwout'));
        card.on('throwin', eventEmitter.trigger.bind(null, 'throwin'));
        card.on('dragstart', eventEmitter.trigger.bind(null, 'dragstart'));
        card.on('dragmove', eventEmitter.trigger.bind(null, 'dragmove'));
        card.on('dragend', eventEmitter.trigger.bind(null, 'dragend'));

        return card;
    };

    return stack;
};

module.exports = Stack;