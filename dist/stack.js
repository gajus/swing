'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _remove2 = require('lodash/remove');

var _remove3 = _interopRequireDefault(_remove2);

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

var _sister = require('sister');

var _sister2 = _interopRequireDefault(_sister);

var _rebound = require('rebound');

var _rebound2 = _interopRequireDefault(_rebound);

var _card = require('./card');

var _card2 = _interopRequireDefault(_card);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {Object} config Stack configuration.
 * @return {Object} An instance of Stack object.
 */
var Stack = function Stack(config) {
    var construct = void 0,
        eventEmitter = void 0,
        index = void 0,
        springSystem = void 0,
        stack = void 0;

    construct = function construct() {
        stack = {};
        springSystem = new _rebound2.default.SpringSystem();
        eventEmitter = (0, _sister2.default)();
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
        var card = (0, _card2.default)(stack, element);
        var events = ['throwout', 'throwoutend', 'throwoutleft', 'throwoutright', 'throwoutup', 'throwoutdown', 'throwin', 'throwinend', 'dragstart', 'dragmove', 'dragend'];

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
        var group = (0, _find3.default)(index, {
            element: element
        });

        if (group) {
            return group.card;
        }

        return null;
    };

    /**
     * Remove an instance of Card from the stack index.
     *
     * @param {Card} card
     * @return {null}
     */
    stack.destroyCard = function (card) {
        return (0, _remove3.default)(index, {
            card: card
        });
    };

    return stack;
};

exports.default = Stack;
module.exports = exports['default'];
//# sourceMappingURL=stack.js.map
