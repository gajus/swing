/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _stack = __webpack_require__(1);
	
	var _stack2 = _interopRequireDefault(_stack);
	
	var _card = __webpack_require__(6);
	
	var _card2 = _interopRequireDefault(_card);
	
	global.gajus = global.gajus || {};
	
	global.gajus.Swing = {
	    Stack: _stack2['default'],
	    Card: _card2['default']
	};
	
	exports.Stack = _stack2['default'];
	exports.Card = _card2['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _sister = __webpack_require__(2);
	
	var _sister2 = _interopRequireDefault(_sister);
	
	var _rebound = __webpack_require__(3);
	
	var _rebound2 = _interopRequireDefault(_rebound);
	
	var _card = __webpack_require__(6);
	
	var _card2 = _interopRequireDefault(_card);
	
	var _util = __webpack_require__(10);
	
	var _util2 = _interopRequireDefault(_util);
	
	var Stack = undefined;
	
	/**
	 * @param {Object} config
	 */
	Stack = function (config) {
	    var constructor = undefined,
	        stack = undefined,
	        springSystem = undefined,
	        eventEmitter = undefined,
	        index = undefined;
	
	    constructor = function () {
	        stack = {};
	        springSystem = new _rebound2['default'].SpringSystem();
	        eventEmitter = (0, _sister2['default'])();
	        index = [];
	    };
	
	    constructor();
	
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
	        var card = undefined,
	            events = undefined;
	
	        card = (0, _card2['default'])(stack, element);
	
	        events = ['throwout', 'throwoutend', 'throwoutleft', 'throwoutright', 'throwin', 'throwinend', 'dragstart', 'dragmove', 'dragend'];
	
	        // Proxy Card events to the Stack.
	        events.forEach(function (name) {
	            card.on(name, function (data) {
	                eventEmitter.trigger(name, data);
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
	     * @return {Card|undefined}
	     */
	    stack.getCard = function (element) {
	        return _util2['default'].find(index, {
	            element: element
	        });
	    };
	
	    /**
	     * Remove an instance of Card from the stack index.
	     *
	     * @param {Card} card
	     */
	    stack.destroyCard = function (card) {
	        return _util2['default'].remove(index, card);
	    };
	
	    return stack;
	};
	
	exports['default'] = Stack;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	* @link https://github.com/gajus/sister for the canonical source repository
	* @license https://github.com/gajus/sister/blob/master/LICENSE BSD 3-Clause
	*/
	function Sister () {
	    var sister = {},
	        events = {};
	
	    /**
	     * @name handler
	     * @function
	     * @param {Object} data Event data.
	     */
	
	    /**
	     * @param {String} name Event name.
	     * @param {handler} handler
	     * @return {listener}
	     */
	    sister.on = function (name, handler) {
	        var listener = {name: name, handler: handler};
	        events[name] = events[name] || [];
	        events[name].unshift(listener);
	        return listener;
	    };
	
	    /**
	     * @param {listener}
	     */
	    sister.off = function (listener) {
	        var index = events[listener.name].indexOf(listener);
	
	        if (index != -1) {
	            events[listener.name].splice(index, 1);
	        }
	    };
	
	    /**
	     * @param {String} name Event name.
	     * @param {Object} data Event data.
	     */
	    sister.trigger = function (name, data) {
	        var listeners = events[name],
	            i;
	
	        if (listeners) {
	            i = listeners.length;
	            while (i--) {
	                listeners[i].handler(data);
	            }
	        }
	    };
	
	    return sister;
	}
	
	global.gajus = global.gajus || {};
	global.gajus.Sister = Sister;
	
	module.exports = Sister;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, setImmediate) {// Rebound
	// =======
	// **Rebound** is a simple library that models Spring dynamics for the
	// purpose of driving physical animations.
	//
	// Origin
	// ------
	// [Rebound](http://facebook.github.io/rebound) was originally written
	// in Java to provide a lightweight physics system for
	// [Home](https://play.google.com/store/apps/details?id=com.facebook.home) and
	// [Chat Heads](https://play.google.com/store/apps/details?id=com.facebook.orca)
	// on Android. It's now been adopted by several other Android
	// applications. This JavaScript port was written to provide a quick
	// way to demonstrate Rebound animations on the web for a
	// [conference talk](https://www.youtube.com/watch?v=s5kNm-DgyjY). Since then
	// the JavaScript version has been used to build some really nice interfaces.
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
	//   <img
	//     src="http://facebook.github.io/rebound/images/rebound.png"
	//     id="logo"
	//   />
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
	    var args = slice.call(arguments, 2);
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
	      this.looper = looper;
	      looper.springSystem = this;
	    },
	
	    // Add a new spring to this SpringSystem. This Spring will now be solved for
	    // during the physics iteration loop. By default the spring will use the
	    // default Origami spring config with 40 tension and 7 friction, but you can
	    // also provide your own values here.
	    createSpring: function(tension, friction) {
	      var springConfig;
	      if (tension === undefined || friction === undefined) {
	        springConfig = SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG;
	      } else {
	        springConfig =
	          SpringConfig.fromOrigamiTensionAndFriction(tension, friction);
	      }
	      return this.createSpringWithConfig(springConfig);
	    },
	
	    // Add a spring with a specified bounciness and speed. To replicate Origami
	    // compositions based on PopAnimation patches, use this factory method to
	    // create matching springs.
	    createSpringWithBouncinessAndSpeed: function(bounciness, speed) {
	      var springConfig;
	      if (bounciness === undefined || speed === undefined) {
	        springConfig = SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG;
	      } else {
	        springConfig =
	          SpringConfig.fromBouncinessAndSpeed(bounciness, speed);
	      }
	      return this.createSpringWithConfig(springConfig);
	    },
	
	    // Add a spring with the provided SpringConfig.
	    createSpringWithConfig: function(springConfig) {
	      var spring = new Spring(this);
	      this.registerSpring(spring);
	      spring.setSpringConfig(springConfig);
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
	        listener = this.listeners[i];
	        listener.onBeforeIntegrate && listener.onBeforeIntegrate(this);
	      }
	
	      this.advance(currentTimeMillis, ellapsedMillis);
	      if (this._activeSprings.length === 0) {
	        this._isIdle = true;
	        this._lastTimeMillis = -1;
	      }
	
	      for (i = 0; i < len; i++) {
	        listener = this.listeners[i];
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
	  // spring from its rest point or `endValue` as defined by [Hooke's
	  // law](http://en.wikipedia.org/wiki/Hooke's_law). Springs also have
	  // configurable friction, which ensures that they do not oscillate
	  // infinitely. When a Spring is displaced by updating it's resting
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
	
	    // Get the absolute distance of the Spring from it's resting endValue
	    // position.
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
	        var onChange = listener.onSpringEndStateChange;
	        onChange && onChange(this);
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
	      var start = this._startValue;
	      var end = this._endValue;
	      return this._springConfig.tension > 0 &&
	       ((start < end && this.getCurrentValue() > end) ||
	       (start > end && this.getCurrentValue() < end));
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
	        aAcceleration =
	          (tension * (this._endValue - tempPosition)) - friction * velocity;
	
	        tempPosition = position + aVelocity * Spring.SOLVER_TIMESTEP_SEC * 0.5;
	        tempVelocity =
	          velocity + aAcceleration * Spring.SOLVER_TIMESTEP_SEC * 0.5;
	        bVelocity = tempVelocity;
	        bAcceleration =
	          (tension * (this._endValue - tempPosition)) - friction * tempVelocity;
	
	        tempPosition = position + bVelocity * Spring.SOLVER_TIMESTEP_SEC * 0.5;
	        tempVelocity =
	          velocity + bAcceleration * Spring.SOLVER_TIMESTEP_SEC * 0.5;
	        cVelocity = tempVelocity;
	        cAcceleration =
	          (tension * (this._endValue - tempPosition)) - friction * tempVelocity;
	
	        tempPosition = position + cVelocity * Spring.SOLVER_TIMESTEP_SEC * 0.5;
	        tempVelocity =
	          velocity + cAcceleration * Spring.SOLVER_TIMESTEP_SEC * 0.5;
	        dVelocity = tempVelocity;
	        dAcceleration =
	          (tension * (this._endValue - tempPosition)) - friction * tempVelocity;
	
	        dxdt =
	          1.0/6.0 * (aVelocity + 2.0 * (bVelocity + cVelocity) + dVelocity);
	        dvdt = 1.0/6.0 * (
	          aAcceleration + 2.0 * (bAcceleration + cAcceleration) + dAcceleration
	        );
	
	        position += dxdt * Spring.SOLVER_TIMESTEP_SEC;
	        velocity += dvdt * Spring.SOLVER_TIMESTEP_SEC;
	      }
	
	      this._tempState.position = tempPosition;
	      this._tempState.velocity = tempVelocity;
	
	      this._currentState.position = position;
	      this._currentState.velocity = velocity;
	
	      if (this._timeAccumulator > 0) {
	        this._interpolate(this._timeAccumulator / Spring.SOLVER_TIMESTEP_SEC);
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
	
	    // Check if the Spring is atRest meaning that it's currentValue and
	    // endValue are the same and that it has no velocity. The previously
	    // described thresholds for speed and displacement define the bounds
	    // of this equivalence check. If the Spring has 0 tension, then it will
	    // be considered at rest whenever its absolute velocity drops below the
	    // restSpeedThreshold.
	    isAtRest: function() {
	      return Math.abs(this._currentState.velocity) < this._restSpeedThreshold &&
	        (this.getDisplacementDistanceForState(this._currentState) <=
	          this._displacementFromRestThreshold ||
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
	
	    _interpolate: function(alpha) {
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
	  // **AnimationLooper** plays each frame of the SpringSystem on animation
	  // timing loop. This is the default type of looper for a new spring system
	  // as it is the most common when developing UI.
	  var AnimationLooper = rebound.AnimationLooper = function AnimationLooper() {
	    this.springSystem = null;
	    var _this = this;
	    var _run = function() {
	      _this.springSystem.loop(Date.now());
	    };
	
	    this.run = function() {
	      util.onFrame(_run);
	    };
	  };
	
	  // **SimulationLooper** resolves the SpringSystem to a resting state in a
	  // tight and blocking loop. This is useful for synchronously generating
	  // pre-recorded animations that can then be played on a timing loop later.
	  // Sometimes this lead to better performance to pre-record a single spring
	  // curve and use it to drive many animations; however, it can make dynamic
	  // response to user input a bit trickier to implement.
	  rebound.SimulationLooper = function SimulationLooper(timestep) {
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
	    };
	  };
	
	  // **SteppingSimulationLooper** resolves the SpringSystem one step at a
	  // time controlled by an outside loop. This is useful for testing and
	  // verifying the behavior of a SpringSystem or if you want to control your own
	  // timing loop for some reason e.g. slowing down or speeding up the
	  // simulation.
	  rebound.SteppingSimulationLooper = function(timestep) {
	    this.springSystem = null;
	    var time = 0;
	
	    // this.run is NOOP'd here to allow control from the outside using
	    // this.step.
	    this.run = function(){};
	
	    // Perform one step toward resolving the SpringSystem.
	    this.step = function(timestep) {
	      this.springSystem.loop(time+=timestep);
	    };
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
	
	  // BouncyConversion provides math for converting from Origami PopAnimation
	  // config values to regular Origami tension and friction values. If you are
	  // trying to replicate prototypes made with PopAnimation patches in Origami,
	  // then you should create your springs with
	  // SpringSystem.createSpringWithBouncinessAndSpeed, which uses this Math
	  // internally to create a spring to match the provided PopAnimation
	  // configuration from Origami.
	  var BouncyConversion = rebound.BouncyConversion = function(bounciness, speed){
	    this.bounciness = bounciness;
	    this.speed = speed;
	    var b = this.normalize(bounciness / 1.7, 0, 20.0);
	    b = this.projectNormal(b, 0.0, 0.8);
	    var s = this.normalize(speed / 1.7, 0, 20.0);
	    this.bouncyTension = this.projectNormal(s, 0.5, 200)
	    this.bouncyFriction = this.quadraticOutInterpolation(
	      b,
	      this.b3Nobounce(this.bouncyTension),
	      0.01);
	  }
	
	  util.extend(BouncyConversion.prototype, {
	
	    normalize: function(value, startValue, endValue) {
	      return (value - startValue) / (endValue - startValue);
	    },
	
	    projectNormal: function(n, start, end) {
	      return start + (n * (end - start));
	    },
	
	    linearInterpolation: function(t, start, end) {
	      return t * end + (1.0 - t) * start;
	    },
	
	    quadraticOutInterpolation: function(t, start, end) {
	      return this.linearInterpolation(2*t - t*t, start, end);
	    },
	
	    b3Friction1: function(x) {
	      return (0.0007 * Math.pow(x, 3)) -
	        (0.031 * Math.pow(x, 2)) + 0.64 * x + 1.28;
	    },
	
	    b3Friction2: function(x) {
	      return (0.000044 * Math.pow(x, 3)) -
	        (0.006 * Math.pow(x, 2)) + 0.36 * x + 2.;
	    },
	
	    b3Friction3: function(x) {
	      return (0.00000045 * Math.pow(x, 3)) -
	        (0.000332 * Math.pow(x, 2)) + 0.1078 * x + 5.84;
	    },
	
	    b3Nobounce: function(tension) {
	      var friction = 0;
	      if (tension <= 18) {
	        friction = this.b3Friction1(tension);
	      } else if (tension > 18 && tension <= 44) {
	        friction = this.b3Friction2(tension);
	      } else {
	        friction = this.b3Friction3(tension);
	      }
	      return friction;
	    }
	  });
	
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
	
	    // Convert an origami PopAnimation Spring bounciness and speed to Rebound
	    // spring constants. If you are using PopAnimation patches in Origami, this
	    // utility will provide springs that match your prototype.
	    fromBouncinessAndSpeed: function(bounciness, speed) {
	      var bouncyConversion = new rebound.BouncyConversion(bounciness, speed);
	      return this.fromOrigamiTensionAndFriction(
	        bouncyConversion.bouncyTension,
	        bouncyConversion.bouncyFriction);
	    },
	
	    // Create a SpringConfig with no tension or a coasting spring with some
	    // amount of Friction so that it does not coast infininitely.
	    coastingConfigWithOrigamiFriction: function(friction) {
	      return new SpringConfig(
	        0,
	        OrigamiValueConverter.frictionFromOrigamiValue(friction)
	      );
	    }
	  });
	
	  SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG =
	    SpringConfig.fromOrigamiTensionAndFriction(40, 7);
	
	  util.extend(SpringConfig.prototype, {friction: 0, tension: 0});
	
	  // Here are a couple of function to convert colors between hex codes and RGB
	  // component values. These are handy when performing color
	  // tweening animations.
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
	
	    var ret = {
	      r: parseInt(parts[0], 16),
	      g: parseInt(parts[1], 16),
	      b: parseInt(parts[2], 16)
	    };
	
	    colorCache[color] = ret;
	    return ret;
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
	
	    // Interpolate two hex colors in a 0 - 1 range or optionally provide a
	    // custom range with fromLow,fromHight. The output will be in hex by default
	    // unless asRGB is true in which case it will be returned as an rgb string.
	    interpolateColor:
	      function(val, startColor, endColor, fromLow, fromHigh, asRGB) {
	      fromLow = fromLow === undefined ? 0 : fromLow;
	      fromHigh = fromHigh === undefined ? 1 : fromHigh;
	      startColor = util.hexToRGB(startColor);
	      endColor = util.hexToRGB(endColor);
	      var r = Math.floor(
	        util.mapValueInRange(val, fromLow, fromHigh, startColor.r, endColor.r)
	      );
	      var g = Math.floor(
	        util.mapValueInRange(val, fromLow, fromHigh, startColor.g, endColor.g)
	      );
	      var b = Math.floor(
	        util.mapValueInRange(val, fromLow, fromHigh, startColor.b, endColor.b)
	      );
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
	      window.oRequestAnimationFrame ||
	      function(callback) {
	        window.setTimeout(callback, 1000 / 60);
	      };
	  }
	  if (!_onFrame && typeof process !== 'undefined' && process.title === 'node') {
	    _onFrame = setImmediate;
	  }
	
	  // Cross browser/node timer functions.
	  util.onFrame = function onFrame(func) {
	    return _onFrame(func);
	  };
	
	  // Export the public api using exports for common js or the window for
	  // normal browser inclusion.
	  if (true) {
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(5).setImmediate))

/***/ },
/* 4 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            currentQueue[queueIndex].run();
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
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
	};
	
	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(4).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;
	
	// DOM APIs, for completeness
	
	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };
	
	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};
	
	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};
	
	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};
	
	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);
	
	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};
	
	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);
	
	  immediateIds[id] = true;
	
	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });
	
	  return id;
	};
	
	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).setImmediate, __webpack_require__(5).clearImmediate))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _sister = __webpack_require__(2);
	
	var _sister2 = _interopRequireDefault(_sister);
	
	var _hammerjs = __webpack_require__(7);
	
	var _hammerjs2 = _interopRequireDefault(_hammerjs);
	
	var _rebound = __webpack_require__(3);
	
	var _rebound2 = _interopRequireDefault(_rebound);
	
	var _vendorPrefix = __webpack_require__(9);
	
	var _vendorPrefix2 = _interopRequireDefault(_vendorPrefix);
	
	var _utilJs = __webpack_require__(10);
	
	var _utilJs2 = _interopRequireDefault(_utilJs);
	
	var _raf = __webpack_require__(12);
	
	var _raf2 = _interopRequireDefault(_raf);
	
	var Card = undefined;
	
	/**
	 * @param {Stack} stack
	 * @param {HTMLElement} targetElement
	 */
	Card = function (stack, targetElement) {
	    var constructor = undefined,
	        card = undefined,
	        config = undefined,
	        eventEmitter = undefined,
	        springSystem = undefined,
	        springThrowIn = undefined,
	        springThrowOut = undefined,
	        lastThrow = undefined,
	        lastTranslate = undefined,
	        throwOutDistance = undefined,
	        _onSpringUpdate = undefined,
	        mc = undefined,
	        dragTimer = undefined,
	        isDraging = undefined,
	        currentX = undefined,
	        currentY = undefined,
	        doMove = undefined,
	        cancelMove = undefined,
	        throwWhere = undefined;
	
	    constructor = function () {
	        card = {};
	        config = Card.makeConfig(stack.getConfig());
	        eventEmitter = (0, _sister2['default'])();
	        springSystem = stack.getSpringSystem();
	        springThrowIn = springSystem.createSpring(250, 10);
	        springThrowOut = springSystem.createSpring(500, 20);
	        lastThrow = {};
	        lastTranslate = {
	            x: 0,
	            y: 0
	        };
	        isDraging = false;
	        currentX = 0;
	        currentY = 0;
	
	        springThrowIn.setRestSpeedThreshold(0.05);
	        springThrowIn.setRestDisplacementThreshold(0.05);
	
	        springThrowOut.setRestSpeedThreshold(0.05);
	        springThrowOut.setRestDisplacementThreshold(0.05);
	
	        throwOutDistance = config.throwOutDistance(config.minThrowOutDistance, config.maxThrowOutDistance);
	
	        mc = new _hammerjs2['default'].Manager(targetElement, {
	            recognizers: [[_hammerjs2['default'].Pan, {
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
	
	            cancelMove();
	
	            isDraging = true;
	
	            (function animation() {
	                if (!isDraging) {
	                    return;
	                }
	
	                doMove();
	
	                dragTimer = (0, _raf2['default'])(animation);
	            })();
	        });
	
	        eventEmitter.on('panmove', function (e) {
	            currentX = e.deltaX;
	            currentY = e.deltaY;
	        });
	
	        eventEmitter.on('panend', function (e) {
	            var x = undefined,
	                y = undefined;
	
	            isDraging = false;
	
	            cancelMove();
	
	            x = lastTranslate.x + e.deltaX;
	            y = lastTranslate.y + e.deltaY;
	
	            if (config.isThrowOut(x, targetElement, config.throwOutConfidence(x, targetElement))) {
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
	        if (_utilJs2['default'].isTouchDevice()) {
	            targetElement.addEventListener('touchstart', function () {
	                eventEmitter.trigger('panstart');
	            });
	
	            // Disable scrolling while dragging the element on the touch enabled devices.
	            // @see http://stackoverflow.com/a/12090055/368691
	            (function () {
	                var dragging = undefined;
	
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
	                var value = undefined,
	                    x = undefined,
	                    y = undefined;
	
	                value = spring.getCurrentValue();
	                x = _rebound2['default'].MathUtil.mapValueInRange(value, 0, 1, lastThrow.fromX, 0);
	                y = _rebound2['default'].MathUtil.mapValueInRange(value, 0, 1, lastThrow.fromY, 0);
	
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
	                var value = undefined,
	                    x = undefined,
	                    y = undefined;
	
	                value = spring.getCurrentValue();
	                x = _rebound2['default'].MathUtil.mapValueInRange(value, 0, 1, lastThrow.fromX, throwOutDistance * lastThrow.direction);
	                y = lastThrow.fromY;
	
	                _onSpringUpdate(x, y);
	            },
	            onSpringAtRest: function onSpringAtRest() {
	                eventEmitter.trigger('throwoutend', {
	                    target: targetElement
	                });
	            }
	        });
	
	        doMove = function () {
	            var x = undefined,
	                y = undefined,
	                r = undefined;
	
	            x = lastTranslate.x + currentX;
	            y = lastTranslate.y + currentY;
	            r = config.rotation(x, y, targetElement, config.maxRotation);
	
	            config.transform(targetElement, x, y, r);
	
	            eventEmitter.trigger('dragmove', {
	                target: targetElement,
	                throwOutConfidence: config.throwOutConfidence(x, targetElement),
	                throwDirection: x < 0 ? Card.DIRECTION_LEFT : Card.DIRECTION_RIGHT
	            });
	        };
	
	        cancelMove = function () {
	            dragTimer && _raf2['default'].cancel(dragTimer);
	        };
	
	        /**
	         * Invoked every time the physics solver updates the Spring's value.
	         *
	         * @param {Number} x
	         * @param {Number} y
	         */
	        _onSpringUpdate = function (x, y) {
	            var r = undefined;
	
	            r = config.rotation(x, y, targetElement, config.maxRotation);
	
	            lastTranslate.x = x || 0;
	            lastTranslate.y = y || 0;
	
	            Card.transform(targetElement, x, y, r);
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
	
	                if (lastThrow.direction === Card.DIRECTION_LEFT) {
	                    eventEmitter.trigger('throwoutleft', {
	                        target: targetElement,
	                        throwDirection: lastThrow.direction
	                    });
	                } else {
	                    eventEmitter.trigger('throwoutright', {
	                        target: targetElement,
	                        throwDirection: lastThrow.direction
	                    });
	                }
	            } else {
	                throw new Error('Invalid throw event.');
	            }
	        };
	    };
	
	    constructor();
	
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
	        cancelMove();
	
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
	Card.makeConfig = function (config) {
	    var defaultConfig = undefined;
	
	    config = config || {};
	
	    defaultConfig = {
	        isThrowOut: Card.isThrowOut,
	        throwOutConfidence: Card.throwOutConfidence,
	        throwOutDistance: Card.throwOutDistance,
	        minThrowOutDistance: 400,
	        maxThrowOutDistance: 500,
	        rotation: Card.rotation,
	        maxRotation: 20,
	        transform: Card.transform
	    };
	
	    return _utilJs2['default'].assign({}, defaultConfig, config);
	};
	
	/**
	 * Uses CSS transform to translate element position and rotation.
	 *
	 * Invoked in the event of `dragmove` and every time the physics solver is triggered.
	 *
	 * @param {Number} x Horizontal offset from the startDrag.
	 * @param {Number} y Vertical offset from the startDrag.
	 */
	Card.transform = function (element, x, y, r) {
	    element.style[(0, _vendorPrefix2['default'])('transform')] = 'translate3d(0, 0, 0) translate(' + x + 'px, ' + y + 'px) rotate(' + r + 'deg)';
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
	 */
	Card.appendToParent = function (element) {
	    var parent = undefined,
	        siblings = undefined,
	        targetIndex = undefined;
	
	    parent = element.parentNode;
	    siblings = _utilJs2['default'].elementChildren(parent);
	    targetIndex = siblings.indexOf(element);
	
	    if (targetIndex + 1 !== siblings.length) {
	        parent.removeChild(element);
	        parent.appendChild(element);
	    }
	};
	
	/**
	 * Returns a value between 0 and 1 indicating the completeness of the throw out condition.
	 *
	 * Ration of the absolute distance from the original card position and element width.
	 *
	 * @param {Number} offset Distance from the dragStart.
	 * @param {HTMLElement} element Element.
	 * @return {Number}
	 */
	Card.throwOutConfidence = function (offset, element) {
	    return Math.min(Math.abs(offset) / element.offsetWidth, 1);
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
	 * @return {Number}
	 */
	Card.throwOutDistance = function (min, max) {
	    return _utilJs2['default'].random(min, max);
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
	    var horizontalOffset = undefined,
	        verticalOffset = undefined,
	        rotation = undefined;
	
	    horizontalOffset = Math.min(Math.max(x / element.offsetWidth, -1), 1);
	    verticalOffset = (y > 0 ? 1 : -1) * Math.min(Math.abs(y) / 100, 1);
	    rotation = horizontalOffset * verticalOffset * maxRotation;
	
	    return rotation;
	};
	
	Card.DIRECTION_LEFT = -1;
	Card.DIRECTION_RIGHT = 1;
	
	Card.THROW_IN = 'in';
	Card.THROW_OUT = 'out';
	
	exports['default'] = Card;
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*! Hammer.JS - v2.0.4 - 2014-09-28
	 * http://hammerjs.github.io/
	 *
	 * Copyright (c) 2014 Jorik Tangelder;
	 * Licensed under the MIT license */
	(function(window, document, exportName, undefined) {
	  'use strict';
	
	var VENDOR_PREFIXES = ['', 'webkit', 'moz', 'MS', 'ms', 'o'];
	var TEST_ELEMENT = document.createElement('div');
	
	var TYPE_FUNCTION = 'function';
	
	var round = Math.round;
	var abs = Math.abs;
	var now = Date.now;
	
	/**
	 * set a timeout with a given scope
	 * @param {Function} fn
	 * @param {Number} timeout
	 * @param {Object} context
	 * @returns {number}
	 */
	function setTimeoutContext(fn, timeout, context) {
	    return setTimeout(bindFn(fn, context), timeout);
	}
	
	/**
	 * if the argument is an array, we want to execute the fn on each entry
	 * if it aint an array we don't want to do a thing.
	 * this is used by all the methods that accept a single and array argument.
	 * @param {*|Array} arg
	 * @param {String} fn
	 * @param {Object} [context]
	 * @returns {Boolean}
	 */
	function invokeArrayArg(arg, fn, context) {
	    if (Array.isArray(arg)) {
	        each(arg, context[fn], context);
	        return true;
	    }
	    return false;
	}
	
	/**
	 * walk objects and arrays
	 * @param {Object} obj
	 * @param {Function} iterator
	 * @param {Object} context
	 */
	function each(obj, iterator, context) {
	    var i;
	
	    if (!obj) {
	        return;
	    }
	
	    if (obj.forEach) {
	        obj.forEach(iterator, context);
	    } else if (obj.length !== undefined) {
	        i = 0;
	        while (i < obj.length) {
	            iterator.call(context, obj[i], i, obj);
	            i++;
	        }
	    } else {
	        for (i in obj) {
	            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
	        }
	    }
	}
	
	/**
	 * extend object.
	 * means that properties in dest will be overwritten by the ones in src.
	 * @param {Object} dest
	 * @param {Object} src
	 * @param {Boolean} [merge]
	 * @returns {Object} dest
	 */
	function extend(dest, src, merge) {
	    var keys = Object.keys(src);
	    var i = 0;
	    while (i < keys.length) {
	        if (!merge || (merge && dest[keys[i]] === undefined)) {
	            dest[keys[i]] = src[keys[i]];
	        }
	        i++;
	    }
	    return dest;
	}
	
	/**
	 * merge the values from src in the dest.
	 * means that properties that exist in dest will not be overwritten by src
	 * @param {Object} dest
	 * @param {Object} src
	 * @returns {Object} dest
	 */
	function merge(dest, src) {
	    return extend(dest, src, true);
	}
	
	/**
	 * simple class inheritance
	 * @param {Function} child
	 * @param {Function} base
	 * @param {Object} [properties]
	 */
	function inherit(child, base, properties) {
	    var baseP = base.prototype,
	        childP;
	
	    childP = child.prototype = Object.create(baseP);
	    childP.constructor = child;
	    childP._super = baseP;
	
	    if (properties) {
	        extend(childP, properties);
	    }
	}
	
	/**
	 * simple function bind
	 * @param {Function} fn
	 * @param {Object} context
	 * @returns {Function}
	 */
	function bindFn(fn, context) {
	    return function boundFn() {
	        return fn.apply(context, arguments);
	    };
	}
	
	/**
	 * let a boolean value also be a function that must return a boolean
	 * this first item in args will be used as the context
	 * @param {Boolean|Function} val
	 * @param {Array} [args]
	 * @returns {Boolean}
	 */
	function boolOrFn(val, args) {
	    if (typeof val == TYPE_FUNCTION) {
	        return val.apply(args ? args[0] || undefined : undefined, args);
	    }
	    return val;
	}
	
	/**
	 * use the val2 when val1 is undefined
	 * @param {*} val1
	 * @param {*} val2
	 * @returns {*}
	 */
	function ifUndefined(val1, val2) {
	    return (val1 === undefined) ? val2 : val1;
	}
	
	/**
	 * addEventListener with multiple events at once
	 * @param {EventTarget} target
	 * @param {String} types
	 * @param {Function} handler
	 */
	function addEventListeners(target, types, handler) {
	    each(splitStr(types), function(type) {
	        target.addEventListener(type, handler, false);
	    });
	}
	
	/**
	 * removeEventListener with multiple events at once
	 * @param {EventTarget} target
	 * @param {String} types
	 * @param {Function} handler
	 */
	function removeEventListeners(target, types, handler) {
	    each(splitStr(types), function(type) {
	        target.removeEventListener(type, handler, false);
	    });
	}
	
	/**
	 * find if a node is in the given parent
	 * @method hasParent
	 * @param {HTMLElement} node
	 * @param {HTMLElement} parent
	 * @return {Boolean} found
	 */
	function hasParent(node, parent) {
	    while (node) {
	        if (node == parent) {
	            return true;
	        }
	        node = node.parentNode;
	    }
	    return false;
	}
	
	/**
	 * small indexOf wrapper
	 * @param {String} str
	 * @param {String} find
	 * @returns {Boolean} found
	 */
	function inStr(str, find) {
	    return str.indexOf(find) > -1;
	}
	
	/**
	 * split string on whitespace
	 * @param {String} str
	 * @returns {Array} words
	 */
	function splitStr(str) {
	    return str.trim().split(/\s+/g);
	}
	
	/**
	 * find if a array contains the object using indexOf or a simple polyFill
	 * @param {Array} src
	 * @param {String} find
	 * @param {String} [findByKey]
	 * @return {Boolean|Number} false when not found, or the index
	 */
	function inArray(src, find, findByKey) {
	    if (src.indexOf && !findByKey) {
	        return src.indexOf(find);
	    } else {
	        var i = 0;
	        while (i < src.length) {
	            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
	                return i;
	            }
	            i++;
	        }
	        return -1;
	    }
	}
	
	/**
	 * convert array-like objects to real arrays
	 * @param {Object} obj
	 * @returns {Array}
	 */
	function toArray(obj) {
	    return Array.prototype.slice.call(obj, 0);
	}
	
	/**
	 * unique array with objects based on a key (like 'id') or just by the array's value
	 * @param {Array} src [{id:1},{id:2},{id:1}]
	 * @param {String} [key]
	 * @param {Boolean} [sort=False]
	 * @returns {Array} [{id:1},{id:2}]
	 */
	function uniqueArray(src, key, sort) {
	    var results = [];
	    var values = [];
	    var i = 0;
	
	    while (i < src.length) {
	        var val = key ? src[i][key] : src[i];
	        if (inArray(values, val) < 0) {
	            results.push(src[i]);
	        }
	        values[i] = val;
	        i++;
	    }
	
	    if (sort) {
	        if (!key) {
	            results = results.sort();
	        } else {
	            results = results.sort(function sortUniqueArray(a, b) {
	                return a[key] > b[key];
	            });
	        }
	    }
	
	    return results;
	}
	
	/**
	 * get the prefixed property
	 * @param {Object} obj
	 * @param {String} property
	 * @returns {String|Undefined} prefixed
	 */
	function prefixed(obj, property) {
	    var prefix, prop;
	    var camelProp = property[0].toUpperCase() + property.slice(1);
	
	    var i = 0;
	    while (i < VENDOR_PREFIXES.length) {
	        prefix = VENDOR_PREFIXES[i];
	        prop = (prefix) ? prefix + camelProp : property;
	
	        if (prop in obj) {
	            return prop;
	        }
	        i++;
	    }
	    return undefined;
	}
	
	/**
	 * get a unique id
	 * @returns {number} uniqueId
	 */
	var _uniqueId = 1;
	function uniqueId() {
	    return _uniqueId++;
	}
	
	/**
	 * get the window object of an element
	 * @param {HTMLElement} element
	 * @returns {DocumentView|Window}
	 */
	function getWindowForElement(element) {
	    var doc = element.ownerDocument;
	    return (doc.defaultView || doc.parentWindow);
	}
	
	var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
	
	var SUPPORT_TOUCH = ('ontouchstart' in window);
	var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
	var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);
	
	var INPUT_TYPE_TOUCH = 'touch';
	var INPUT_TYPE_PEN = 'pen';
	var INPUT_TYPE_MOUSE = 'mouse';
	var INPUT_TYPE_KINECT = 'kinect';
	
	var COMPUTE_INTERVAL = 25;
	
	var INPUT_START = 1;
	var INPUT_MOVE = 2;
	var INPUT_END = 4;
	var INPUT_CANCEL = 8;
	
	var DIRECTION_NONE = 1;
	var DIRECTION_LEFT = 2;
	var DIRECTION_RIGHT = 4;
	var DIRECTION_UP = 8;
	var DIRECTION_DOWN = 16;
	
	var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
	var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
	var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;
	
	var PROPS_XY = ['x', 'y'];
	var PROPS_CLIENT_XY = ['clientX', 'clientY'];
	
	/**
	 * create new input type manager
	 * @param {Manager} manager
	 * @param {Function} callback
	 * @returns {Input}
	 * @constructor
	 */
	function Input(manager, callback) {
	    var self = this;
	    this.manager = manager;
	    this.callback = callback;
	    this.element = manager.element;
	    this.target = manager.options.inputTarget;
	
	    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
	    // so when disabled the input events are completely bypassed.
	    this.domHandler = function(ev) {
	        if (boolOrFn(manager.options.enable, [manager])) {
	            self.handler(ev);
	        }
	    };
	
	    this.init();
	
	}
	
	Input.prototype = {
	    /**
	     * should handle the inputEvent data and trigger the callback
	     * @virtual
	     */
	    handler: function() { },
	
	    /**
	     * bind the events
	     */
	    init: function() {
	        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
	        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
	        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
	    },
	
	    /**
	     * unbind the events
	     */
	    destroy: function() {
	        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
	        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
	        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
	    }
	};
	
	/**
	 * create new input type manager
	 * called by the Manager constructor
	 * @param {Hammer} manager
	 * @returns {Input}
	 */
	function createInputInstance(manager) {
	    var Type;
	    var inputClass = manager.options.inputClass;
	
	    if (inputClass) {
	        Type = inputClass;
	    } else if (SUPPORT_POINTER_EVENTS) {
	        Type = PointerEventInput;
	    } else if (SUPPORT_ONLY_TOUCH) {
	        Type = TouchInput;
	    } else if (!SUPPORT_TOUCH) {
	        Type = MouseInput;
	    } else {
	        Type = TouchMouseInput;
	    }
	    return new (Type)(manager, inputHandler);
	}
	
	/**
	 * handle input events
	 * @param {Manager} manager
	 * @param {String} eventType
	 * @param {Object} input
	 */
	function inputHandler(manager, eventType, input) {
	    var pointersLen = input.pointers.length;
	    var changedPointersLen = input.changedPointers.length;
	    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
	    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));
	
	    input.isFirst = !!isFirst;
	    input.isFinal = !!isFinal;
	
	    if (isFirst) {
	        manager.session = {};
	    }
	
	    // source event is the normalized value of the domEvents
	    // like 'touchstart, mouseup, pointerdown'
	    input.eventType = eventType;
	
	    // compute scale, rotation etc
	    computeInputData(manager, input);
	
	    // emit secret event
	    manager.emit('hammer.input', input);
	
	    manager.recognize(input);
	    manager.session.prevInput = input;
	}
	
	/**
	 * extend the data with some usable properties like scale, rotate, velocity etc
	 * @param {Object} manager
	 * @param {Object} input
	 */
	function computeInputData(manager, input) {
	    var session = manager.session;
	    var pointers = input.pointers;
	    var pointersLength = pointers.length;
	
	    // store the first input to calculate the distance and direction
	    if (!session.firstInput) {
	        session.firstInput = simpleCloneInputData(input);
	    }
	
	    // to compute scale and rotation we need to store the multiple touches
	    if (pointersLength > 1 && !session.firstMultiple) {
	        session.firstMultiple = simpleCloneInputData(input);
	    } else if (pointersLength === 1) {
	        session.firstMultiple = false;
	    }
	
	    var firstInput = session.firstInput;
	    var firstMultiple = session.firstMultiple;
	    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;
	
	    var center = input.center = getCenter(pointers);
	    input.timeStamp = now();
	    input.deltaTime = input.timeStamp - firstInput.timeStamp;
	
	    input.angle = getAngle(offsetCenter, center);
	    input.distance = getDistance(offsetCenter, center);
	
	    computeDeltaXY(session, input);
	    input.offsetDirection = getDirection(input.deltaX, input.deltaY);
	
	    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
	    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;
	
	    computeIntervalInputData(session, input);
	
	    // find the correct target
	    var target = manager.element;
	    if (hasParent(input.srcEvent.target, target)) {
	        target = input.srcEvent.target;
	    }
	    input.target = target;
	}
	
	function computeDeltaXY(session, input) {
	    var center = input.center;
	    var offset = session.offsetDelta || {};
	    var prevDelta = session.prevDelta || {};
	    var prevInput = session.prevInput || {};
	
	    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
	        prevDelta = session.prevDelta = {
	            x: prevInput.deltaX || 0,
	            y: prevInput.deltaY || 0
	        };
	
	        offset = session.offsetDelta = {
	            x: center.x,
	            y: center.y
	        };
	    }
	
	    input.deltaX = prevDelta.x + (center.x - offset.x);
	    input.deltaY = prevDelta.y + (center.y - offset.y);
	}
	
	/**
	 * velocity is calculated every x ms
	 * @param {Object} session
	 * @param {Object} input
	 */
	function computeIntervalInputData(session, input) {
	    var last = session.lastInterval || input,
	        deltaTime = input.timeStamp - last.timeStamp,
	        velocity, velocityX, velocityY, direction;
	
	    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
	        var deltaX = last.deltaX - input.deltaX;
	        var deltaY = last.deltaY - input.deltaY;
	
	        var v = getVelocity(deltaTime, deltaX, deltaY);
	        velocityX = v.x;
	        velocityY = v.y;
	        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
	        direction = getDirection(deltaX, deltaY);
	
	        session.lastInterval = input;
	    } else {
	        // use latest velocity info if it doesn't overtake a minimum period
	        velocity = last.velocity;
	        velocityX = last.velocityX;
	        velocityY = last.velocityY;
	        direction = last.direction;
	    }
	
	    input.velocity = velocity;
	    input.velocityX = velocityX;
	    input.velocityY = velocityY;
	    input.direction = direction;
	}
	
	/**
	 * create a simple clone from the input used for storage of firstInput and firstMultiple
	 * @param {Object} input
	 * @returns {Object} clonedInputData
	 */
	function simpleCloneInputData(input) {
	    // make a simple copy of the pointers because we will get a reference if we don't
	    // we only need clientXY for the calculations
	    var pointers = [];
	    var i = 0;
	    while (i < input.pointers.length) {
	        pointers[i] = {
	            clientX: round(input.pointers[i].clientX),
	            clientY: round(input.pointers[i].clientY)
	        };
	        i++;
	    }
	
	    return {
	        timeStamp: now(),
	        pointers: pointers,
	        center: getCenter(pointers),
	        deltaX: input.deltaX,
	        deltaY: input.deltaY
	    };
	}
	
	/**
	 * get the center of all the pointers
	 * @param {Array} pointers
	 * @return {Object} center contains `x` and `y` properties
	 */
	function getCenter(pointers) {
	    var pointersLength = pointers.length;
	
	    // no need to loop when only one touch
	    if (pointersLength === 1) {
	        return {
	            x: round(pointers[0].clientX),
	            y: round(pointers[0].clientY)
	        };
	    }
	
	    var x = 0, y = 0, i = 0;
	    while (i < pointersLength) {
	        x += pointers[i].clientX;
	        y += pointers[i].clientY;
	        i++;
	    }
	
	    return {
	        x: round(x / pointersLength),
	        y: round(y / pointersLength)
	    };
	}
	
	/**
	 * calculate the velocity between two points. unit is in px per ms.
	 * @param {Number} deltaTime
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Object} velocity `x` and `y`
	 */
	function getVelocity(deltaTime, x, y) {
	    return {
	        x: x / deltaTime || 0,
	        y: y / deltaTime || 0
	    };
	}
	
	/**
	 * get the direction between two points
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Number} direction
	 */
	function getDirection(x, y) {
	    if (x === y) {
	        return DIRECTION_NONE;
	    }
	
	    if (abs(x) >= abs(y)) {
	        return x > 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
	    }
	    return y > 0 ? DIRECTION_UP : DIRECTION_DOWN;
	}
	
	/**
	 * calculate the absolute distance between two points
	 * @param {Object} p1 {x, y}
	 * @param {Object} p2 {x, y}
	 * @param {Array} [props] containing x and y keys
	 * @return {Number} distance
	 */
	function getDistance(p1, p2, props) {
	    if (!props) {
	        props = PROPS_XY;
	    }
	    var x = p2[props[0]] - p1[props[0]],
	        y = p2[props[1]] - p1[props[1]];
	
	    return Math.sqrt((x * x) + (y * y));
	}
	
	/**
	 * calculate the angle between two coordinates
	 * @param {Object} p1
	 * @param {Object} p2
	 * @param {Array} [props] containing x and y keys
	 * @return {Number} angle
	 */
	function getAngle(p1, p2, props) {
	    if (!props) {
	        props = PROPS_XY;
	    }
	    var x = p2[props[0]] - p1[props[0]],
	        y = p2[props[1]] - p1[props[1]];
	    return Math.atan2(y, x) * 180 / Math.PI;
	}
	
	/**
	 * calculate the rotation degrees between two pointersets
	 * @param {Array} start array of pointers
	 * @param {Array} end array of pointers
	 * @return {Number} rotation
	 */
	function getRotation(start, end) {
	    return getAngle(end[1], end[0], PROPS_CLIENT_XY) - getAngle(start[1], start[0], PROPS_CLIENT_XY);
	}
	
	/**
	 * calculate the scale factor between two pointersets
	 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
	 * @param {Array} start array of pointers
	 * @param {Array} end array of pointers
	 * @return {Number} scale
	 */
	function getScale(start, end) {
	    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
	}
	
	var MOUSE_INPUT_MAP = {
	    mousedown: INPUT_START,
	    mousemove: INPUT_MOVE,
	    mouseup: INPUT_END
	};
	
	var MOUSE_ELEMENT_EVENTS = 'mousedown';
	var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';
	
	/**
	 * Mouse events input
	 * @constructor
	 * @extends Input
	 */
	function MouseInput() {
	    this.evEl = MOUSE_ELEMENT_EVENTS;
	    this.evWin = MOUSE_WINDOW_EVENTS;
	
	    this.allow = true; // used by Input.TouchMouse to disable mouse events
	    this.pressed = false; // mousedown state
	
	    Input.apply(this, arguments);
	}
	
	inherit(MouseInput, Input, {
	    /**
	     * handle mouse events
	     * @param {Object} ev
	     */
	    handler: function MEhandler(ev) {
	        var eventType = MOUSE_INPUT_MAP[ev.type];
	
	        // on start we want to have the left mouse button down
	        if (eventType & INPUT_START && ev.button === 0) {
	            this.pressed = true;
	        }
	
	        if (eventType & INPUT_MOVE && ev.which !== 1) {
	            eventType = INPUT_END;
	        }
	
	        // mouse must be down, and mouse events are allowed (see the TouchMouse input)
	        if (!this.pressed || !this.allow) {
	            return;
	        }
	
	        if (eventType & INPUT_END) {
	            this.pressed = false;
	        }
	
	        this.callback(this.manager, eventType, {
	            pointers: [ev],
	            changedPointers: [ev],
	            pointerType: INPUT_TYPE_MOUSE,
	            srcEvent: ev
	        });
	    }
	});
	
	var POINTER_INPUT_MAP = {
	    pointerdown: INPUT_START,
	    pointermove: INPUT_MOVE,
	    pointerup: INPUT_END,
	    pointercancel: INPUT_CANCEL,
	    pointerout: INPUT_CANCEL
	};
	
	// in IE10 the pointer types is defined as an enum
	var IE10_POINTER_TYPE_ENUM = {
	    2: INPUT_TYPE_TOUCH,
	    3: INPUT_TYPE_PEN,
	    4: INPUT_TYPE_MOUSE,
	    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
	};
	
	var POINTER_ELEMENT_EVENTS = 'pointerdown';
	var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';
	
	// IE10 has prefixed support, and case-sensitive
	if (window.MSPointerEvent) {
	    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
	    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
	}
	
	/**
	 * Pointer events input
	 * @constructor
	 * @extends Input
	 */
	function PointerEventInput() {
	    this.evEl = POINTER_ELEMENT_EVENTS;
	    this.evWin = POINTER_WINDOW_EVENTS;
	
	    Input.apply(this, arguments);
	
	    this.store = (this.manager.session.pointerEvents = []);
	}
	
	inherit(PointerEventInput, Input, {
	    /**
	     * handle mouse events
	     * @param {Object} ev
	     */
	    handler: function PEhandler(ev) {
	        var store = this.store;
	        var removePointer = false;
	
	        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
	        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
	        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;
	
	        var isTouch = (pointerType == INPUT_TYPE_TOUCH);
	
	        // get index of the event in the store
	        var storeIndex = inArray(store, ev.pointerId, 'pointerId');
	
	        // start and mouse must be down
	        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
	            if (storeIndex < 0) {
	                store.push(ev);
	                storeIndex = store.length - 1;
	            }
	        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
	            removePointer = true;
	        }
	
	        // it not found, so the pointer hasn't been down (so it's probably a hover)
	        if (storeIndex < 0) {
	            return;
	        }
	
	        // update the event in the store
	        store[storeIndex] = ev;
	
	        this.callback(this.manager, eventType, {
	            pointers: store,
	            changedPointers: [ev],
	            pointerType: pointerType,
	            srcEvent: ev
	        });
	
	        if (removePointer) {
	            // remove from the store
	            store.splice(storeIndex, 1);
	        }
	    }
	});
	
	var SINGLE_TOUCH_INPUT_MAP = {
	    touchstart: INPUT_START,
	    touchmove: INPUT_MOVE,
	    touchend: INPUT_END,
	    touchcancel: INPUT_CANCEL
	};
	
	var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
	var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';
	
	/**
	 * Touch events input
	 * @constructor
	 * @extends Input
	 */
	function SingleTouchInput() {
	    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
	    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
	    this.started = false;
	
	    Input.apply(this, arguments);
	}
	
	inherit(SingleTouchInput, Input, {
	    handler: function TEhandler(ev) {
	        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];
	
	        // should we handle the touch events?
	        if (type === INPUT_START) {
	            this.started = true;
	        }
	
	        if (!this.started) {
	            return;
	        }
	
	        var touches = normalizeSingleTouches.call(this, ev, type);
	
	        // when done, reset the started state
	        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
	            this.started = false;
	        }
	
	        this.callback(this.manager, type, {
	            pointers: touches[0],
	            changedPointers: touches[1],
	            pointerType: INPUT_TYPE_TOUCH,
	            srcEvent: ev
	        });
	    }
	});
	
	/**
	 * @this {TouchInput}
	 * @param {Object} ev
	 * @param {Number} type flag
	 * @returns {undefined|Array} [all, changed]
	 */
	function normalizeSingleTouches(ev, type) {
	    var all = toArray(ev.touches);
	    var changed = toArray(ev.changedTouches);
	
	    if (type & (INPUT_END | INPUT_CANCEL)) {
	        all = uniqueArray(all.concat(changed), 'identifier', true);
	    }
	
	    return [all, changed];
	}
	
	var TOUCH_INPUT_MAP = {
	    touchstart: INPUT_START,
	    touchmove: INPUT_MOVE,
	    touchend: INPUT_END,
	    touchcancel: INPUT_CANCEL
	};
	
	var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';
	
	/**
	 * Multi-user touch events input
	 * @constructor
	 * @extends Input
	 */
	function TouchInput() {
	    this.evTarget = TOUCH_TARGET_EVENTS;
	    this.targetIds = {};
	
	    Input.apply(this, arguments);
	}
	
	inherit(TouchInput, Input, {
	    handler: function MTEhandler(ev) {
	        var type = TOUCH_INPUT_MAP[ev.type];
	        var touches = getTouches.call(this, ev, type);
	        if (!touches) {
	            return;
	        }
	
	        this.callback(this.manager, type, {
	            pointers: touches[0],
	            changedPointers: touches[1],
	            pointerType: INPUT_TYPE_TOUCH,
	            srcEvent: ev
	        });
	    }
	});
	
	/**
	 * @this {TouchInput}
	 * @param {Object} ev
	 * @param {Number} type flag
	 * @returns {undefined|Array} [all, changed]
	 */
	function getTouches(ev, type) {
	    var allTouches = toArray(ev.touches);
	    var targetIds = this.targetIds;
	
	    // when there is only one touch, the process can be simplified
	    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
	        targetIds[allTouches[0].identifier] = true;
	        return [allTouches, allTouches];
	    }
	
	    var i,
	        targetTouches,
	        changedTouches = toArray(ev.changedTouches),
	        changedTargetTouches = [],
	        target = this.target;
	
	    // get target touches from touches
	    targetTouches = allTouches.filter(function(touch) {
	        return hasParent(touch.target, target);
	    });
	
	    // collect touches
	    if (type === INPUT_START) {
	        i = 0;
	        while (i < targetTouches.length) {
	            targetIds[targetTouches[i].identifier] = true;
	            i++;
	        }
	    }
	
	    // filter changed touches to only contain touches that exist in the collected target ids
	    i = 0;
	    while (i < changedTouches.length) {
	        if (targetIds[changedTouches[i].identifier]) {
	            changedTargetTouches.push(changedTouches[i]);
	        }
	
	        // cleanup removed touches
	        if (type & (INPUT_END | INPUT_CANCEL)) {
	            delete targetIds[changedTouches[i].identifier];
	        }
	        i++;
	    }
	
	    if (!changedTargetTouches.length) {
	        return;
	    }
	
	    return [
	        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
	        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
	        changedTargetTouches
	    ];
	}
	
	/**
	 * Combined touch and mouse input
	 *
	 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
	 * This because touch devices also emit mouse events while doing a touch.
	 *
	 * @constructor
	 * @extends Input
	 */
	function TouchMouseInput() {
	    Input.apply(this, arguments);
	
	    var handler = bindFn(this.handler, this);
	    this.touch = new TouchInput(this.manager, handler);
	    this.mouse = new MouseInput(this.manager, handler);
	}
	
	inherit(TouchMouseInput, Input, {
	    /**
	     * handle mouse and touch events
	     * @param {Hammer} manager
	     * @param {String} inputEvent
	     * @param {Object} inputData
	     */
	    handler: function TMEhandler(manager, inputEvent, inputData) {
	        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
	            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);
	
	        // when we're in a touch event, so  block all upcoming mouse events
	        // most mobile browser also emit mouseevents, right after touchstart
	        if (isTouch) {
	            this.mouse.allow = false;
	        } else if (isMouse && !this.mouse.allow) {
	            return;
	        }
	
	        // reset the allowMouse when we're done
	        if (inputEvent & (INPUT_END | INPUT_CANCEL)) {
	            this.mouse.allow = true;
	        }
	
	        this.callback(manager, inputEvent, inputData);
	    },
	
	    /**
	     * remove the event listeners
	     */
	    destroy: function destroy() {
	        this.touch.destroy();
	        this.mouse.destroy();
	    }
	});
	
	var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
	var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;
	
	// magical touchAction value
	var TOUCH_ACTION_COMPUTE = 'compute';
	var TOUCH_ACTION_AUTO = 'auto';
	var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
	var TOUCH_ACTION_NONE = 'none';
	var TOUCH_ACTION_PAN_X = 'pan-x';
	var TOUCH_ACTION_PAN_Y = 'pan-y';
	
	/**
	 * Touch Action
	 * sets the touchAction property or uses the js alternative
	 * @param {Manager} manager
	 * @param {String} value
	 * @constructor
	 */
	function TouchAction(manager, value) {
	    this.manager = manager;
	    this.set(value);
	}
	
	TouchAction.prototype = {
	    /**
	     * set the touchAction value on the element or enable the polyfill
	     * @param {String} value
	     */
	    set: function(value) {
	        // find out the touch-action by the event handlers
	        if (value == TOUCH_ACTION_COMPUTE) {
	            value = this.compute();
	        }
	
	        if (NATIVE_TOUCH_ACTION) {
	            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
	        }
	        this.actions = value.toLowerCase().trim();
	    },
	
	    /**
	     * just re-set the touchAction value
	     */
	    update: function() {
	        this.set(this.manager.options.touchAction);
	    },
	
	    /**
	     * compute the value for the touchAction property based on the recognizer's settings
	     * @returns {String} value
	     */
	    compute: function() {
	        var actions = [];
	        each(this.manager.recognizers, function(recognizer) {
	            if (boolOrFn(recognizer.options.enable, [recognizer])) {
	                actions = actions.concat(recognizer.getTouchAction());
	            }
	        });
	        return cleanTouchActions(actions.join(' '));
	    },
	
	    /**
	     * this method is called on each input cycle and provides the preventing of the browser behavior
	     * @param {Object} input
	     */
	    preventDefaults: function(input) {
	        // not needed with native support for the touchAction property
	        if (NATIVE_TOUCH_ACTION) {
	            return;
	        }
	
	        var srcEvent = input.srcEvent;
	        var direction = input.offsetDirection;
	
	        // if the touch action did prevented once this session
	        if (this.manager.session.prevented) {
	            srcEvent.preventDefault();
	            return;
	        }
	
	        var actions = this.actions;
	        var hasNone = inStr(actions, TOUCH_ACTION_NONE);
	        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
	        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
	
	        if (hasNone ||
	            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
	            (hasPanX && direction & DIRECTION_VERTICAL)) {
	            return this.preventSrc(srcEvent);
	        }
	    },
	
	    /**
	     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
	     * @param {Object} srcEvent
	     */
	    preventSrc: function(srcEvent) {
	        this.manager.session.prevented = true;
	        srcEvent.preventDefault();
	    }
	};
	
	/**
	 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
	 * @param {String} actions
	 * @returns {*}
	 */
	function cleanTouchActions(actions) {
	    // none
	    if (inStr(actions, TOUCH_ACTION_NONE)) {
	        return TOUCH_ACTION_NONE;
	    }
	
	    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
	    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
	
	    // pan-x and pan-y can be combined
	    if (hasPanX && hasPanY) {
	        return TOUCH_ACTION_PAN_X + ' ' + TOUCH_ACTION_PAN_Y;
	    }
	
	    // pan-x OR pan-y
	    if (hasPanX || hasPanY) {
	        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
	    }
	
	    // manipulation
	    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
	        return TOUCH_ACTION_MANIPULATION;
	    }
	
	    return TOUCH_ACTION_AUTO;
	}
	
	/**
	 * Recognizer flow explained; *
	 * All recognizers have the initial state of POSSIBLE when a input session starts.
	 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
	 * Example session for mouse-input: mousedown -> mousemove -> mouseup
	 *
	 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
	 * which determines with state it should be.
	 *
	 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
	 * POSSIBLE to give it another change on the next cycle.
	 *
	 *               Possible
	 *                  |
	 *            +-----+---------------+
	 *            |                     |
	 *      +-----+-----+               |
	 *      |           |               |
	 *   Failed      Cancelled          |
	 *                          +-------+------+
	 *                          |              |
	 *                      Recognized       Began
	 *                                         |
	 *                                      Changed
	 *                                         |
	 *                                  Ended/Recognized
	 */
	var STATE_POSSIBLE = 1;
	var STATE_BEGAN = 2;
	var STATE_CHANGED = 4;
	var STATE_ENDED = 8;
	var STATE_RECOGNIZED = STATE_ENDED;
	var STATE_CANCELLED = 16;
	var STATE_FAILED = 32;
	
	/**
	 * Recognizer
	 * Every recognizer needs to extend from this class.
	 * @constructor
	 * @param {Object} options
	 */
	function Recognizer(options) {
	    this.id = uniqueId();
	
	    this.manager = null;
	    this.options = merge(options || {}, this.defaults);
	
	    // default is enable true
	    this.options.enable = ifUndefined(this.options.enable, true);
	
	    this.state = STATE_POSSIBLE;
	
	    this.simultaneous = {};
	    this.requireFail = [];
	}
	
	Recognizer.prototype = {
	    /**
	     * @virtual
	     * @type {Object}
	     */
	    defaults: {},
	
	    /**
	     * set options
	     * @param {Object} options
	     * @return {Recognizer}
	     */
	    set: function(options) {
	        extend(this.options, options);
	
	        // also update the touchAction, in case something changed about the directions/enabled state
	        this.manager && this.manager.touchAction.update();
	        return this;
	    },
	
	    /**
	     * recognize simultaneous with an other recognizer.
	     * @param {Recognizer} otherRecognizer
	     * @returns {Recognizer} this
	     */
	    recognizeWith: function(otherRecognizer) {
	        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
	            return this;
	        }
	
	        var simultaneous = this.simultaneous;
	        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	        if (!simultaneous[otherRecognizer.id]) {
	            simultaneous[otherRecognizer.id] = otherRecognizer;
	            otherRecognizer.recognizeWith(this);
	        }
	        return this;
	    },
	
	    /**
	     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
	     * @param {Recognizer} otherRecognizer
	     * @returns {Recognizer} this
	     */
	    dropRecognizeWith: function(otherRecognizer) {
	        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
	            return this;
	        }
	
	        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	        delete this.simultaneous[otherRecognizer.id];
	        return this;
	    },
	
	    /**
	     * recognizer can only run when an other is failing
	     * @param {Recognizer} otherRecognizer
	     * @returns {Recognizer} this
	     */
	    requireFailure: function(otherRecognizer) {
	        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
	            return this;
	        }
	
	        var requireFail = this.requireFail;
	        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	        if (inArray(requireFail, otherRecognizer) === -1) {
	            requireFail.push(otherRecognizer);
	            otherRecognizer.requireFailure(this);
	        }
	        return this;
	    },
	
	    /**
	     * drop the requireFailure link. it does not remove the link on the other recognizer.
	     * @param {Recognizer} otherRecognizer
	     * @returns {Recognizer} this
	     */
	    dropRequireFailure: function(otherRecognizer) {
	        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
	            return this;
	        }
	
	        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	        var index = inArray(this.requireFail, otherRecognizer);
	        if (index > -1) {
	            this.requireFail.splice(index, 1);
	        }
	        return this;
	    },
	
	    /**
	     * has require failures boolean
	     * @returns {boolean}
	     */
	    hasRequireFailures: function() {
	        return this.requireFail.length > 0;
	    },
	
	    /**
	     * if the recognizer can recognize simultaneous with an other recognizer
	     * @param {Recognizer} otherRecognizer
	     * @returns {Boolean}
	     */
	    canRecognizeWith: function(otherRecognizer) {
	        return !!this.simultaneous[otherRecognizer.id];
	    },
	
	    /**
	     * You should use `tryEmit` instead of `emit` directly to check
	     * that all the needed recognizers has failed before emitting.
	     * @param {Object} input
	     */
	    emit: function(input) {
	        var self = this;
	        var state = this.state;
	
	        function emit(withState) {
	            self.manager.emit(self.options.event + (withState ? stateStr(state) : ''), input);
	        }
	
	        // 'panstart' and 'panmove'
	        if (state < STATE_ENDED) {
	            emit(true);
	        }
	
	        emit(); // simple 'eventName' events
	
	        // panend and pancancel
	        if (state >= STATE_ENDED) {
	            emit(true);
	        }
	    },
	
	    /**
	     * Check that all the require failure recognizers has failed,
	     * if true, it emits a gesture event,
	     * otherwise, setup the state to FAILED.
	     * @param {Object} input
	     */
	    tryEmit: function(input) {
	        if (this.canEmit()) {
	            return this.emit(input);
	        }
	        // it's failing anyway
	        this.state = STATE_FAILED;
	    },
	
	    /**
	     * can we emit?
	     * @returns {boolean}
	     */
	    canEmit: function() {
	        var i = 0;
	        while (i < this.requireFail.length) {
	            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
	                return false;
	            }
	            i++;
	        }
	        return true;
	    },
	
	    /**
	     * update the recognizer
	     * @param {Object} inputData
	     */
	    recognize: function(inputData) {
	        // make a new copy of the inputData
	        // so we can change the inputData without messing up the other recognizers
	        var inputDataClone = extend({}, inputData);
	
	        // is is enabled and allow recognizing?
	        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
	            this.reset();
	            this.state = STATE_FAILED;
	            return;
	        }
	
	        // reset when we've reached the end
	        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
	            this.state = STATE_POSSIBLE;
	        }
	
	        this.state = this.process(inputDataClone);
	
	        // the recognizer has recognized a gesture
	        // so trigger an event
	        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
	            this.tryEmit(inputDataClone);
	        }
	    },
	
	    /**
	     * return the state of the recognizer
	     * the actual recognizing happens in this method
	     * @virtual
	     * @param {Object} inputData
	     * @returns {Const} STATE
	     */
	    process: function(inputData) { }, // jshint ignore:line
	
	    /**
	     * return the preferred touch-action
	     * @virtual
	     * @returns {Array}
	     */
	    getTouchAction: function() { },
	
	    /**
	     * called when the gesture isn't allowed to recognize
	     * like when another is being recognized or it is disabled
	     * @virtual
	     */
	    reset: function() { }
	};
	
	/**
	 * get a usable string, used as event postfix
	 * @param {Const} state
	 * @returns {String} state
	 */
	function stateStr(state) {
	    if (state & STATE_CANCELLED) {
	        return 'cancel';
	    } else if (state & STATE_ENDED) {
	        return 'end';
	    } else if (state & STATE_CHANGED) {
	        return 'move';
	    } else if (state & STATE_BEGAN) {
	        return 'start';
	    }
	    return '';
	}
	
	/**
	 * direction cons to string
	 * @param {Const} direction
	 * @returns {String}
	 */
	function directionStr(direction) {
	    if (direction == DIRECTION_DOWN) {
	        return 'down';
	    } else if (direction == DIRECTION_UP) {
	        return 'up';
	    } else if (direction == DIRECTION_LEFT) {
	        return 'left';
	    } else if (direction == DIRECTION_RIGHT) {
	        return 'right';
	    }
	    return '';
	}
	
	/**
	 * get a recognizer by name if it is bound to a manager
	 * @param {Recognizer|String} otherRecognizer
	 * @param {Recognizer} recognizer
	 * @returns {Recognizer}
	 */
	function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
	    var manager = recognizer.manager;
	    if (manager) {
	        return manager.get(otherRecognizer);
	    }
	    return otherRecognizer;
	}
	
	/**
	 * This recognizer is just used as a base for the simple attribute recognizers.
	 * @constructor
	 * @extends Recognizer
	 */
	function AttrRecognizer() {
	    Recognizer.apply(this, arguments);
	}
	
	inherit(AttrRecognizer, Recognizer, {
	    /**
	     * @namespace
	     * @memberof AttrRecognizer
	     */
	    defaults: {
	        /**
	         * @type {Number}
	         * @default 1
	         */
	        pointers: 1
	    },
	
	    /**
	     * Used to check if it the recognizer receives valid input, like input.distance > 10.
	     * @memberof AttrRecognizer
	     * @param {Object} input
	     * @returns {Boolean} recognized
	     */
	    attrTest: function(input) {
	        var optionPointers = this.options.pointers;
	        return optionPointers === 0 || input.pointers.length === optionPointers;
	    },
	
	    /**
	     * Process the input and return the state for the recognizer
	     * @memberof AttrRecognizer
	     * @param {Object} input
	     * @returns {*} State
	     */
	    process: function(input) {
	        var state = this.state;
	        var eventType = input.eventType;
	
	        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
	        var isValid = this.attrTest(input);
	
	        // on cancel input and we've recognized before, return STATE_CANCELLED
	        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
	            return state | STATE_CANCELLED;
	        } else if (isRecognized || isValid) {
	            if (eventType & INPUT_END) {
	                return state | STATE_ENDED;
	            } else if (!(state & STATE_BEGAN)) {
	                return STATE_BEGAN;
	            }
	            return state | STATE_CHANGED;
	        }
	        return STATE_FAILED;
	    }
	});
	
	/**
	 * Pan
	 * Recognized when the pointer is down and moved in the allowed direction.
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function PanRecognizer() {
	    AttrRecognizer.apply(this, arguments);
	
	    this.pX = null;
	    this.pY = null;
	}
	
	inherit(PanRecognizer, AttrRecognizer, {
	    /**
	     * @namespace
	     * @memberof PanRecognizer
	     */
	    defaults: {
	        event: 'pan',
	        threshold: 10,
	        pointers: 1,
	        direction: DIRECTION_ALL
	    },
	
	    getTouchAction: function() {
	        var direction = this.options.direction;
	        var actions = [];
	        if (direction & DIRECTION_HORIZONTAL) {
	            actions.push(TOUCH_ACTION_PAN_Y);
	        }
	        if (direction & DIRECTION_VERTICAL) {
	            actions.push(TOUCH_ACTION_PAN_X);
	        }
	        return actions;
	    },
	
	    directionTest: function(input) {
	        var options = this.options;
	        var hasMoved = true;
	        var distance = input.distance;
	        var direction = input.direction;
	        var x = input.deltaX;
	        var y = input.deltaY;
	
	        // lock to axis?
	        if (!(direction & options.direction)) {
	            if (options.direction & DIRECTION_HORIZONTAL) {
	                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
	                hasMoved = x != this.pX;
	                distance = Math.abs(input.deltaX);
	            } else {
	                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
	                hasMoved = y != this.pY;
	                distance = Math.abs(input.deltaY);
	            }
	        }
	        input.direction = direction;
	        return hasMoved && distance > options.threshold && direction & options.direction;
	    },
	
	    attrTest: function(input) {
	        return AttrRecognizer.prototype.attrTest.call(this, input) &&
	            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
	    },
	
	    emit: function(input) {
	        this.pX = input.deltaX;
	        this.pY = input.deltaY;
	
	        var direction = directionStr(input.direction);
	        if (direction) {
	            this.manager.emit(this.options.event + direction, input);
	        }
	
	        this._super.emit.call(this, input);
	    }
	});
	
	/**
	 * Pinch
	 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function PinchRecognizer() {
	    AttrRecognizer.apply(this, arguments);
	}
	
	inherit(PinchRecognizer, AttrRecognizer, {
	    /**
	     * @namespace
	     * @memberof PinchRecognizer
	     */
	    defaults: {
	        event: 'pinch',
	        threshold: 0,
	        pointers: 2
	    },
	
	    getTouchAction: function() {
	        return [TOUCH_ACTION_NONE];
	    },
	
	    attrTest: function(input) {
	        return this._super.attrTest.call(this, input) &&
	            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
	    },
	
	    emit: function(input) {
	        this._super.emit.call(this, input);
	        if (input.scale !== 1) {
	            var inOut = input.scale < 1 ? 'in' : 'out';
	            this.manager.emit(this.options.event + inOut, input);
	        }
	    }
	});
	
	/**
	 * Press
	 * Recognized when the pointer is down for x ms without any movement.
	 * @constructor
	 * @extends Recognizer
	 */
	function PressRecognizer() {
	    Recognizer.apply(this, arguments);
	
	    this._timer = null;
	    this._input = null;
	}
	
	inherit(PressRecognizer, Recognizer, {
	    /**
	     * @namespace
	     * @memberof PressRecognizer
	     */
	    defaults: {
	        event: 'press',
	        pointers: 1,
	        time: 500, // minimal time of the pointer to be pressed
	        threshold: 5 // a minimal movement is ok, but keep it low
	    },
	
	    getTouchAction: function() {
	        return [TOUCH_ACTION_AUTO];
	    },
	
	    process: function(input) {
	        var options = this.options;
	        var validPointers = input.pointers.length === options.pointers;
	        var validMovement = input.distance < options.threshold;
	        var validTime = input.deltaTime > options.time;
	
	        this._input = input;
	
	        // we only allow little movement
	        // and we've reached an end event, so a tap is possible
	        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
	            this.reset();
	        } else if (input.eventType & INPUT_START) {
	            this.reset();
	            this._timer = setTimeoutContext(function() {
	                this.state = STATE_RECOGNIZED;
	                this.tryEmit();
	            }, options.time, this);
	        } else if (input.eventType & INPUT_END) {
	            return STATE_RECOGNIZED;
	        }
	        return STATE_FAILED;
	    },
	
	    reset: function() {
	        clearTimeout(this._timer);
	    },
	
	    emit: function(input) {
	        if (this.state !== STATE_RECOGNIZED) {
	            return;
	        }
	
	        if (input && (input.eventType & INPUT_END)) {
	            this.manager.emit(this.options.event + 'up', input);
	        } else {
	            this._input.timeStamp = now();
	            this.manager.emit(this.options.event, this._input);
	        }
	    }
	});
	
	/**
	 * Rotate
	 * Recognized when two or more pointer are moving in a circular motion.
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function RotateRecognizer() {
	    AttrRecognizer.apply(this, arguments);
	}
	
	inherit(RotateRecognizer, AttrRecognizer, {
	    /**
	     * @namespace
	     * @memberof RotateRecognizer
	     */
	    defaults: {
	        event: 'rotate',
	        threshold: 0,
	        pointers: 2
	    },
	
	    getTouchAction: function() {
	        return [TOUCH_ACTION_NONE];
	    },
	
	    attrTest: function(input) {
	        return this._super.attrTest.call(this, input) &&
	            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
	    }
	});
	
	/**
	 * Swipe
	 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function SwipeRecognizer() {
	    AttrRecognizer.apply(this, arguments);
	}
	
	inherit(SwipeRecognizer, AttrRecognizer, {
	    /**
	     * @namespace
	     * @memberof SwipeRecognizer
	     */
	    defaults: {
	        event: 'swipe',
	        threshold: 10,
	        velocity: 0.65,
	        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
	        pointers: 1
	    },
	
	    getTouchAction: function() {
	        return PanRecognizer.prototype.getTouchAction.call(this);
	    },
	
	    attrTest: function(input) {
	        var direction = this.options.direction;
	        var velocity;
	
	        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
	            velocity = input.velocity;
	        } else if (direction & DIRECTION_HORIZONTAL) {
	            velocity = input.velocityX;
	        } else if (direction & DIRECTION_VERTICAL) {
	            velocity = input.velocityY;
	        }
	
	        return this._super.attrTest.call(this, input) &&
	            direction & input.direction &&
	            input.distance > this.options.threshold &&
	            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
	    },
	
	    emit: function(input) {
	        var direction = directionStr(input.direction);
	        if (direction) {
	            this.manager.emit(this.options.event + direction, input);
	        }
	
	        this.manager.emit(this.options.event, input);
	    }
	});
	
	/**
	 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
	 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
	 * a single tap.
	 *
	 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
	 * multi-taps being recognized.
	 * @constructor
	 * @extends Recognizer
	 */
	function TapRecognizer() {
	    Recognizer.apply(this, arguments);
	
	    // previous time and center,
	    // used for tap counting
	    this.pTime = false;
	    this.pCenter = false;
	
	    this._timer = null;
	    this._input = null;
	    this.count = 0;
	}
	
	inherit(TapRecognizer, Recognizer, {
	    /**
	     * @namespace
	     * @memberof PinchRecognizer
	     */
	    defaults: {
	        event: 'tap',
	        pointers: 1,
	        taps: 1,
	        interval: 300, // max time between the multi-tap taps
	        time: 250, // max time of the pointer to be down (like finger on the screen)
	        threshold: 2, // a minimal movement is ok, but keep it low
	        posThreshold: 10 // a multi-tap can be a bit off the initial position
	    },
	
	    getTouchAction: function() {
	        return [TOUCH_ACTION_MANIPULATION];
	    },
	
	    process: function(input) {
	        var options = this.options;
	
	        var validPointers = input.pointers.length === options.pointers;
	        var validMovement = input.distance < options.threshold;
	        var validTouchTime = input.deltaTime < options.time;
	
	        this.reset();
	
	        if ((input.eventType & INPUT_START) && (this.count === 0)) {
	            return this.failTimeout();
	        }
	
	        // we only allow little movement
	        // and we've reached an end event, so a tap is possible
	        if (validMovement && validTouchTime && validPointers) {
	            if (input.eventType != INPUT_END) {
	                return this.failTimeout();
	            }
	
	            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
	            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;
	
	            this.pTime = input.timeStamp;
	            this.pCenter = input.center;
	
	            if (!validMultiTap || !validInterval) {
	                this.count = 1;
	            } else {
	                this.count += 1;
	            }
	
	            this._input = input;
	
	            // if tap count matches we have recognized it,
	            // else it has began recognizing...
	            var tapCount = this.count % options.taps;
	            if (tapCount === 0) {
	                // no failing requirements, immediately trigger the tap event
	                // or wait as long as the multitap interval to trigger
	                if (!this.hasRequireFailures()) {
	                    return STATE_RECOGNIZED;
	                } else {
	                    this._timer = setTimeoutContext(function() {
	                        this.state = STATE_RECOGNIZED;
	                        this.tryEmit();
	                    }, options.interval, this);
	                    return STATE_BEGAN;
	                }
	            }
	        }
	        return STATE_FAILED;
	    },
	
	    failTimeout: function() {
	        this._timer = setTimeoutContext(function() {
	            this.state = STATE_FAILED;
	        }, this.options.interval, this);
	        return STATE_FAILED;
	    },
	
	    reset: function() {
	        clearTimeout(this._timer);
	    },
	
	    emit: function() {
	        if (this.state == STATE_RECOGNIZED ) {
	            this._input.tapCount = this.count;
	            this.manager.emit(this.options.event, this._input);
	        }
	    }
	});
	
	/**
	 * Simple way to create an manager with a default set of recognizers.
	 * @param {HTMLElement} element
	 * @param {Object} [options]
	 * @constructor
	 */
	function Hammer(element, options) {
	    options = options || {};
	    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
	    return new Manager(element, options);
	}
	
	/**
	 * @const {string}
	 */
	Hammer.VERSION = '2.0.4';
	
	/**
	 * default settings
	 * @namespace
	 */
	Hammer.defaults = {
	    /**
	     * set if DOM events are being triggered.
	     * But this is slower and unused by simple implementations, so disabled by default.
	     * @type {Boolean}
	     * @default false
	     */
	    domEvents: false,
	
	    /**
	     * The value for the touchAction property/fallback.
	     * When set to `compute` it will magically set the correct value based on the added recognizers.
	     * @type {String}
	     * @default compute
	     */
	    touchAction: TOUCH_ACTION_COMPUTE,
	
	    /**
	     * @type {Boolean}
	     * @default true
	     */
	    enable: true,
	
	    /**
	     * EXPERIMENTAL FEATURE -- can be removed/changed
	     * Change the parent input target element.
	     * If Null, then it is being set the to main element.
	     * @type {Null|EventTarget}
	     * @default null
	     */
	    inputTarget: null,
	
	    /**
	     * force an input class
	     * @type {Null|Function}
	     * @default null
	     */
	    inputClass: null,
	
	    /**
	     * Default recognizer setup when calling `Hammer()`
	     * When creating a new Manager these will be skipped.
	     * @type {Array}
	     */
	    preset: [
	        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
	        [RotateRecognizer, { enable: false }],
	        [PinchRecognizer, { enable: false }, ['rotate']],
	        [SwipeRecognizer,{ direction: DIRECTION_HORIZONTAL }],
	        [PanRecognizer, { direction: DIRECTION_HORIZONTAL }, ['swipe']],
	        [TapRecognizer],
	        [TapRecognizer, { event: 'doubletap', taps: 2 }, ['tap']],
	        [PressRecognizer]
	    ],
	
	    /**
	     * Some CSS properties can be used to improve the working of Hammer.
	     * Add them to this method and they will be set when creating a new Manager.
	     * @namespace
	     */
	    cssProps: {
	        /**
	         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
	         * @type {String}
	         * @default 'none'
	         */
	        userSelect: 'none',
	
	        /**
	         * Disable the Windows Phone grippers when pressing an element.
	         * @type {String}
	         * @default 'none'
	         */
	        touchSelect: 'none',
	
	        /**
	         * Disables the default callout shown when you touch and hold a touch target.
	         * On iOS, when you touch and hold a touch target such as a link, Safari displays
	         * a callout containing information about the link. This property allows you to disable that callout.
	         * @type {String}
	         * @default 'none'
	         */
	        touchCallout: 'none',
	
	        /**
	         * Specifies whether zooming is enabled. Used by IE10>
	         * @type {String}
	         * @default 'none'
	         */
	        contentZooming: 'none',
	
	        /**
	         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
	         * @type {String}
	         * @default 'none'
	         */
	        userDrag: 'none',
	
	        /**
	         * Overrides the highlight color shown when the user taps a link or a JavaScript
	         * clickable element in iOS. This property obeys the alpha value, if specified.
	         * @type {String}
	         * @default 'rgba(0,0,0,0)'
	         */
	        tapHighlightColor: 'rgba(0,0,0,0)'
	    }
	};
	
	var STOP = 1;
	var FORCED_STOP = 2;
	
	/**
	 * Manager
	 * @param {HTMLElement} element
	 * @param {Object} [options]
	 * @constructor
	 */
	function Manager(element, options) {
	    options = options || {};
	
	    this.options = merge(options, Hammer.defaults);
	    this.options.inputTarget = this.options.inputTarget || element;
	
	    this.handlers = {};
	    this.session = {};
	    this.recognizers = [];
	
	    this.element = element;
	    this.input = createInputInstance(this);
	    this.touchAction = new TouchAction(this, this.options.touchAction);
	
	    toggleCssProps(this, true);
	
	    each(options.recognizers, function(item) {
	        var recognizer = this.add(new (item[0])(item[1]));
	        item[2] && recognizer.recognizeWith(item[2]);
	        item[3] && recognizer.requireFailure(item[3]);
	    }, this);
	}
	
	Manager.prototype = {
	    /**
	     * set options
	     * @param {Object} options
	     * @returns {Manager}
	     */
	    set: function(options) {
	        extend(this.options, options);
	
	        // Options that need a little more setup
	        if (options.touchAction) {
	            this.touchAction.update();
	        }
	        if (options.inputTarget) {
	            // Clean up existing event listeners and reinitialize
	            this.input.destroy();
	            this.input.target = options.inputTarget;
	            this.input.init();
	        }
	        return this;
	    },
	
	    /**
	     * stop recognizing for this session.
	     * This session will be discarded, when a new [input]start event is fired.
	     * When forced, the recognizer cycle is stopped immediately.
	     * @param {Boolean} [force]
	     */
	    stop: function(force) {
	        this.session.stopped = force ? FORCED_STOP : STOP;
	    },
	
	    /**
	     * run the recognizers!
	     * called by the inputHandler function on every movement of the pointers (touches)
	     * it walks through all the recognizers and tries to detect the gesture that is being made
	     * @param {Object} inputData
	     */
	    recognize: function(inputData) {
	        var session = this.session;
	        if (session.stopped) {
	            return;
	        }
	
	        // run the touch-action polyfill
	        this.touchAction.preventDefaults(inputData);
	
	        var recognizer;
	        var recognizers = this.recognizers;
	
	        // this holds the recognizer that is being recognized.
	        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
	        // if no recognizer is detecting a thing, it is set to `null`
	        var curRecognizer = session.curRecognizer;
	
	        // reset when the last recognizer is recognized
	        // or when we're in a new session
	        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
	            curRecognizer = session.curRecognizer = null;
	        }
	
	        var i = 0;
	        while (i < recognizers.length) {
	            recognizer = recognizers[i];
	
	            // find out if we are allowed try to recognize the input for this one.
	            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
	            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
	            //      that is being recognized.
	            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
	            //      this can be setup with the `recognizeWith()` method on the recognizer.
	            if (session.stopped !== FORCED_STOP && ( // 1
	                    !curRecognizer || recognizer == curRecognizer || // 2
	                    recognizer.canRecognizeWith(curRecognizer))) { // 3
	                recognizer.recognize(inputData);
	            } else {
	                recognizer.reset();
	            }
	
	            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
	            // current active recognizer. but only if we don't already have an active recognizer
	            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
	                curRecognizer = session.curRecognizer = recognizer;
	            }
	            i++;
	        }
	    },
	
	    /**
	     * get a recognizer by its event name.
	     * @param {Recognizer|String} recognizer
	     * @returns {Recognizer|Null}
	     */
	    get: function(recognizer) {
	        if (recognizer instanceof Recognizer) {
	            return recognizer;
	        }
	
	        var recognizers = this.recognizers;
	        for (var i = 0; i < recognizers.length; i++) {
	            if (recognizers[i].options.event == recognizer) {
	                return recognizers[i];
	            }
	        }
	        return null;
	    },
	
	    /**
	     * add a recognizer to the manager
	     * existing recognizers with the same event name will be removed
	     * @param {Recognizer} recognizer
	     * @returns {Recognizer|Manager}
	     */
	    add: function(recognizer) {
	        if (invokeArrayArg(recognizer, 'add', this)) {
	            return this;
	        }
	
	        // remove existing
	        var existing = this.get(recognizer.options.event);
	        if (existing) {
	            this.remove(existing);
	        }
	
	        this.recognizers.push(recognizer);
	        recognizer.manager = this;
	
	        this.touchAction.update();
	        return recognizer;
	    },
	
	    /**
	     * remove a recognizer by name or instance
	     * @param {Recognizer|String} recognizer
	     * @returns {Manager}
	     */
	    remove: function(recognizer) {
	        if (invokeArrayArg(recognizer, 'remove', this)) {
	            return this;
	        }
	
	        var recognizers = this.recognizers;
	        recognizer = this.get(recognizer);
	        recognizers.splice(inArray(recognizers, recognizer), 1);
	
	        this.touchAction.update();
	        return this;
	    },
	
	    /**
	     * bind event
	     * @param {String} events
	     * @param {Function} handler
	     * @returns {EventEmitter} this
	     */
	    on: function(events, handler) {
	        var handlers = this.handlers;
	        each(splitStr(events), function(event) {
	            handlers[event] = handlers[event] || [];
	            handlers[event].push(handler);
	        });
	        return this;
	    },
	
	    /**
	     * unbind event, leave emit blank to remove all handlers
	     * @param {String} events
	     * @param {Function} [handler]
	     * @returns {EventEmitter} this
	     */
	    off: function(events, handler) {
	        var handlers = this.handlers;
	        each(splitStr(events), function(event) {
	            if (!handler) {
	                delete handlers[event];
	            } else {
	                handlers[event].splice(inArray(handlers[event], handler), 1);
	            }
	        });
	        return this;
	    },
	
	    /**
	     * emit event to the listeners
	     * @param {String} event
	     * @param {Object} data
	     */
	    emit: function(event, data) {
	        // we also want to trigger dom events
	        if (this.options.domEvents) {
	            triggerDomEvent(event, data);
	        }
	
	        // no handlers, so skip it all
	        var handlers = this.handlers[event] && this.handlers[event].slice();
	        if (!handlers || !handlers.length) {
	            return;
	        }
	
	        data.type = event;
	        data.preventDefault = function() {
	            data.srcEvent.preventDefault();
	        };
	
	        var i = 0;
	        while (i < handlers.length) {
	            handlers[i](data);
	            i++;
	        }
	    },
	
	    /**
	     * destroy the manager and unbinds all events
	     * it doesn't unbind dom events, that is the user own responsibility
	     */
	    destroy: function() {
	        this.element && toggleCssProps(this, false);
	
	        this.handlers = {};
	        this.session = {};
	        this.input.destroy();
	        this.element = null;
	    }
	};
	
	/**
	 * add/remove the css properties as defined in manager.options.cssProps
	 * @param {Manager} manager
	 * @param {Boolean} add
	 */
	function toggleCssProps(manager, add) {
	    var element = manager.element;
	    each(manager.options.cssProps, function(value, name) {
	        element.style[prefixed(element.style, name)] = add ? value : '';
	    });
	}
	
	/**
	 * trigger dom event
	 * @param {String} event
	 * @param {Object} data
	 */
	function triggerDomEvent(event, data) {
	    var gestureEvent = document.createEvent('Event');
	    gestureEvent.initEvent(event, true, true);
	    gestureEvent.gesture = data;
	    data.target.dispatchEvent(gestureEvent);
	}
	
	extend(Hammer, {
	    INPUT_START: INPUT_START,
	    INPUT_MOVE: INPUT_MOVE,
	    INPUT_END: INPUT_END,
	    INPUT_CANCEL: INPUT_CANCEL,
	
	    STATE_POSSIBLE: STATE_POSSIBLE,
	    STATE_BEGAN: STATE_BEGAN,
	    STATE_CHANGED: STATE_CHANGED,
	    STATE_ENDED: STATE_ENDED,
	    STATE_RECOGNIZED: STATE_RECOGNIZED,
	    STATE_CANCELLED: STATE_CANCELLED,
	    STATE_FAILED: STATE_FAILED,
	
	    DIRECTION_NONE: DIRECTION_NONE,
	    DIRECTION_LEFT: DIRECTION_LEFT,
	    DIRECTION_RIGHT: DIRECTION_RIGHT,
	    DIRECTION_UP: DIRECTION_UP,
	    DIRECTION_DOWN: DIRECTION_DOWN,
	    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
	    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
	    DIRECTION_ALL: DIRECTION_ALL,
	
	    Manager: Manager,
	    Input: Input,
	    TouchAction: TouchAction,
	
	    TouchInput: TouchInput,
	    MouseInput: MouseInput,
	    PointerEventInput: PointerEventInput,
	    TouchMouseInput: TouchMouseInput,
	    SingleTouchInput: SingleTouchInput,
	
	    Recognizer: Recognizer,
	    AttrRecognizer: AttrRecognizer,
	    Tap: TapRecognizer,
	    Pan: PanRecognizer,
	    Swipe: SwipeRecognizer,
	    Pinch: PinchRecognizer,
	    Rotate: RotateRecognizer,
	    Press: PressRecognizer,
	
	    on: addEventListeners,
	    off: removeEventListeners,
	    each: each,
	    merge: merge,
	    extend: extend,
	    inherit: inherit,
	    bindFn: bindFn,
	    prefixed: prefixed
	});
	
	if ("function" == TYPE_FUNCTION && __webpack_require__(8)) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	        return Hammer;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof module != 'undefined' && module.exports) {
	    module.exports = Hammer;
	} else {
	    window[exportName] = Hammer;
	}
	
	})(window, document, 'Hammer');


/***/ },
/* 8 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;
	
	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 9 */
/***/ function(module, exports) {

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


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _lodashArrayRemove = __webpack_require__(43);
	
	var _lodashArrayRemove2 = _interopRequireDefault(_lodashArrayRemove);
	
	var _lodashObjectAssign = __webpack_require__(19);
	
	var _lodashObjectAssign2 = _interopRequireDefault(_lodashObjectAssign);
	
	var _lodashNumberRandom = __webpack_require__(41);
	
	var _lodashNumberRandom2 = _interopRequireDefault(_lodashNumberRandom);
	
	var _lodashCollectionFind = __webpack_require__(68);
	
	var _lodashCollectionFind2 = _interopRequireDefault(_lodashCollectionFind);
	
	var _lodashCollectionWhere = __webpack_require__(77);
	
	var _lodashCollectionWhere2 = _interopRequireDefault(_lodashCollectionWhere);
	
	var util = undefined;
	
	util = {};
	
	util.remove = _lodashArrayRemove2['default'];
	util.assign = _lodashObjectAssign2['default'];
	util.random = _lodashNumberRandom2['default'];
	util.find = _lodashCollectionFind2['default'];
	util.where = _lodashCollectionWhere2['default'];
	
	/**
	 * Return direct children elements.
	 *
	 * @see http://stackoverflow.com/a/27102446/368691
	 * @param {HTMLElement}
	 * @return {Array}
	 */
	util.elementChildren = function (element) {
	    return util.where(element.childNodes, {
	        nodeType: 1
	    });
	};
	
	/**
	 * @see http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
	 * @return {Boolean}
	 */
	util.isTouchDevice = function () {
	    return 'ontouchstart' in window || navigator.msMaxTouchPoints;
	};
	
	exports['default'] = util;
	module.exports = exports['default'];

/***/ },
/* 11 */,
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var now = __webpack_require__(13)
	  , global = typeof window === 'undefined' ? {} : window
	  , vendors = ['moz', 'webkit']
	  , suffix = 'AnimationFrame'
	  , raf = global['request' + suffix]
	  , caf = global['cancel' + suffix] || global['cancelRequest' + suffix]
	
	for(var i = 0; i < vendors.length && !raf; i++) {
	  raf = global[vendors[i] + 'Request' + suffix]
	  caf = global[vendors[i] + 'Cancel' + suffix]
	      || global[vendors[i] + 'CancelRequest' + suffix]
	}
	
	// Some versions of FF have rAF but not cAF
	if(!raf || !caf) {
	  var last = 0
	    , id = 0
	    , queue = []
	    , frameDuration = 1000 / 60
	
	  raf = function(callback) {
	    if(queue.length === 0) {
	      var _now = now()
	        , next = Math.max(0, frameDuration - (_now - last))
	      last = next + _now
	      setTimeout(function() {
	        var cp = queue.slice(0)
	        // Clear queue here to prevent
	        // callbacks from appending listeners
	        // to the current frame's queue
	        queue.length = 0
	        for(var i = 0; i < cp.length; i++) {
	          if(!cp[i].cancelled) {
	            try{
	              cp[i].callback(last)
	            } catch(e) {
	              setTimeout(function() { throw e }, 0)
	            }
	          }
	        }
	      }, Math.round(next))
	    }
	    queue.push({
	      handle: ++id,
	      callback: callback,
	      cancelled: false
	    })
	    return id
	  }
	
	  caf = function(handle) {
	    for(var i = 0; i < queue.length; i++) {
	      if(queue[i].handle === handle) {
	        queue[i].cancelled = true
	      }
	    }
	  }
	}
	
	module.exports = function(fn) {
	  // Wrap in a new function to prevent
	  // `cancel` potentially being assigned
	  // to the native rAF function
	  return raf.call(global, fn)
	}
	module.exports.cancel = function() {
	  caf.apply(global, arguments)
	}


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Generated by CoffeeScript 1.7.1
	(function() {
	  var getNanoSeconds, hrtime, loadTime;
	
	  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
	    module.exports = function() {
	      return performance.now();
	    };
	  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
	    module.exports = function() {
	      return (getNanoSeconds() - loadTime) / 1e6;
	    };
	    hrtime = process.hrtime;
	    getNanoSeconds = function() {
	      var hr;
	      hr = hrtime();
	      return hr[0] * 1e9 + hr[1];
	    };
	    loadTime = getNanoSeconds();
	  } else if (Date.now) {
	    module.exports = function() {
	      return Date.now() - loadTime;
	    };
	    loadTime = Date.now();
	  } else {
	    module.exports = function() {
	      return new Date().getTime() - loadTime;
	    };
	    loadTime = new Date().getTime();
	  }
	
	}).call(this);
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var identity = __webpack_require__(18);
	
	/**
	 * A specialized version of `baseCallback` which only supports `this` binding
	 * and specifying the number of arguments to provide to `func`.
	 *
	 * @private
	 * @param {Function} func The function to bind.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {number} [argCount] The number of arguments to provide to `func`.
	 * @returns {Function} Returns the callback.
	 */
	function bindCallback(func, thisArg, argCount) {
	  if (typeof func != 'function') {
	    return identity;
	  }
	  if (thisArg === undefined) {
	    return func;
	  }
	  switch (argCount) {
	    case 1: return function(value) {
	      return func.call(thisArg, value);
	    };
	    case 3: return function(value, index, collection) {
	      return func.call(thisArg, value, index, collection);
	    };
	    case 4: return function(accumulator, value, index, collection) {
	      return func.call(thisArg, accumulator, value, index, collection);
	    };
	    case 5: return function(value, other, key, object, source) {
	      return func.call(thisArg, value, other, key, object, source);
	    };
	  }
	  return function() {
	    return func.apply(thisArg, arguments);
	  };
	}
	
	module.exports = bindCallback;


/***/ },
/* 18 */
/***/ function(module, exports) {

	/**
	 * This method returns the first argument provided to it.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 *
	 * _.identity(object) === object;
	 * // => true
	 */
	function identity(value) {
	  return value;
	}
	
	module.exports = identity;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var assignWith = __webpack_require__(20),
	    baseAssign = __webpack_require__(36),
	    createAssigner = __webpack_require__(38);
	
	/**
	 * Assigns own enumerable properties of source object(s) to the destination
	 * object. Subsequent sources overwrite property assignments of previous sources.
	 * If `customizer` is provided it's invoked to produce the assigned values.
	 * The `customizer` is bound to `thisArg` and invoked with five arguments:
	 * (objectValue, sourceValue, key, object, source).
	 *
	 * **Note:** This method mutates `object` and is based on
	 * [`Object.assign`](http://ecma-international.org/ecma-262/6.0/#sec-object.assign).
	 *
	 * @static
	 * @memberOf _
	 * @alias extend
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @param {Function} [customizer] The function to customize assigned values.
	 * @param {*} [thisArg] The `this` binding of `customizer`.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
	 * // => { 'user': 'fred', 'age': 40 }
	 *
	 * // using a customizer callback
	 * var defaults = _.partialRight(_.assign, function(value, other) {
	 *   return _.isUndefined(value) ? other : value;
	 * });
	 *
	 * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
	 * // => { 'user': 'barney', 'age': 36 }
	 */
	var assign = createAssigner(function(object, source, customizer) {
	  return customizer
	    ? assignWith(object, source, customizer)
	    : baseAssign(object, source);
	});
	
	module.exports = assign;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var keys = __webpack_require__(21);
	
	/**
	 * A specialized version of `_.assign` for customizing assigned values without
	 * support for argument juggling, multiple sources, and `this` binding `customizer`
	 * functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {Function} customizer The function to customize assigned values.
	 * @returns {Object} Returns `object`.
	 */
	function assignWith(object, source, customizer) {
	  var index = -1,
	      props = keys(source),
	      length = props.length;
	
	  while (++index < length) {
	    var key = props[index],
	        value = object[key],
	        result = customizer(value, source[key], key, object, source);
	
	    if ((result === result ? (result !== value) : (value === value)) ||
	        (value === undefined && !(key in object))) {
	      object[key] = result;
	    }
	  }
	  return object;
	}
	
	module.exports = assignWith;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(22),
	    isArrayLike = __webpack_require__(27),
	    isObject = __webpack_require__(25),
	    shimKeys = __webpack_require__(31);
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeKeys = getNative(Object, 'keys');
	
	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	var keys = !nativeKeys ? shimKeys : function(object) {
	  var Ctor = object == null ? undefined : object.constructor;
	  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
	      (typeof object != 'function' && isArrayLike(object))) {
	    return shimKeys(object);
	  }
	  return isObject(object) ? nativeKeys(object) : [];
	};
	
	module.exports = keys;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var isNative = __webpack_require__(23);
	
	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object == null ? undefined : object[key];
	  return isNative(value) ? value : undefined;
	}
	
	module.exports = getNative;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(24),
	    isObjectLike = __webpack_require__(26);
	
	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);
	
	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (isFunction(value)) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}
	
	module.exports = isNative;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(25);
	
	/** `Object#toString` result references. */
	var funcTag = '[object Function]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 which returns 'object' for typed array constructors.
	  return isObject(value) && objToString.call(value) == funcTag;
	}
	
	module.exports = isFunction;


/***/ },
/* 25 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	module.exports = isObject;


/***/ },
/* 26 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	module.exports = isObjectLike;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var getLength = __webpack_require__(28),
	    isLength = __webpack_require__(30);
	
	/**
	 * Checks if `value` is array-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 */
	function isArrayLike(value) {
	  return value != null && isLength(getLength(value));
	}
	
	module.exports = isArrayLike;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(29);
	
	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	 * that affects Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');
	
	module.exports = getLength;


/***/ },
/* 29 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}
	
	module.exports = baseProperty;


/***/ },
/* 30 */
/***/ function(module, exports) {

	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	module.exports = isLength;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(32),
	    isArray = __webpack_require__(33),
	    isIndex = __webpack_require__(34),
	    isLength = __webpack_require__(30),
	    keysIn = __webpack_require__(35);
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * A fallback implementation of `Object.keys` which creates an array of the
	 * own enumerable property names of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function shimKeys(object) {
	  var props = keysIn(object),
	      propsLength = props.length,
	      length = propsLength && object.length;
	
	  var allowIndexes = !!length && isLength(length) &&
	    (isArray(object) || isArguments(object));
	
	  var index = -1,
	      result = [];
	
	  while (++index < propsLength) {
	    var key = props[index];
	    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = shimKeys;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(27),
	    isObjectLike = __webpack_require__(26);
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Native method references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;
	
	/**
	 * Checks if `value` is classified as an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  return isObjectLike(value) && isArrayLike(value) &&
	    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
	}
	
	module.exports = isArguments;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(22),
	    isLength = __webpack_require__(30),
	    isObjectLike = __webpack_require__(26);
	
	/** `Object#toString` result references. */
	var arrayTag = '[object Array]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeIsArray = getNative(Array, 'isArray');
	
	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(function() { return arguments; }());
	 * // => false
	 */
	var isArray = nativeIsArray || function(value) {
	  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
	};
	
	module.exports = isArray;


/***/ },
/* 34 */
/***/ function(module, exports) {

	/** Used to detect unsigned integer values. */
	var reIsUint = /^\d+$/;
	
	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return value > -1 && value % 1 == 0 && value < length;
	}
	
	module.exports = isIndex;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(32),
	    isArray = __webpack_require__(33),
	    isIndex = __webpack_require__(34),
	    isLength = __webpack_require__(30),
	    isObject = __webpack_require__(25);
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  if (object == null) {
	    return [];
	  }
	  if (!isObject(object)) {
	    object = Object(object);
	  }
	  var length = object.length;
	  length = (length && isLength(length) &&
	    (isArray(object) || isArguments(object)) && length) || 0;
	
	  var Ctor = object.constructor,
	      index = -1,
	      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
	      result = Array(length),
	      skipIndexes = length > 0;
	
	  while (++index < length) {
	    result[index] = (index + '');
	  }
	  for (var key in object) {
	    if (!(skipIndexes && isIndex(key, length)) &&
	        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = keysIn;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var baseCopy = __webpack_require__(37),
	    keys = __webpack_require__(21);
	
	/**
	 * The base implementation of `_.assign` without support for argument juggling,
	 * multiple sources, and `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @returns {Object} Returns `object`.
	 */
	function baseAssign(object, source) {
	  return source == null
	    ? object
	    : baseCopy(source, keys(source), object);
	}
	
	module.exports = baseAssign;


/***/ },
/* 37 */
/***/ function(module, exports) {

	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property names to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @returns {Object} Returns `object`.
	 */
	function baseCopy(source, props, object) {
	  object || (object = {});
	
	  var index = -1,
	      length = props.length;
	
	  while (++index < length) {
	    var key = props[index];
	    object[key] = source[key];
	  }
	  return object;
	}
	
	module.exports = baseCopy;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var bindCallback = __webpack_require__(17),
	    isIterateeCall = __webpack_require__(39),
	    restParam = __webpack_require__(40);
	
	/**
	 * Creates a `_.assign`, `_.defaults`, or `_.merge` function.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return restParam(function(object, sources) {
	    var index = -1,
	        length = object == null ? 0 : sources.length,
	        customizer = length > 2 ? sources[length - 2] : undefined,
	        guard = length > 2 ? sources[2] : undefined,
	        thisArg = length > 1 ? sources[length - 1] : undefined;
	
	    if (typeof customizer == 'function') {
	      customizer = bindCallback(customizer, thisArg, 5);
	      length -= 2;
	    } else {
	      customizer = typeof thisArg == 'function' ? thisArg : undefined;
	      length -= (customizer ? 1 : 0);
	    }
	    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	      customizer = length < 3 ? undefined : customizer;
	      length = 1;
	    }
	    while (++index < length) {
	      var source = sources[index];
	      if (source) {
	        assigner(object, source, customizer);
	      }
	    }
	    return object;
	  });
	}
	
	module.exports = createAssigner;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(27),
	    isIndex = __webpack_require__(34),
	    isObject = __webpack_require__(25);
	
	/**
	 * Checks if the provided arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == 'number'
	      ? (isArrayLike(object) && isIndex(index, object.length))
	      : (type == 'string' && index in object)) {
	    var other = object[index];
	    return value === value ? (value === other) : (other !== other);
	  }
	  return false;
	}
	
	module.exports = isIterateeCall;


/***/ },
/* 40 */
/***/ function(module, exports) {

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;
	
	/**
	 * Creates a function that invokes `func` with the `this` binding of the
	 * created function and arguments from `start` and beyond provided as an array.
	 *
	 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/Web/JavaScript/Reference/Functions/rest_parameters).
	 *
	 * @static
	 * @memberOf _
	 * @category Function
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var say = _.restParam(function(what, names) {
	 *   return what + ' ' + _.initial(names).join(', ') +
	 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
	 * });
	 *
	 * say('hello', 'fred', 'barney', 'pebbles');
	 * // => 'hello fred, barney, & pebbles'
	 */
	function restParam(func, start) {
	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        rest = Array(length);
	
	    while (++index < length) {
	      rest[index] = args[start + index];
	    }
	    switch (start) {
	      case 0: return func.call(this, rest);
	      case 1: return func.call(this, args[0], rest);
	      case 2: return func.call(this, args[0], args[1], rest);
	    }
	    var otherArgs = Array(start + 1);
	    index = -1;
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = rest;
	    return func.apply(this, otherArgs);
	  };
	}
	
	module.exports = restParam;


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var baseRandom = __webpack_require__(42),
	    isIterateeCall = __webpack_require__(39);
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeMin = Math.min,
	    nativeRandom = Math.random;
	
	/**
	 * Produces a random number between `min` and `max` (inclusive). If only one
	 * argument is provided a number between `0` and the given number is returned.
	 * If `floating` is `true`, or either `min` or `max` are floats, a floating-point
	 * number is returned instead of an integer.
	 *
	 * @static
	 * @memberOf _
	 * @category Number
	 * @param {number} [min=0] The minimum possible value.
	 * @param {number} [max=1] The maximum possible value.
	 * @param {boolean} [floating] Specify returning a floating-point number.
	 * @returns {number} Returns the random number.
	 * @example
	 *
	 * _.random(0, 5);
	 * // => an integer between 0 and 5
	 *
	 * _.random(5);
	 * // => also an integer between 0 and 5
	 *
	 * _.random(5, true);
	 * // => a floating-point number between 0 and 5
	 *
	 * _.random(1.2, 5.2);
	 * // => a floating-point number between 1.2 and 5.2
	 */
	function random(min, max, floating) {
	  if (floating && isIterateeCall(min, max, floating)) {
	    max = floating = undefined;
	  }
	  var noMin = min == null,
	      noMax = max == null;
	
	  if (floating == null) {
	    if (noMax && typeof min == 'boolean') {
	      floating = min;
	      min = 1;
	    }
	    else if (typeof max == 'boolean') {
	      floating = max;
	      noMax = true;
	    }
	  }
	  if (noMin && noMax) {
	    max = 1;
	    noMax = false;
	  }
	  min = +min || 0;
	  if (noMax) {
	    max = min;
	    min = 0;
	  } else {
	    max = +max || 0;
	  }
	  if (floating || min % 1 || max % 1) {
	    var rand = nativeRandom();
	    return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand + '').length - 1)))), max);
	  }
	  return baseRandom(min, max);
	}
	
	module.exports = random;


/***/ },
/* 42 */
/***/ function(module, exports) {

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeFloor = Math.floor,
	    nativeRandom = Math.random;
	
	/**
	 * The base implementation of `_.random` without support for argument juggling
	 * and returning floating-point numbers.
	 *
	 * @private
	 * @param {number} min The minimum possible value.
	 * @param {number} max The maximum possible value.
	 * @returns {number} Returns the random number.
	 */
	function baseRandom(min, max) {
	  return min + nativeFloor(nativeRandom() * (max - min + 1));
	}
	
	module.exports = baseRandom;


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var baseCallback = __webpack_require__(44),
	    basePullAt = __webpack_require__(67);
	
	/**
	 * Removes all elements from `array` that `predicate` returns truthy for
	 * and returns an array of the removed elements. The predicate is bound to
	 * `thisArg` and invoked with three arguments: (value, index, array).
	 *
	 * If a property name is provided for `predicate` the created `_.property`
	 * style callback returns the property value of the given element.
	 *
	 * If a value is also provided for `thisArg` the created `_.matchesProperty`
	 * style callback returns `true` for elements that have a matching property
	 * value, else `false`.
	 *
	 * If an object is provided for `predicate` the created `_.matches` style
	 * callback returns `true` for elements that have the properties of the given
	 * object, else `false`.
	 *
	 * **Note:** Unlike `_.filter`, this method mutates `array`.
	 *
	 * @static
	 * @memberOf _
	 * @category Array
	 * @param {Array} array The array to modify.
	 * @param {Function|Object|string} [predicate=_.identity] The function invoked
	 *  per iteration.
	 * @param {*} [thisArg] The `this` binding of `predicate`.
	 * @returns {Array} Returns the new array of removed elements.
	 * @example
	 *
	 * var array = [1, 2, 3, 4];
	 * var evens = _.remove(array, function(n) {
	 *   return n % 2 == 0;
	 * });
	 *
	 * console.log(array);
	 * // => [1, 3]
	 *
	 * console.log(evens);
	 * // => [2, 4]
	 */
	function remove(array, predicate, thisArg) {
	  var result = [];
	  if (!(array && array.length)) {
	    return result;
	  }
	  var index = -1,
	      indexes = [],
	      length = array.length;
	
	  predicate = baseCallback(predicate, thisArg, 3);
	  while (++index < length) {
	    var value = array[index];
	    if (predicate(value, index, array)) {
	      result.push(value);
	      indexes.push(index);
	    }
	  }
	  basePullAt(array, indexes);
	  return result;
	}
	
	module.exports = remove;


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var baseMatches = __webpack_require__(45),
	    baseMatchesProperty = __webpack_require__(58),
	    bindCallback = __webpack_require__(17),
	    identity = __webpack_require__(18),
	    property = __webpack_require__(65);
	
	/**
	 * The base implementation of `_.callback` which supports specifying the
	 * number of arguments to provide to `func`.
	 *
	 * @private
	 * @param {*} [func=_.identity] The value to convert to a callback.
	 * @param {*} [thisArg] The `this` binding of `func`.
	 * @param {number} [argCount] The number of arguments to provide to `func`.
	 * @returns {Function} Returns the callback.
	 */
	function baseCallback(func, thisArg, argCount) {
	  var type = typeof func;
	  if (type == 'function') {
	    return thisArg === undefined
	      ? func
	      : bindCallback(func, thisArg, argCount);
	  }
	  if (func == null) {
	    return identity;
	  }
	  if (type == 'object') {
	    return baseMatches(func);
	  }
	  return thisArg === undefined
	    ? property(func)
	    : baseMatchesProperty(func, thisArg);
	}
	
	module.exports = baseCallback;


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsMatch = __webpack_require__(46),
	    getMatchData = __webpack_require__(55),
	    toObject = __webpack_require__(54);
	
	/**
	 * The base implementation of `_.matches` which does not clone `source`.
	 *
	 * @private
	 * @param {Object} source The object of property values to match.
	 * @returns {Function} Returns the new function.
	 */
	function baseMatches(source) {
	  var matchData = getMatchData(source);
	  if (matchData.length == 1 && matchData[0][2]) {
	    var key = matchData[0][0],
	        value = matchData[0][1];
	
	    return function(object) {
	      if (object == null) {
	        return false;
	      }
	      return object[key] === value && (value !== undefined || (key in toObject(object)));
	    };
	  }
	  return function(object) {
	    return baseIsMatch(object, matchData);
	  };
	}
	
	module.exports = baseMatches;


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqual = __webpack_require__(47),
	    toObject = __webpack_require__(54);
	
	/**
	 * The base implementation of `_.isMatch` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to inspect.
	 * @param {Array} matchData The propery names, values, and compare flags to match.
	 * @param {Function} [customizer] The function to customize comparing objects.
	 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	 */
	function baseIsMatch(object, matchData, customizer) {
	  var index = matchData.length,
	      length = index,
	      noCustomizer = !customizer;
	
	  if (object == null) {
	    return !length;
	  }
	  object = toObject(object);
	  while (index--) {
	    var data = matchData[index];
	    if ((noCustomizer && data[2])
	          ? data[1] !== object[data[0]]
	          : !(data[0] in object)
	        ) {
	      return false;
	    }
	  }
	  while (++index < length) {
	    data = matchData[index];
	    var key = data[0],
	        objValue = object[key],
	        srcValue = data[1];
	
	    if (noCustomizer && data[2]) {
	      if (objValue === undefined && !(key in object)) {
	        return false;
	      }
	    } else {
	      var result = customizer ? customizer(objValue, srcValue, key) : undefined;
	      if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
	        return false;
	      }
	    }
	  }
	  return true;
	}
	
	module.exports = baseIsMatch;


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqualDeep = __webpack_require__(48),
	    isObject = __webpack_require__(25),
	    isObjectLike = __webpack_require__(26);
	
	/**
	 * The base implementation of `_.isEqual` without support for `this` binding
	 * `customizer` functions.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @param {Function} [customizer] The function to customize comparing values.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 */
	function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
	  if (value === other) {
	    return true;
	  }
	  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
	    return value !== value && other !== other;
	  }
	  return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
	}
	
	module.exports = baseIsEqual;


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var equalArrays = __webpack_require__(49),
	    equalByTag = __webpack_require__(51),
	    equalObjects = __webpack_require__(52),
	    isArray = __webpack_require__(33),
	    isTypedArray = __webpack_require__(53);
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    objectTag = '[object Object]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/**
	 * A specialized version of `baseIsEqual` for arrays and objects which performs
	 * deep comparisons and tracks traversed objects enabling objects with circular
	 * references to be compared.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing objects.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA=[]] Tracks traversed `value` objects.
	 * @param {Array} [stackB=[]] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
	  var objIsArr = isArray(object),
	      othIsArr = isArray(other),
	      objTag = arrayTag,
	      othTag = arrayTag;
	
	  if (!objIsArr) {
	    objTag = objToString.call(object);
	    if (objTag == argsTag) {
	      objTag = objectTag;
	    } else if (objTag != objectTag) {
	      objIsArr = isTypedArray(object);
	    }
	  }
	  if (!othIsArr) {
	    othTag = objToString.call(other);
	    if (othTag == argsTag) {
	      othTag = objectTag;
	    } else if (othTag != objectTag) {
	      othIsArr = isTypedArray(other);
	    }
	  }
	  var objIsObj = objTag == objectTag,
	      othIsObj = othTag == objectTag,
	      isSameTag = objTag == othTag;
	
	  if (isSameTag && !(objIsArr || objIsObj)) {
	    return equalByTag(object, other, objTag);
	  }
	  if (!isLoose) {
	    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');
	
	    if (objIsWrapped || othIsWrapped) {
	      return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
	    }
	  }
	  if (!isSameTag) {
	    return false;
	  }
	  // Assume cyclic values are equal.
	  // For more information on detecting circular references see https://es5.github.io/#JO.
	  stackA || (stackA = []);
	  stackB || (stackB = []);
	
	  var length = stackA.length;
	  while (length--) {
	    if (stackA[length] == object) {
	      return stackB[length] == other;
	    }
	  }
	  // Add `object` and `other` to the stack of traversed objects.
	  stackA.push(object);
	  stackB.push(other);
	
	  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);
	
	  stackA.pop();
	  stackB.pop();
	
	  return result;
	}
	
	module.exports = baseIsEqualDeep;


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var arraySome = __webpack_require__(50);
	
	/**
	 * A specialized version of `baseIsEqualDeep` for arrays with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Array} array The array to compare.
	 * @param {Array} other The other array to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing arrays.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	 */
	function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
	  var index = -1,
	      arrLength = array.length,
	      othLength = other.length;
	
	  if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
	    return false;
	  }
	  // Ignore non-index properties.
	  while (++index < arrLength) {
	    var arrValue = array[index],
	        othValue = other[index],
	        result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;
	
	    if (result !== undefined) {
	      if (result) {
	        continue;
	      }
	      return false;
	    }
	    // Recursively compare arrays (susceptible to call stack limits).
	    if (isLoose) {
	      if (!arraySome(other, function(othValue) {
	            return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
	          })) {
	        return false;
	      }
	    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
	      return false;
	    }
	  }
	  return true;
	}
	
	module.exports = equalArrays;


/***/ },
/* 50 */
/***/ function(module, exports) {

	/**
	 * A specialized version of `_.some` for arrays without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {boolean} Returns `true` if any element passes the predicate check,
	 *  else `false`.
	 */
	function arraySome(array, predicate) {
	  var index = -1,
	      length = array.length;
	
	  while (++index < length) {
	    if (predicate(array[index], index, array)) {
	      return true;
	    }
	  }
	  return false;
	}
	
	module.exports = arraySome;


/***/ },
/* 51 */
/***/ function(module, exports) {

	/** `Object#toString` result references. */
	var boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    numberTag = '[object Number]',
	    regexpTag = '[object RegExp]',
	    stringTag = '[object String]';
	
	/**
	 * A specialized version of `baseIsEqualDeep` for comparing objects of
	 * the same `toStringTag`.
	 *
	 * **Note:** This function only supports comparing values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {string} tag The `toStringTag` of the objects to compare.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalByTag(object, other, tag) {
	  switch (tag) {
	    case boolTag:
	    case dateTag:
	      // Coerce dates and booleans to numbers, dates to milliseconds and booleans
	      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
	      return +object == +other;
	
	    case errorTag:
	      return object.name == other.name && object.message == other.message;
	
	    case numberTag:
	      // Treat `NaN` vs. `NaN` as equal.
	      return (object != +object)
	        ? other != +other
	        : object == +other;
	
	    case regexpTag:
	    case stringTag:
	      // Coerce regexes to strings and treat strings primitives and string
	      // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
	      return object == (other + '');
	  }
	  return false;
	}
	
	module.exports = equalByTag;


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var keys = __webpack_require__(21);
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * A specialized version of `baseIsEqualDeep` for objects with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing values.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
	  var objProps = keys(object),
	      objLength = objProps.length,
	      othProps = keys(other),
	      othLength = othProps.length;
	
	  if (objLength != othLength && !isLoose) {
	    return false;
	  }
	  var index = objLength;
	  while (index--) {
	    var key = objProps[index];
	    if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
	      return false;
	    }
	  }
	  var skipCtor = isLoose;
	  while (++index < objLength) {
	    key = objProps[index];
	    var objValue = object[key],
	        othValue = other[key],
	        result = customizer ? customizer(isLoose ? othValue : objValue, isLoose? objValue : othValue, key) : undefined;
	
	    // Recursively compare objects (susceptible to call stack limits).
	    if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
	      return false;
	    }
	    skipCtor || (skipCtor = key == 'constructor');
	  }
	  if (!skipCtor) {
	    var objCtor = object.constructor,
	        othCtor = other.constructor;
	
	    // Non `Object` object instances with different constructors are not equal.
	    if (objCtor != othCtor &&
	        ('constructor' in object && 'constructor' in other) &&
	        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	      return false;
	    }
	  }
	  return true;
	}
	
	module.exports = equalObjects;


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var isLength = __webpack_require__(30),
	    isObjectLike = __webpack_require__(26);
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    weakMapTag = '[object WeakMap]';
	
	var arrayBufferTag = '[object ArrayBuffer]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';
	
	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dateTag] = typedArrayTags[errorTag] =
	typedArrayTags[funcTag] = typedArrayTags[mapTag] =
	typedArrayTags[numberTag] = typedArrayTags[objectTag] =
	typedArrayTags[regexpTag] = typedArrayTags[setTag] =
	typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	function isTypedArray(value) {
	  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
	}
	
	module.exports = isTypedArray;


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(25);
	
	/**
	 * Converts `value` to an object if it's not one.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {Object} Returns the object.
	 */
	function toObject(value) {
	  return isObject(value) ? value : Object(value);
	}
	
	module.exports = toObject;


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var isStrictComparable = __webpack_require__(56),
	    pairs = __webpack_require__(57);
	
	/**
	 * Gets the propery names, values, and compare flags of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the match data of `object`.
	 */
	function getMatchData(object) {
	  var result = pairs(object),
	      length = result.length;
	
	  while (length--) {
	    result[length][2] = isStrictComparable(result[length][1]);
	  }
	  return result;
	}
	
	module.exports = getMatchData;


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(25);
	
	/**
	 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` if suitable for strict
	 *  equality comparisons, else `false`.
	 */
	function isStrictComparable(value) {
	  return value === value && !isObject(value);
	}
	
	module.exports = isStrictComparable;


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var keys = __webpack_require__(21),
	    toObject = __webpack_require__(54);
	
	/**
	 * Creates a two dimensional array of the key-value pairs for `object`,
	 * e.g. `[[key1, value1], [key2, value2]]`.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the new array of key-value pairs.
	 * @example
	 *
	 * _.pairs({ 'barney': 36, 'fred': 40 });
	 * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
	 */
	function pairs(object) {
	  object = toObject(object);
	
	  var index = -1,
	      props = keys(object),
	      length = props.length,
	      result = Array(length);
	
	  while (++index < length) {
	    var key = props[index];
	    result[index] = [key, object[key]];
	  }
	  return result;
	}
	
	module.exports = pairs;


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(59),
	    baseIsEqual = __webpack_require__(47),
	    baseSlice = __webpack_require__(60),
	    isArray = __webpack_require__(33),
	    isKey = __webpack_require__(61),
	    isStrictComparable = __webpack_require__(56),
	    last = __webpack_require__(62),
	    toObject = __webpack_require__(54),
	    toPath = __webpack_require__(63);
	
	/**
	 * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
	 *
	 * @private
	 * @param {string} path The path of the property to get.
	 * @param {*} srcValue The value to compare.
	 * @returns {Function} Returns the new function.
	 */
	function baseMatchesProperty(path, srcValue) {
	  var isArr = isArray(path),
	      isCommon = isKey(path) && isStrictComparable(srcValue),
	      pathKey = (path + '');
	
	  path = toPath(path);
	  return function(object) {
	    if (object == null) {
	      return false;
	    }
	    var key = pathKey;
	    object = toObject(object);
	    if ((isArr || !isCommon) && !(key in object)) {
	      object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
	      if (object == null) {
	        return false;
	      }
	      key = last(path);
	      object = toObject(object);
	    }
	    return object[key] === srcValue
	      ? (srcValue !== undefined || (key in object))
	      : baseIsEqual(srcValue, object[key], undefined, true);
	  };
	}
	
	module.exports = baseMatchesProperty;


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var toObject = __webpack_require__(54);
	
	/**
	 * The base implementation of `get` without support for string paths
	 * and default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array} path The path of the property to get.
	 * @param {string} [pathKey] The key representation of path.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path, pathKey) {
	  if (object == null) {
	    return;
	  }
	  if (pathKey !== undefined && pathKey in toObject(object)) {
	    path = [pathKey];
	  }
	  var index = 0,
	      length = path.length;
	
	  while (object != null && index < length) {
	    object = object[path[index++]];
	  }
	  return (index && index == length) ? object : undefined;
	}
	
	module.exports = baseGet;


/***/ },
/* 60 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.slice` without an iteratee call guard.
	 *
	 * @private
	 * @param {Array} array The array to slice.
	 * @param {number} [start=0] The start position.
	 * @param {number} [end=array.length] The end position.
	 * @returns {Array} Returns the slice of `array`.
	 */
	function baseSlice(array, start, end) {
	  var index = -1,
	      length = array.length;
	
	  start = start == null ? 0 : (+start || 0);
	  if (start < 0) {
	    start = -start > length ? 0 : (length + start);
	  }
	  end = (end === undefined || end > length) ? length : (+end || 0);
	  if (end < 0) {
	    end += length;
	  }
	  length = start > end ? 0 : ((end - start) >>> 0);
	  start >>>= 0;
	
	  var result = Array(length);
	  while (++index < length) {
	    result[index] = array[index + start];
	  }
	  return result;
	}
	
	module.exports = baseSlice;


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(33),
	    toObject = __webpack_require__(54);
	
	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
	    reIsPlainProp = /^\w*$/;
	
	/**
	 * Checks if `value` is a property name and not a property path.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	 */
	function isKey(value, object) {
	  var type = typeof value;
	  if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
	    return true;
	  }
	  if (isArray(value)) {
	    return false;
	  }
	  var result = !reIsDeepProp.test(value);
	  return result || (object != null && value in toObject(object));
	}
	
	module.exports = isKey;


/***/ },
/* 62 */
/***/ function(module, exports) {

	/**
	 * Gets the last element of `array`.
	 *
	 * @static
	 * @memberOf _
	 * @category Array
	 * @param {Array} array The array to query.
	 * @returns {*} Returns the last element of `array`.
	 * @example
	 *
	 * _.last([1, 2, 3]);
	 * // => 3
	 */
	function last(array) {
	  var length = array ? array.length : 0;
	  return length ? array[length - 1] : undefined;
	}
	
	module.exports = last;


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(64),
	    isArray = __webpack_require__(33);
	
	/** Used to match property names within property paths. */
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
	
	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;
	
	/**
	 * Converts `value` to property path array if it's not one.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {Array} Returns the property path array.
	 */
	function toPath(value) {
	  if (isArray(value)) {
	    return value;
	  }
	  var result = [];
	  baseToString(value).replace(rePropName, function(match, number, quote, string) {
	    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	}
	
	module.exports = toPath;


/***/ },
/* 64 */
/***/ function(module, exports) {

	/**
	 * Converts `value` to a string if it's not one. An empty string is returned
	 * for `null` or `undefined` values.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  return value == null ? '' : (value + '');
	}
	
	module.exports = baseToString;


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(29),
	    basePropertyDeep = __webpack_require__(66),
	    isKey = __webpack_require__(61);
	
	/**
	 * Creates a function that returns the property value at `path` on a
	 * given object.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var objects = [
	 *   { 'a': { 'b': { 'c': 2 } } },
	 *   { 'a': { 'b': { 'c': 1 } } }
	 * ];
	 *
	 * _.map(objects, _.property('a.b.c'));
	 * // => [2, 1]
	 *
	 * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
	 * // => [1, 2]
	 */
	function property(path) {
	  return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
	}
	
	module.exports = property;


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(59),
	    toPath = __webpack_require__(63);
	
	/**
	 * A specialized version of `baseProperty` which supports deep paths.
	 *
	 * @private
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function basePropertyDeep(path) {
	  var pathKey = (path + '');
	  path = toPath(path);
	  return function(object) {
	    return baseGet(object, path, pathKey);
	  };
	}
	
	module.exports = basePropertyDeep;


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var isIndex = __webpack_require__(34);
	
	/** Used for native method references. */
	var arrayProto = Array.prototype;
	
	/** Native method references. */
	var splice = arrayProto.splice;
	
	/**
	 * The base implementation of `_.pullAt` without support for individual
	 * index arguments and capturing the removed elements.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {number[]} indexes The indexes of elements to remove.
	 * @returns {Array} Returns `array`.
	 */
	function basePullAt(array, indexes) {
	  var length = array ? indexes.length : 0;
	  while (length--) {
	    var index = indexes[length];
	    if (index != previous && isIndex(index)) {
	      var previous = index;
	      splice.call(array, index, 1);
	    }
	  }
	  return array;
	}
	
	module.exports = basePullAt;


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var baseEach = __webpack_require__(69),
	    createFind = __webpack_require__(74);
	
	/**
	 * Iterates over elements of `collection`, returning the first element
	 * `predicate` returns truthy for. The predicate is bound to `thisArg` and
	 * invoked with three arguments: (value, index|key, collection).
	 *
	 * If a property name is provided for `predicate` the created `_.property`
	 * style callback returns the property value of the given element.
	 *
	 * If a value is also provided for `thisArg` the created `_.matchesProperty`
	 * style callback returns `true` for elements that have a matching property
	 * value, else `false`.
	 *
	 * If an object is provided for `predicate` the created `_.matches` style
	 * callback returns `true` for elements that have the properties of the given
	 * object, else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @alias detect
	 * @category Collection
	 * @param {Array|Object|string} collection The collection to search.
	 * @param {Function|Object|string} [predicate=_.identity] The function invoked
	 *  per iteration.
	 * @param {*} [thisArg] The `this` binding of `predicate`.
	 * @returns {*} Returns the matched element, else `undefined`.
	 * @example
	 *
	 * var users = [
	 *   { 'user': 'barney',  'age': 36, 'active': true },
	 *   { 'user': 'fred',    'age': 40, 'active': false },
	 *   { 'user': 'pebbles', 'age': 1,  'active': true }
	 * ];
	 *
	 * _.result(_.find(users, function(chr) {
	 *   return chr.age < 40;
	 * }), 'user');
	 * // => 'barney'
	 *
	 * // using the `_.matches` callback shorthand
	 * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
	 * // => 'pebbles'
	 *
	 * // using the `_.matchesProperty` callback shorthand
	 * _.result(_.find(users, 'active', false), 'user');
	 * // => 'fred'
	 *
	 * // using the `_.property` callback shorthand
	 * _.result(_.find(users, 'active'), 'user');
	 * // => 'barney'
	 */
	var find = createFind(baseEach);
	
	module.exports = find;


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var baseForOwn = __webpack_require__(70),
	    createBaseEach = __webpack_require__(73);
	
	/**
	 * The base implementation of `_.forEach` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array|Object|string} Returns `collection`.
	 */
	var baseEach = createBaseEach(baseForOwn);
	
	module.exports = baseEach;


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var baseFor = __webpack_require__(71),
	    keys = __webpack_require__(21);
	
	/**
	 * The base implementation of `_.forOwn` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForOwn(object, iteratee) {
	  return baseFor(object, iteratee, keys);
	}
	
	module.exports = baseForOwn;


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var createBaseFor = __webpack_require__(72);
	
	/**
	 * The base implementation of `baseForIn` and `baseForOwn` which iterates
	 * over `object` properties returned by `keysFunc` invoking `iteratee` for
	 * each property. Iteratee functions may exit iteration early by explicitly
	 * returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = createBaseFor();
	
	module.exports = baseFor;


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	var toObject = __webpack_require__(54);
	
	/**
	 * Creates a base function for `_.forIn` or `_.forInRight`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var iterable = toObject(object),
	        props = keysFunc(object),
	        length = props.length,
	        index = fromRight ? length : -1;
	
	    while ((fromRight ? index-- : ++index < length)) {
	      var key = props[index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}
	
	module.exports = createBaseFor;


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	var getLength = __webpack_require__(28),
	    isLength = __webpack_require__(30),
	    toObject = __webpack_require__(54);
	
	/**
	 * Creates a `baseEach` or `baseEachRight` function.
	 *
	 * @private
	 * @param {Function} eachFunc The function to iterate over a collection.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseEach(eachFunc, fromRight) {
	  return function(collection, iteratee) {
	    var length = collection ? getLength(collection) : 0;
	    if (!isLength(length)) {
	      return eachFunc(collection, iteratee);
	    }
	    var index = fromRight ? length : -1,
	        iterable = toObject(collection);
	
	    while ((fromRight ? index-- : ++index < length)) {
	      if (iteratee(iterable[index], index, iterable) === false) {
	        break;
	      }
	    }
	    return collection;
	  };
	}
	
	module.exports = createBaseEach;


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	var baseCallback = __webpack_require__(44),
	    baseFind = __webpack_require__(75),
	    baseFindIndex = __webpack_require__(76),
	    isArray = __webpack_require__(33);
	
	/**
	 * Creates a `_.find` or `_.findLast` function.
	 *
	 * @private
	 * @param {Function} eachFunc The function to iterate over a collection.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new find function.
	 */
	function createFind(eachFunc, fromRight) {
	  return function(collection, predicate, thisArg) {
	    predicate = baseCallback(predicate, thisArg, 3);
	    if (isArray(collection)) {
	      var index = baseFindIndex(collection, predicate, fromRight);
	      return index > -1 ? collection[index] : undefined;
	    }
	    return baseFind(collection, predicate, eachFunc);
	  };
	}
	
	module.exports = createFind;


/***/ },
/* 75 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
	 * without support for callback shorthands and `this` binding, which iterates
	 * over `collection` using the provided `eachFunc`.
	 *
	 * @private
	 * @param {Array|Object|string} collection The collection to search.
	 * @param {Function} predicate The function invoked per iteration.
	 * @param {Function} eachFunc The function to iterate over `collection`.
	 * @param {boolean} [retKey] Specify returning the key of the found element
	 *  instead of the element itself.
	 * @returns {*} Returns the found element or its key, else `undefined`.
	 */
	function baseFind(collection, predicate, eachFunc, retKey) {
	  var result;
	  eachFunc(collection, function(value, key, collection) {
	    if (predicate(value, key, collection)) {
	      result = retKey ? key : value;
	      return false;
	    }
	  });
	  return result;
	}
	
	module.exports = baseFind;


/***/ },
/* 76 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.findIndex` and `_.findLastIndex` without
	 * support for callback shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array} array The array to search.
	 * @param {Function} predicate The function invoked per iteration.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseFindIndex(array, predicate, fromRight) {
	  var length = array.length,
	      index = fromRight ? length : -1;
	
	  while ((fromRight ? index-- : ++index < length)) {
	    if (predicate(array[index], index, array)) {
	      return index;
	    }
	  }
	  return -1;
	}
	
	module.exports = baseFindIndex;


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	var baseMatches = __webpack_require__(45),
	    filter = __webpack_require__(78);
	
	/**
	 * Performs a deep comparison between each element in `collection` and the
	 * source object, returning an array of all elements that have equivalent
	 * property values.
	 *
	 * **Note:** This method supports comparing arrays, booleans, `Date` objects,
	 * numbers, `Object` objects, regexes, and strings. Objects are compared by
	 * their own, not inherited, enumerable properties. For comparing a single
	 * own or inherited property value see `_.matchesProperty`.
	 *
	 * @static
	 * @memberOf _
	 * @category Collection
	 * @param {Array|Object|string} collection The collection to search.
	 * @param {Object} source The object of property values to match.
	 * @returns {Array} Returns the new filtered array.
	 * @example
	 *
	 * var users = [
	 *   { 'user': 'barney', 'age': 36, 'active': false, 'pets': ['hoppy'] },
	 *   { 'user': 'fred',   'age': 40, 'active': true, 'pets': ['baby puss', 'dino'] }
	 * ];
	 *
	 * _.pluck(_.where(users, { 'age': 36, 'active': false }), 'user');
	 * // => ['barney']
	 *
	 * _.pluck(_.where(users, { 'pets': ['dino'] }), 'user');
	 * // => ['fred']
	 */
	function where(collection, source) {
	  return filter(collection, baseMatches(source));
	}
	
	module.exports = where;


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	var arrayFilter = __webpack_require__(79),
	    baseCallback = __webpack_require__(44),
	    baseFilter = __webpack_require__(80),
	    isArray = __webpack_require__(33);
	
	/**
	 * Iterates over elements of `collection`, returning an array of all elements
	 * `predicate` returns truthy for. The predicate is bound to `thisArg` and
	 * invoked with three arguments: (value, index|key, collection).
	 *
	 * If a property name is provided for `predicate` the created `_.property`
	 * style callback returns the property value of the given element.
	 *
	 * If a value is also provided for `thisArg` the created `_.matchesProperty`
	 * style callback returns `true` for elements that have a matching property
	 * value, else `false`.
	 *
	 * If an object is provided for `predicate` the created `_.matches` style
	 * callback returns `true` for elements that have the properties of the given
	 * object, else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @alias select
	 * @category Collection
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function|Object|string} [predicate=_.identity] The function invoked
	 *  per iteration.
	 * @param {*} [thisArg] The `this` binding of `predicate`.
	 * @returns {Array} Returns the new filtered array.
	 * @example
	 *
	 * _.filter([4, 5, 6], function(n) {
	 *   return n % 2 == 0;
	 * });
	 * // => [4, 6]
	 *
	 * var users = [
	 *   { 'user': 'barney', 'age': 36, 'active': true },
	 *   { 'user': 'fred',   'age': 40, 'active': false }
	 * ];
	 *
	 * // using the `_.matches` callback shorthand
	 * _.pluck(_.filter(users, { 'age': 36, 'active': true }), 'user');
	 * // => ['barney']
	 *
	 * // using the `_.matchesProperty` callback shorthand
	 * _.pluck(_.filter(users, 'active', false), 'user');
	 * // => ['fred']
	 *
	 * // using the `_.property` callback shorthand
	 * _.pluck(_.filter(users, 'active'), 'user');
	 * // => ['barney']
	 */
	function filter(collection, predicate, thisArg) {
	  var func = isArray(collection) ? arrayFilter : baseFilter;
	  predicate = baseCallback(predicate, thisArg, 3);
	  return func(collection, predicate);
	}
	
	module.exports = filter;


/***/ },
/* 79 */
/***/ function(module, exports) {

	/**
	 * A specialized version of `_.filter` for arrays without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {Array} Returns the new filtered array.
	 */
	function arrayFilter(array, predicate) {
	  var index = -1,
	      length = array.length,
	      resIndex = -1,
	      result = [];
	
	  while (++index < length) {
	    var value = array[index];
	    if (predicate(value, index, array)) {
	      result[++resIndex] = value;
	    }
	  }
	  return result;
	}
	
	module.exports = arrayFilter;


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	var baseEach = __webpack_require__(69);
	
	/**
	 * The base implementation of `_.filter` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {Array} Returns the new filtered array.
	 */
	function baseFilter(collection, predicate) {
	  var result = [];
	  baseEach(collection, function(value, index, collection) {
	    if (predicate(value, index, collection)) {
	      result.push(value);
	    }
	  });
	  return result;
	}
	
	module.exports = baseFilter;


/***/ }
/******/ ]);
//# sourceMappingURL=swing.js.map