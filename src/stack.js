var Stack,
    Sister = require('sister'),
    rebound = require('rebound'),
    Card = require('./card.js');

/**
 * @param {Object} config
 */
Stack = function Stack (config) {
    var stack,
        springSystem,
        eventEmitter,
        index;

    if (!(this instanceof Stack)) {
        return new Stack(config);
    }

    stack = this;
    springSystem = new rebound.SpringSystem();
    eventEmitter = Sister();
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
     * Creates an instance of Card and associates it with the element.
     * 
     * @return {Card}
     */
    stack.createCard = function (element) {
        var card = Card(this, element),
            events = [
                'throwout',
                'throwoutend',
                'throwoutleft',
                'throwoutright',
                'throwin',
                'throwinend',
                'dragstart',
                'dragmove',
                'dragend'
            ];

        // Proxy Card events to the Stack.
        events.forEach(function (name) {
            card.on(name, function (data) {
                eventEmitter.trigger(name, data);
            });
        });

        index.push({
            element: element,
            card: card
        });

        return card;
    };

    /**
     * Returns card associated with an element.
     *
     * @param {HTMLElement} element
     * @return {Card|null}
     */
    stack.getCard = function (element) {
        var j = index.length;
        while (j--) {
            if (index[j].element === element) {
                return index[j].card;
            }
        }
        return null;
    };

    /**
     * @param {Card} card
     */
    stack._destroyCard = function (card) {
        var j = index.length;
        while (j--) {
            if (index[j].card === card) {
                index.splice(j, 1);

                break;
            }
        }
    };

    return stack;
};

module.exports = Stack;
