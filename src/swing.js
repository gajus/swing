var Sister = require('sister'),
    rebound = require('rebound'),
    Pan = require('pan-drag'),
    vendorPrefix = require('vendor-prefix');

function SwingStack (config) {
    if (!(this instanceof SwingStack)) {
        return new SwingStack(config);
    }

    this.config = config || {};
    this.config.throwOut = this.config.throwOut ? this.config.throwOut : this.throwOut;
    this.config.throwOutDistance = this.config.throwOutDistance ? this.config.throwOutDistance : this.throwOutDistance;

    this.springSystem = new rebound.SpringSystem();
}

/**
 * Method used to determine whether element should be thrown out of the stack.
 * Default behavior is to throw out element if it has been moved at least 10px
 * outside of the box of the dragStart location.
 * 
 * @param {Number} offset Distance from the dragStart.
 * @param {Number} elementWidth Width of the element being dragged.
 * @return {Boolean}
 */
SwingStack.prototype.throwOut = function (offset, elementWidth) {
    return Math.max(Math.abs(offset) - elementWidth, 0) > 10;
};

/**
 * @return {Number}
 */
SwingStack.prototype.throwOutDistance = function () {
    return 500;
};

/**
 * @return {SwingElement}
 */
SwingStack.prototype.createSwingElement = function (targetElement) {
    return new SwingElement(this, targetElement);
};

/**
 * @param {SwingStack} swingStack
 * @param {HTMLElement} targetElement
 * @return {Sister}
 */
function SwingElement (swingStack, targetElement) {
    var swingElement = {},
        emitter = Sister(),
        pan,
        springSnapBack,
        springThrowOut,
        dragEndX,
        dragEndY,
        throwDirection;

    /*mc = new Hammer.Manager(targetElement, {
        recognizers: [
            [Hammer.Pan, {threshold: 2}]
        ]
    });*/

    pan = new Pan(targetElement);

    springSnapBack = swingStack.springSystem.createSpring(250, 10);
    springThrowOut = swingStack.springSystem.createSpring(500, 20);

    swingElement = this;
    swingElement.targetElementWidth = targetElement.offsetWidth;

    targetElement.addEventListener('mousedown', function (e) {
        swingElement.targetMouseDownUp = targetElement.offsetHeight / 2 > e.layerY;
    });

    pan.eventEmitter.on('move', function (e) {
        swingElement.translate(e.handle, e.offsetX, e.offsetY);
    });

    pan.eventEmitter.on('end', function(e) {
        dragEndX = e.offsetX;
        dragEndY = e.offsetY;
        throwDirection = dragEndX > 0 ? 1 : -1;

        if (swingStack.config.throwOut(dragEndX, swingElement.targetElementWidth)) {
            springThrowOut.setCurrentValue(0).setAtRest().setVelocity(100).setEndValue(1);

            emitter.trigger('throwOut');
        } else {
            springSnapBack.setCurrentValue(0).setAtRest().setEndValue(1);

            emitter.trigger('snapBack');
        }
    });

    springSnapBack.addListener({
        onSpringUpdate: function (spring) {
            swingElement.onSpringSnapBackUpdate(targetElement, dragEndX, dragEndY, spring.getCurrentValue());
        }
    });

    springThrowOut.addListener({
        onSpringUpdate: function (spring) {
            swingElement.onSpringThrowOutUpdate(targetElement, dragEndX, dragEndY, spring.getCurrentValue(), swingStack.config.throwOutDistance() * throwDirection);
        }
    });

    return emitter;
}

/**
 * Rotation angle is equal to the proportion of the offset and elementWidth
 * times the maximumRotation constant.
 * 
 * @param {Number} offset Horizontal offset from the startDrag.
 * @return {Number} Rotation angle expressed in degrees.
 */
SwingElement.prototype.rotationAngle = function (offset) {
    var maximumRotation = 20;

    if (!this.targetMouseDownUp) {
        maximumRotation *= -1;
    }

    return Math.min(Math.max(offset/this.targetElementWidth, -1), 1) * maximumRotation;
};

/**
 * Use CSS transform to translate element position.
 * 
 * @param {Number} x
 * @param {Number} y
 * @return {null}
 */
SwingElement.prototype.translate = function (element, x, y) {
    var r = this.rotationAngle(x);

    element.style[vendorPrefix('transform')] = 'translate(' + x + 'px, ' + y + 'px) rotate(' + r + 'deg)';
};

/**
 * @param {Number} value A value from 0 to 1 indicating the progress of the transition.
 */
SwingElement.prototype.onSpringSnapBackUpdate = function (element, dragEndX, dragEndY, value) {
    x = rebound.MathUtil.mapValueInRange(value, 0, 1, dragEndX, 0);
    y = rebound.MathUtil.mapValueInRange(value, 0, 1, dragEndY, 0);

    this.translate(element, x, y);
};

/**
 * @param {Number} value A value from 0 to 1 indicating the progress of the transition.
 * @param {Number} throwOutDistance
 */
SwingElement.prototype.onSpringThrowOutUpdate = function (element, dragEndX, dragEndY, value, throwOutDistance) {
    x = rebound.MathUtil.mapValueInRange(value, 0, 1, dragEndX, throwOutDistance);
    
    this.translate(element, x, dragEndY);
};

window.SwingStack = SwingStack;
window.SwingElement = SwingElement;

module.exports = {
    SwingStack: SwingStack,
    SwingElement: SwingElement
};