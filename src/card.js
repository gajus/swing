var Sister = require('sister'),
    Hammer = require('hammerjs'),
    rebound = require('rebound'),
    vendorPrefix = require('vendor-prefix');

/**
 * @param {Stack} Stack
 * @param {HTMLElement} targetElement
 * @return {Sister}
 */
function Card (Stack, targetElement) {
    var card = this,
        emitter = Sister(),
        springSnapBack,
        springThrowOut,
        dragEndX,
        dragEndY,
        throwDirection,
        mousedownTranslate,
        throwOutDistance;

    mc = new Hammer.Manager(targetElement, {
        recognizers: [
            [Hammer.Pan, {threshold: 2}]
        ]
    });

    springSnapBack = Stack.springSystem.createSpring(250, 10);
    springThrowOut = Stack.springSystem.createSpring(500, 20);

    card.targetElementWidth = targetElement.offsetWidth;
    card.targetElementHeight = targetElement.offsetHeight;

    targetElement.addEventListener('mousedown', function (e) {
        card.appendToParent(e.target);

        mousedownTranslate = card.getTranslate(targetElement);

        emitter.trigger('startdrag', {
            target: targetElement
        });
    });

    mc.on('panmove', function (e) {
        card.translate(targetElement, mousedownTranslate[0] + e.deltaX, mousedownTranslate[1] + e.deltaY);

        emitter.trigger('dragmove', {
            target: targetElement
        });
    });

    mc.on('panend', function(e) {
        dragEndX = mousedownTranslate[0] + e.deltaX;
        dragEndY = mousedownTranslate[1] + e.deltaY;
        
        throwDirection = dragEndX > 0 ? 1 : -1;

        if (Stack.config.throwOut(dragEndX, card.targetElementWidth)) {
            springThrowOut.setCurrentValue(0).setAtRest().setVelocity(100).setEndValue(1);

            emitter.trigger('throwout', {
                target: targetElement,
                throwDirection: throwDirection
            });
        } else {
            springSnapBack.setCurrentValue(0).setAtRest().setEndValue(1);

            emitter.trigger('snapback', {
                target: targetElement
            });
        }

        emitter.trigger('dragend', {
            target: targetElement
        });
    });

    springSnapBack.addListener({
        onSpringUpdate: function (spring) {
            card.onSpringSnapBackUpdate(targetElement, dragEndX, dragEndY, spring.getCurrentValue());
        }
    });

    springThrowOut.addListener({
        onSpringActivate: function () {
            throwOutDistance = Stack.config.throwOutDistance() * throwDirection;
        },
        onSpringUpdate: function (spring) {
            card.onSpringThrowOutUpdate(targetElement, dragEndX, dragEndY, spring.getCurrentValue(), throwOutDistance);
        }
    });

    return emitter;
}

/**
 * If element is not the last among the siblings, append the
 * element to the parentNode.
 * 
 * @param {HTMLElement} element The target element.
 */
Card.prototype.appendToParent = function (element) {
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
Card.prototype.getTranslate = function (element) {
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
 * Rotation is equal to the proportion of horizontal and vertical offset
 * times the maximumRotation constant.
 * 
 * @param {Number} x Horizontal offset from the startDrag.
 * @param {Number} y Vertical offset from the startDrag.
 * @return {Number} Rotation angle expressed in degrees.
 */
Card.prototype.rotationAngle = function (x, y) {
    var maximumRotation = 20,
        horizontalOffset = Math.min(Math.max(x/this.targetElementWidth, -1), 1),
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
Card.prototype.translate = function (element, x, y) {
    var r = this.rotationAngle(x, y);

    element.style[vendorPrefix('transform')] = 'translate(' + x + 'px, ' + y + 'px) rotate(' + r + 'deg)';
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
Card.prototype.onSpringSnapBackUpdate = function (element, x, y, value) {
    x = rebound.MathUtil.mapValueInRange(value, 0, 1, x, 0);
    y = rebound.MathUtil.mapValueInRange(value, 0, 1, y, 0);

    this.translate(element, x, y);
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
Card.prototype.onSpringThrowOutUpdate = function (element, x, y, value, throwOutDistance) {
    x = rebound.MathUtil.mapValueInRange(value, 0, 1, x, throwOutDistance);
    
    this.translate(element, x, y);
};

module.exports = Card;