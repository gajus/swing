(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],2:[function(require,module,exports){
(function (global){
var Sister = require('sister');

/**
 * @param {HTMLElement} targetElement
 */
function Pan (targetElement) {
    var pan = this;

    targetElement.draggable = true;

    return {
        eventEmitter: pan.bind(targetElement)
    };
}

Pan.prototype.bind = function (targetElement) {
    var eventEmitter = new Sister(),
        pan = this,
        handle,
        positionTracker,
        position,
        dragStartSubjectDisplay,
        dragStartSubjectOpacity,
        dragStart,
        dragMove,
        dragEndt,
        firstMove;

    dragStart = function (e) {
        positionTracker = pan.positionTracker(e);

        dragStartSubjectDisplay = targetElement.style.display;
        dragStartSubjectOpacity = targetElement.style.opacity;

        handle = pan.makeHandle(targetElement);

        targetElement.style.opacity = 0;

        firstMove = true;

        // Doesn't work without this in Firefox.
        e.dataTransfer.setData('text/plain', 'node');
    };
    
    dragMove = function (e) {
        // For mobile.
        e.preventDefault();

        position = positionTracker.update(e);

        if (firstMove) {
            // Manipulating (hiding) the targetElement on dragStart is
            // causing instant dragEnd.

            targetElement.parentNode.insertBefore(handle, targetElement);
            targetElement.style.display = 'none';

            firstMove = false;

            eventEmitter.trigger('start', {
                type: 'start',
                offsetX: position.offsetX,
                offsetY: position.offsetY,
                target: targetElement,
                handle: handle
            });
        }

        if (!position.isChange || position.isOutside) {
            return;
        }

        eventEmitter.trigger('move', {
            type: 'move',
            offsetX: position.offsetX,
            offsetY: position.offsetY,
            target: targetElement,
            handle: handle
        });
    };

    dragEnd = function (e) {
        // For mobile.
        e.preventDefault();
        
        targetElement.style.display = dragStartSubjectDisplay;
        targetElement.style.opacity = dragStartSubjectOpacity;

        handle.parentNode.removeChild(handle);

        eventEmitter.trigger('end', {
            type: 'end',
            offsetX: position.offsetX,
            offsetY: position.offsetY,
            target: targetElement,
            handle: handle
        });
    };

    targetElement.addEventListener('dragstart', dragStart, false);
    //targetElement.addEventListener('drag', dragMove, false);
    targetElement.addEventListener('dragend', dragEnd, false);

    targetElement.addEventListener('touchstart', dragStart, false);
    targetElement.addEventListener('touchmove', dragMove, false);
    targetElement.addEventListener('touchend', dragEnd, false);

    // @see http://stackoverflow.com/a/902352/368691
    document.body.addEventListener('dragover', dragMove, false);

    document.body.addEventListener('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
    }, false);

    return eventEmitter;
};

/**
 * Get the mouse cursor position or the first touch position.
 * 
 * @param {Object} event
 * @return {Object}
 */
Pan.prototype.getEventPosition = function (event) {
    var source = event.touches ? event.touches[0] : event;

    return {
        x: source.pageX,
        y: source.pageY
    };
};

/**
 * Position tracker receives the first event and uses to produce an offset calculator.
 */
Pan.prototype.positionTracker = function (startEvent) {
    var pan = this,
        pt = {},
        eventPosition = pan.getEventPosition(startEvent),
        lastPageX = eventPosition.x,
        lastPageY = eventPosition.y;

    pt.dragStartX = eventPosition.x;
    pt.dragStartY = eventPosition.y;

    return {
        update: function (event) {
            var eventPosition = pan.getEventPosition(event);

            pt.pageX = eventPosition.x;
            pt.pageY = eventPosition.y;

            pt.offsetX = eventPosition.x - pt.dragStartX;
            pt.offsetY = eventPosition.y - pt.dragStartY;

            // Is the cursor outside the screen?
            pt.isOutside = pt.pageX == document.documentElement.scrollLeft && pt.pageY == document.documentElement.scrollTop;
            // Did the cursor position change?
            pt.isChange = lastPageX != eventPosition.x || lastPageY != eventPosition.y;

            lastPageX = eventPosition.x;
            lastPageY = eventPosition.y;

            return pt;
        }
    };
};

/**
 * @param {HTMLElement} targetElement
 * @return {HTMLElement}
 */
Pan.prototype.makeHandle = function (targetElement) {
    var handle = this.makeClone(targetElement);

    return handle;
};

/**
 * Clone node.
 * 
 * @param {HTMLElement} node
 * @return {HTMLElement}
 */
Pan.prototype.makeClone = function (node) {
    var clone;

    clone = node.cloneNode(true);

    return clone;
};

global.Pan = Pan;

module.exports = Pan;
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"sister":4}],3:[function(require,module,exports){
(function (process){
// Rebound
// =======
// **Rebound** is a simple library that models Spring dynamics for the
// purpose of driving physical animations.
//
// Origin
// ------
// [Rebound](http://facebook.github.io/rebound) was originally written
// in Java to provide a lightweight physics system for
// [Facebook Home](https://play.google.com/store/apps/details?id=com.facebook.home)
// and [Chat Heads](https://play.google.com/store/apps/details?id=com.facebook.orca)
// on Android. It's now been adopted by several other Android
// applications. This JavaScript port was written to provide a quick
// way to demonstrate Rebound animations on the web for a
// [conference talk](https://www.youtube.com/watch?v=s5kNm-DgyjY). Since then the
// JavaScript version has been used to build some really nice interfaces.
// Check out [brandonwalkin.com](http://brandonwalkin.com) for an
// example.
//
// Overview
// --------
// The Library provides a SpringSystem for maintaining a set of Spring
// objects and iterating those Springs through a physics solver loop
// until equilibrium is achieved. The Spring class is the basic
// animation driver provided by Rebound. By attaching a listener to
// a Spring, you can observe its motion. The observer function is
// notified of position changes on the spring as it solves for
// equilibrium. These position updates can be mapped to an animation
// range to drive animated property updates on your user interface
// elements (translation, rotation, scale, etc).
//
// Example
// -------
// Here's a simple example. Pressing and releasing on the logo below
// will cause it to scale up and down with a springy animation.
//
// <div style="text-align:center; margin-bottom:50px; margin-top:50px">
//   <img src="http://facebook.github.io/rebound/images/rebound.png" id="logo" />
// </div>
// <script src="../rebound.min.js"></script>
// <script>
//
// function scale(el, val) {
//   el.style.mozTransform =
//   el.style.msTransform =
//   el.style.webkitTransform =
//   el.style.transform = 'scale3d(' + val + ', ' + val + ', 1)';
// }
// var el = document.getElementById('logo');
//
// var springSystem = new rebound.SpringSystem();
// var spring = springSystem.createSpring(50, 3);
// spring.addListener({
//   onSpringUpdate: function(spring) {
//     var val = spring.getCurrentValue();
//     val = rebound.MathUtil.mapValueInRange(val, 0, 1, 1, 0.5);
//     scale(el, val);
//   }
// });
//
// el.addEventListener('mousedown', function() {
//   spring.setEndValue(1);
// });
//
// el.addEventListener('mouseout', function() {
//   spring.setEndValue(0);
// });
//
// el.addEventListener('mouseup', function() {
//   spring.setEndValue(0);
// });
//
// </script>
//
// Here's how it works.
//
// ```
// // Get a reference to the logo element.
// var el = document.getElementById('logo');
//
// // create a SpringSystem and a Spring with a bouncy config.
// var springSystem = new rebound.SpringSystem();
// var spring = springSystem.createSpring(50, 3);
//
// // Add a listener to the spring. Every time the physics
// // solver updates the Spring's value onSpringUpdate will
// // be called.
// spring.addListener({
//   onSpringUpdate: function(spring) {
//     var val = spring.getCurrentValue();
//     val = rebound.MathUtil
//                  .mapValueInRange(val, 0, 1, 1, 0.5);
//     scale(el, val);
//   }
// });
//
// // Listen for mouse down/up/out and toggle the
// //springs endValue from 0 to 1.
// el.addEventListener('mousedown', function() {
//   spring.setEndValue(1);
// });
//
// el.addEventListener('mouseout', function() {
//   spring.setEndValue(0);
// });
//
// el.addEventListener('mouseup', function() {
//   spring.setEndValue(0);
// });
//
// // Helper for scaling an element with css transforms.
// function scale(el, val) {
//   el.style.mozTransform =
//   el.style.msTransform =
//   el.style.webkitTransform =
//   el.style.transform = 'scale3d(' +
//     val + ', ' + val + ', 1)';
// }
// ```

(function() {
  var rebound = {};
  var util = rebound.util = {};
  var concat = Array.prototype.concat;
  var slice = Array.prototype.slice;

  // Bind a function to a context object.
  util.bind = function bind(func, context) {
    args = slice.call(arguments, 2);
    return function() {
      func.apply(context, concat.call(args, slice.call(arguments)));
    };
  };

  // Add all the properties in the source to the target.
  util.extend = function extend(target, source) {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  };

  // SpringSystem
  // ------------
  // **SpringSystem** is a set of Springs that all run on the same physics
  // timing loop. To get started with a Rebound animation you first
  // create a new SpringSystem and then add springs to it.
  var SpringSystem = rebound.SpringSystem = function SpringSystem(looper) {
    this._springRegistry = {};
    this._activeSprings = [];
    this.listeners = [];
    this._idleSpringIndices = [];
    this.looper = looper || new AnimationLooper();
    this.looper.springSystem = this;
  };

  util.extend(SpringSystem.prototype, {

    _springRegistry: null,

    _isIdle: true,

    _lastTimeMillis: -1,

    _activeSprings: null,

    listeners: null,

    _idleSpringIndices: null,

    // A SpringSystem is iterated by a looper. The looper is responsible
    // for executing each frame as the SpringSystem is resolved to idle.
    // There are three types of Loopers described below AnimationLooper,
    // SimulationLooper, and SteppingSimulationLooper. AnimationLooper is
    // the default as it is the most useful for common UI animations.
    setLooper: function(looper) {
      this.looper = looper
      looper.springSystem = this;
    },

    // Create and register a new spring with the SpringSystem. This
    // Spring will now be solved for during the physics iteration loop. By default
    // the spring will use the default Origami spring config with 40 tension and 7
    // friction, but you can also provide your own values here.
    createSpring: function(tension, friction) {
      var spring = new Spring(this);
      this.registerSpring(spring);
      if (typeof tension === 'undefined' || typeof friction === 'undefined') {
        spring.setSpringConfig(SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG);
      } else {
        var springConfig = SpringConfig.fromOrigamiTensionAndFriction(tension, friction);
        spring.setSpringConfig(springConfig);
      }
      return spring;
    },

    // You can check if a SpringSystem is idle or active by calling
    // getIsIdle. If all of the Springs in the SpringSystem are at rest,
    // i.e. the physics forces have reached equilibrium, then this
    // method will return true.
    getIsIdle: function() {
      return this._isIdle;
    },

    // Retrieve a specific Spring from the SpringSystem by id. This
    // can be useful for inspecting the state of a spring before
    // or after an integration loop in the SpringSystem executes.
    getSpringById: function (id) {
      return this._springRegistry[id];
    },

    // Get a listing of all the springs registered with this
    // SpringSystem.
    getAllSprings: function() {
      var vals = [];
      for (var id in this._springRegistry) {
        if (this._springRegistry.hasOwnProperty(id)) {
          vals.push(this._springRegistry[id]);
        }
      }
      return vals;
    },

    // registerSpring is called automatically as soon as you create
    // a Spring with SpringSystem#createSpring. This method sets the
    // spring up in the registry so that it can be solved in the
    // solver loop.
    registerSpring: function(spring) {
      this._springRegistry[spring.getId()] = spring;
    },

    // Deregister a spring with this SpringSystem. The SpringSystem will
    // no longer consider this Spring during its integration loop once
    // this is called. This is normally done automatically for you when
    // you call Spring#destroy.
    deregisterSpring: function(spring) {
      removeFirst(this._activeSprings, spring);
      delete this._springRegistry[spring.getId()];
    },

    advance: function(time, deltaTime) {
      while(this._idleSpringIndices.length > 0) this._idleSpringIndices.pop();
      for (var i = 0, len = this._activeSprings.length; i < len; i++) {
        var spring = this._activeSprings[i];
        if (spring.systemShouldAdvance()) {
          spring.advance(time / 1000.0, deltaTime / 1000.0);
        } else {
          this._idleSpringIndices.push(this._activeSprings.indexOf(spring));
        }
      }
      while(this._idleSpringIndices.length > 0) {
        var idx = this._idleSpringIndices.pop();
        idx >= 0 && this._activeSprings.splice(idx, 1);
      }
    },

    // This is our main solver loop called to move the simulation
    // forward through time. Before each pass in the solver loop
    // onBeforeIntegrate is called on an any listeners that have
    // registered themeselves with the SpringSystem. This gives you
    // an opportunity to apply any constraints or adjustments to
    // the springs that should be enforced before each iteration
    // loop. Next the advance method is called to move each Spring in
    // the systemShouldAdvance forward to the current time. After the
    // integration step runs in advance, onAfterIntegrate is called
    // on any listeners that have registered themselves with the
    // SpringSystem. This gives you an opportunity to run any post
    // integration constraints or adjustments on the Springs in the
    // SpringSystem.
    loop: function(currentTimeMillis) {
      var listener;
      if (this._lastTimeMillis === -1) {
        this._lastTimeMillis = currentTimeMillis -1;
      }
      var ellapsedMillis = currentTimeMillis - this._lastTimeMillis;
      this._lastTimeMillis = currentTimeMillis;

      var i = 0, len = this.listeners.length;
      for (i = 0; i < len; i++) {
        var listener = this.listeners[i];
        listener.onBeforeIntegrate && listener.onBeforeIntegrate(this);
      }

      this.advance(currentTimeMillis, ellapsedMillis);
      if (this._activeSprings.length === 0) {
        this._isIdle = true;
        this._lastTimeMillis = -1;
      }

      for (i = 0; i < len; i++) {
        var listener = this.listeners[i];
        listener.onAfterIntegrate && listener.onAfterIntegrate(this);
      }

      if (!this._isIdle) {
        this.looper.run();
      }
    },

    // activateSpring is used to notify the SpringSystem that a Spring
    // has become displaced. The system responds by starting its solver
    // loop up if it is currently idle.
    activateSpring: function(springId) {
      var spring = this._springRegistry[springId];
      if (this._activeSprings.indexOf(spring) == -1) {
        this._activeSprings.push(spring);
      }
      if (this.getIsIdle()) {
        this._isIdle = false;
        this.looper.run();
      }
    },

    // Add a listener to the SpringSystem so that you can receive
    // before/after integration notifications allowing Springs to be
    // constrained or adjusted.
    addListener: function(listener) {
      this.listeners.push(listener);
    },

    // Remove a previously added listener on the SpringSystem.
    removeListener: function(listener) {
      removeFirst(this.listeners, listener);
    },

    // Remove all previously added listeners on the SpringSystem.
    removeAllListeners: function() {
      this.listeners = [];
    }

  });

  // Spring
  // ------
  // **Spring** provides a model of a classical spring acting to
  // resolve a body to equilibrium. Springs have configurable
  // tension which is a force multipler on the displacement of the
  // spring from its rest point or `endValue` as defined by [Hooke’s
  // law](http://en.wikipedia.org/wiki/Hooke's_law). Springs also have
  // configurable friction, which ensures that they do not oscillate
  // infinitely. When a Spring is displaced by updating it’s resting
  // or `currentValue`, the SpringSystems that contain that Spring
  // will automatically start looping to solve for equilibrium. As each
  // timestep passes, `SpringListener` objects attached to the Spring
  // will be notified of the updates providing a way to drive an
  // animation off of the spring's resolution curve.
  var Spring = rebound.Spring = function Spring(springSystem) {
    this._id = 's' + Spring._ID++;
    this._springSystem = springSystem;
    this.listeners = [];
    this._currentState = new PhysicsState();
    this._previousState = new PhysicsState();
    this._tempState = new PhysicsState();
  };

  util.extend(Spring, {
    _ID: 0,

    MAX_DELTA_TIME_SEC: 0.064,

    SOLVER_TIMESTEP_SEC: 0.001

  });

  util.extend(Spring.prototype, {

    _id: 0,

    _springConfig: null,

    _overshootClampingEnabled: false,

    _currentState: null,

    _previousState: null,

    _tempState: null,

    _startValue: 0,

    _endValue: 0,

    _wasAtRest: true,

    _restSpeedThreshold: 0.001,

    _displacementFromRestThreshold: 0.001,

    listeners: null,

    _timeAccumulator: 0,

    _springSystem: null,

    // Remove a Spring from simulation and clear its listeners.
    destroy: function() {
      this.listeners = [];
      this.frames = [];
      this._springSystem.deregisterSpring(this);
    },

    // Get the id of the spring, which can be used to retrieve it from
    // the SpringSystems it participates in later.
    getId: function() {
      return this._id;
    },

    // Set the configuration values for this Spring. A SpringConfig
    // contains the tension and friction values used to solve for the
    // equilibrium of the Spring in the physics loop.
    setSpringConfig: function(springConfig) {
      this._springConfig = springConfig;
      return this;
    },

    // Retrieve the SpringConfig used by this Spring.
    getSpringConfig: function() {
      return this._springConfig;
    },

    // Set the current position of this Spring. Listeners will be updated
    // with this value immediately. If the rest or `endValue` is not
    // updated to match this value, then the spring will be dispalced and
    // the SpringSystem will start to loop to restore the spring to the
    // `endValue`.
    //
    // A common pattern is to move a Spring around without animation by
    // calling.
    //
    // ```
    // spring.setCurrentValue(n).setAtRest();
    // ```
    //
    // This moves the Spring to a new position `n`, sets the endValue
    // to `n`, and removes any velocity from the `Spring`. By doing
    // this you can allow the `SpringListener` to manage the position
    // of UI elements attached to the spring even when moving without
    // animation. For example, when dragging an element you can
    // update the position of an attached view through a spring
    // by calling `spring.setCurrentValue(x)`. When
    // the gesture ends you can update the Springs
    // velocity and endValue
    // `spring.setVelocity(gestureEndVelocity).setEndValue(flingTarget)`
    // to cause it to naturally animate the UI element to the resting
    // position taking into account existing velocity. The codepaths for
    // synchronous movement and spring driven animation can
    // be unified using this technique.
    setCurrentValue: function(currentValue, skipSetAtRest) {
      this._startValue = currentValue;
      this._currentState.position = currentValue;
      if (!skipSetAtRest) {
        this.setAtRest();
      }
      this.notifyPositionUpdated(false, false);
      return this;
    },

    // Get the position that the most recent animation started at. This
    // can be useful for determining the number off oscillations that
    // have occurred.
    getStartValue: function() {
      return this._startValue;
    },

    // Retrieve the current value of the Spring.
    getCurrentValue: function() {
      return this._currentState.position;
    },

    // Get the absolute distance of the Spring from it’s resting endValue position.
    getCurrentDisplacementDistance: function() {
      return this.getDisplacementDistanceForState(this._currentState);
    },

    getDisplacementDistanceForState: function(state) {
      return Math.abs(this._endValue - state.position);
    },

    // Set the endValue or resting position of the spring. If this
    // value is different than the current value, the SpringSystem will
    // be notified and will begin running its solver loop to resolve
    // the Spring to equilibrium. Any listeners that are registered
    // for onSpringEndStateChange will also be notified of this update
    // immediately.
    setEndValue: function(endValue) {
      if (this._endValue == endValue && this.isAtRest())  {
        return this;
      }
      this._startValue = this.getCurrentValue();
      this._endValue = endValue;
      this._springSystem.activateSpring(this.getId());
      for (var i = 0, len = this.listeners.length; i < len; i++) {
        var listener = this.listeners[i];
        listener.onSpringEndStateChange && listener.onSpringEndStateChange(this);
      }
      return this;
    },

    // Retrieve the endValue or resting position of this spring.
    getEndValue: function() {
      return this._endValue;
    },

    // Set the current velocity of the Spring. As previously mentioned,
    // this can be useful when you are performing a direct manipulation
    // gesture. When a UI element is released you may call setVelocity
    // on its animation Spring so that the Spring continues with the
    // same velocity as the gesture ended with. The friction, tension,
    // and displacement of the Spring will then govern its motion to
    // return to rest on a natural feeling curve.
    setVelocity: function(velocity) {
      if (velocity === this._currentState.velocity) {
        return this;
      }
      this._currentState.velocity = velocity;
      this._springSystem.activateSpring(this.getId());
      return this;
    },

    // Get the current velocity of the Spring.
    getVelocity: function() {
      return this._currentState.velocity;
    },

    // Set a threshold value for the movement speed of the Spring below
    // which it will be considered to be not moving or resting.
    setRestSpeedThreshold: function(restSpeedThreshold) {
      this._restSpeedThreshold = restSpeedThreshold;
      return this;
    },

    // Retrieve the rest speed threshold for this Spring.
    getRestSpeedThreshold: function() {
      return this._restSpeedThreshold;
    },

    // Set a threshold value for displacement below which the Spring
    // will be considered to be not displaced i.e. at its resting
    // `endValue`.
    setRestDisplacementThreshold: function(displacementFromRestThreshold) {
      this._displacementFromRestThreshold = displacementFromRestThreshold;
    },

    // Retrieve the rest displacement threshold for this spring.
    getRestDisplacementThreshold: function() {
      return this._displacementFromRestThreshold;
    },

    // Enable overshoot clamping. This means that the Spring will stop
    // immediately when it reaches its resting position regardless of
    // any existing momentum it may have. This can be useful for certain
    // types of animations that should not oscillate such as a scale
    // down to 0 or alpha fade.
    setOvershootClampingEnabled: function(enabled) {
      this._overshootClampingEnabled = enabled;
      return this;
    },

    // Check if overshoot clamping is enabled for this spring.
    isOvershootClampingEnabled: function() {
      return this._overshootClampingEnabled;
    },

    // Check if the Spring has gone past its end point by comparing
    // the direction it was moving in when it started to the current
    // position and end value.
    isOvershooting: function() {
      return this._springConfig.tension > 0 &&
             ((this._startValue < this._endValue && this.getCurrentValue() > this._endValue) ||
             (this._startValue > this._endValue && this.getCurrentValue() < this._endValue));
    },

    // Spring.advance is the main solver method for the Spring. It takes
    // the current time and delta since the last time step and performs
    // an RK4 integration to get the new position and velocity state
    // for the Spring based on the tension, friction, velocity, and
    // displacement of the Spring.
    advance: function(time, realDeltaTime) {
      var isAtRest = this.isAtRest();

      if (isAtRest && this._wasAtRest) {
        return;
      }

      var adjustedDeltaTime = realDeltaTime;
      if (realDeltaTime > Spring.MAX_DELTA_TIME_SEC) {
        adjustedDeltaTime = Spring.MAX_DELTA_TIME_SEC;
      }

      this._timeAccumulator += adjustedDeltaTime;

      var tension = this._springConfig.tension,
          friction = this._springConfig.friction,

          position = this._currentState.position,
          velocity = this._currentState.velocity,
          tempPosition = this._tempState.position,
          tempVelocity = this._tempState.velocity,

          aVelocity, aAcceleration,
          bVelocity, bAcceleration,
          cVelocity, cAcceleration,
          dVelocity, dAcceleration,

          dxdt, dvdt;

      while(this._timeAccumulator >= Spring.SOLVER_TIMESTEP_SEC) {

        this._timeAccumulator -= Spring.SOLVER_TIMESTEP_SEC;

        if (this._timeAccumulator < Spring.SOLVER_TIMESTEP_SEC) {
          this._previousState.position = position;
          this._previousState.velocity = velocity;
        }

        aVelocity = velocity;
        aAcceleration = (tension * (this._endValue - tempPosition)) - friction * velocity;

        tempPosition = position + aVelocity * Spring.SOLVER_TIMESTEP_SEC * 0.5;
        tempVelocity = velocity + aAcceleration * Spring.SOLVER_TIMESTEP_SEC * 0.5;
        bVelocity = tempVelocity;
        bAcceleration = (tension * (this._endValue - tempPosition)) - friction * tempVelocity;

        tempPosition = position + bVelocity * Spring.SOLVER_TIMESTEP_SEC * 0.5;
        tempVelocity = velocity + bAcceleration * Spring.SOLVER_TIMESTEP_SEC * 0.5;
        cVelocity = tempVelocity;
        cAcceleration = (tension * (this._endValue - tempPosition)) - friction * tempVelocity;

        tempPosition = position + cVelocity * Spring.SOLVER_TIMESTEP_SEC * 0.5;
        tempVelocity = velocity + cAcceleration * Spring.SOLVER_TIMESTEP_SEC * 0.5;
        dVelocity = tempVelocity;
        dAcceleration = (tension * (this._endValue - tempPosition)) - friction * tempVelocity;

        dxdt = 1.0/6.0 * (aVelocity + 2.0 * (bVelocity + cVelocity) + dVelocity);
        dvdt = 1.0/6.0 *
          (aAcceleration + 2.0 * (bAcceleration + cAcceleration) + dAcceleration);

        position += dxdt * Spring.SOLVER_TIMESTEP_SEC;
        velocity += dvdt * Spring.SOLVER_TIMESTEP_SEC;
      }

      this._tempState.position = tempPosition;
      this._tempState.velocity = tempVelocity;

      this._currentState.position = position;
      this._currentState.velocity = velocity;

      if (this._timeAccumulator > 0) {
        this.interpolate(this._timeAccumulator / Spring.SOLVER_TIMESTEP_SEC);
      }

      if (this.isAtRest() ||
          this._overshootClampingEnabled && this.isOvershooting()) {

        if (this._springConfig.tension > 0) {
          this._startValue = this._endValue;
          this._currentState.position = this._endValue;
        } else {
          this._endValue = this._currentState.position;
          this._startValue = this._endValue;
        }
        this.setVelocity(0);
        isAtRest = true;
      }

      var notifyActivate = false;
      if (this._wasAtRest) {
        this._wasAtRest = false;
        notifyActivate = true;
      }

      var notifyAtRest = false;
      if (isAtRest) {
        this._wasAtRest = true;
        notifyAtRest = true;
      }

      this.notifyPositionUpdated(notifyActivate, notifyAtRest);
    },

    notifyPositionUpdated: function(notifyActivate, notifyAtRest) {
      for (var i = 0, len = this.listeners.length; i < len; i++) {
        var listener = this.listeners[i];
        if (notifyActivate && listener.onSpringActivate) {
          listener.onSpringActivate(this);
        }

        if (listener.onSpringUpdate) {
          listener.onSpringUpdate(this);
        }

        if (notifyAtRest && listener.onSpringAtRest) {
          listener.onSpringAtRest(this);
        }
      }
    },


    // Check if the SpringSystem should advance. Springs are advanced
    // a final frame after they reach equilibrium to ensure that the
    // currentValue is exactly the requested endValue regardless of the
    // displacement threshold.
    systemShouldAdvance: function() {
      return !this.isAtRest() || !this.wasAtRest();
    },

    wasAtRest: function() {
      return this._wasAtRest;
    },

    // Check if the Spring is atRest meaning that it’s currentValue and
    // endValue are the same and that it has no velocity. The previously
    // described thresholds for speed and displacement define the bounds
    // of this equivalence check. If the Spring has 0 tension, then it will
    // be considered at rest whenever its absolute velocity drops below the
    // restSpeedThreshold.
    isAtRest: function() {
      return Math.abs(this._currentState.velocity) < this._restSpeedThreshold &&
        (this.getDisplacementDistanceForState(this._currentState) <= this._displacementFromRestThreshold ||
        this._springConfig.tension === 0);
    },

    // Force the spring to be at rest at its current position. As
    // described in the documentation for setCurrentValue, this method
    // makes it easy to do synchronous non-animated updates to ui
    // elements that are attached to springs via SpringListeners.
    setAtRest: function() {
      this._endValue = this._currentState.position;
      this._tempState.position = this._currentState.position;
      this._currentState.velocity = 0;
      return this;
    },

    interpolate: function(alpha) {
      this._currentState.position = this._currentState.position *
        alpha + this._previousState.position * (1 - alpha);
      this._currentState.velocity = this._currentState.velocity *
        alpha + this._previousState.velocity * (1 - alpha);
    },

    getListeners: function() {
      return this.listeners;
    },

    addListener: function(newListener) {
      this.listeners.push(newListener);
      return this;
    },

    removeListener: function(listenerToRemove) {
      removeFirst(this.listeners, listenerToRemove);
      return this;
    },

    removeAllListeners: function() {
      this.listeners = [];
      return this;
    },

    currentValueIsApproximately: function(value) {
      return Math.abs(this.getCurrentValue() - value) <=
        this.getRestDisplacementThreshold();
    }

  });

  // PhysicsState
  // ------------
  // **PhysicsState** consists of a position and velocity. A Spring uses
  // this internally to keep track of its current and prior position and
  // velocity values.
  var PhysicsState = function PhysicsState() {};

  util.extend(PhysicsState.prototype, {
    position: 0,
    velocity: 0
  });

  // SpringConfig
  // ------------
  // **SpringConfig** maintains a set of tension and friction constants
  // for a Spring. You can use fromOrigamiTensionAndFriction to convert
  // values from the [Origami](http://facebook.github.io/origami/)
  // design tool directly to Rebound spring constants.
  var SpringConfig = rebound.SpringConfig =
    function SpringConfig(tension, friction) {
      this.tension = tension;
      this.friction = friction;
    };

  // Loopers
  // -------
  // **AnimationLooper** plays each frame of the SpringSystem on animation timing loop.
  // This is the default type of looper for a new spring system as it is the most common
  // when developing UI.
  var AnimationLooper = rebound.AnimationLooper = function AnimationLooper() {
    this.springSystem = null;
    var _this = this;
    var _run = function() {
      _this.springSystem.loop(Date.now());
    };

    this.run = function() {
      util.onFrame(_run);
    }
  };

  // **SimulationLooper** resolves the SpringSystem to a resting state in a
  // tight and blocking loop. This is useful for synchronously generating pre-recorded
  // animations that can then be played on a timing loop later. Sometimes this lead to
  // better performance to pre-record a single spring curve and use it to drive many
  // animations; however, it can make dynamic response to user input a bit trickier to
  // implement.
  var SimulationLooper = rebound.SimulationLooper = function SimulationLooper(timestep) {
    this.springSystem = null;
    var time = 0;
    var running = false;
    timestep=timestep || 16.667;

    this.run = function() {
      if (running) {
        return;
      }
      running = true;
      while(!this.springSystem.getIsIdle()) {
        this.springSystem.loop(time+=timestep);
      }
      running = false;
    }
  };

  // **SteppingSimulationLooper** resolves the SpringSystem one step at a time controlled
  // by an outside loop. This is useful for testing and verifying the behavior of a SpringSystem
  // or if you want to control your own timing loop for some reason e.g. slowing down or speeding
  // up the simulation.
  var SteppingSimulationLooper = rebound.SteppingSimulationLooper = function(timestep) {
    this.springSystem = null;
    var time = 0;
    var running = false;

    // this.run is NOOP'd here to allow control from the outside using this.step.
    this.run = function(){};

    // Perform one step toward resolving the SpringSystem.
    this.step = function(timestep) {
      this.springSystem.loop(time+=timestep);
    }
  };

  // Math for converting from
  // [Origami](http://facebook.github.io/origami/) to
  // [Rebound](http://facebook.github.io/rebound).
  // You mostly don't need to worry about this, just use
  // SpringConfig.fromOrigamiTensionAndFriction(v, v);
  var OrigamiValueConverter = rebound.OrigamiValueConverter = {
    tensionFromOrigamiValue: function(oValue) {
      return (oValue - 30.0) * 3.62 + 194.0;
    },

    origamiValueFromTension: function(tension) {
      return (tension - 194.0) / 3.62 + 30.0;
    },

    frictionFromOrigamiValue: function(oValue) {
      return (oValue - 8.0) * 3.0 + 25.0;
    },

    origamiFromFriction: function(friction) {
      return (friction - 25.0) / 3.0 + 8.0;
    }
  };

  util.extend(SpringConfig, {
    // Convert an origami Spring tension and friction to Rebound spring
    // constants. If you are prototyping a design with Origami, this
    // makes it easy to make your springs behave exactly the same in
    // Rebound.
    fromOrigamiTensionAndFriction: function(tension, friction) {
      return new SpringConfig(
        OrigamiValueConverter.tensionFromOrigamiValue(tension),
        OrigamiValueConverter.frictionFromOrigamiValue(friction));
    },

    // Create a SpringConfig with no tension or a coasting spring with some amount
    // of Friction so that it does not coast infininitely.
    coastingConfigWithOrigamiFriction: function(friction) {
      return new SpringConfig(0, OrigamiValueConverter.frictionFromOrigamiValue(friction));
    }
  });

  SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG = SpringConfig.fromOrigamiTensionAndFriction(40, 7);

  util.extend(SpringConfig.prototype, {friction: 0, tension: 0});

  // Here are a couple of function to convert colors between hex codes and RGB
  // component values. These are handy when performing color tweening animations.
  var colorCache = {};
  util.hexToRGB = function(color) {
    if (colorCache[color]) {
      return colorCache[color];
    }
    color = color.replace('#', '');
    if (color.length === 3) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    var parts = color.match(/.{2}/g);

    var color = {
      r: parseInt(parts[0], 16),
      g: parseInt(parts[1], 16),
      b: parseInt(parts[2], 16)
    };

    colorCache[color] = color;
    return color;
  };

  util.rgbToHex = function(r, g, b) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
    r = r.length < 2 ? '0' + r : r;
    g = g.length < 2 ? '0' + g : g;
    b = b.length < 2 ? '0' + b : b;
    return '#' + r + g + b;
  };

  var MathUtil = rebound.MathUtil = {
    // This helper function does a linear interpolation of a value from
    // one range to another. This can be very useful for converting the
    // motion of a Spring to a range of UI property values. For example a
    // spring moving from position 0 to 1 could be interpolated to move a
    // view from pixel 300 to 350 and scale it from 0.5 to 1. The current
    // position of the `Spring` just needs to be run through this method
    // taking its input range in the _from_ parameters with the property
    // animation range in the _to_ parameters.
    mapValueInRange: function(value, fromLow, fromHigh, toLow, toHigh) {
      var fromRangeSize = fromHigh - fromLow;
      var toRangeSize = toHigh - toLow;
      var valueScale = (value - fromLow) / fromRangeSize;
      return toLow + (valueScale * toRangeSize);
    },

    // Interpolate two hex colors in a 0 - 1 range or optionally provide a custom range
    // with fromLow,fromHight. The output will be in hex by default unless asRGB is true
    // in which case it will be returned as an rgb string.
    interpolateColor: function(val, startColor, endColor, fromLow, fromHigh, asRGB) {
      fromLow = typeof fromLow === 'undefined' ? 0 : fromLow;
      fromHigh = typeof fromHigh === 'undefined' ? 1 : fromHigh;
      var startColor = util.hexToRGB(startColor);
      var endColor = util.hexToRGB(endColor);
      var r = Math.floor(util.mapValueInRange(val, fromLow, fromHigh, startColor.r, endColor.r));
      var g = Math.floor(util.mapValueInRange(val, fromLow, fromHigh, startColor.g, endColor.g));
      var b = Math.floor(util.mapValueInRange(val, fromLow, fromHigh, startColor.b, endColor.b));
      if (asRGB) {
        return 'rgb(' + r + ',' + g + ',' + b + ')';
      } else {
        return util.rgbToHex(r, g, b);
      }
    },

    degreesToRadians: function(deg) {
      return (deg * Math.PI) / 180;
    },

    radiansToDegrees: function(rad) {
      return (rad * 180) / Math.PI;
    }

  }

  util.extend(util, MathUtil);


  // Utilities
  // ---------
  // Here are a few useful JavaScript utilities.

  // Lop off the first occurence of the reference in the Array.
  function removeFirst(array, item) {
    var idx = array.indexOf(item);
    idx != -1 && array.splice(idx, 1);
  }

  var _onFrame;
  if (typeof window !== 'undefined') {
    _onFrame = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame;
  }
  if (!_onFrame && typeof process !== 'undefined' && process.title === 'node') {
    _onFrame = setImmediate;
  }

  // Cross browser/node timer functions.
  util.onFrame = function onFrame(func) {
    return _onFrame(func);
  }

  // Export the public api using exports for common js or the window for
  // normal browser inclusion.
  if (typeof exports != 'undefined') {
    util.extend(exports, rebound);
  } else if (typeof window != 'undefined') {
    window.rebound = rebound;
  }
})();

// Legal Stuff
// -----------
/**
 *  Copyright (c) 2013, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

}).call(this,require("1YiZ5S"))
},{"1YiZ5S":1}],4:[function(require,module,exports){
function S () {
    if (!(this instanceof S)) {
        return new S();
    }
    this._events = {};
}
S.prototype.on = function (name, listener) {
    this._events[name] = this._events[name] || [];
    this._events[name].push(listener);
    return this;
};
S.prototype.trigger = function (name, data) {
    var i,
        j;
    if (this._events[name]) {
        i = 0;
        j = this._events[name].length;
        while (i < j) {
            this._events[name][i++](data);
        }
    }
};
module.exports = S;
},{}],5:[function(require,module,exports){
'use strict';

var style = document.createElement('p').style,
    prefixes = 'O ms Moz webkit'.split(' '),
    hasPrefix = /^(o|ms|moz|webkit)/,
    upper = /([A-Z])/g,
    memo = {};

function get(key){
    return (key in memo) ? memo[key] : memo[key] = prefix(key);
}

function prefix(key){
    var capitalizedKey = key.replace(/-([a-z])/g, function(s, match){
            return match.toUpperCase();
        }),
        i = prefixes.length,
        name;

    if (style[capitalizedKey] !== undefined) return capitalizedKey;

    capitalizedKey = capitalize(key);

    while (i--) {
        name = prefixes[i] + capitalizedKey;
        if (style[name] !== undefined) return name;
    }

    throw new Error('unable to prefix ' + key);
}

function capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function dashedPrefix(key){
    var prefixedKey = get(key),
        upper = /([A-Z])/g;

    if (upper.test(prefixedKey)) {
        prefixedKey = (hasPrefix.test(prefixedKey) ? '-' : '') + prefixedKey.replace(upper, '-$1');
    }

    return prefixedKey.toLowerCase();
}

module.exports = get;
module.exports.dash = dashedPrefix;

},{}],6:[function(require,module,exports){
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
},{"pan-drag":2,"rebound":3,"sister":4,"vendor-prefix":5}]},{},[6])