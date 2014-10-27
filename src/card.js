var Hammer = require('hammerjs'),
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
 * @param {Stack} Stack
 * @param {HTMLElement} targetElement
 */
function Card (Stack, targetElement) {
    var card = {},
        config;

    /**
     * Binds mouse cursor events to the targetElement.
     */
    Card.bind = function () {
        var eventEmitter = Stack.eventEmitter(),
            springSystem = Stack.springSystem(),
            springSnapBack,
            springThrowOut,
            dragEndX,
            dragEndY,
            throwDirection,
            throwOutDistance,
            mousedownTranslate;

        throwOutDistance = config.throwOutDistance();

        mc = new Hammer.Manager(targetElement, {
            recognizers: [
                [Hammer.Pan, {threshold: 2}]
            ]
        });

        springSnapBack = springSystem.createSpring(250, 10);
        springThrowOut = springSystem.createSpring(500, 20);

        targetElement.addEventListener('mousedown', function (e) {
            Card.appendToParent(e.target);

            mousedownTranslate = Card.getTranslate(targetElement);

            eventEmitter.trigger('dragstart', {
                target: targetElement
            });
        });

        mc.on('panmove', function (e) {
            Card.translate(targetElement, mousedownTranslate[0] + e.deltaX, mousedownTranslate[1] + e.deltaY);

            eventEmitter.trigger('dragmove', {
                target: targetElement
            });
        });

        mc.on('panend', function(e) {
            dragEndX = mousedownTranslate[0] + e.deltaX;
            dragEndY = mousedownTranslate[1] + e.deltaY;
            
            throwDirection = dragEndX < 0 ? Card.DIRECTION_LEFT : Card.DIRECTION_RIGHT;

            if (config.isThrowOut(dragEndX, card.targetElementWidth)) {
                springThrowOut.setCurrentValue(0).setAtRest().setVelocity(100).setEndValue(1);

                eventEmitter.trigger('throwout', {
                    target: targetElement,
                    throwDirection: throwDirection
                });
            } else {
                springSnapBack.setCurrentValue(0).setAtRest().setEndValue(1);

                eventEmitter.trigger('throwin', {
                    target: targetElement
                });
            }

            eventEmitter.trigger('dragend', {
                target: targetElement
            });
        });

        springSnapBack.addListener({
            onSpringUpdate: function (spring) {
                Card.onSpringSnapBackUpdate(targetElement, dragEndX, dragEndY, spring.getCurrentValue());
            }
        });

        springThrowOut.addListener({
            onSpringUpdate: function (spring) {
                Card.onSpringThrowOutUpdate(targetElement, dragEndX, dragEndY, spring.getCurrentValue(), throwOutDistance * throwDirection);
            }
        });
    };

    /**
     * Interprets Stack.config() object.
     * 
     * @param {Object} config
     */
    Card.config = function (config) {
        config = config || {};

        config.isThrowOut = config.isThrowOut ? config.isThrowOut : Card.isThrowOut;

        config.throwOutDistance = config.throwOutDistance ? config.throwOutDistance : Card.throwOutDistance;
        config.minThrowOutDistance = config.minThrowOutDistance ? config.minThrowOutDistance : 400;
        config.maxThrowOutDistance = config.maxThrowOutDistance ? config.maxThrowOutDistance : 500;

        config.rotationAngle = config.rotationAngle ? config.rotationAngle : Card.rotationAngle;

        return config;
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
     * Get the [x, y] values for the computed CSS transform translate state.
     * 
     * @param {HTMLElement} element The target element.
     * @return {Array}
     */
    Card.getTranslate = function (element) {
        var translate = [0, 0],
            match;

        if (!element.style.transform) {
            return translate;
        }

        match = element.style.transform.match(/translate\((.+)px, (.+)px\)/);

        if (!match) {
            return translate;
        }

        translate[0] = parseFloat(match[1]);
        translate[1] = parseFloat(match[2]);

        return translate;
    };

    /**
     * Invoked when card is added to the stack.
     * The card is thrown to this offset from the stack.
     * The value is a random number between minThrowOutDistance and maxThrowOutDistance.
     * 
     * @return {Number}
     */
    Card.throwOutDistance = function () {
        return util.randomInt(config.minThrowOutDistance, config.maxThrowOutDistance);
    };

    /**
     * Rotation is equal to the proportion of horizontal and vertical offset
     * times the maximumRotation constant.
     * 
     * @param {Number} x Horizontal offset from the startDrag.
     * @param {Number} y Vertical offset from the startDrag.
     * @return {Number} Rotation angle expressed in degrees.
     */
    Card.rotationAngle = function (x, y) {
        var maximumRotation = 20,
            horizontalOffset = Math.min(Math.max(x/card.targetElementWidth, -1), 1),
            verticalOffset = (y > 0 ? 1 : -1) * Math.min(Math.abs(y)/100, 1),
            rotation = horizontalOffset * verticalOffset * maximumRotation;

        return rotation;
    };

    /**
     * Use CSS transform to translate element position.
     * 
     * @param {HTMLElement} element The target element.
     * @param {Number} x Horizontal offset from the startDrag.
     * @param {Number} y Vertical offset from the startDrag.
     * @return {null}
     */
    Card.translate = function (element, x, y) {
        var r = config.rotationAngle(x, y);

        element.style[vendorPrefix('transform')] = 'translate(' + x + 'px, ' + y + 'px) rotate(' + r + 'deg)';
    };

    /**
     * Determine if element is being thrown out of the stack.
     * Element is considered to be throw out if it has been moved at least 10px
     * outside of the stack box.
     * 
     * @param {Number} offset Distance from the dragStart.
     * @param {Number} elementWidth Width of the element being dragged.
     * @return {Boolean}
     */
    Card.isThrowOut = function (offset, elementWidth) {
        return Math.max(Math.abs(offset) - elementWidth, 0) > 10;
    };

    /**
     * This method is invoked every time the Rebound physics solver updates the Spring's value.
     * 
     * @param {HTMLElement} element The target element.
     * @param {Number} x Horizontal offset from the startDrag.
     * @param {Number} y Vertical offset from the startDrag.
     * @param {Number} value A value from 0 to 1 indicating the progress of the transition.
     * @return {null}
     */
    Card.onSpringSnapBackUpdate = function (element, x, y, value) {
        x = rebound.MathUtil.mapValueInRange(value, 0, 1, x, 0);
        y = rebound.MathUtil.mapValueInRange(value, 0, 1, y, 0);

        Card.translate(element, x, y);
    };

    /**
     * This method is invoked every time the Rebound physics solver updates the Spring's value.
     * 
     * @param {HTMLElement} element The target element.
     * @param {Number} x Horizontal offset from the startDrag.
     * @param {Number} y Vertical offset from the startDrag.
     * @param {Number} value A value from 0 to 1 indicating the progress of the transition.
     * @param {Number} throwOutDistance
     * @return {null}
     */
    Card.onSpringThrowOutUpdate = function (element, x, y, value, throwOutDistance) {
        x = rebound.MathUtil.mapValueInRange(value, 0, 1, x, throwOutDistance);
        
        Card.translate(element, x, y);
    };

    card.targetElementWidth = targetElement.offsetWidth;
    card.targetElementHeight = targetElement.offsetHeight;

    config = Card.config(Stack.config());

    Card.bind();
}

Card.DIRECTION_LEFT = -1;
Card.DIRECTION_RIGHT = 1;

module.exports = Card;