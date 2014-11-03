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
        eventEmitter = Sister(),
        index = [];

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
        var card = new Card(this, targetElement),
            events = ['throwout', 'throwoutleft', 'throwoutright', 'throwin', 'dragstart', 'dragmove', 'dragend'],
            listeners = [];

        // Proxy Card events to the Stack.
        events.forEach(function (name) {
            card.on(name, function (data) {
                eventEmitter.trigger(name, data);
            });
        });

        index.push({
            card: card,
            listeners: listeners
        });

        return card;
    };

    /**
     * 
     */
    stack.destroyCard = function (card) {
        
    };

    return stack;
};

module.exports = Stack;