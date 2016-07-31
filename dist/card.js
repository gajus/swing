'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _random2 = require('lodash/random');

var _random3 = _interopRequireDefault(_random2);

var _assign2 = require('lodash/assign');

var _assign3 = _interopRequireDefault(_assign2);

var _sister = require('sister');

var _sister2 = _interopRequireDefault(_sister);

var _hammerjs = require('hammerjs');

var _hammerjs2 = _interopRequireDefault(_hammerjs);

var _rebound = require('rebound');

var _rebound2 = _interopRequireDefault(_rebound);

var _vendorPrefix = require('vendor-prefix');

var _vendorPrefix2 = _interopRequireDefault(_vendorPrefix);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {Stack} stack
 * @param {HTMLElement} targetElement
 * @return {Object} An instance of Card.
 */
var Card = function Card(stack, targetElement) {
    var card = void 0,
        config = void 0,
        currentX = void 0,
        currentY = void 0,
        doMove = void 0,
        eventEmitter = void 0,
        isDraging = void 0,
        lastThrow = void 0,
        lastTranslate = void 0,
        lastX = void 0,
        lastY = void 0,
        mc = void 0,
        _onSpringUpdate = void 0,
        springSystem = void 0,
        springThrowIn = void 0,
        springThrowOut = void 0,
        throwOutDistance = void 0,
        throwWhere = void 0;

    var construct = function construct() {
        card = {};
        config = Card.makeConfig(stack.getConfig());
        eventEmitter = (0, _sister2.default)();
        springSystem = stack.getSpringSystem();
        springThrowIn = springSystem.createSpring(250, 10);
        springThrowOut = springSystem.createSpring(500, 20);
        lastThrow = {};
        lastTranslate = {
            x: 0,
            y: 0
        };

        springThrowIn.setRestSpeedThreshold(0.05);
        springThrowIn.setRestDisplacementThreshold(0.05);

        springThrowOut.setRestSpeedThreshold(0.05);
        springThrowOut.setRestDisplacementThreshold(0.05);

        throwOutDistance = config.throwOutDistance(config.minThrowOutDistance, config.maxThrowOutDistance);

        mc = new _hammerjs2.default.Manager(targetElement, {
            recognizers: [[_hammerjs2.default.Pan, {
                threshold: 2
            }]]
        });

        Card.appendToParent(targetElement);

        eventEmitter.on('panstart', function () {
            Card.appendToParent(targetElement);

            eventEmitter.trigger('dragstart', {
                target: targetElement
            });

            currentX = 0;
            currentY = 0;

            isDraging = true;

            (function animation() {
                if (isDraging) {
                    doMove();

                    (0, _raf2.default)(animation);
                }
            })();
        });

        eventEmitter.on('panmove', function (e) {
            currentX = e.deltaX;
            currentY = e.deltaY;
        });

        eventEmitter.on('panend', function (e) {
            isDraging = false;

            var x = lastTranslate.x + e.deltaX;
            var y = lastTranslate.y + e.deltaY;

            if (config.isThrowOut(x, targetElement, config.throwOutConfidence(x, y, targetElement))) {
                card.throwOut(x, y);
            } else {
                card.throwIn(x, y);
            }

            eventEmitter.trigger('dragend', {
                target: targetElement
            });
        });

        // "mousedown" event fires late on touch enabled devices, thus listening
        // to the touchstart event for touch enabled devices and mousedown otherwise.
        if ((0, _util.isTouchDevice)()) {
            targetElement.addEventListener('touchstart', function () {
                eventEmitter.trigger('panstart');
            });

            // Disable scrolling while dragging the element on the touch enabled devices.
            // @see http://stackoverflow.com/a/12090055/368691
            (function () {
                var dragging = void 0;

                targetElement.addEventListener('touchstart', function () {
                    dragging = true;
                });

                targetElement.addEventListener('touchend', function () {
                    dragging = false;
                });

                global.addEventListener('touchmove', function (e) {
                    if (dragging) {
                        e.preventDefault();
                    }
                });
            })();
        } else {
            targetElement.addEventListener('mousedown', function () {
                eventEmitter.trigger('panstart');
            });
        }

        mc.on('panmove', function (e) {
            eventEmitter.trigger('panmove', e);
        });

        mc.on('panend', function (e) {
            eventEmitter.trigger('panend', e);
        });

        springThrowIn.addListener({
            onSpringUpdate: function onSpringUpdate(spring) {
                var value = spring.getCurrentValue();
                var x = _rebound2.default.MathUtil.mapValueInRange(value, 0, 1, lastThrow.fromX, 0);
                var y = _rebound2.default.MathUtil.mapValueInRange(value, 0, 1, lastThrow.fromY, 0);

                _onSpringUpdate(x, y);
            },
            onSpringAtRest: function onSpringAtRest() {
                eventEmitter.trigger('throwinend', {
                    target: targetElement
                });
            }
        });

        springThrowOut.addListener({
            onSpringUpdate: function onSpringUpdate(spring) {
                var value = spring.getCurrentValue();
                var x = _rebound2.default.MathUtil.mapValueInRange(value, 0, 1, lastThrow.fromX, throwOutDistance * lastThrow.direction);
                var y = lastThrow.fromY;

                _onSpringUpdate(x, y);
            },
            onSpringAtRest: function onSpringAtRest() {
                eventEmitter.trigger('throwoutend', {
                    target: targetElement
                });
            }
        });

        /**
         * Transforms card position based on the current environment variables.
         *
         * @return {undefined}
         */
        doMove = function doMove() {
            var r = void 0,
                x = void 0,
                y = void 0,
                direction = void 0;

            if (currentX === lastX && currentY === lastY) {
                return;
            }

            lastX = currentX;
            lastY = currentY;

            x = lastTranslate.x + currentX;
            y = lastTranslate.y + currentY;
            r = config.rotation(x, y, targetElement, config.maxRotation);

            config.transform(targetElement, x, y, r);

            if (Math.abs(y) > 1.1 * Math.abs(x)) {
                direction = y > 0 ? Card.DIRECTION_DOWN : Card.DIRECTION_UP;
            } else {
                direction = x < 0 ? Card.DIRECTION_LEFT : Card.DIRECTION_RIGHT;
            }

            eventEmitter.trigger('dragmove', {
                target: targetElement,
                throwOutConfidence: config.throwOutConfidence(x, y, targetElement),
                throwDirection: direction,
                offset: x
            });
        };

        /**
         * Invoked every time the physics solver updates the Spring's value.
         *
         * @param {Number} x
         * @param {Number} y
         * @return {undefined}
         */
        _onSpringUpdate = function _onSpringUpdate(x, y) {
            var r = void 0;

            r = config.rotation(x, y, targetElement, config.maxRotation);

            lastTranslate.x = x || 0;
            lastTranslate.y = y || 0;

            Card.transform(targetElement, x, y, r);
        };

        /**
         * @param {Card.THROW_IN|Card.THROW_OUT} where
         * @param {Number} fromX
         * @param {Number} fromY
         * @return {undefined}
         */
        throwWhere = function throwWhere(where, fromX, fromY) {
            lastThrow.fromX = fromX;
            lastThrow.fromY = fromY;

            if (Math.abs(fromY) > 1.2 * Math.abs(fromX)) {
                lastThrow.direction = fromY > 0 ? Card.DIRECTION_DOWN : Card.DIRECTION_UP;
            } else {
                lastThrow.direction = fromX < 0 ? Card.DIRECTION_LEFT : Card.DIRECTION_RIGHT;
            }

            if (where === Card.THROW_IN) {
                springThrowIn.setCurrentValue(0).setAtRest().setEndValue(1);

                eventEmitter.trigger('throwin', {
                    target: targetElement,
                    throwDirection: lastThrow.direction
                });
            } else if (where === Card.THROW_OUT) {
                springThrowOut.setCurrentValue(0).setAtRest().setVelocity(100).setEndValue(1);

                eventEmitter.trigger('throwout', {
                    target: targetElement,
                    lastThrow: lastThrow,
                    throwDirection: lastThrow.direction
                });

                var eventName = void 0;
                switch (lastThrow.direction) {
                    case Card.DIRECTION_LEFT:
                        eventName = 'throwoutleft';break;
                    case Card.DIRECTION_RIGHT:
                        eventName = 'throwoutright';break;
                    case Card.DIRECTION_UP:
                        eventName = 'throwoutup';break;
                    case Card.DIRECTION_DOWN:
                        eventName = 'throwoutdown';break;
                }

                eventEmitter.trigger(eventName, {
                    target: targetElement,
                    throwDirection: lastThrow.direction
                });
            } else {
                throw new Error('Invalid throw event.');
            }
        };
    };

    construct();

    /**
     * Alias
     */
    card.on = eventEmitter.on;
    card.trigger = eventEmitter.trigger;

    /**
     * Throws a card into the stack from an arbitrary position.
     *
     * @param {Number} fromX
     * @param {Number} fromY
     * @return {undefined}
     */
    card.throwIn = function (fromX, fromY) {
        throwWhere(Card.THROW_IN, fromX, fromY);
    };

    /**
     * Throws a card out of the stack in the direction away from the original offset.
     *
     * @param {Number} fromX
     * @param {Number} fromY
     * @return {undefined}
     */
    card.throwOut = function (fromX, fromY) {
        throwWhere(Card.THROW_OUT, fromX, fromY);
    };

    /**
     * Unbinds all Hammer.Manager events.
     * Removes the listeners from the physics simulation.
     *
     * @return {undefined}
     */
    card.destroy = function () {
        mc.destroy();
        springThrowIn.destroy();
        springThrowOut.destroy();

        stack.destroyCard(card);
    };

    return card;
};

/**
 * Creates a configuration object.
 *
 * @param {Object} config
 * @return {Object}
 */
Card.makeConfig = function () {
    var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var defaultConfig = {
        isThrowOut: Card.isThrowOut,
        throwOutConfidence: Card.throwOutConfidence,
        throwOutDistance: Card.throwOutDistance,
        minThrowOutDistance: 400,
        maxThrowOutDistance: 500,
        rotation: Card.rotation,
        maxRotation: 20,
        transform: Card.transform
    };

    return (0, _assign3.default)({}, defaultConfig, config);
};

/**
 * Uses CSS transform to translate element position and rotation.
 *
 * Invoked in the event of `dragmove` and every time the physics solver is triggered.
 *
 * @param {HTMLElement} element
 * @param {Number} x Horizontal offset from the startDrag.
 * @param {Number} y Vertical offset from the startDrag.
 * @param {Number} r
 * @return {undefined}
 */
Card.transform = function (element, x, y, r) {
    element.style[(0, _vendorPrefix2.default)('transform')] = 'translate3d(0, 0, 0) translate(' + x + 'px, ' + y + 'px) rotate(' + r + 'deg)';
};

/**
 * Append element to the parentNode.
 *
 * This makes the element first among the siblings. The reason for using
 * this as opposed to zIndex is to allow CSS selector :nth-child.
 *
 * Invoked in the event of mousedown.
 * Invoked when card is added to the stack.
 *
 * @param {HTMLElement} element The target element.
 * @return {undefined}
 */
Card.appendToParent = function (element) {
    var parentNode = element.parentNode;
    var siblings = (0, _util.elementChildren)(parentNode);
    var targetIndex = siblings.indexOf(element);

    if (targetIndex + 1 !== siblings.length) {
        parentNode.removeChild(element);
        parentNode.appendChild(element);
    }
};

/**
 * Returns a value between 0 and 1 indicating the completeness of the throw out condition.
 *
 * Ration of the absolute distance from the original card position and element width.
 *
 * @param {Number} x horizontal distance from the dragStart.
 * @param {Number} y vertical distance from the dragStart.
 * @param {HTMLElement} element Element.
 * @return {Number}
 */
Card.throwOutConfidence = function (x, y, element) {

    var xConf = Math.min(Math.abs(x) / element.offsetWidth, 1);
    var yConf = Math.min(Math.abs(y) / element.offsetHeight, 1);

    return Math.max(xConf, yConf);
};

/**
 * Determines if element is being thrown out of the stack.
 *
 * Element is considered to be thrown out when throwOutConfidence is equal to 1.
 *
 * @param {Number} offset Distance from the dragStart.
 * @param {HTMLElement} element Element.
 * @param {Number} throwOutConfidence config.throwOutConfidence
 * @return {Boolean}
 */
Card.isThrowOut = function (offset, element, throwOutConfidence) {
    return throwOutConfidence === 1;
};

/**
 * Calculates a distances at which the card is thrown out of the stack.
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
Card.throwOutDistance = function (min, max) {
    return (0, _random3.default)(min, max);
};

/**
 * Calculates rotation based on the element x and y offset, element width and maxRotation variables.
 *
 * @param {Number} x Horizontal offset from the startDrag.
 * @param {Number} y Vertical offset from the startDrag.
 * @param {HTMLElement} element Element.
 * @param {Number} maxRotation
 * @return {Number} Rotation angle expressed in degrees.
 */
Card.rotation = function (x, y, element, maxRotation) {
    var horizontalOffset = Math.min(Math.max(x / element.offsetWidth, -1), 1);
    var verticalOffset = (y > 0 ? 1 : -1) * Math.min(Math.abs(y) / 100, 1);
    var rotation = horizontalOffset * verticalOffset * maxRotation;

    return rotation;
};

Card.DIRECTION_LEFT = -1;
Card.DIRECTION_RIGHT = 1;
Card.DIRECTION_UP = -2;
Card.DIRECTION_DOWN = 2;

Card.THROW_IN = 'in';
Card.THROW_OUT = 'out';

exports.default = Card;
module.exports = exports['default'];
//# sourceMappingURL=card.js.map
