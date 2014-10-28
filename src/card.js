var Hammer = require('hammerjs'),
    rebound = require('rebound'),
    vendorPrefix = require('vendor-prefix'),
    Card,
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
        eventEmitter = stack.eventEmitter(),
        springSystem = stack.springSystem(),
        springSnapBack = springSystem.createSpring(250, 10),
        springThrowOut = springSystem.createSpring(500, 20),
        throwFromX,
        throwFromY,
        throwDirection,
        throwOutDistance,
        lastTranslateX = 0,
        lastTranslateY = 0;

    throwOutDistance = config.throwOutDistance(config.minThrowOutDistance, config.maxThrowOutDistance);

    mc = new Hammer.Manager(targetElement, {
        recognizers: [
            [Hammer.Pan, {threshold: 2}]
        ]
    });

    targetElement.addEventListener('mousedown', function (e) {
        Card.appendToParent(e.target);

        eventEmitter.trigger('dragstart', {
            target: targetElement
        });
    });

    mc.on('panmove', function (e) {
        var x = lastTranslateX + e.deltaX,
            y = lastTranslateY + e.deltaY,
            r = config.rotation(x, y, targetElementWidth, targetElementHeight, config.maxRotation);

        Card.transform(targetElement, x, y, r);

        eventEmitter.trigger('dragmove', {
            target: targetElement
        });
    });

    mc.on('panend', function(e) {
        var dragEndX,
            dragEndY;

        dragEndX = lastTranslateX + e.deltaX;
        dragEndY = lastTranslateY + e.deltaY;

        if (config.isThrowOut(dragEndX, targetElementWidth)) {
            card.throwOut(dragEndX, dragEndY);
        } else {
            card.throwIn(dragEndX, dragEndY);
        }

        eventEmitter.trigger('dragend', {
            target: targetElement
        });
    });

    springSnapBack.addListener({
        onSpringUpdate: function (spring) {
            var value = spring.getCurrentValue(),
                x = rebound.MathUtil.mapValueInRange(value, 0, 1, throwFromX, 0),
                y = rebound.MathUtil.mapValueInRange(value, 0, 1, throwFromY, 0),
                r = config.rotation(x, y, targetElementWidth, targetElementHeight, config.maxRotation);

            lastTranslateX = x;
            lastTranslateY = y;

            Card.transform(targetElement, x, y, r);
        }
    });

    springThrowOut.addListener({
        onSpringUpdate: function (spring) {
            var value = spring.getCurrentValue(),
                x = rebound.MathUtil.mapValueInRange(value, 0, 1, throwFromX, throwOutDistance * throwDirection),
                y = throwFromY,
                r = config.rotation(x, y, targetElementWidth, targetElementHeight, config.maxRotation);

            lastTranslateX = x;
            lastTranslateY = y;

            Card.transform(targetElement, x, y, r);
        }
    });

    /**
     * Throws a card into the stack from an arbitrary position.
     *
     * @param {Number} fromX
     * @param {Number} fromY
     */
    card.throwIn = function (fromX, fromY) {
        throwFromX = fromX;
        throwFromY = fromY;
        throwDirection = throwFromX < 0 ? Card.DIRECTION_LEFT : Card.DIRECTION_RIGHT;

        springSnapBack.setCurrentValue(0).setAtRest().setEndValue(1);

        eventEmitter.trigger('throwin', {
            target: targetElement,
            throwDirection: throwDirection
        });
    };

    /**
     * Throws a card out of the stack in the direction away from the original offset.
     *
     * @param {Number} fromX
     * @param {Number} fromY
     */
    card.throwOut = function (fromX, fromY) {
        throwFromX = fromX;
        throwFromY = fromY;
        throwDirection = throwFromX < 0 ? Card.DIRECTION_LEFT : Card.DIRECTION_RIGHT;

        springThrowOut.setCurrentValue(0).setAtRest().setVelocity(100).setEndValue(1);

        eventEmitter.trigger('throwout', {
            target: targetElement,
            throwDirection: throwDirection
        });
    };

    return card;
};

/**
 * Interprets stack.config() object.
 * 
 * @param {Object} config
 */
Card.config = function (config) {
    config = config || {};

    config.isThrowOut = config.isThrowOut ? config.isThrowOut : Card.isThrowOut;

    config.throwOutDistance = config.throwOutDistance ? config.throwOutDistance : Card.throwOutDistance;
    config.minThrowOutDistance = config.minThrowOutDistance ? config.minThrowOutDistance : 400;
    config.maxThrowOutDistance = config.maxThrowOutDistance ? config.maxThrowOutDistance : 500;

    config.rotation = config.rotation ? config.rotation : Card.rotation;
    config.maxRotation = config.maxRotation ? config.maxRotation : 20;

    return config;
};

/**
 * Use CSS transform to translate element position.
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
 * element to the parentNode.
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
 * Invoked in the event of dragend.
 * Determines if element is being thrown out of the stack.
 * Element is considered to be throw out if it has been moved away from
 * the center of the original position more than its width.
 * 
 * @param {Number} offset Distance from the dragStart.
 * @param {Number} elementWidth Width of the element being dragged.
 * @return {Boolean}
 */
Card.isThrowOut = function (offset, elementWidth) {
    return Math.max(Math.abs(offset) - elementWidth, 0) > 0;
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

module.exports = Card;