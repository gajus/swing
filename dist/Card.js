'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

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

var _Direction = require('./Direction');

var _Direction2 = _interopRequireDefault(_Direction);

var _utilities = require('./utilities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {number} fromX
 * @param {number} fromY
 * @param {Direction[]} allowedDirections
 * @returns {Direction[]} computed direction
 */
var computeDirection = function computeDirection(fromX, fromY, allowedDirections) {
  var isHorizontal = Math.abs(fromX) > Math.abs(fromY);

  var isLeftDirection = fromX < 0 ? _Direction2.default.LEFT : _Direction2.default.RIGHT;
  var isUpDirection = fromY < 0 ? _Direction2.default.UP : _Direction2.default.DOWN;

  var direction = isHorizontal ? isLeftDirection : isUpDirection;

  if (allowedDirections.indexOf(direction) === -1) {
    return _Direction2.default.INVALID;
  }

  return direction;
};

/**
 * @param {Stack} stack
 * @param {HTMLElement} targetElement
 * @param {boolean} prepend
 * @returns {Object} An instance of Card.
 */
var Card = function Card(stack, targetElement, prepend) {
  var card = void 0;
  var config = void 0;
  var currentX = void 0;
  var currentY = void 0;
  var doMove = void 0;
  var eventEmitter = void 0;
  var isDraging = void 0;
  var isPanning = void 0;
  var lastThrow = void 0;
  var lastTranslate = void 0;
  var lastX = void 0;
  var lastY = void 0;
  var mc = void 0;
  var _onSpringUpdate = void 0;
  var springSystem = void 0;
  var springThrowIn = void 0;
  var springThrowOut = void 0;
  var throwDirectionToEventName = void 0;
  var throwOutDistance = void 0;
  var throwWhere = void 0;

  var construct = function construct() {
    card = {};
    config = Card.makeConfig(stack.getConfig());
    eventEmitter = (0, _sister2.default)();
    springSystem = stack.getSpringSystem();
    springThrowIn = springSystem.createSpring(250, 10);
    springThrowOut = springSystem.createSpring(500, 20);
    lastThrow = {};
    lastTranslate = {
      coordinateX: 0,
      coordinateY: 0
    };

    /* Mapping directions to event names */
    throwDirectionToEventName = {};
    throwDirectionToEventName[_Direction2.default.LEFT] = 'throwoutleft';
    throwDirectionToEventName[_Direction2.default.RIGHT] = 'throwoutright';
    throwDirectionToEventName[_Direction2.default.UP] = 'throwoutup';
    throwDirectionToEventName[_Direction2.default.DOWN] = 'throwoutdown';

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

    if (prepend) {
      Card.prependToParent(targetElement);
    } else {
      Card.appendToParent(targetElement);
    }

    eventEmitter.on('panstart', function () {
      // allow a css class to disable the card events
      if (targetElement.className.indexOf('disable-swing') !== -1) {
        return;
      }
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

    eventEmitter.on('panmove', function (event) {
      currentX = event.deltaX;
      currentY = event.deltaY;
    });

    eventEmitter.on('panend', function (event) {
      isDraging = false;

      var coordinateX = lastTranslate.coordinateX + event.deltaX;
      var coordinateY = lastTranslate.coordinateY + event.deltaY;

      var isThrowOut = config.isThrowOut(coordinateX, coordinateY, targetElement, config.throwOutConfidence(coordinateX, coordinateY, targetElement));

      // Not really sure about computing direction here and filtering on directions here.
      // It adds more logic. Any suggestion will be appreciated.
      var direction = computeDirection(coordinateX, coordinateY, config.allowedDirections);

      if (isThrowOut && direction !== _Direction2.default.INVALID) {
        card.throwOut(coordinateX, coordinateY, direction);
      } else {
        card.throwIn(coordinateX, coordinateY, direction);
      }

      eventEmitter.trigger('dragend', {
        target: targetElement
      });
    });

    // "mousedown" event fires late on touch enabled devices, thus listening
    // to the touchstart event for touch enabled devices and mousedown otherwise.
    if ((0, _utilities.isTouchDevice)()) {
      targetElement.addEventListener('touchstart', function () {
        eventEmitter.trigger('panstart');
      });

      targetElement.addEventListener('touchend', function () {
        if (isDraging && !isPanning) {
          eventEmitter.trigger('dragend', {
            target: targetElement
          });
        }
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

        global.addEventListener('touchmove', function (event) {
          if (dragging) {
            event.preventDefault();
          }
        });
      })();
    } else {
      targetElement.addEventListener('mousedown', function () {
        eventEmitter.trigger('panstart');
      });

      targetElement.addEventListener('mouseup', function () {
        if (isDraging && !isPanning) {
          eventEmitter.trigger('dragend', {
            target: targetElement
          });
        }
      });
    }

    mc.on('panstart', function (event) {
      isPanning = true;
      eventEmitter.trigger('panstart', event);
    });

    mc.on('panmove', function (event) {
      eventEmitter.trigger('panmove', event);
    });

    mc.on('panend', function (event) {
      isPanning = false;
      eventEmitter.trigger('panend', event);
    });

    springThrowIn.addListener({
      onSpringAtRest: function onSpringAtRest() {
        eventEmitter.trigger('throwinend', {
          target: targetElement
        });
      },
      onSpringUpdate: function onSpringUpdate(spring) {
        var value = spring.getCurrentValue();
        var coordianteX = _rebound2.default.MathUtil.mapValueInRange(value, 0, 1, lastThrow.fromX, 0);
        var coordianteY = _rebound2.default.MathUtil.mapValueInRange(value, 0, 1, lastThrow.fromY, 0);

        _onSpringUpdate(coordianteX, coordianteY);
      }
    });

    springThrowOut.addListener({
      onSpringAtRest: function onSpringAtRest() {
        eventEmitter.trigger('throwoutend', {
          target: targetElement
        });
      },
      onSpringUpdate: function onSpringUpdate(spring) {
        var value = spring.getCurrentValue();

        var coordianteX = void 0;
        var coordianteY = void 0;
        var directionFactor = void 0;

        if (lastThrow.direction === _Direction2.default.RIGHT || lastThrow.direction === _Direction2.default.LEFT) {
          directionFactor = lastThrow.direction === _Direction2.default.RIGHT ? 1 : -1;
          coordianteX = _rebound2.default.MathUtil.mapValueInRange(value, 0, 1, lastThrow.fromX, throwOutDistance * directionFactor);
          coordianteY = lastThrow.fromY;
        } else if (lastThrow.direction === _Direction2.default.UP || lastThrow.direction === _Direction2.default.DOWN) {
          directionFactor = lastThrow.direction === _Direction2.default.DOWN ? 1 : -1;
          coordianteX = lastThrow.fromX;
          coordianteY = _rebound2.default.MathUtil.mapValueInRange(value, 0, 1, lastThrow.fromY, throwOutDistance * directionFactor);
        }

        _onSpringUpdate(coordianteX, coordianteY);
      }
    });

    /**
     * Transforms card position based on the current environment variables.
     *
     * @returns {undefined}
     */
    doMove = function doMove() {
      if (currentX === lastX && currentY === lastY) {
        return;
      }

      lastX = currentX;
      lastY = currentY;

      var coordinateX = lastTranslate.coordinateX + currentX;
      var coordianteY = lastTranslate.coordinateY + currentY;
      var rotation = config.rotation(coordinateX, coordianteY, targetElement, config.maxRotation);

      config.transform(targetElement, coordinateX, coordianteY, rotation);

      eventEmitter.trigger('dragmove', {
        offset: coordinateX,
        target: targetElement,
        throwDirection: computeDirection(coordinateX, coordianteY, config.allowedDirections),
        throwOutConfidence: config.throwOutConfidence(coordinateX, coordianteY, targetElement)
      });
    };

    /**
     * Invoked every time the physics solver updates the Spring's value.
     *
     * @param {number} coordinateX
     * @param {number} coordinateY
     * @returns {undefined}
     */
    _onSpringUpdate = function _onSpringUpdate(coordinateX, coordinateY) {
      var rotation = config.rotation(coordinateX, coordinateY, targetElement, config.maxRotation);

      lastTranslate.coordinateX = coordinateX || 0;
      lastTranslate.coordinateY = coordinateY || 0;

      config.transform(targetElement, coordinateX, coordinateY, rotation);
    };

    /**
     * @param {Card.THROW_IN|Card.THROW_OUT} where
     * @param {number} fromX
     * @param {number} fromY
     * @param {Direction} [direction]
     * @returns {undefined}
     */
    throwWhere = function throwWhere(where, fromX, fromY, direction) {
      lastThrow.fromX = fromX;
      lastThrow.fromY = fromY;

      // If direction argument is not set, compute it from coordinates.
      lastThrow.direction = direction || computeDirection(fromX, fromY, config.allowedDirections);

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
          throwDirection: lastThrow.direction
        });

        /* Emits more accurate events about specific directions */
        eventEmitter.trigger(throwDirectionToEventName[lastThrow.direction], {
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
   * @param {number} coordinateX
   * @param {number} coordinateY
   * @param {Direction} [direction]
   * @returns {undefined}
   */
  card.throwIn = function (coordinateX, coordinateY, direction) {
    throwWhere(Card.THROW_IN, coordinateX, coordinateY, direction);
  };

  /**
   * Throws a card out of the stack in the direction away from the original offset.
   *
   * @param {number} coordinateX
   * @param {number} coordinateY
   * @param {Direction} [direction]
   * @returns {undefined}
   */
  card.throwOut = function (coordinateX, coordinateY, direction) {
    throwWhere(Card.THROW_OUT, coordinateX, coordinateY, direction);
  };

  /**
   * Unbinds all Hammer.Manager events.
   * Removes the listeners from the physics simulation.
   *
   * @returns {undefined}
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
 * @returns {Object}
 */
Card.makeConfig = function () {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var defaultConfig = {
    allowedDirections: [_Direction2.default.RIGHT, _Direction2.default.LEFT, _Direction2.default.UP],
    isThrowOut: Card.isThrowOut,
    maxRotation: 20,
    maxThrowOutDistance: 500,
    minThrowOutDistance: 400,
    rotation: Card.rotation,
    throwOutConfidence: Card.throwOutConfidence,
    throwOutDistance: Card.throwOutDistance,
    transform: Card.transform
  };

  return _lodash2.default.assign({}, defaultConfig, config);
};

/**
 * Uses CSS transform to translate element position and rotation.
 *
 * Invoked in the event of `dragmove` and every time the physics solver is triggered.
 *
 * @param {HTMLElement} element
 * @param {number} coordinateX Horizontal offset from the startDrag.
 * @param {number} coordinateY Vertical offset from the startDrag.
 * @param {number} rotation
 * @returns {undefined}
 */
Card.transform = function (element, coordinateX, coordinateY, rotation) {
  element.style[(0, _vendorPrefix2.default)('transform')] = 'translate3d(0, 0, 0) translate(' + coordinateX + 'px, ' + coordinateY + 'px) rotate(' + rotation + 'deg)';
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
 * @returns {undefined}
 */
Card.appendToParent = function (element) {
  var parentNode = element.parentNode;
  var siblings = (0, _utilities.elementChildren)(parentNode);
  var targetIndex = siblings.indexOf(element);

  if (targetIndex + 1 !== siblings.length) {
    parentNode.removeChild(element);
    parentNode.appendChild(element);
  }
};

/**
 * Prepend element to the parentNode.
 *
 * This makes the element last among the siblings.
 *
 * Invoked when card is added to the stack (when prepend is true).
 *
 * @param {HTMLElement} element The target element.
 * @return {undefined}
 */
Card.prependToParent = function (element) {
  var parentNode = element.parentNode;

  parentNode.removeChild(element);
  parentNode.insertBefore(element, parentNode.firstChild);
};

/**
 * Returns a value between 0 and 1 indicating the completeness of the throw out condition.
 *
 * Ration of the absolute distance from the original card position and element width.
 *
 * @param {number} xOffset Distance from the dragStart.
 * @param {number} yOffset Distance from the dragStart.
 * @param {HTMLElement} element Element.
 * @returns {number}
 */
Card.throwOutConfidence = function (xOffset, yOffset, element) {
  var xConfidence = Math.min(Math.abs(xOffset) / element.offsetWidth, 1);
  var yConfidence = Math.min(Math.abs(yOffset) / element.offsetHeight, 1);

  return Math.max(xConfidence, yConfidence);
};

/**
 * Determines if element is being thrown out of the stack.
 *
 * Element is considered to be thrown out when throwOutConfidence is equal to 1.
 *
 * @param {number} xOffset Distance from the dragStart.
 * @param {number} yOffset Distance from the dragStart.
 * @param {HTMLElement} element Element.
 * @param {number} throwOutConfidence config.throwOutConfidence
 * @returns {boolean}
 */
Card.isThrowOut = function (xOffset, yOffset, element, throwOutConfidence) {
  return throwOutConfidence === 1;
};

/**
 * Calculates a distances at which the card is thrown out of the stack.
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
Card.throwOutDistance = function (min, max) {
  return _lodash2.default.random(min, max);
};

/**
 * Calculates rotation based on the element x and y offset, element width and maxRotation variables.
 *
 * @param {number} coordinateX Horizontal offset from the startDrag.
 * @param {number} coordinateY Vertical offset from the startDrag.
 * @param {HTMLElement} element Element.
 * @param {number} maxRotation
 * @returns {number} Rotation angle expressed in degrees.
 */
Card.rotation = function (coordinateX, coordinateY, element, maxRotation) {
  var horizontalOffset = Math.min(Math.max(coordinateX / element.offsetWidth, -1), 1);
  var verticalOffset = (coordinateY > 0 ? 1 : -1) * Math.min(Math.abs(coordinateY) / 100, 1);
  var rotation = horizontalOffset * verticalOffset * maxRotation;

  return rotation;
};

Card.THROW_IN = 'in';
Card.THROW_OUT = 'out';

exports.default = Card;
module.exports = exports['default'];