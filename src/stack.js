import _ from 'lodash';
import Sister from 'sister';
import rebound from 'rebound';
import Card from './card';

/**
 * @param {Object} config Stack configuration.
 * @return {Object} An instance of Stack object.
 */
const Stack = (config) => {
    let construct,
        eventEmitter,
        index,
        springSystem,
        stack;

    construct = () => {
        stack = {};
        springSystem = new rebound.SpringSystem();
        eventEmitter = Sister();
        index = [];
    };

    construct();

    /**
     * Get the configuration object.
     *
     * @return {Object}
     */
    stack.getConfig = () => {
        return config;
    };

    /**
     * Get a singleton instance of the SpringSystem physics engine.
     *
     * @return {Sister}
     */
    stack.getSpringSystem = () => {
        return springSystem;
    };

    /**
     * Proxy to the instance of the event emitter.
     *
     * @param {String} eventName
     * @param {String} listener
     * @return {undefined}
     */
    stack.on = (eventName, listener) => {
        eventEmitter.on(eventName, listener);
    };

    /**
     * Creates an instance of Card and associates it with an element.
     *
     * @param {HTMLElement} element
     * @return {Card}
     */
    stack.createCard = (element) => {
        const card = Card(stack, element);
        const events = [
            'throwout',
            'throwoutend',
            'throwoutleft',
            'throwoutright',
            'throwoutup',
            'throwoutdown',
            'throwin',
            'throwinend',
            'dragstart',
            'dragmove',
            'dragend'
        ];

        // Proxy Card events to the Stack.
        events.forEach((eventName) => {
            card.on(eventName, (data) => {
                eventEmitter.trigger(eventName, data);
            });
        });

        index.push({
            element,
            card
        });

        return card;
    };

    /**
     * Returns an instance of Card associated with an element.
     *
     * @param {HTMLElement} element
     * @return {Card|null}
     */
    stack.getCard = (element) => {
        const group = _.find(index, {
            element
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
    stack.destroyCard = (card) => {
        return _.remove(index, {
            card
        });
    };

    return stack;
};

export default Stack;
