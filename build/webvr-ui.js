(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.webvrui = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @api private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {Mixed} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @api private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @api public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Boolean} exists Only check if there are listeners.
 * @returns {Array|Boolean}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event, exists) {
  var evt = prefix ? prefix + event : event
    , available = this._events[evt];

  if (exists) return !!available;
  if (!available) return [];
  if (available.fn) return [available.fn];

  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
    ee[i] = available[i].fn;
  }

  return ee;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  var listener = new EE(fn, context || this)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  var listener = new EE(fn, context || this, true)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Remove the listeners of a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {Mixed} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
         listeners.fn === fn
      && (!once || listeners.once)
      && (!context || listeners.context === context)
    ) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
           listeners[i].fn !== fn
        || (once && !listeners[i].once)
        || (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {String|Symbol} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
  module.exports = EventEmitter;
}

},{}],2:[function(_dereq_,module,exports){
/*!
* screenfull
* v3.0.0 - 2015-11-24
* (c) Sindre Sorhus; MIT License
*/
(function () {
	'use strict';

	var isCommonjs = typeof module !== 'undefined' && module.exports;
	var keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element;

	var fn = (function () {
		var val;
		var valLength;

		var fnMap = [
			[
				'requestFullscreen',
				'exitFullscreen',
				'fullscreenElement',
				'fullscreenEnabled',
				'fullscreenchange',
				'fullscreenerror'
			],
			// new WebKit
			[
				'webkitRequestFullscreen',
				'webkitExitFullscreen',
				'webkitFullscreenElement',
				'webkitFullscreenEnabled',
				'webkitfullscreenchange',
				'webkitfullscreenerror'

			],
			// old WebKit (Safari 5.1)
			[
				'webkitRequestFullScreen',
				'webkitCancelFullScreen',
				'webkitCurrentFullScreenElement',
				'webkitCancelFullScreen',
				'webkitfullscreenchange',
				'webkitfullscreenerror'

			],
			[
				'mozRequestFullScreen',
				'mozCancelFullScreen',
				'mozFullScreenElement',
				'mozFullScreenEnabled',
				'mozfullscreenchange',
				'mozfullscreenerror'
			],
			[
				'msRequestFullscreen',
				'msExitFullscreen',
				'msFullscreenElement',
				'msFullscreenEnabled',
				'MSFullscreenChange',
				'MSFullscreenError'
			]
		];

		var i = 0;
		var l = fnMap.length;
		var ret = {};

		for (; i < l; i++) {
			val = fnMap[i];
			if (val && val[1] in document) {
				for (i = 0, valLength = val.length; i < valLength; i++) {
					ret[fnMap[0][i]] = val[i];
				}
				return ret;
			}
		}

		return false;
	})();

	var screenfull = {
		request: function (elem) {
			var request = fn.requestFullscreen;

			elem = elem || document.documentElement;

			// Work around Safari 5.1 bug: reports support for
			// keyboard in fullscreen even though it doesn't.
			// Browser sniffing, since the alternative with
			// setTimeout is even worse.
			if (/5\.1[\.\d]* Safari/.test(navigator.userAgent)) {
				elem[request]();
			} else {
				elem[request](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);
			}
		},
		exit: function () {
			document[fn.exitFullscreen]();
		},
		toggle: function (elem) {
			if (this.isFullscreen) {
				this.exit();
			} else {
				this.request(elem);
			}
		},
		raw: fn
	};

	if (!fn) {
		if (isCommonjs) {
			module.exports = false;
		} else {
			window.screenfull = false;
		}

		return;
	}

	Object.defineProperties(screenfull, {
		isFullscreen: {
			get: function () {
				return Boolean(document[fn.fullscreenElement]);
			}
		},
		element: {
			enumerable: true,
			get: function () {
				return document[fn.fullscreenElement];
			}
		},
		enabled: {
			enumerable: true,
			get: function () {
				// Coerce to boolean in case of old WebKit
				return Boolean(document[fn.fullscreenEnabled]);
			}
		}
	});

	if (isCommonjs) {
		module.exports = screenfull;
	} else {
		window.screenfull = screenfull;
	}
})();

},{}],3:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AbstractButton = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventemitter = _dereq_("eventemitter3");

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _DefaultButtonDom = _dereq_("./DefaultButtonDom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * An Abstract class to extend when implementing a custom button
 * @class
 * @abstract
 */
var AbstractButton = exports.AbstractButton = function (_EventEmitter) {
    _inherits(AbstractButton, _EventEmitter);

    /**
     * Constructs a new Abstract Button
     * @constructor
     * @param {HTMLCanvasElement} sourceCanvas
     * @param {String} icon a reference to which icon to use
     * @param {Object} [options] optionally provide parameters
     * @param {Number} [options.size=35] set the height of the button
     * @param {AbstractButtonDom} [options.buttonDom=DefaultButtonDom] set a custom AbstractButtonDom
     * @param {Boolean} [options.injectCSS=true] set to false if you want to write your own styles
     */
    function AbstractButton(sourceCanvas, icon, options) {
        _classCallCheck(this, AbstractButton);

        var _this = _possibleConstructorReturn(this, (AbstractButton.__proto__ || Object.getPrototypeOf(AbstractButton)).call(this));

        options = options || {};
        // Option to change pixel height of the button.
        options.size = options.size || 35;
        options.injectCSS = options.injectCSS !== false;

        _this.sourceCanvas = sourceCanvas;

        _this.button = options.buttonDom || new _DefaultButtonDom.DefaultButtonDom(options.size, icon);

        if (options.injectCSS) {
            _this.button.injectCSS();
        }
        return _this;
    }

    _createClass(AbstractButton, [{
        key: "remove",


        /**
         * remove any listeners and remove from DOM if currently in it
         */
        value: function remove() {
            if (this.domElement.parentElement) {
                this.domElement.parentElement.removeChild(this.domElement);
            }
        }
    }, {
        key: "domElement",
        get: function get() {
            return this.button.domElement;
        }
    }]);

    return AbstractButton;
}(_eventemitter2.default);

},{"./DefaultButtonDom":5,"eventemitter3":1}],4:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractButtonDom = exports.AbstractButtonDom = function () {
    function AbstractButtonDom(domElement) {
        _classCallCheck(this, AbstractButtonDom);

        this.domElement = domElement;
    }

    _createClass(AbstractButtonDom, [{
        key: "injectCSS",
        value: function injectCSS() {}
    }, {
        key: "setTitle",
        value: function setTitle(text) {
            var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        }
    }, {
        key: "setDescription",
        value: function setDescription(text) {}
    }]);

    return AbstractButtonDom;
}();

},{}],5:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DefaultButtonDom = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractButtonDom2 = _dereq_("./AbstractButtonDom");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _WebVRUI_css_injected = false;

var DefaultButtonDom = exports.DefaultButtonDom = function (_AbstractButtonDom) {
    _inherits(DefaultButtonDom, _AbstractButtonDom);

    function DefaultButtonDom(height, icon) {
        _classCallCheck(this, DefaultButtonDom);

        var _this = _possibleConstructorReturn(this, (DefaultButtonDom.__proto__ || Object.getPrototypeOf(DefaultButtonDom)).call(this, document.createElement("div")));

        _this.cssClassPrefix = "webvr-ui-button";

        _this.fontSize = height / 2.5;
        _this.height = height;

        var cls = _this.cssClassPrefix;

        _this.domElement.className = cls;

        var svgString = DefaultButtonDom["generate" + (icon.toLowerCase() === "vr" ? "VR" : "360") + "Icon"](_this.cssClassPrefix + "-svg", _this.fontSize);

        _this.domElement.innerHTML = "<button class=\"" + cls + "-button\" data-error=\"false\">\n                <div class=\"" + cls + "-title\"></div>\n                <div class=\"" + cls + "-logo\">" + svgString + ("</div>\n            </button>\n            <div class=\"" + cls + "-description\" />");
        return _this;
    }

    _createClass(DefaultButtonDom, [{
        key: "injectCSS",
        value: function injectCSS() {
            // Make sure its only injected once
            if (!_WebVRUI_css_injected) {
                _WebVRUI_css_injected = true;

                // Create the css
                var style = document.createElement("style");
                style.innerHTML = DefaultButtonDom.generateCss(this.cssClassPrefix, this.height, this.fontSize);

                var head = document.getElementsByTagName("head")[0];
                head.insertBefore(style, head.firstChild);
            }
        }
    }, {
        key: "setTitle",
        value: function setTitle(text) {
            var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var btn = this.domElement.querySelector("." + this.cssClassPrefix + "-button");
            var title = this.domElement.querySelector("." + this.cssClassPrefix + "-title");
            btn.title = text;
            btn.dataset.error = error;

            if (!text) {
                title.style.display = "none";
            } else {
                title.innerText = text;
                title.style.display = "inherit";
            }
        }
    }, {
        key: "setDescription",
        value: function setDescription(text) {
            this.domElement.querySelector("." + this.cssClassPrefix + "-description").innerHTML = text;
        }
    }], [{
        key: "generateVRIcon",
        value: function generateVRIcon(cssClass, height) {
            var aspect = 28 / 18;
            return "<svg class=\"" + cssClass + "\" version=\"1.1\" x=\"0px\" y=\"0px\" width=\"" + aspect * height + "px\" height=\"" + height + "px\" viewBox=\"0 0 28 18\" xml:space=\"preserve\">\n                <path fill=\"#000000\" d=\"M26.8,1.1C26.1,0.4,25.1,0,24.2,0H3.4c-1,0-1.7,0.4-2.4,1.1C0.3,1.7,0,2.7,0,3.6v10.7\n            c0,1,0.3,1.9,0.9,2.6C1.6,17.6,2.4,18,3.4,18h5c0.7,0,1.3-0.2,1.8-0.5c0.6-0.3,1-0.8,1.3-1.4l1.5-2.6C13.2,13.1,13,13,14,13v0h-0.2\n            h0c0.3,0,0.7,0.1,0.8,0.5l1.4,2.6c0.3,0.6,0.8,1.1,1.3,1.4c0.6,0.3,1.2,0.5,1.8,0.5h5c1,0,2-0.4,2.7-1.1c0.7-0.7,1.2-1.6,1.2-2.6\n            V3.6C28,2.7,27.5,1.7,26.8,1.1z M7.4,11.8c-1.6,0-2.8-1.3-2.8-2.8c0-1.6,1.3-2.8,2.8-2.8c1.6,0,2.8,1.3,2.8,2.8\n            C10.2,10.5,8.9,11.8,7.4,11.8z M20.1,11.8c-1.6,0-2.8-1.3-2.8-2.8c0-1.6,1.3-2.8,2.8-2.8C21.7,6.2,23,7.4,23,9\n            C23,10.5,21.7,11.8,20.1,11.8z\"/>\n            </svg>";
        }
    }, {
        key: "generate360Icon",
        value: function generate360Icon(cssClass, height) {
            var aspect = 28 / 18;
            return "<svg class=\"" + cssClass + "\" version=\"1.1\" x=\"0px\" y=\"0px\" width=\"" + aspect * height + "px\" height=\"" + height + "px\" viewBox=\"0 0 28 11\" xml:space=\"preserve\">\n                <path id=\"XMLID_16_\" d=\"M17.3,7.1c0.3,0,0.9,0,1.6,0c0.7,0,1.5-0.1,2.4-0.2c0.9-0.1,2-0.3,3-0.6c0.5-0.2,1.1-0.4,1.6-0.7\n            c0.5-0.3,0.8-0.7,0.8-0.9c0-0.1-0.1-0.3-0.3-0.5c-0.2-0.2-0.5-0.3-0.8-0.5c-0.6-0.3-1.3-0.5-2-0.6c-1.4-0.3-3-0.5-4.6-0.6\n            c-0.7-0.1-1.7-0.1-2.3-0.1v-1c0.6,0,1.6,0,2.4,0.1c1.6,0.1,3.2,0.2,4.7,0.5c0.8,0.2,1.5,0.3,2.2,0.6c0.4,0.2,0.7,0.3,1.1,0.6\n            C27.5,3.6,27.9,4,28,4.6c0.1,0.6-0.2,1.1-0.4,1.5c-0.3,0.3-0.6,0.6-0.9,0.8c-0.6,0.4-1.2,0.7-1.8,0.9c-1.2,0.5-2.3,0.7-3.3,1\n            c-1,0.2-1.9,0.3-2.6,0.4c-0.7,0.1-1.4,0.1-1.8,0.2c-0.2,0-0.5,0-0.5,0v1.6L13.7,8l3.1-2.9v1.9C16.8,7.1,17.1,7.1,17.3,7.1z\"/>\n            <path id=\"XMLID_15_\" d=\"M10.5,3.8c-0.3,0-0.8,0-1.5,0C8.4,3.8,7.6,3.9,6.7,4c-0.9,0.1-2,0.3-3,0.6C3.1,4.8,2.6,5,2.1,5.3\n            C1.6,5.6,1.3,6,1.3,6.2c0,0.1,0.1,0.3,0.3,0.5C1.8,6.8,2.1,7,2.4,7.1c0.6,0.3,1.3,0.5,2,0.6c1.4,0.3,2.8,0.5,4.4,0.6\n            c0.7,0.1,1.5,0.1,2.1,0.1v1c-0.6,0-1.4,0-2.2-0.1C7.1,9.3,5.6,9.1,4.1,8.8C3.3,8.7,2.6,8.5,1.9,8.2C1.5,8,1.2,7.9,0.8,7.6\n            C0.5,7.4,0.1,7,0,6.4c-0.1-0.6,0.2-1.1,0.4-1.5C0.7,4.6,1,4.3,1.3,4.1c0.6-0.4,1.2-0.7,1.8-0.9c1.2-0.5,2.3-0.7,3.3-1\n            C7.4,2,8.2,1.9,9,1.8c0.7-0.1,1.2-0.1,1.6-0.2c0.2,0,0.3,0,0.3,0V0L14,2.9l-3.1,2.9V3.9C10.9,3.9,10.7,3.8,10.5,3.8z\"/>\n            </svg>";
        }
    }, {
        key: "generateCss",
        value: function generateCss(prefix) {
            var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
            var fontSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 18;
            var errorColor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "rgba(255,255,255,0.4)";

            var borderWidth = 2;
            var borderRadius = height / 2;
            // borderRadius = 0;

            return "\n            button." + prefix + "-button {\n                border: white " + borderWidth + "px solid;\n                border-radius: " + borderRadius + "px;\n                box-sizing: border-box;\n                background: rgba(0,0,0, 0);\n\n                height: " + height + "px;\n                min-width: " + 125 + "px;\n                display: inline-block;\n                position: relative;\n\n                margin-top: 8px;\n\n                font-family: 'Karla', sans-serif;\n                cursor: pointer;\n\n                -webkit-transition: width 0.5s;\n                transition: width 0.5s;\n            }\n\n            /*\n            * Logo\n            */\n\n            ." + prefix + "-logo {\n                width: " + height + "px;\n                height: " + height + "px;\n                border-radius: " + borderRadius + "px;\n                background-color: white;\n                position: absolute;\n                top:-" + borderWidth + "px;\n                left:-" + borderWidth + "px;\n            }\n            ." + prefix + "-logo > svg {\n                margin-top: " + (height - fontSize) / 2 + "px;\n            }\n\n\n            /*\n            * Title\n            */\n\n            ." + prefix + "-title {\n                color: white;\n                position: relative;\n                font-size: " + fontSize + "px;\n                top: -" + borderWidth + "px;\n                line-height: " + (height - borderWidth * 2) + "px;\n                text-align: left;\n                padding-left: " + height * 1.05 + "px;\n                padding-right: " + (borderRadius - 10 < 5 ? 5 : borderRadius - 10) + "px;\n            }\n\n            /*\n            * Description\n            */\n\n            ." + prefix + "-description{\n                font-size: 13px;\n                margin-top: 5px;\n                margin-bottom: 10px;\n\n            }\n\n        ." + prefix + "-description, a {\n                color: white\n            }\n\n            /*\n            * Error\n            */\n\n            button." + prefix + "-button[data-error=true] {\n                border-color: " + errorColor + ";\n            }\n            button." + prefix + "-button[data-error=true] > ." + prefix + "-logo {\n                background-color: " + errorColor + ";\n            }\n            button." + prefix + "-button[data-error=true] > ." + prefix + "-title {\n                color: " + errorColor + ";\n            }\n\n        ";
        }
    }]);

    return DefaultButtonDom;
}(_AbstractButtonDom2.AbstractButtonDom);

},{"./AbstractButtonDom":4}],6:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Enter360Button = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _screenfull = _dereq_("screenfull");

var _screenfull2 = _interopRequireDefault(_screenfull);

var _AbstractButton2 = _dereq_("./AbstractButton");

var _states = _dereq_("./states");

var State = _interopRequireWildcard(_states);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Enter360Button = exports.Enter360Button = function (_AbstractButton) {
    _inherits(Enter360Button, _AbstractButton);

    function Enter360Button(sourceCanvas, options) {
        _classCallCheck(this, Enter360Button);

        var _this = _possibleConstructorReturn(this, (Enter360Button.__proto__ || Object.getPrototypeOf(Enter360Button)).call(this, sourceCanvas, "360", options));

        _this.__setState(State.READY_TO_PRESENT);

        _this.__onClick = _this.__onClick.bind(_this);
        _this.__onChangeFullscreen = _this.__onChangeFullscreen.bind(_this);
        _this.domElement.addEventListener("click", _this.__onClick);
        console.log(_screenfull2.default.raw.fullscreenchange);
        document.addEventListener(_screenfull2.default.raw.fullscreenchange, _this.__onChangeFullscreen);
        return _this;
    }

    /**
     * @private
     */


    _createClass(Enter360Button, [{
        key: "__setState",
        value: function __setState(state) {
            if (state != this.state) {
                switch (state) {
                    case State.READY_TO_PRESENT:
                        this.button.setTitle("Enter 360");
                        this.button.setDescription("");

                        if (this.state == State.PRESENTING) {
                            this.emit("exit");
                        }
                        break;
                    case State.PRESENTING:
                        this.button.setTitle("Exit 360");
                        this.button.setDescription("");

                        this.emit("enter");
                        break;
                    default:
                        this.emit("error", new Error("Unknown state " + state));
                }

                this.emit("change", state);
                this.state = state;
            }
        }
    }, {
        key: "__onChangeFullscreen",
        value: function __onChangeFullscreen(e) {
            this.__setState(_screenfull2.default.isFullscreen ? State.PRESENTING : State.READY_TO_PRESENT);
        }
    }, {
        key: "__onClick",
        value: function __onClick() {
            if (this.state == State.READY_TO_PRESENT) {
                this.enterFullscreen();
            } else if (this.state == State.PRESENTING) {
                this.exitFullscreen();
            }
        }
    }, {
        key: "enterFullscreen",
        value: function enterFullscreen() {
            if (_screenfull2.default.enabled) {
                _screenfull2.default.request(this.sourceCanvas);
                this.__setState(State.PRESENTING);
                return true;
            }
            return false;
        }
    }, {
        key: "exitFullscreen",
        value: function exitFullscreen() {
            if (_screenfull2.default.enabled && _screenfull2.default.isFullscreen) {
                _screenfull2.default.exit();
                this.__setState(State.READY_TO_PRESENT);
                return true;
            }
            return false;
        }
    }, {
        key: "remove",
        value: function remove() {
            this.domElement.removeEventListener('click', this.__onClick);
            document.removeEventListener(_screenfull2.default.raw.fullscreenchanged, this.__onChangeFullscreen);
            _get(Enter360Button.prototype.__proto__ || Object.getPrototypeOf(Enter360Button.prototype), "remove", this).call(this);
        }
    }]);

    return Enter360Button;
}(_AbstractButton2.AbstractButton);

},{"./AbstractButton":3,"./states":10,"screenfull":2}],7:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EnterVRButton = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _AbstractButton2 = _dereq_("./AbstractButton");

var _WebVRManager = _dereq_("./WebVRManager");

var manager = _interopRequireWildcard(_WebVRManager);

var _states = _dereq_("./states");

var State = _interopRequireWildcard(_states);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A button to allow easy-entry and messaging around a WebVR experience
 * @class
 */
var EnterVRButton = exports.EnterVRButton = function (_AbstractButton) {
    _inherits(EnterVRButton, _AbstractButton);

    /**
     * Construct a new Enter VR Button
     * @constructor
     * @param {HTMLCanvasElement} sourceCanvas the canvas that you want to present in WebVR
     * @param {Object} [options] optional parameters
     * @param {Number} [options.size=35] specify the height of the button
     * @param {AbstractButtonDom} [options.buttonConstructor=DefaultButtonDom] specify a custom button class
     * @param {Boolean} [options.injectCSS=true] set to false if you want to write your own styles
     */
    function EnterVRButton(sourceCanvas, options) {
        _classCallCheck(this, EnterVRButton);

        // Check if the browser is compatible with WebVR and has headsets.
        var _this = _possibleConstructorReturn(this, (EnterVRButton.__proto__ || Object.getPrototypeOf(EnterVRButton)).call(this, sourceCanvas, "VR", options));

        manager.getVRDisplay().then(function (display) {
            _this.display = display;
            _this.__setState(State.READY_TO_PRESENT);
        }).catch(function (e) {
            if (e.name == "NO_DISPLAYS") {
                _this.__setState(State.ERROR_NO_PRESENTABLE_DISPLAYS);
            } else if (e.name == "WEBVR_UNSUPPORTED") {
                _this.__setState(State.ERROR_BROWSER_NOT_SUPPORTED);
            }
        });
        //bind events
        _this.__onClick = _this.__onClick.bind(_this);
        _this.domElement.addEventListener("click", _this.__onClick);

        _this.__onVRDisplayPresentChange = _this.__onVRDisplayPresentChange.bind(_this);
        window.addEventListener("vrdisplaypresentchange", _this.__onVRDisplayPresentChange);
        return _this;
    }

    /**
     * @private
     */


    _createClass(EnterVRButton, [{
        key: "__onClick",
        value: function __onClick(e) {
            var _this2 = this;

            if (this.state == State.READY_TO_PRESENT) {
                manager.enterVR(this.display, this.sourceCanvas).then(function () {
                    return _this2.__setState(State.PRESENTING);
                },
                //this could fail if:
                //1. Display `canPresent` is false
                //2. Canvas is invalid
                //3. not executed via user interaction
                function () {
                    return _this2.__setState(State.ERROR_REQUEST_TO_PRESENT_REJECTED);
                });
            } else if (this.state == State.PRESENTING) {
                this.__setState(State.READY_TO_PRESENT);
                manager.exitVR(this.display).then(function () {
                    return _this2.__setState(State.READY_TO_PRESENT);
                },
                //this could fail if:
                //1. exit requested while not currently presenting
                function () {
                    return _this2.__setState(State.ERROR_EXIT_PRESENT_REJECTED);
                });
            }
        }

        /**
         * @private
         */

    }, {
        key: "__onVRDisplayPresentChange",
        value: function __onVRDisplayPresentChange() {
            var isPresenting = this.display && this.display.isPresenting;
            this.__setState(isPresenting ? State.PRESENTING : State.READY_TO_PRESENT);
        }

        /**
         * @private
         */

    }, {
        key: "__setState",
        value: function __setState(state) {
            if (state != this.state) {
                switch (state) {
                    case State.READY_TO_PRESENT:
                        this.button.setTitle("Enter VR");
                        this.button.setDescription("");
                        if (this.state === State.PRESENTING) {
                            this.emit("exit");
                        }
                        break;
                    case State.PRESENTING:
                        this.button.setTitle("Exit VR");
                        this.button.setDescription("");
                        this.emit("enter");
                        break;
                    //all errors fall-through to default, no break
                    case State.ERROR_NO_PRESENTABLE_DISPLAYS:
                        this.button.setTitle("Enter VR", true);
                        this.button.setDescription("No VR Headset found");
                    case State.ERROR_BROWSER_NOT_SUPPORTED:
                        this.button.setTitle("Browser not supported", true);
                        this.button.setDescription("Sorry, your browser doesn't support <a href='http://webvr.info'>WebVR</a>");
                    case State.ERROR_REQUEST_TO_PRESENT_REJECTED:
                        this.button.setTitle("Display can't present", true);
                        this.button.setDescription("Your display refused to present");
                    case State.ERROR_EXIT_PRESENT_REJECTED:
                    default:
                        this.emit("error", new Error(state));
                }

                this.emit("change", state);
                this.state = state;
            }
        }

        /**
         * clean up object for garbage collection
         */

    }, {
        key: "remove",
        value: function remove() {
            window.removeEventListener("vrdisplaypresentchage", this.__onVRDisplayPresentChange);
            this.domElement.removeEventListener("click", this.__onClick);
            _get(EnterVRButton.prototype.__proto__ || Object.getPrototypeOf(EnterVRButton.prototype), "remove", this).call(this);
        }
    }]);

    return EnterVRButton;
}(_AbstractButton2.AbstractButton);

},{"./AbstractButton":3,"./WebVRManager":8,"./states":10}],8:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

/**
* Promise returns true if there is at least one HMD device available.
 * @returns Promise<VRDisplay>
*/
var getVRDisplay = exports.getVRDisplay = function getVRDisplay() {
    return new Promise(function (resolve, reject) {
        if (!navigator || !navigator.getVRDisplays) {
            var e = new Error("Browser not supporting WebVR");
            e.name = "WEBVR_UNSUPPORTED";
            reject(e);
            return;
        }

        var rejectNoDisplay = function rejectNoDisplay() {
            // No displays are found.
            var e = new Error("No displays found");
            e.name = "NO_DISPLAYS";
            reject(e);
        };

        navigator.getVRDisplays().then(function (displays) {
            // Promise succeeds, but check if there are any displays actually.
            for (var i = 0; i < displays.length; i++) {
                console.log(displays[i]);
                if (displays[i].capabilities.canPresent) {
                    resolve(displays[i]);
                    break;
                }
            }

            rejectNoDisplay();
        }, rejectNoDisplay);
    });
};

/**
 * Enter presentation mode with your set VR display
 */
var enterVR = exports.enterVR = function enterVR(display, canvas) {
    return display.requestPresent([{
        source: canvas
    }]);
};

var exitVR = exports.exitVR = function exitVR(display) {
    return display.exitPresent();
};

},{}],9:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.manager = exports.State = exports.AbstractButton = exports.Enter360Button = exports.EnterVRButton = undefined;

var _WebVRManager = _dereq_("./WebVRManager");

var manager = _interopRequireWildcard(_WebVRManager);

var _states = _dereq_("./states");

var State = _interopRequireWildcard(_states);

var _AbstractButton = _dereq_("./AbstractButton");

var _EnterVRButton = _dereq_("./EnterVRButton");

var _Enter360Button = _dereq_("./Enter360Button");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.EnterVRButton = _EnterVRButton.EnterVRButton;
exports.Enter360Button = _Enter360Button.Enter360Button;
exports.AbstractButton = _AbstractButton.AbstractButton;
exports.State = State;
exports.manager = manager;

},{"./AbstractButton":3,"./Enter360Button":6,"./EnterVRButton":7,"./WebVRManager":8,"./states":10}],10:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var READY_TO_PRESENT = exports.READY_TO_PRESENT = "ready";
var PRESENTING = exports.PRESENTING = "presenting";
var ERROR_NO_PRESENTABLE_DISPLAYS = exports.ERROR_NO_PRESENTABLE_DISPLAYS = "error-no-presentable-displays";
var ERROR_BROWSER_NOT_SUPPORTED = exports.ERROR_BROWSER_NOT_SUPPORTED = "error-browser-not-supported";
var ERROR_REQUEST_TO_PRESENT_REJECTED = exports.ERROR_REQUEST_TO_PRESENT_REJECTED = "error-request-to-present-rejected";
var ERROR_EXIT_PRESENT_REJECTED = exports.ERROR_EXIT_PRESENT_REJECTED = "error-exit-present-rejected";

},{}]},{},[9])(9)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZXZlbnRlbWl0dGVyMy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zY3JlZW5mdWxsL2Rpc3Qvc2NyZWVuZnVsbC5qcyIsInNyYy9BYnN0cmFjdEJ1dHRvbi5qcyIsInNyYy9BYnN0cmFjdEJ1dHRvbkRvbS5qcyIsInNyYy9EZWZhdWx0QnV0dG9uRG9tLmpzIiwic3JjL0VudGVyMzYwQnV0dG9uLmpzIiwic3JjL0VudGVyVlJCdXR0b24uanMiLCJzcmMvV2ViVlJNYW5hZ2VyLmpzIiwic3JjL2luZGV4LmpzIiwic3JjL3N0YXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2VEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNqSkE7Ozs7QUFDQTs7Ozs7Ozs7OztBQUdBOzs7OztJQUthLGMsV0FBQSxj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LFlBQW5CO0FBQ0EsSUFBTSx3RUFBZ0MsK0JBQXRDO0FBQ0EsSUFBTSxvRUFBOEIsNkJBQXBDO0FBQ0EsSUFBTSxnRkFBb0MsbUNBQTFDO0FBQ0EsSUFBTSxvRUFBOEIsNkJBQXBDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHlcbiAgLCBwcmVmaXggPSAnfic7XG5cbi8qKlxuICogQ29uc3RydWN0b3IgdG8gY3JlYXRlIGEgc3RvcmFnZSBmb3Igb3VyIGBFRWAgb2JqZWN0cy5cbiAqIEFuIGBFdmVudHNgIGluc3RhbmNlIGlzIGEgcGxhaW4gb2JqZWN0IHdob3NlIHByb3BlcnRpZXMgYXJlIGV2ZW50IG5hbWVzLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIEV2ZW50cygpIHt9XG5cbi8vXG4vLyBXZSB0cnkgdG8gbm90IGluaGVyaXQgZnJvbSBgT2JqZWN0LnByb3RvdHlwZWAuIEluIHNvbWUgZW5naW5lcyBjcmVhdGluZyBhblxuLy8gaW5zdGFuY2UgaW4gdGhpcyB3YXkgaXMgZmFzdGVyIHRoYW4gY2FsbGluZyBgT2JqZWN0LmNyZWF0ZShudWxsKWAgZGlyZWN0bHkuXG4vLyBJZiBgT2JqZWN0LmNyZWF0ZShudWxsKWAgaXMgbm90IHN1cHBvcnRlZCB3ZSBwcmVmaXggdGhlIGV2ZW50IG5hbWVzIHdpdGggYVxuLy8gY2hhcmFjdGVyIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSBidWlsdC1pbiBvYmplY3QgcHJvcGVydGllcyBhcmUgbm90XG4vLyBvdmVycmlkZGVuIG9yIHVzZWQgYXMgYW4gYXR0YWNrIHZlY3Rvci5cbi8vXG5pZiAoT2JqZWN0LmNyZWF0ZSkge1xuICBFdmVudHMucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAvL1xuICAvLyBUaGlzIGhhY2sgaXMgbmVlZGVkIGJlY2F1c2UgdGhlIGBfX3Byb3RvX19gIHByb3BlcnR5IGlzIHN0aWxsIGluaGVyaXRlZCBpblxuICAvLyBzb21lIG9sZCBicm93c2VycyBsaWtlIEFuZHJvaWQgNCwgaVBob25lIDUuMSwgT3BlcmEgMTEgYW5kIFNhZmFyaSA1LlxuICAvL1xuICBpZiAoIW5ldyBFdmVudHMoKS5fX3Byb3RvX18pIHByZWZpeCA9IGZhbHNlO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudGF0aW9uIG9mIGEgc2luZ2xlIGV2ZW50IGxpc3RlbmVyLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBsaXN0ZW5lciBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7TWl4ZWR9IGNvbnRleHQgVGhlIGNvbnRleHQgdG8gaW52b2tlIHRoZSBsaXN0ZW5lciB3aXRoLlxuICogQHBhcmFtIHtCb29sZWFufSBbb25jZT1mYWxzZV0gU3BlY2lmeSBpZiB0aGUgbGlzdGVuZXIgaXMgYSBvbmUtdGltZSBsaXN0ZW5lci5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIEVFKGZuLCBjb250ZXh0LCBvbmNlKSB7XG4gIHRoaXMuZm4gPSBmbjtcbiAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgdGhpcy5vbmNlID0gb25jZSB8fCBmYWxzZTtcbn1cblxuLyoqXG4gKiBNaW5pbWFsIGBFdmVudEVtaXR0ZXJgIGludGVyZmFjZSB0aGF0IGlzIG1vbGRlZCBhZ2FpbnN0IHRoZSBOb2RlLmpzXG4gKiBgRXZlbnRFbWl0dGVyYCBpbnRlcmZhY2UuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXBpIHB1YmxpY1xuICovXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xufVxuXG4vKipcbiAqIFJldHVybiBhbiBhcnJheSBsaXN0aW5nIHRoZSBldmVudHMgZm9yIHdoaWNoIHRoZSBlbWl0dGVyIGhhcyByZWdpc3RlcmVkXG4gKiBsaXN0ZW5lcnMuXG4gKlxuICogQHJldHVybnMge0FycmF5fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5ldmVudE5hbWVzID0gZnVuY3Rpb24gZXZlbnROYW1lcygpIHtcbiAgdmFyIG5hbWVzID0gW11cbiAgICAsIGV2ZW50c1xuICAgICwgbmFtZTtcblxuICBpZiAodGhpcy5fZXZlbnRzQ291bnQgPT09IDApIHJldHVybiBuYW1lcztcblxuICBmb3IgKG5hbWUgaW4gKGV2ZW50cyA9IHRoaXMuX2V2ZW50cykpIHtcbiAgICBpZiAoaGFzLmNhbGwoZXZlbnRzLCBuYW1lKSkgbmFtZXMucHVzaChwcmVmaXggPyBuYW1lLnNsaWNlKDEpIDogbmFtZSk7XG4gIH1cblxuICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuICAgIHJldHVybiBuYW1lcy5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhldmVudHMpKTtcbiAgfVxuXG4gIHJldHVybiBuYW1lcztcbn07XG5cbi8qKlxuICogUmV0dXJuIHRoZSBsaXN0ZW5lcnMgcmVnaXN0ZXJlZCBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtCb29sZWFufSBleGlzdHMgT25seSBjaGVjayBpZiB0aGVyZSBhcmUgbGlzdGVuZXJzLlxuICogQHJldHVybnMge0FycmF5fEJvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uIGxpc3RlbmVycyhldmVudCwgZXhpc3RzKSB7XG4gIHZhciBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50XG4gICAgLCBhdmFpbGFibGUgPSB0aGlzLl9ldmVudHNbZXZ0XTtcblxuICBpZiAoZXhpc3RzKSByZXR1cm4gISFhdmFpbGFibGU7XG4gIGlmICghYXZhaWxhYmxlKSByZXR1cm4gW107XG4gIGlmIChhdmFpbGFibGUuZm4pIHJldHVybiBbYXZhaWxhYmxlLmZuXTtcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGF2YWlsYWJsZS5sZW5ndGgsIGVlID0gbmV3IEFycmF5KGwpOyBpIDwgbDsgaSsrKSB7XG4gICAgZWVbaV0gPSBhdmFpbGFibGVbaV0uZm47XG4gIH1cblxuICByZXR1cm4gZWU7XG59O1xuXG4vKipcbiAqIENhbGxzIGVhY2ggb2YgdGhlIGxpc3RlbmVycyByZWdpc3RlcmVkIGZvciBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gYHRydWVgIGlmIHRoZSBldmVudCBoYWQgbGlzdGVuZXJzLCBlbHNlIGBmYWxzZWAuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiBlbWl0KGV2ZW50LCBhMSwgYTIsIGEzLCBhNCwgYTUpIHtcbiAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XSkgcmV0dXJuIGZhbHNlO1xuXG4gIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbZXZ0XVxuICAgICwgbGVuID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICwgYXJnc1xuICAgICwgaTtcblxuICBpZiAobGlzdGVuZXJzLmZuKSB7XG4gICAgaWYgKGxpc3RlbmVycy5vbmNlKSB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcnMuZm4sIHVuZGVmaW5lZCwgdHJ1ZSk7XG5cbiAgICBzd2l0Y2ggKGxlbikge1xuICAgICAgY2FzZSAxOiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQpLCB0cnVlO1xuICAgICAgY2FzZSAyOiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExKSwgdHJ1ZTtcbiAgICAgIGNhc2UgMzogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIpLCB0cnVlO1xuICAgICAgY2FzZSA0OiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiwgYTMpLCB0cnVlO1xuICAgICAgY2FzZSA1OiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiwgYTMsIGE0KSwgdHJ1ZTtcbiAgICAgIGNhc2UgNjogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIsIGEzLCBhNCwgYTUpLCB0cnVlO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDEsIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0xKTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG5cbiAgICBsaXN0ZW5lcnMuZm4uYXBwbHkobGlzdGVuZXJzLmNvbnRleHQsIGFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHZhciBsZW5ndGggPSBsaXN0ZW5lcnMubGVuZ3RoXG4gICAgICAsIGo7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChsaXN0ZW5lcnNbaV0ub25jZSkgdGhpcy5yZW1vdmVMaXN0ZW5lcihldmVudCwgbGlzdGVuZXJzW2ldLmZuLCB1bmRlZmluZWQsIHRydWUpO1xuXG4gICAgICBzd2l0Y2ggKGxlbikge1xuICAgICAgICBjYXNlIDE6IGxpc3RlbmVyc1tpXS5mbi5jYWxsKGxpc3RlbmVyc1tpXS5jb250ZXh0KTsgYnJlYWs7XG4gICAgICAgIGNhc2UgMjogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQsIGExKTsgYnJlYWs7XG4gICAgICAgIGNhc2UgMzogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQsIGExLCBhMik7IGJyZWFrO1xuICAgICAgICBjYXNlIDQ6IGxpc3RlbmVyc1tpXS5mbi5jYWxsKGxpc3RlbmVyc1tpXS5jb250ZXh0LCBhMSwgYTIsIGEzKTsgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgaWYgKCFhcmdzKSBmb3IgKGogPSAxLCBhcmdzID0gbmV3IEFycmF5KGxlbiAtMSk7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgYXJnc1tqIC0gMV0gPSBhcmd1bWVudHNbal07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGlzdGVuZXJzW2ldLmZuLmFwcGx5KGxpc3RlbmVyc1tpXS5jb250ZXh0LCBhcmdzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8qKlxuICogQWRkIGEgbGlzdGVuZXIgZm9yIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8U3ltYm9sfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBsaXN0ZW5lciBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7TWl4ZWR9IFtjb250ZXh0PXRoaXNdIFRoZSBjb250ZXh0IHRvIGludm9rZSB0aGUgbGlzdGVuZXIgd2l0aC5cbiAqIEByZXR1cm5zIHtFdmVudEVtaXR0ZXJ9IGB0aGlzYC5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBmdW5jdGlvbiBvbihldmVudCwgZm4sIGNvbnRleHQpIHtcbiAgdmFyIGxpc3RlbmVyID0gbmV3IEVFKGZuLCBjb250ZXh0IHx8IHRoaXMpXG4gICAgLCBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHRoaXMuX2V2ZW50c1tldnRdID0gbGlzdGVuZXIsIHRoaXMuX2V2ZW50c0NvdW50Kys7XG4gIGVsc2UgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XS5mbikgdGhpcy5fZXZlbnRzW2V2dF0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2UgdGhpcy5fZXZlbnRzW2V2dF0gPSBbdGhpcy5fZXZlbnRzW2V2dF0sIGxpc3RlbmVyXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkIGEgb25lLXRpbWUgbGlzdGVuZXIgZm9yIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8U3ltYm9sfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBsaXN0ZW5lciBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7TWl4ZWR9IFtjb250ZXh0PXRoaXNdIFRoZSBjb250ZXh0IHRvIGludm9rZSB0aGUgbGlzdGVuZXIgd2l0aC5cbiAqIEByZXR1cm5zIHtFdmVudEVtaXR0ZXJ9IGB0aGlzYC5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uIG9uY2UoZXZlbnQsIGZuLCBjb250ZXh0KSB7XG4gIHZhciBsaXN0ZW5lciA9IG5ldyBFRShmbiwgY29udGV4dCB8fCB0aGlzLCB0cnVlKVxuICAgICwgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1tldnRdKSB0aGlzLl9ldmVudHNbZXZ0XSA9IGxpc3RlbmVyLCB0aGlzLl9ldmVudHNDb3VudCsrO1xuICBlbHNlIGlmICghdGhpcy5fZXZlbnRzW2V2dF0uZm4pIHRoaXMuX2V2ZW50c1tldnRdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlIHRoaXMuX2V2ZW50c1tldnRdID0gW3RoaXMuX2V2ZW50c1tldnRdLCBsaXN0ZW5lcl07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgbGlzdGVuZXJzIG9mIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8U3ltYm9sfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIE9ubHkgcmVtb3ZlIHRoZSBsaXN0ZW5lcnMgdGhhdCBtYXRjaCB0aGlzIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gY29udGV4dCBPbmx5IHJlbW92ZSB0aGUgbGlzdGVuZXJzIHRoYXQgaGF2ZSB0aGlzIGNvbnRleHQuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG9uY2UgT25seSByZW1vdmUgb25lLXRpbWUgbGlzdGVuZXJzLlxuICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gYHRoaXNgLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKGV2ZW50LCBmbiwgY29udGV4dCwgb25jZSkge1xuICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1tldnRdKSByZXR1cm4gdGhpcztcbiAgaWYgKCFmbikge1xuICAgIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKSB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gICAgZWxzZSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2dF07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW2V2dF07XG5cbiAgaWYgKGxpc3RlbmVycy5mbikge1xuICAgIGlmIChcbiAgICAgICAgIGxpc3RlbmVycy5mbiA9PT0gZm5cbiAgICAgICYmICghb25jZSB8fCBsaXN0ZW5lcnMub25jZSlcbiAgICAgICYmICghY29udGV4dCB8fCBsaXN0ZW5lcnMuY29udGV4dCA9PT0gY29udGV4dClcbiAgICApIHtcbiAgICAgIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKSB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gICAgICBlbHNlIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZ0XTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGV2ZW50cyA9IFtdLCBsZW5ndGggPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChcbiAgICAgICAgICAgbGlzdGVuZXJzW2ldLmZuICE9PSBmblxuICAgICAgICB8fCAob25jZSAmJiAhbGlzdGVuZXJzW2ldLm9uY2UpXG4gICAgICAgIHx8IChjb250ZXh0ICYmIGxpc3RlbmVyc1tpXS5jb250ZXh0ICE9PSBjb250ZXh0KVxuICAgICAgKSB7XG4gICAgICAgIGV2ZW50cy5wdXNoKGxpc3RlbmVyc1tpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9cbiAgICAvLyBSZXNldCB0aGUgYXJyYXksIG9yIHJlbW92ZSBpdCBjb21wbGV0ZWx5IGlmIHdlIGhhdmUgbm8gbW9yZSBsaXN0ZW5lcnMuXG4gICAgLy9cbiAgICBpZiAoZXZlbnRzLmxlbmd0aCkgdGhpcy5fZXZlbnRzW2V2dF0gPSBldmVudHMubGVuZ3RoID09PSAxID8gZXZlbnRzWzBdIDogZXZlbnRzO1xuICAgIGVsc2UgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICBlbHNlIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZ0XTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYWxsIGxpc3RlbmVycywgb3IgdGhvc2Ugb2YgdGhlIHNwZWNpZmllZCBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IFtldmVudF0gVGhlIGV2ZW50IG5hbWUuXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uIHJlbW92ZUFsbExpc3RlbmVycyhldmVudCkge1xuICB2YXIgZXZ0O1xuXG4gIGlmIChldmVudCkge1xuICAgIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG4gICAgaWYgKHRoaXMuX2V2ZW50c1tldnRdKSB7XG4gICAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgICAgZWxzZSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2dF07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vXG4vLyBBbGlhcyBtZXRob2RzIG5hbWVzIGJlY2F1c2UgcGVvcGxlIHJvbGwgbGlrZSB0aGF0LlxuLy9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub2ZmID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lcjtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uO1xuXG4vL1xuLy8gVGhpcyBmdW5jdGlvbiBkb2Vzbid0IGFwcGx5IGFueW1vcmUuXG4vL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBzZXRNYXhMaXN0ZW5lcnMoKSB7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy9cbi8vIEV4cG9zZSB0aGUgcHJlZml4LlxuLy9cbkV2ZW50RW1pdHRlci5wcmVmaXhlZCA9IHByZWZpeDtcblxuLy9cbi8vIEFsbG93IGBFdmVudEVtaXR0ZXJgIHRvIGJlIGltcG9ydGVkIGFzIG1vZHVsZSBuYW1lc3BhY2UuXG4vL1xuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuLy9cbi8vIEV4cG9zZSB0aGUgbW9kdWxlLlxuLy9cbmlmICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIG1vZHVsZSkge1xuICBtb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcbn1cbiIsIi8qIVxuKiBzY3JlZW5mdWxsXG4qIHYzLjAuMCAtIDIwMTUtMTEtMjRcbiogKGMpIFNpbmRyZSBTb3JodXM7IE1JVCBMaWNlbnNlXG4qL1xuKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBpc0NvbW1vbmpzID0gdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHM7XG5cdHZhciBrZXlib2FyZEFsbG93ZWQgPSB0eXBlb2YgRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgJ0FMTE9XX0tFWUJPQVJEX0lOUFVUJyBpbiBFbGVtZW50O1xuXG5cdHZhciBmbiA9IChmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHZhbDtcblx0XHR2YXIgdmFsTGVuZ3RoO1xuXG5cdFx0dmFyIGZuTWFwID0gW1xuXHRcdFx0W1xuXHRcdFx0XHQncmVxdWVzdEZ1bGxzY3JlZW4nLFxuXHRcdFx0XHQnZXhpdEZ1bGxzY3JlZW4nLFxuXHRcdFx0XHQnZnVsbHNjcmVlbkVsZW1lbnQnLFxuXHRcdFx0XHQnZnVsbHNjcmVlbkVuYWJsZWQnLFxuXHRcdFx0XHQnZnVsbHNjcmVlbmNoYW5nZScsXG5cdFx0XHRcdCdmdWxsc2NyZWVuZXJyb3InXG5cdFx0XHRdLFxuXHRcdFx0Ly8gbmV3IFdlYktpdFxuXHRcdFx0W1xuXHRcdFx0XHQnd2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4nLFxuXHRcdFx0XHQnd2Via2l0RXhpdEZ1bGxzY3JlZW4nLFxuXHRcdFx0XHQnd2Via2l0RnVsbHNjcmVlbkVsZW1lbnQnLFxuXHRcdFx0XHQnd2Via2l0RnVsbHNjcmVlbkVuYWJsZWQnLFxuXHRcdFx0XHQnd2Via2l0ZnVsbHNjcmVlbmNoYW5nZScsXG5cdFx0XHRcdCd3ZWJraXRmdWxsc2NyZWVuZXJyb3InXG5cblx0XHRcdF0sXG5cdFx0XHQvLyBvbGQgV2ViS2l0IChTYWZhcmkgNS4xKVxuXHRcdFx0W1xuXHRcdFx0XHQnd2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4nLFxuXHRcdFx0XHQnd2Via2l0Q2FuY2VsRnVsbFNjcmVlbicsXG5cdFx0XHRcdCd3ZWJraXRDdXJyZW50RnVsbFNjcmVlbkVsZW1lbnQnLFxuXHRcdFx0XHQnd2Via2l0Q2FuY2VsRnVsbFNjcmVlbicsXG5cdFx0XHRcdCd3ZWJraXRmdWxsc2NyZWVuY2hhbmdlJyxcblx0XHRcdFx0J3dlYmtpdGZ1bGxzY3JlZW5lcnJvcidcblxuXHRcdFx0XSxcblx0XHRcdFtcblx0XHRcdFx0J21velJlcXVlc3RGdWxsU2NyZWVuJyxcblx0XHRcdFx0J21vekNhbmNlbEZ1bGxTY3JlZW4nLFxuXHRcdFx0XHQnbW96RnVsbFNjcmVlbkVsZW1lbnQnLFxuXHRcdFx0XHQnbW96RnVsbFNjcmVlbkVuYWJsZWQnLFxuXHRcdFx0XHQnbW96ZnVsbHNjcmVlbmNoYW5nZScsXG5cdFx0XHRcdCdtb3pmdWxsc2NyZWVuZXJyb3InXG5cdFx0XHRdLFxuXHRcdFx0W1xuXHRcdFx0XHQnbXNSZXF1ZXN0RnVsbHNjcmVlbicsXG5cdFx0XHRcdCdtc0V4aXRGdWxsc2NyZWVuJyxcblx0XHRcdFx0J21zRnVsbHNjcmVlbkVsZW1lbnQnLFxuXHRcdFx0XHQnbXNGdWxsc2NyZWVuRW5hYmxlZCcsXG5cdFx0XHRcdCdNU0Z1bGxzY3JlZW5DaGFuZ2UnLFxuXHRcdFx0XHQnTVNGdWxsc2NyZWVuRXJyb3InXG5cdFx0XHRdXG5cdFx0XTtcblxuXHRcdHZhciBpID0gMDtcblx0XHR2YXIgbCA9IGZuTWFwLmxlbmd0aDtcblx0XHR2YXIgcmV0ID0ge307XG5cblx0XHRmb3IgKDsgaSA8IGw7IGkrKykge1xuXHRcdFx0dmFsID0gZm5NYXBbaV07XG5cdFx0XHRpZiAodmFsICYmIHZhbFsxXSBpbiBkb2N1bWVudCkge1xuXHRcdFx0XHRmb3IgKGkgPSAwLCB2YWxMZW5ndGggPSB2YWwubGVuZ3RoOyBpIDwgdmFsTGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRyZXRbZm5NYXBbMF1baV1dID0gdmFsW2ldO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiByZXQ7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9KSgpO1xuXG5cdHZhciBzY3JlZW5mdWxsID0ge1xuXHRcdHJlcXVlc3Q6IGZ1bmN0aW9uIChlbGVtKSB7XG5cdFx0XHR2YXIgcmVxdWVzdCA9IGZuLnJlcXVlc3RGdWxsc2NyZWVuO1xuXG5cdFx0XHRlbGVtID0gZWxlbSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cblx0XHRcdC8vIFdvcmsgYXJvdW5kIFNhZmFyaSA1LjEgYnVnOiByZXBvcnRzIHN1cHBvcnQgZm9yXG5cdFx0XHQvLyBrZXlib2FyZCBpbiBmdWxsc2NyZWVuIGV2ZW4gdGhvdWdoIGl0IGRvZXNuJ3QuXG5cdFx0XHQvLyBCcm93c2VyIHNuaWZmaW5nLCBzaW5jZSB0aGUgYWx0ZXJuYXRpdmUgd2l0aFxuXHRcdFx0Ly8gc2V0VGltZW91dCBpcyBldmVuIHdvcnNlLlxuXHRcdFx0aWYgKC81XFwuMVtcXC5cXGRdKiBTYWZhcmkvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcblx0XHRcdFx0ZWxlbVtyZXF1ZXN0XSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZWxlbVtyZXF1ZXN0XShrZXlib2FyZEFsbG93ZWQgJiYgRWxlbWVudC5BTExPV19LRVlCT0FSRF9JTlBVVCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRleGl0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRkb2N1bWVudFtmbi5leGl0RnVsbHNjcmVlbl0oKTtcblx0XHR9LFxuXHRcdHRvZ2dsZTogZnVuY3Rpb24gKGVsZW0pIHtcblx0XHRcdGlmICh0aGlzLmlzRnVsbHNjcmVlbikge1xuXHRcdFx0XHR0aGlzLmV4aXQoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMucmVxdWVzdChlbGVtKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHJhdzogZm5cblx0fTtcblxuXHRpZiAoIWZuKSB7XG5cdFx0aWYgKGlzQ29tbW9uanMpIHtcblx0XHRcdG1vZHVsZS5leHBvcnRzID0gZmFsc2U7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHdpbmRvdy5zY3JlZW5mdWxsID0gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMoc2NyZWVuZnVsbCwge1xuXHRcdGlzRnVsbHNjcmVlbjoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiBCb29sZWFuKGRvY3VtZW50W2ZuLmZ1bGxzY3JlZW5FbGVtZW50XSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRlbGVtZW50OiB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiBkb2N1bWVudFtmbi5mdWxsc2NyZWVuRWxlbWVudF07XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRlbmFibGVkOiB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdC8vIENvZXJjZSB0byBib29sZWFuIGluIGNhc2Ugb2Ygb2xkIFdlYktpdFxuXHRcdFx0XHRyZXR1cm4gQm9vbGVhbihkb2N1bWVudFtmbi5mdWxsc2NyZWVuRW5hYmxlZF0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0aWYgKGlzQ29tbW9uanMpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IHNjcmVlbmZ1bGw7XG5cdH0gZWxzZSB7XG5cdFx0d2luZG93LnNjcmVlbmZ1bGwgPSBzY3JlZW5mdWxsO1xuXHR9XG59KSgpO1xuIiwiaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tIFwiZXZlbnRlbWl0dGVyM1wiO1xuaW1wb3J0IHsgRGVmYXVsdEJ1dHRvbkRvbSB9IGZyb20gXCIuL0RlZmF1bHRCdXR0b25Eb21cIjtcblxuXG4vKipcbiAqIEFuIEFic3RyYWN0IGNsYXNzIHRvIGV4dGVuZCB3aGVuIGltcGxlbWVudGluZyBhIGN1c3RvbSBidXR0b25cbiAqIEBjbGFzc1xuICogQGFic3RyYWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBBYnN0cmFjdEJ1dHRvbiBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0cyBhIG5ldyBBYnN0cmFjdCBCdXR0b25cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSBzb3VyY2VDYW52YXNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gaWNvbiBhIHJlZmVyZW5jZSB0byB3aGljaCBpY29uIHRvIHVzZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gb3B0aW9uYWxseSBwcm92aWRlIHBhcmFtZXRlcnNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuc2l6ZT0zNV0gc2V0IHRoZSBoZWlnaHQgb2YgdGhlIGJ1dHRvblxuICAgICAqIEBwYXJhbSB7QWJzdHJhY3RCdXR0b25Eb219IFtvcHRpb25zLmJ1dHRvbkRvbT1EZWZhdWx0QnV0dG9uRG9tXSBzZXQgYSBjdXN0b20gQWJzdHJhY3RCdXR0b25Eb21cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmluamVjdENTUz10cnVlXSBzZXQgdG8gZmFsc2UgaWYgeW91IHdhbnQgdG8gd3JpdGUgeW91ciBvd24gc3R5bGVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc291cmNlQ2FudmFzLCBpY29uLCBvcHRpb25zKXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgIC8vIE9wdGlvbiB0byBjaGFuZ2UgcGl4ZWwgaGVpZ2h0IG9mIHRoZSBidXR0b24uXG4gICAgICAgIG9wdGlvbnMuc2l6ZSA9ICBvcHRpb25zLnNpemUgfHwgMzU7XG4gICAgICAgIG9wdGlvbnMuaW5qZWN0Q1NTID0gb3B0aW9ucy5pbmplY3RDU1MgIT09IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuc291cmNlQ2FudmFzID0gc291cmNlQ2FudmFzO1xuXG4gICAgICAgIHRoaXMuYnV0dG9uID0gb3B0aW9ucy5idXR0b25Eb20gfHwgbmV3IERlZmF1bHRCdXR0b25Eb20ob3B0aW9ucy5zaXplLCBpY29uKTtcblxuICAgICAgICBpZihvcHRpb25zLmluamVjdENTUykge1xuICAgICAgICAgICAgdGhpcy5idXR0b24uaW5qZWN0Q1NTKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgZG9tRWxlbWVudCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5idXR0b24uZG9tRWxlbWVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZW1vdmUgYW55IGxpc3RlbmVycyBhbmQgcmVtb3ZlIGZyb20gRE9NIGlmIGN1cnJlbnRseSBpbiBpdFxuICAgICAqL1xuICAgIHJlbW92ZSgpe1xuICAgICAgICBpZih0aGlzLmRvbUVsZW1lbnQucGFyZW50RWxlbWVudCl7XG4gICAgICAgICAgICB0aGlzLmRvbUVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmRvbUVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEFic3RyYWN0QnV0dG9uRG9tIHtcbiAgICBjb25zdHJ1Y3Rvcihkb21FbGVtZW50KXtcbiAgICAgICAgdGhpcy5kb21FbGVtZW50ID0gZG9tRWxlbWVudDtcbiAgICB9XG4gICAgXG4gICAgaW5qZWN0Q1NTKCl7XG4gICAgICAgIFxuICAgIH1cblxuICAgIHNldFRpdGxlKHRleHQsIGVycm9yID0gZmFsc2UpIHtcbiAgICB9XG5cbiAgICBzZXREZXNjcmlwdGlvbih0ZXh0KSB7XG4gICAgfVxufSIsImltcG9ydCB7QWJzdHJhY3RCdXR0b25Eb219IGZyb20gXCIuL0Fic3RyYWN0QnV0dG9uRG9tXCI7XG5cbmxldCBfV2ViVlJVSV9jc3NfaW5qZWN0ZWQgPSBmYWxzZTtcblxuXG5leHBvcnQgY2xhc3MgRGVmYXVsdEJ1dHRvbkRvbSBleHRlbmRzIEFic3RyYWN0QnV0dG9uRG9tIHtcbiAgICBjb25zdHJ1Y3RvcihoZWlnaHQsIGljb24pe1xuICAgICAgICBzdXBlcihkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtcblxuICAgICAgICB0aGlzLmNzc0NsYXNzUHJlZml4ID0gXCJ3ZWJ2ci11aS1idXR0b25cIjtcblxuICAgICAgICB0aGlzLmZvbnRTaXplID0gaGVpZ2h0LzIuNTtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICAgICAgbGV0IHsgY3NzQ2xhc3NQcmVmaXg6Y2xzIH0gPSB0aGlzO1xuICAgICAgICB0aGlzLmRvbUVsZW1lbnQuY2xhc3NOYW1lID0gY2xzO1xuXG4gICAgICAgIGNvbnN0IHN2Z1N0cmluZyA9IERlZmF1bHRCdXR0b25Eb21bIFwiZ2VuZXJhdGVcIiArIChpY29uLnRvTG93ZXJDYXNlKCkgPT09IFwidnJcIiA/IFwiVlJcIiA6IFwiMzYwXCIpICsgXCJJY29uXCJdKHRoaXMuY3NzQ2xhc3NQcmVmaXggKyBcIi1zdmdcIiwgdGhpcy5mb250U2l6ZSk7XG5cbiAgICAgICAgdGhpcy5kb21FbGVtZW50LmlubmVySFRNTCA9IChcbiAgICAgICAgICAgIGA8YnV0dG9uIGNsYXNzPVwiJHtjbHN9LWJ1dHRvblwiIGRhdGEtZXJyb3I9XCJmYWxzZVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCIke2Nsc30tdGl0bGVcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiJHtjbHN9LWxvZ29cIj5gK1xuICAgICAgICAgICAgICAgICAgICBzdmdTdHJpbmcgK1xuICAgICAgICAgICAgICAgIGA8L2Rpdj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIiR7Y2xzfS1kZXNjcmlwdGlvblwiIC8+YFxuICAgICAgICApO1xuICAgIH1cblxuXG4gICAgaW5qZWN0Q1NTKCl7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSBpdHMgb25seSBpbmplY3RlZCBvbmNlXG4gICAgICAgIGlmKCFfV2ViVlJVSV9jc3NfaW5qZWN0ZWQpIHtcbiAgICAgICAgICAgIF9XZWJWUlVJX2Nzc19pbmplY3RlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgY3NzXG4gICAgICAgICAgICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgICAgICAgICAgIHN0eWxlLmlubmVySFRNTCA9IERlZmF1bHRCdXR0b25Eb20uZ2VuZXJhdGVDc3ModGhpcy5jc3NDbGFzc1ByZWZpeCAsIHRoaXMuaGVpZ2h0LCB0aGlzLmZvbnRTaXplKTtcblxuICAgICAgICAgICAgdmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XG4gICAgICAgICAgICBoZWFkLmluc2VydEJlZm9yZShzdHlsZSxoZWFkLmZpcnN0Q2hpbGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0VGl0bGUodGV4dCwgZXJyb3IgPSBmYWxzZSl7XG4gICAgICAgIGNvbnN0IGJ0biA9IHRoaXMuZG9tRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLlwiICt0aGlzLmNzc0NsYXNzUHJlZml4K1wiLWJ1dHRvblwiKTtcbiAgICAgICAgY29uc3QgdGl0bGUgPSB0aGlzLmRvbUVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5cIit0aGlzLmNzc0NsYXNzUHJlZml4ICsgXCItdGl0bGVcIik7XG4gICAgICAgIGJ0bi50aXRsZSA9IHRleHQ7XG4gICAgICAgIGJ0bi5kYXRhc2V0LmVycm9yID0gZXJyb3I7XG5cbiAgICAgICAgaWYoIXRleHQpe1xuICAgICAgICAgICAgdGl0bGUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGl0bGUuaW5uZXJUZXh0ID0gdGV4dDtcbiAgICAgICAgICAgIHRpdGxlLnN0eWxlLmRpc3BsYXkgPSBcImluaGVyaXRcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldERlc2NyaXB0aW9uKHRleHQpe1xuICAgICAgICB0aGlzLmRvbUVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5cIit0aGlzLmNzc0NsYXNzUHJlZml4ICsgXCItZGVzY3JpcHRpb25cIikuaW5uZXJIVE1MID0gdGV4dDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2VuZXJhdGVWUkljb24oY3NzQ2xhc3MsIGhlaWdodCl7XG4gICAgICAgIGxldCBhc3BlY3QgPSAyOC8xODtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIGA8c3ZnIGNsYXNzPVwiJHtjc3NDbGFzc31cIiB2ZXJzaW9uPVwiMS4xXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB3aWR0aD1cIiR7YXNwZWN0KmhlaWdodH1weFwiIGhlaWdodD1cIiR7aGVpZ2h0fXB4XCIgdmlld0JveD1cIjAgMCAyOCAxOFwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+XG4gICAgICAgICAgICAgICAgPHBhdGggZmlsbD1cIiMwMDAwMDBcIiBkPVwiTTI2LjgsMS4xQzI2LjEsMC40LDI1LjEsMCwyNC4yLDBIMy40Yy0xLDAtMS43LDAuNC0yLjQsMS4xQzAuMywxLjcsMCwyLjcsMCwzLjZ2MTAuN1xuICAgICAgICAgICAgYzAsMSwwLjMsMS45LDAuOSwyLjZDMS42LDE3LjYsMi40LDE4LDMuNCwxOGg1YzAuNywwLDEuMy0wLjIsMS44LTAuNWMwLjYtMC4zLDEtMC44LDEuMy0xLjRsMS41LTIuNkMxMy4yLDEzLjEsMTMsMTMsMTQsMTN2MGgtMC4yXG4gICAgICAgICAgICBoMGMwLjMsMCwwLjcsMC4xLDAuOCwwLjVsMS40LDIuNmMwLjMsMC42LDAuOCwxLjEsMS4zLDEuNGMwLjYsMC4zLDEuMiwwLjUsMS44LDAuNWg1YzEsMCwyLTAuNCwyLjctMS4xYzAuNy0wLjcsMS4yLTEuNiwxLjItMi42XG4gICAgICAgICAgICBWMy42QzI4LDIuNywyNy41LDEuNywyNi44LDEuMXogTTcuNCwxMS44Yy0xLjYsMC0yLjgtMS4zLTIuOC0yLjhjMC0xLjYsMS4zLTIuOCwyLjgtMi44YzEuNiwwLDIuOCwxLjMsMi44LDIuOFxuICAgICAgICAgICAgQzEwLjIsMTAuNSw4LjksMTEuOCw3LjQsMTEuOHogTTIwLjEsMTEuOGMtMS42LDAtMi44LTEuMy0yLjgtMi44YzAtMS42LDEuMy0yLjgsMi44LTIuOEMyMS43LDYuMiwyMyw3LjQsMjMsOVxuICAgICAgICAgICAgQzIzLDEwLjUsMjEuNywxMS44LDIwLjEsMTEuOHpcIi8+XG4gICAgICAgICAgICA8L3N2Zz5gXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdlbmVyYXRlMzYwSWNvbihjc3NDbGFzcywgaGVpZ2h0KXtcbiAgICAgICAgbGV0IGFzcGVjdCA9IDI4LzE4O1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgYDxzdmcgY2xhc3M9XCIke2Nzc0NsYXNzfVwiIHZlcnNpb249XCIxLjFcIiB4PVwiMHB4XCIgeT1cIjBweFwiIHdpZHRoPVwiJHthc3BlY3QqaGVpZ2h0fXB4XCIgaGVpZ2h0PVwiJHtoZWlnaHR9cHhcIiB2aWV3Qm94PVwiMCAwIDI4IDExXCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj5cbiAgICAgICAgICAgICAgICA8cGF0aCBpZD1cIlhNTElEXzE2X1wiIGQ9XCJNMTcuMyw3LjFjMC4zLDAsMC45LDAsMS42LDBjMC43LDAsMS41LTAuMSwyLjQtMC4yYzAuOS0wLjEsMi0wLjMsMy0wLjZjMC41LTAuMiwxLjEtMC40LDEuNi0wLjdcbiAgICAgICAgICAgIGMwLjUtMC4zLDAuOC0wLjcsMC44LTAuOWMwLTAuMS0wLjEtMC4zLTAuMy0wLjVjLTAuMi0wLjItMC41LTAuMy0wLjgtMC41Yy0wLjYtMC4zLTEuMy0wLjUtMi0wLjZjLTEuNC0wLjMtMy0wLjUtNC42LTAuNlxuICAgICAgICAgICAgYy0wLjctMC4xLTEuNy0wLjEtMi4zLTAuMXYtMWMwLjYsMCwxLjYsMCwyLjQsMC4xYzEuNiwwLjEsMy4yLDAuMiw0LjcsMC41YzAuOCwwLjIsMS41LDAuMywyLjIsMC42YzAuNCwwLjIsMC43LDAuMywxLjEsMC42XG4gICAgICAgICAgICBDMjcuNSwzLjYsMjcuOSw0LDI4LDQuNmMwLjEsMC42LTAuMiwxLjEtMC40LDEuNWMtMC4zLDAuMy0wLjYsMC42LTAuOSwwLjhjLTAuNiwwLjQtMS4yLDAuNy0xLjgsMC45Yy0xLjIsMC41LTIuMywwLjctMy4zLDFcbiAgICAgICAgICAgIGMtMSwwLjItMS45LDAuMy0yLjYsMC40Yy0wLjcsMC4xLTEuNCwwLjEtMS44LDAuMmMtMC4yLDAtMC41LDAtMC41LDB2MS42TDEzLjcsOGwzLjEtMi45djEuOUMxNi44LDcuMSwxNy4xLDcuMSwxNy4zLDcuMXpcIi8+XG4gICAgICAgICAgICA8cGF0aCBpZD1cIlhNTElEXzE1X1wiIGQ9XCJNMTAuNSwzLjhjLTAuMywwLTAuOCwwLTEuNSwwQzguNCwzLjgsNy42LDMuOSw2LjcsNGMtMC45LDAuMS0yLDAuMy0zLDAuNkMzLjEsNC44LDIuNiw1LDIuMSw1LjNcbiAgICAgICAgICAgIEMxLjYsNS42LDEuMyw2LDEuMyw2LjJjMCwwLjEsMC4xLDAuMywwLjMsMC41QzEuOCw2LjgsMi4xLDcsMi40LDcuMWMwLjYsMC4zLDEuMywwLjUsMiwwLjZjMS40LDAuMywyLjgsMC41LDQuNCwwLjZcbiAgICAgICAgICAgIGMwLjcsMC4xLDEuNSwwLjEsMi4xLDAuMXYxYy0wLjYsMC0xLjQsMC0yLjItMC4xQzcuMSw5LjMsNS42LDkuMSw0LjEsOC44QzMuMyw4LjcsMi42LDguNSwxLjksOC4yQzEuNSw4LDEuMiw3LjksMC44LDcuNlxuICAgICAgICAgICAgQzAuNSw3LjQsMC4xLDcsMCw2LjRjLTAuMS0wLjYsMC4yLTEuMSwwLjQtMS41QzAuNyw0LjYsMSw0LjMsMS4zLDQuMWMwLjYtMC40LDEuMi0wLjcsMS44LTAuOWMxLjItMC41LDIuMy0wLjcsMy4zLTFcbiAgICAgICAgICAgIEM3LjQsMiw4LjIsMS45LDksMS44YzAuNy0wLjEsMS4yLTAuMSwxLjYtMC4yYzAuMiwwLDAuMywwLDAuMywwVjBMMTQsMi45bC0zLjEsMi45VjMuOUMxMC45LDMuOSwxMC43LDMuOCwxMC41LDMuOHpcIi8+XG4gICAgICAgICAgICA8L3N2Zz5gXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdlbmVyYXRlQ3NzKHByZWZpeCwgaGVpZ2h0ID0gNTAsIGZvbnRTaXplID0gMTgsIGVycm9yQ29sb3I9XCJyZ2JhKDI1NSwyNTUsMjU1LDAuNClcIil7XG4gICAgICAgIGxldCBib3JkZXJXaWR0aCA9IDI7XG4gICAgICAgIGxldCBib3JkZXJSYWRpdXMgPSBoZWlnaHQgLyAyO1xuICAgICAgICAvLyBib3JkZXJSYWRpdXMgPSAwO1xuXG4gICAgICAgIHJldHVybiAoYFxuICAgICAgICAgICAgYnV0dG9uLiR7cHJlZml4fS1idXR0b24ge1xuICAgICAgICAgICAgICAgIGJvcmRlcjogd2hpdGUgJHtib3JkZXJXaWR0aH1weCBzb2xpZDtcbiAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiAke2JvcmRlclJhZGl1c31weDtcbiAgICAgICAgICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMCwwLDAsIDApO1xuXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAke2hlaWdodH1weDtcbiAgICAgICAgICAgICAgICBtaW4td2lkdGg6ICR7MTI1fXB4O1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgICAgICAgICAgICAgICBtYXJnaW4tdG9wOiA4cHg7XG5cbiAgICAgICAgICAgICAgICBmb250LWZhbWlseTogJ0thcmxhJywgc2Fucy1zZXJpZjtcbiAgICAgICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG5cbiAgICAgICAgICAgICAgICAtd2Via2l0LXRyYW5zaXRpb246IHdpZHRoIDAuNXM7XG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogd2lkdGggMC41cztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICogTG9nb1xuICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgLiR7cHJlZml4fS1sb2dvIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogJHtoZWlnaHR9cHg7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAke2hlaWdodH1weDtcbiAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiAke2JvcmRlclJhZGl1c31weDtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgICAgICAgdG9wOi0ke2JvcmRlcldpZHRofXB4O1xuICAgICAgICAgICAgICAgIGxlZnQ6LSR7Ym9yZGVyV2lkdGh9cHg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuJHtwcmVmaXh9LWxvZ28gPiBzdmcge1xuICAgICAgICAgICAgICAgIG1hcmdpbi10b3A6ICR7KGhlaWdodCAtIGZvbnRTaXplKSAvIDJ9cHg7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICogVGl0bGVcbiAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIC4ke3ByZWZpeH0tdGl0bGUge1xuICAgICAgICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAke2ZvbnRTaXplfXB4O1xuICAgICAgICAgICAgICAgIHRvcDogLSR7Ym9yZGVyV2lkdGh9cHg7XG4gICAgICAgICAgICAgICAgbGluZS1oZWlnaHQ6ICR7aGVpZ2h0IC0gYm9yZGVyV2lkdGggKiAyfXB4O1xuICAgICAgICAgICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgICAgICAgICAgICAgcGFkZGluZy1sZWZ0OiAke2hlaWdodCAqIDEuMDV9cHg7XG4gICAgICAgICAgICAgICAgcGFkZGluZy1yaWdodDogJHsoYm9yZGVyUmFkaXVzLTEwIDwgNSkgPyA1IDogYm9yZGVyUmFkaXVzLTEwfXB4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgKiBEZXNjcmlwdGlvblxuICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgLiR7cHJlZml4fS1kZXNjcmlwdGlvbntcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDEzcHg7XG4gICAgICAgICAgICAgICAgbWFyZ2luLXRvcDogNXB4O1xuICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAuJHtwcmVmaXh9LWRlc2NyaXB0aW9uLCBhIHtcbiAgICAgICAgICAgICAgICBjb2xvcjogd2hpdGVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICogRXJyb3JcbiAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIGJ1dHRvbi4ke3ByZWZpeH0tYnV0dG9uW2RhdGEtZXJyb3I9dHJ1ZV0ge1xuICAgICAgICAgICAgICAgIGJvcmRlci1jb2xvcjogJHtlcnJvckNvbG9yfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ1dHRvbi4ke3ByZWZpeH0tYnV0dG9uW2RhdGEtZXJyb3I9dHJ1ZV0gPiAuJHtwcmVmaXh9LWxvZ28ge1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7ZXJyb3JDb2xvcn07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBidXR0b24uJHtwcmVmaXh9LWJ1dHRvbltkYXRhLWVycm9yPXRydWVdID4gLiR7cHJlZml4fS10aXRsZSB7XG4gICAgICAgICAgICAgICAgY29sb3I6ICR7ZXJyb3JDb2xvcn07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgYCk7XG5cbiAgICB9XG59XG4iLCJpbXBvcnQgc2NyZWVuZnVsbCBmcm9tIFwic2NyZWVuZnVsbFwiO1xuaW1wb3J0IHtBYnN0cmFjdEJ1dHRvbn0gZnJvbSBcIi4vQWJzdHJhY3RCdXR0b25cIjtcbmltcG9ydCAqIGFzIFN0YXRlIGZyb20gXCIuL3N0YXRlc1wiO1xuXG5cblxuZXhwb3J0IGNsYXNzIEVudGVyMzYwQnV0dG9uIGV4dGVuZHMgQWJzdHJhY3RCdXR0b24ge1xuICAgIGNvbnN0cnVjdG9yKHNvdXJjZUNhbnZhcywgb3B0aW9ucyl7XG4gICAgICAgIHN1cGVyKHNvdXJjZUNhbnZhcywgXCIzNjBcIiwgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuX19zZXRTdGF0ZShTdGF0ZS5SRUFEWV9UT19QUkVTRU5UKTtcblxuICAgICAgICB0aGlzLl9fb25DbGljayA9IHRoaXMuX19vbkNsaWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX19vbkNoYW5nZUZ1bGxzY3JlZW4gPSB0aGlzLl9fb25DaGFuZ2VGdWxsc2NyZWVuLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5fX29uQ2xpY2spO1xuICAgICAgICBjb25zb2xlLmxvZyhzY3JlZW5mdWxsLnJhdy5mdWxsc2NyZWVuY2hhbmdlKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihzY3JlZW5mdWxsLnJhdy5mdWxsc2NyZWVuY2hhbmdlLCB0aGlzLl9fb25DaGFuZ2VGdWxsc2NyZWVuKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9fc2V0U3RhdGUoc3RhdGUpe1xuICAgICAgICBpZihzdGF0ZSAhPSB0aGlzLnN0YXRlKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBTdGF0ZS5SRUFEWV9UT19QUkVTRU5UOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRUaXRsZShcIkVudGVyIDM2MFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0RGVzY3JpcHRpb24oXCJcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5zdGF0ZSA9PSBTdGF0ZS5QUkVTRU5USU5HKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChcImV4aXRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBTdGF0ZS5QUkVTRU5USU5HOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRUaXRsZShcIkV4aXQgMzYwXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXREZXNjcmlwdGlvbihcIlwiKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoXCJlbnRlclwiKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KFwiZXJyb3JcIiwgbmV3IEVycm9yKFwiVW5rbm93biBzdGF0ZSBcIiArIHN0YXRlKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZW1pdChcImNoYW5nZVwiLCBzdGF0ZSk7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfX29uQ2hhbmdlRnVsbHNjcmVlbihlKXtcbiAgICAgICAgdGhpcy5fX3NldFN0YXRlKHNjcmVlbmZ1bGwuaXNGdWxsc2NyZWVuID8gU3RhdGUuUFJFU0VOVElORyA6IFN0YXRlLlJFQURZX1RPX1BSRVNFTlQpO1xuICAgIH1cblxuICAgIF9fb25DbGljaygpe1xuICAgICAgICBpZih0aGlzLnN0YXRlID09IFN0YXRlLlJFQURZX1RPX1BSRVNFTlQpe1xuICAgICAgICAgICAgdGhpcy5lbnRlckZ1bGxzY3JlZW4oKTtcbiAgICAgICAgfSBlbHNlIGlmKHRoaXMuc3RhdGUgPT0gU3RhdGUuUFJFU0VOVElORyl7XG4gICAgICAgICAgICB0aGlzLmV4aXRGdWxsc2NyZWVuKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlbnRlckZ1bGxzY3JlZW4oKSB7XG4gICAgICAgIGlmKHNjcmVlbmZ1bGwuZW5hYmxlZCl7XG4gICAgICAgICAgICBzY3JlZW5mdWxsLnJlcXVlc3QodGhpcy5zb3VyY2VDYW52YXMpO1xuICAgICAgICAgICAgdGhpcy5fX3NldFN0YXRlKFN0YXRlLlBSRVNFTlRJTkcpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICBleGl0RnVsbHNjcmVlbigpIHtcbiAgICAgICAgaWYoc2NyZWVuZnVsbC5lbmFibGVkICYmIHNjcmVlbmZ1bGwuaXNGdWxsc2NyZWVuKXtcbiAgICAgICAgICAgIHNjcmVlbmZ1bGwuZXhpdCgpO1xuICAgICAgICAgICAgdGhpcy5fX3NldFN0YXRlKFN0YXRlLlJFQURZX1RPX1BSRVNFTlQpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICByZW1vdmUoKXtcbiAgICAgICAgdGhpcy5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fX29uQ2xpY2spO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHNjcmVlbmZ1bGwucmF3LmZ1bGxzY3JlZW5jaGFuZ2VkLCB0aGlzLl9fb25DaGFuZ2VGdWxsc2NyZWVuKTtcbiAgICAgICAgc3VwZXIucmVtb3ZlKCk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQge0Fic3RyYWN0QnV0dG9ufSBmcm9tIFwiLi9BYnN0cmFjdEJ1dHRvblwiO1xuaW1wb3J0ICogYXMgbWFuYWdlciBmcm9tIFwiLi9XZWJWUk1hbmFnZXJcIjtcbmltcG9ydCAqIGFzIFN0YXRlIGZyb20gXCIuL3N0YXRlc1wiO1xuXG5cblxuLyoqXG4gKiBBIGJ1dHRvbiB0byBhbGxvdyBlYXN5LWVudHJ5IGFuZCBtZXNzYWdpbmcgYXJvdW5kIGEgV2ViVlIgZXhwZXJpZW5jZVxuICogQGNsYXNzXG4gKi9cbmV4cG9ydCBjbGFzcyBFbnRlclZSQnV0dG9uIGV4dGVuZHMgQWJzdHJhY3RCdXR0b24ge1xuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdCBhIG5ldyBFbnRlciBWUiBCdXR0b25cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSBzb3VyY2VDYW52YXMgdGhlIGNhbnZhcyB0aGF0IHlvdSB3YW50IHRvIHByZXNlbnQgaW4gV2ViVlJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIG9wdGlvbmFsIHBhcmFtZXRlcnNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuc2l6ZT0zNV0gc3BlY2lmeSB0aGUgaGVpZ2h0IG9mIHRoZSBidXR0b25cbiAgICAgKiBAcGFyYW0ge0Fic3RyYWN0QnV0dG9uRG9tfSBbb3B0aW9ucy5idXR0b25Db25zdHJ1Y3Rvcj1EZWZhdWx0QnV0dG9uRG9tXSBzcGVjaWZ5IGEgY3VzdG9tIGJ1dHRvbiBjbGFzc1xuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuaW5qZWN0Q1NTPXRydWVdIHNldCB0byBmYWxzZSBpZiB5b3Ugd2FudCB0byB3cml0ZSB5b3VyIG93biBzdHlsZXNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2VDYW52YXMsIG9wdGlvbnMpe1xuICAgICAgICBzdXBlcihzb3VyY2VDYW52YXMsIFwiVlJcIiwgb3B0aW9ucyk7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGJyb3dzZXIgaXMgY29tcGF0aWJsZSB3aXRoIFdlYlZSIGFuZCBoYXMgaGVhZHNldHMuXG4gICAgICAgIG1hbmFnZXIuZ2V0VlJEaXNwbGF5KClcbiAgICAgICAgICAgIC50aGVuKChkaXNwbGF5KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5ID0gZGlzcGxheTtcbiAgICAgICAgICAgICAgICB0aGlzLl9fc2V0U3RhdGUoU3RhdGUuUkVBRFlfVE9fUFJFU0VOVClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZihlLm5hbWUgPT0gXCJOT19ESVNQTEFZU1wiKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX3NldFN0YXRlKFN0YXRlLkVSUk9SX05PX1BSRVNFTlRBQkxFX0RJU1BMQVlTKVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihlLm5hbWUgPT0gXCJXRUJWUl9VTlNVUFBPUlRFRFwiKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX3NldFN0YXRlKFN0YXRlLkVSUk9SX0JST1dTRVJfTk9UX1NVUFBPUlRFRClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgLy9iaW5kIGV2ZW50c1xuICAgICAgICB0aGlzLl9fb25DbGljayA9IHRoaXMuX19vbkNsaWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5fX29uQ2xpY2spO1xuXG4gICAgICAgIHRoaXMuX19vblZSRGlzcGxheVByZXNlbnRDaGFuZ2UgPSB0aGlzLl9fb25WUkRpc3BsYXlQcmVzZW50Q2hhbmdlLmJpbmQodGhpcyk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidnJkaXNwbGF5cHJlc2VudGNoYW5nZVwiLCB0aGlzLl9fb25WUkRpc3BsYXlQcmVzZW50Q2hhbmdlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9fb25DbGljayhlKXtcblxuICAgICAgICBpZih0aGlzLnN0YXRlID09IFN0YXRlLlJFQURZX1RPX1BSRVNFTlQpe1xuICAgICAgICAgICAgbWFuYWdlci5lbnRlclZSKHRoaXMuZGlzcGxheSwgdGhpcy5zb3VyY2VDYW52YXMpXG4gICAgICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICgpPT4gdGhpcy5fX3NldFN0YXRlKFN0YXRlLlBSRVNFTlRJTkcpLFxuICAgICAgICAgICAgICAgICAgICAvL3RoaXMgY291bGQgZmFpbCBpZjpcbiAgICAgICAgICAgICAgICAgICAgLy8xLiBEaXNwbGF5IGBjYW5QcmVzZW50YCBpcyBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAvLzIuIENhbnZhcyBpcyBpbnZhbGlkXG4gICAgICAgICAgICAgICAgICAgIC8vMy4gbm90IGV4ZWN1dGVkIHZpYSB1c2VyIGludGVyYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICgpPT4gdGhpcy5fX3NldFN0YXRlKFN0YXRlLkVSUk9SX1JFUVVFU1RfVE9fUFJFU0VOVF9SRUpFQ1RFRClcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgIH0gZWxzZSBpZih0aGlzLnN0YXRlID09IFN0YXRlLlBSRVNFTlRJTkcpIHtcbiAgICAgICAgICAgIHRoaXMuX19zZXRTdGF0ZShTdGF0ZS5SRUFEWV9UT19QUkVTRU5UKTtcbiAgICAgICAgICAgIG1hbmFnZXIuZXhpdFZSKHRoaXMuZGlzcGxheSlcbiAgICAgICAgICAgICAgICAudGhlbihcbiAgICAgICAgICAgICAgICAgICAgKCk9PiB0aGlzLl9fc2V0U3RhdGUoU3RhdGUuUkVBRFlfVE9fUFJFU0VOVCksXG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcyBjb3VsZCBmYWlsIGlmOlxuICAgICAgICAgICAgICAgICAgICAvLzEuIGV4aXQgcmVxdWVzdGVkIHdoaWxlIG5vdCBjdXJyZW50bHkgcHJlc2VudGluZ1xuICAgICAgICAgICAgICAgICAgICAoKT0+IHRoaXMuX19zZXRTdGF0ZShTdGF0ZS5FUlJPUl9FWElUX1BSRVNFTlRfUkVKRUNURUQpXG4gICAgICAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX19vblZSRGlzcGxheVByZXNlbnRDaGFuZ2UoKXtcbiAgICAgICAgY29uc3QgaXNQcmVzZW50aW5nID0gdGhpcy5kaXNwbGF5ICYmIHRoaXMuZGlzcGxheS5pc1ByZXNlbnRpbmc7XG4gICAgICAgIHRoaXMuX19zZXRTdGF0ZSggaXNQcmVzZW50aW5nID8gU3RhdGUuUFJFU0VOVElORyA6IFN0YXRlLlJFQURZX1RPX1BSRVNFTlQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX19zZXRTdGF0ZShzdGF0ZSl7XG4gICAgICAgIGlmKHN0YXRlICE9IHRoaXMuc3RhdGUpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFN0YXRlLlJFQURZX1RPX1BSRVNFTlQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldFRpdGxlKFwiRW50ZXIgVlJcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldERlc2NyaXB0aW9uKFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnN0YXRlID09PSBTdGF0ZS5QUkVTRU5USU5HKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChcImV4aXRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBTdGF0ZS5QUkVTRU5USU5HOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRUaXRsZShcIkV4aXQgVlJcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldERlc2NyaXB0aW9uKFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoXCJlbnRlclwiKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgLy9hbGwgZXJyb3JzIGZhbGwtdGhyb3VnaCB0byBkZWZhdWx0LCBubyBicmVha1xuICAgICAgICAgICAgICAgIGNhc2UgU3RhdGUuRVJST1JfTk9fUFJFU0VOVEFCTEVfRElTUExBWVM6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldFRpdGxlKFwiRW50ZXIgVlJcIiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldERlc2NyaXB0aW9uKFwiTm8gVlIgSGVhZHNldCBmb3VuZFwiKTtcbiAgICAgICAgICAgICAgICBjYXNlIFN0YXRlLkVSUk9SX0JST1dTRVJfTk9UX1NVUFBPUlRFRDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0VGl0bGUoXCJCcm93c2VyIG5vdCBzdXBwb3J0ZWRcIiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldERlc2NyaXB0aW9uKFwiU29ycnksIHlvdXIgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgPGEgaHJlZj0naHR0cDovL3dlYnZyLmluZm8nPldlYlZSPC9hPlwiKTtcbiAgICAgICAgICAgICAgICBjYXNlIFN0YXRlLkVSUk9SX1JFUVVFU1RfVE9fUFJFU0VOVF9SRUpFQ1RFRDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0VGl0bGUoXCJEaXNwbGF5IGNhbid0IHByZXNlbnRcIiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldERlc2NyaXB0aW9uKFwiWW91ciBkaXNwbGF5IHJlZnVzZWQgdG8gcHJlc2VudFwiKTtcbiAgICAgICAgICAgICAgICBjYXNlIFN0YXRlLkVSUk9SX0VYSVRfUFJFU0VOVF9SRUpFQ1RFRDpcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoXCJlcnJvclwiLCBuZXcgRXJyb3Ioc3RhdGUpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5lbWl0KFwiY2hhbmdlXCIsIHN0YXRlKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNsZWFuIHVwIG9iamVjdCBmb3IgZ2FyYmFnZSBjb2xsZWN0aW9uXG4gICAgICovXG4gICAgcmVtb3ZlKCl7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwidnJkaXNwbGF5cHJlc2VudGNoYWdlXCIsIHRoaXMuX19vblZSRGlzcGxheVByZXNlbnRDaGFuZ2UpO1xuICAgICAgICB0aGlzLmRvbUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuX19vbkNsaWNrKTtcbiAgICAgICAgc3VwZXIucmVtb3ZlKCk7XG4gICAgfVxuXG59XG4iLCJcbi8qKlxuKiBQcm9taXNlIHJldHVybnMgdHJ1ZSBpZiB0aGVyZSBpcyBhdCBsZWFzdCBvbmUgSE1EIGRldmljZSBhdmFpbGFibGUuXG4gKiBAcmV0dXJucyBQcm9taXNlPFZSRGlzcGxheT5cbiovXG5leHBvcnQgY29uc3QgZ2V0VlJEaXNwbGF5ID0gKCk9PlxuICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYoIW5hdmlnYXRvciB8fCAhbmF2aWdhdG9yLmdldFZSRGlzcGxheXMpe1xuICAgICAgICAgICAgbGV0IGUgPSBuZXcgRXJyb3IoXCJCcm93c2VyIG5vdCBzdXBwb3J0aW5nIFdlYlZSXCIpO1xuICAgICAgICAgICAgZS5uYW1lID0gXCJXRUJWUl9VTlNVUFBPUlRFRFwiO1xuICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVqZWN0Tm9EaXNwbGF5ID0gKCk9PntcbiAgICAgICAgICAgIC8vIE5vIGRpc3BsYXlzIGFyZSBmb3VuZC5cbiAgICAgICAgICAgIGxldCBlID0gbmV3IEVycm9yKFwiTm8gZGlzcGxheXMgZm91bmRcIik7XG4gICAgICAgICAgICBlLm5hbWUgPSBcIk5PX0RJU1BMQVlTXCI7XG4gICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgbmF2aWdhdG9yLmdldFZSRGlzcGxheXMoKS50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24oZGlzcGxheXMpIHtcbiAgICAgICAgICAgICAgICAvLyBQcm9taXNlIHN1Y2NlZWRzLCBidXQgY2hlY2sgaWYgdGhlcmUgYXJlIGFueSBkaXNwbGF5cyBhY3R1YWxseS5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRpc3BsYXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRpc3BsYXlzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3BsYXlzW2ldLmNhcGFiaWxpdGllcy5jYW5QcmVzZW50ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkaXNwbGF5c1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlamVjdE5vRGlzcGxheSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlamVjdE5vRGlzcGxheSk7XG4gICAgfSk7XG5cblxuLyoqXG4gKiBFbnRlciBwcmVzZW50YXRpb24gbW9kZSB3aXRoIHlvdXIgc2V0IFZSIGRpc3BsYXlcbiAqL1xuZXhwb3J0IGNvbnN0IGVudGVyVlIgPSAoZGlzcGxheSwgY2FudmFzKT0+XG4gICAgZGlzcGxheS5yZXF1ZXN0UHJlc2VudChbe1xuICAgICAgICBzb3VyY2U6ICBjYW52YXNcbiAgICB9XSk7XG5cblxuZXhwb3J0IGNvbnN0IGV4aXRWUiA9IChkaXNwbGF5KT0+XG4gICAgZGlzcGxheS5leGl0UHJlc2VudCgpO1xuXG4iLCJpbXBvcnQgKiBhcyBtYW5hZ2VyIGZyb20gXCIuL1dlYlZSTWFuYWdlclwiO1xuaW1wb3J0ICogYXMgU3RhdGUgZnJvbSBcIi4vc3RhdGVzXCI7XG5pbXBvcnQgeyBBYnN0cmFjdEJ1dHRvbiB9IGZyb20gXCIuL0Fic3RyYWN0QnV0dG9uXCI7XG5pbXBvcnQgeyBFbnRlclZSQnV0dG9uIH0gZnJvbSBcIi4vRW50ZXJWUkJ1dHRvblwiO1xuaW1wb3J0IHsgRW50ZXIzNjBCdXR0b24gfSBmcm9tIFwiLi9FbnRlcjM2MEJ1dHRvblwiO1xuXG5cbmV4cG9ydCB7XG4gICAgRW50ZXJWUkJ1dHRvbixcbiAgICBFbnRlcjM2MEJ1dHRvbixcbiAgICBBYnN0cmFjdEJ1dHRvbixcbiAgICBTdGF0ZSxcbiAgICBtYW5hZ2VyXG59O1xuXG5cbiIsImV4cG9ydCBjb25zdCBSRUFEWV9UT19QUkVTRU5UID0gXCJyZWFkeVwiO1xyXG5leHBvcnQgY29uc3QgUFJFU0VOVElORyA9IFwicHJlc2VudGluZ1wiO1xyXG5leHBvcnQgY29uc3QgRVJST1JfTk9fUFJFU0VOVEFCTEVfRElTUExBWVMgPSBcImVycm9yLW5vLXByZXNlbnRhYmxlLWRpc3BsYXlzXCI7XHJcbmV4cG9ydCBjb25zdCBFUlJPUl9CUk9XU0VSX05PVF9TVVBQT1JURUQgPSBcImVycm9yLWJyb3dzZXItbm90LXN1cHBvcnRlZFwiO1xyXG5leHBvcnQgY29uc3QgRVJST1JfUkVRVUVTVF9UT19QUkVTRU5UX1JFSkVDVEVEID0gXCJlcnJvci1yZXF1ZXN0LXRvLXByZXNlbnQtcmVqZWN0ZWRcIjtcclxuZXhwb3J0IGNvbnN0IEVSUk9SX0VYSVRfUFJFU0VOVF9SRUpFQ1RFRCA9IFwiZXJyb3ItZXhpdC1wcmVzZW50LXJlamVjdGVkXCI7XHJcbiJdfQ==
