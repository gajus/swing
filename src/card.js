var Card,
    Sister = require('sister'),
    Hammer = require('hammerjs'),
    rebound = require('rebound'),
    vendorPrefix = require('vendor-prefix'),
    util = {};

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
util.randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * @param {Stack} stack
 * @param {HTMLElement} targetElement
 */
Card = function (stack, targetElement) {
    var card = {},
        config = Card.config(stack.config()),
        targetElementWidth = targetElement.offsetWidth,
        targetElementHeight = targetElement.offsetHeight,
        eventEmitter = Sister(),
        springSystem = stack.springSystem(),
        springSnapBack = springSystem.createSpring(250, 10),
        springThrowOut = springSystem.createSpring(500, 20),
        lastThrow = {},
        lastTranslate = {x: 0, y: 0},
        throwOutDistance,
        onSpringUpdate,
        throwWhere;

    throwOutDistance = config.throwOutDistance(config.minThrowOutDistance, config.maxThrowOutDistance);

    mc = new Hammer.Manager(targetElement, {
        recognizers: [
            [Hammer.Pan, {threshold: 2}]
        ]
    });

    Card.appendToParent(targetElement);

    targetElement.addEventListener('mousedown', function () {
        Card.appendToParent(targetElement);

        eventEmitter.trigger('dragstart', {
            target: targetElement
        });
    });

    mc.on('panmove', function (e) {
        var x = lastTranslate.x + e.deltaX,
            y = lastTranslate.y + e.deltaY,
            r = config.rotation(x, y, targetElementWidth, targetElementHeight, config.maxRotation);

        Card.transform(targetElement, x, y, r);

        eventEmitter.trigger('dragmove', {
            target: targetElement,
            throwOutConfidence: Card.throwOutConfidence(x, targetElementWidth),
            throwDirection: x < 0 ? Card.DIRECTION_LEFT : Card.DIRECTION_RIGHT
        });
    });

    mc.on('panend', function(e) {
        var x = lastTranslate.x + e.deltaX,
            y = lastTranslate.y + e.deltaY;

        if (config.isThrowOut(x, targetElementWidth)) {
            card.throwOut(x, y);
        } else {
            card.throwIn(x, y);
        }

        eventEmitter.trigger('dragend', {
            target: targetElement
        });
    });

    springSnapBack.addListener({
        onSpringUpdate: function (spring) {
            var value = spring.getCurrentValue(),
                x = rebound.MathUtil.mapValueInRange(value, 0, 1, lastThrow.fromX, 0),
                y = rebound.MathUtil.mapValueInRange(value, 0, 1, lastThrow.fromY, 0);

            onSpringUpdate(x, y);
        }
    });

    springThrowOut.addListener({
        onSpringUpdate: function (spring) {
            var value = spring.getCurrentValue(),
                x = rebound.MathUtil.mapValueInRange(value, 0, 1, lastThrow.fromX, throwOutDistance * lastThrow.direction),
                y = lastThrow.fromY;

            onSpringUpdate(x, y);            
        }
    });

    /**
     * Invoked every time the physics solver updates the Spring's value.
     *
     * @param {Number} x
     * @param {Number} y
     */
    onSpringUpdate = function (x, y) {
        var r = config.rotation(x, y, targetElementWidth, targetElementHeight, config.maxRotation);

        lastTranslate.x = x;
        lastTranslate.y = y;

        Card.transform(targetElement, x, y, r);
    };

    /**
     * Alias
     */
    card.on = eventEmitter.on;

    /**
     * Throws a card into the stack from an arbitrary position.
     *
     * @param {Number} fromX
     * @param {Number} fromY
     */
    card.throwIn = function (fromX, fromY) {
        throwWhere(Card.THROW_IN, fromX, fromY);
    };

    /**
     * Throws a card out of the stack in the direction away from the original offset.
     *
     * @param {Number} fromX
     * @param {Number} fromY
     */
    card.throwOut = function (fromX, fromY) {
        throwWhere(Card.THROW_OUT, fromX, fromY);
    };

    /**
     * Unbinds all Hammer.Manager events.
     * Removes the listeners from the physics simulation.
     */
    card.destroy = function () {
        mc.destroy();
        springSnapBack.destroy();
        springThrowOut.destroy();
    };

    /**
     * @param {Card.THROW_IN|Card.THROW_OUT} where
     * @param {Number} fromX
     * @param {Number} fromY
     */
    throwWhere = function (where, fromX, fromY) {
        lastThrow.fromX = fromX;
        lastThrow.fromY = fromY;
        lastThrow.direction = lastThrow.fromX < 0 ? Card.DIRECTION_LEFT : Card.DIRECTION_RIGHT;

        if (where == Card.THROW_IN) {
            springSnapBack.setCurrentValue(0).setAtRest().setEndValue(1);
        } else if (where == Card.THROW_OUT) {
            springThrowOut.setCurrentValue(0).setAtRest().setVelocity(100).setEndValue(1);
        } else {
            throw new Error('Invalid throw event.');
        }

        eventEmitter.trigger('throw' + where, {
            target: targetElement,
            throwDirection: lastThrow.direction
        });
    };

    return card;
};

/**
 * Interprets stack.config() object. Sets default configuration.
 * 
 * @param {Object} config
 * @return {Object}
 */
Card.config = function (config) {
    config = config || {};

    config.isThrowOut = config.isThrowOut ? config.isThrowOut : Card.isThrowOut;
    
    config.throwOutConfidence = config.throwOutConfidence ? config.throwOutConfidence : Card.throwOutConfidence;

    config.throwOutDistance = config.throwOutDistance ? config.throwOutDistance : Card.throwOutDistance;
    config.minThrowOutDistance = config.minThrowOutDistance ? config.minThrowOutDistance : 400;
    config.maxThrowOutDistance = config.maxThrowOutDistance ? config.maxThrowOutDistance : 500;

    config.rotation = config.rotation ? config.rotation : Card.rotation;
    config.maxRotation = config.maxRotation ? config.maxRotation : 20;

    config.transform = config.transform ? config.transform : Card.transform;

    return config;
};

/**
 * Invoked in the event of `dragmove` and every time the physics solver is triggered.
 * Uses CSS transform to translate element position and rotation.
 * 
 * @param {Number} x Horizontal offset from the startDrag.
 * @param {Number} y Vertical offset from the startDrag.
 * @return {null}
 */
Card.transform = function (element, x, y, r) {
    element.style[vendorPrefix('transform')] = 'translate(' + x + 'px, ' + y + 'px) rotate(' + r + 'deg)';
};

/**
 * If element is not the last among the siblings, append the
 * element to the parentNode. The reason for using this as opposed to zIndex
 * is to allow CSS selector :nth-child, etc.
 *
 * Invoked in the event of mousedown.
 * Invoked when card is added to the stack.
 * 
 * @param {HTMLElement} element The target element.
 */
Card.appendToParent = function (element) {
    var parent = element.parentNode,
        siblings = parent.querySelectorAll('li'),
        targetIndex = [].slice.apply(siblings).indexOf(element);

    if (targetIndex + 1 != siblings.length) {
        parent.removeChild(element);
        parent.appendChild(element);
    }
};

/**
 * Invoked in the event of dragmove.
 * Returns a value between 0 and 1 indicating the completeness of the throw out condition.
 * Ration of the absolute distance from the original card position and element width.
 * 
 * @param {Number} offset Distance from the dragStart.
 * @param {Number} elementWidth Width of the element being dragged.
 * @return {Number}
 */
Card.throwOutConfidence = function (offset, elementWidth) {
    return Math.min(Math.abs(offset) / elementWidth, 1);
};

/**
 * Invoked in the event of dragend.
 * Determines if element is being thrown out of the stack.
 * Element is considered to be thrown out when throwOutConfidence is equal to 1.
 * 
 * @param {Number} offset Distance from the dragStart.
 * @param {Number} elementWidth Width of the element being dragged.
 * @return {Boolean}
 */
Card.isThrowOut = function (offset, elementWidth) {
    return Card.throwOutConfidence(offset, elementWidth) == 1;
};

/**
 * Invoked when card is added to the stack.
 * The card is thrown to this offset from the stack.
 * The value is a random number between minThrowOutDistance and maxThrowOutDistance.
 * 
 * @return {Number}
 */
Card.throwOutDistance = function (minThrowOutDistance, maxThrowOutDistance) {
    return util.randomInt(minThrowOutDistance, maxThrowOutDistance);
};

/**
 * Rotation is equal to the proportion of horizontal and vertical offset
 * times the maximumRotation constant.
 * 
 * @param {Number} x Horizontal offset from the startDrag.
 * @param {Number} y Vertical offset from the startDrag.
 * @param {Number} elementWidth
 * @param {Number} elementHeight
 * @param {Number} maxRotation
 * @return {Number} Rotation angle expressed in degrees.
 */
Card.rotation = function (x, y, elementWidth, elementHeight, maxRotation) {
    var horizontalOffset = Math.min(Math.max(x/elementWidth, -1), 1),
        verticalOffset = (y > 0 ? 1 : -1) * Math.min(Math.abs(y)/100, 1),
        rotation = horizontalOffset * verticalOffset * maxRotation;

    return rotation;
};

Card.DIRECTION_LEFT = -1;
Card.DIRECTION_RIGHT = 1;

Card.THROW_IN = 'in';
Card.THROW_OUT = 'out';

module.exports = Card;