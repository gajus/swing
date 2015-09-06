'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sister = require('sister');

var _sister2 = _interopRequireDefault(_sister);

var _rebound = require('rebound');

var _rebound2 = _interopRequireDefault(_rebound);

var _card = require('./card');

var _card2 = _interopRequireDefault(_card);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var Stack = undefined;

/**
 * @param {Object} config Stack configuration.
 * @return {Object} An instance of Stack object.
 */
Stack = function (config) {
    var construct = undefined,
        eventEmitter = undefined,
        index = undefined,
        springSystem = undefined,
        stack = undefined;

    construct = function () {
        stack = {};
        springSystem = new _rebound2['default'].SpringSystem();
        eventEmitter = (0, _sister2['default'])();
        index = [];
    };

    construct();

    /**
     * Get the configuration object.
     *
     * @return {Object}
     */
    stack.getConfig = function () {
        return config;
    };

    /**
     * Get a singleton instance of the SpringSystem physics engine.
     *
     * @return {Sister}
     */
    stack.getSpringSystem = function () {
        return springSystem;
    };

    /**
     * Proxy to the instance of the event emitter.
     *
     * @param {String} eventName
     * @param {String} listener
     * @return {undefined}
     */
    stack.on = function (eventName, listener) {
        eventEmitter.on(eventName, listener);
    };

    /**
     * Creates an instance of Card and associates it with an element.
     *
     * @param {HTMLElement} element
     * @return {Card}
     */
    stack.createCard = function (element) {
        var card = undefined,
            events = undefined;

        card = (0, _card2['default'])(stack, element);

        events = ['throwout', 'throwoutend', 'throwoutleft', 'throwoutright', 'throwin', 'throwinend', 'dragstart', 'dragmove', 'dragend'];

        // Proxy Card events to the Stack.
        events.forEach(function (eventName) {
            card.on(eventName, function (data) {
                eventEmitter.trigger(eventName, data);
            });
        });

        index.push({
            element: element,
            card: card
        });

        return card;
    };

    /**
     * Returns an instance of Card associated with an element.
     *
     * @param {HTMLElement} element
     * @return {Card|null}
     */
    stack.getCard = function (element) {
        var card = undefined;

        card = _util2['default'].find(index, {
            element: element
        });

        if (card) {
            return card.card;
        }

        return null;
    };

    /**
     * Remove an instance of Card from the stack index.
     *
     * @param {Card} card
     * @return {Card}
     */
    stack.destroyCard = function (card) {
        return _util2['default'].remove(index, card);
    };

    return stack;
};

exports['default'] = Stack;
module.exports = exports['default'];
//# sourceMappingURL=stack.js.map