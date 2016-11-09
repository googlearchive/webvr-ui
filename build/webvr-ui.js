(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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
     * @param {Number} [options.height=35] set the height of the button
     * @param {AbstractButtonDom} [options.buttonDom=DefaultButtonDom] set a custom AbstractButtonDom
     * @param {Boolean} [options.injectCSS=true] set to false if you want to write your own styles
     */
    function AbstractButton(sourceCanvas, icon, options) {
        _classCallCheck(this, AbstractButton);

        var _this = _possibleConstructorReturn(this, (AbstractButton.__proto__ || Object.getPrototypeOf(AbstractButton)).call(this));

        options = options || {};
        // Option to change pixel height of the button.
        options.height = options.height || 45;
        options.injectCSS = options.injectCSS !== false;

        _this.sourceCanvas = sourceCanvas;

        _this.buttonDom = options.buttonDom || new _DefaultButtonDom.DefaultButtonDom(options.height, icon);

        if (options.injectCSS) {
            _this.buttonDom.injectCSS();
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
            return this.buttonDom.domElement;
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
    function AbstractButtonDom() {
        var domElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.createElement("div");

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

        var _this = _possibleConstructorReturn(this, (DefaultButtonDom.__proto__ || Object.getPrototypeOf(DefaultButtonDom)).call(this));

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
        key: "setTooltip",
        value: function setTooltip(tooltip) {
            var btn = this.domElement.querySelector("." + this.cssClassPrefix + "-button");
            btn.title = tooltip;
        }
    }, {
        key: "setDescription",
        value: function setDescription(text) {
            this.domElement.querySelector("." + this.cssClassPrefix + "-description").innerHTML = text;
        }
    }], [{
        key: "generateVRIcon",
        value: function generateVRIcon(cssClass, height) {
            var fill = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "#000000";

            var aspect = 28 / 18;
            return "<svg class=\"" + cssClass + "\" version=\"1.1\" x=\"0px\" y=\"0px\" width=\"" + aspect * height + "px\" height=\"" + height + "px\" viewBox=\"0 0 28 18\" xml:space=\"preserve\">\n                <path fill=\"" + fill + "\" d=\"M26.8,1.1C26.1,0.4,25.1,0,24.2,0H3.4c-1,0-1.7,0.4-2.4,1.1C0.3,1.7,0,2.7,0,3.6v10.7\n            c0,1,0.3,1.9,0.9,2.6C1.6,17.6,2.4,18,3.4,18h5c0.7,0,1.3-0.2,1.8-0.5c0.6-0.3,1-0.8,1.3-1.4l1.5-2.6C13.2,13.1,13,13,14,13v0h-0.2\n            h0c0.3,0,0.7,0.1,0.8,0.5l1.4,2.6c0.3,0.6,0.8,1.1,1.3,1.4c0.6,0.3,1.2,0.5,1.8,0.5h5c1,0,2-0.4,2.7-1.1c0.7-0.7,1.2-1.6,1.2-2.6\n            V3.6C28,2.7,27.5,1.7,26.8,1.1z M7.4,11.8c-1.6,0-2.8-1.3-2.8-2.8c0-1.6,1.3-2.8,2.8-2.8c1.6,0,2.8,1.3,2.8,2.8\n            C10.2,10.5,8.9,11.8,7.4,11.8z M20.1,11.8c-1.6,0-2.8-1.3-2.8-2.8c0-1.6,1.3-2.8,2.8-2.8C21.7,6.2,23,7.4,23,9\n            C23,10.5,21.7,11.8,20.1,11.8z\"/>\n            </svg>";
        }
    }, {
        key: "generate360Icon",
        value: function generate360Icon(cssClass, height) {
            var fill = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "#000000";

            var aspect = 28 / 18;
            return "<svg class=\"" + cssClass + "\" version=\"1.1\" x=\"0px\" y=\"0px\" width=\"" + aspect * height + "px\" height=\"" + height + "px\" viewBox=\"0 0 28 11\" xml:space=\"preserve\">\n                <path fill=\"" + fill + "\" d=\"M17.3,7.1c0.3,0,0.9,0,1.6,0c0.7,0,1.5-0.1,2.4-0.2c0.9-0.1,2-0.3,3-0.6c0.5-0.2,1.1-0.4,1.6-0.7\n            c0.5-0.3,0.8-0.7,0.8-0.9c0-0.1-0.1-0.3-0.3-0.5c-0.2-0.2-0.5-0.3-0.8-0.5c-0.6-0.3-1.3-0.5-2-0.6c-1.4-0.3-3-0.5-4.6-0.6\n            c-0.7-0.1-1.7-0.1-2.3-0.1v-1c0.6,0,1.6,0,2.4,0.1c1.6,0.1,3.2,0.2,4.7,0.5c0.8,0.2,1.5,0.3,2.2,0.6c0.4,0.2,0.7,0.3,1.1,0.6\n            C27.5,3.6,27.9,4,28,4.6c0.1,0.6-0.2,1.1-0.4,1.5c-0.3,0.3-0.6,0.6-0.9,0.8c-0.6,0.4-1.2,0.7-1.8,0.9c-1.2,0.5-2.3,0.7-3.3,1\n            c-1,0.2-1.9,0.3-2.6,0.4c-0.7,0.1-1.4,0.1-1.8,0.2c-0.2,0-0.5,0-0.5,0v1.6L13.7,8l3.1-2.9v1.9C16.8,7.1,17.1,7.1,17.3,7.1z\"/>\n            <path id=\"XMLID_15_\" d=\"M10.5,3.8c-0.3,0-0.8,0-1.5,0C8.4,3.8,7.6,3.9,6.7,4c-0.9,0.1-2,0.3-3,0.6C3.1,4.8,2.6,5,2.1,5.3\n            C1.6,5.6,1.3,6,1.3,6.2c0,0.1,0.1,0.3,0.3,0.5C1.8,6.8,2.1,7,2.4,7.1c0.6,0.3,1.3,0.5,2,0.6c1.4,0.3,2.8,0.5,4.4,0.6\n            c0.7,0.1,1.5,0.1,2.1,0.1v1c-0.6,0-1.4,0-2.2-0.1C7.1,9.3,5.6,9.1,4.1,8.8C3.3,8.7,2.6,8.5,1.9,8.2C1.5,8,1.2,7.9,0.8,7.6\n            C0.5,7.4,0.1,7,0,6.4c-0.1-0.6,0.2-1.1,0.4-1.5C0.7,4.6,1,4.3,1.3,4.1c0.6-0.4,1.2-0.7,1.8-0.9c1.2-0.5,2.3-0.7,3.3-1\n            C7.4,2,8.2,1.9,9,1.8c0.7-0.1,1.2-0.1,1.6-0.2c0.2,0,0.3,0,0.3,0V0L14,2.9l-3.1,2.9V3.9C10.9,3.9,10.7,3.8,10.5,3.8z\"/>\n            </svg>";
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

        // TODO: Disabled for now, fails on iOS
        // console.log(screenfull.raw.fullscreenchange);
        // document.addEventListener(screenfull.raw.fullscreenchange, this.__onChangeFullscreen);
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
                        this.buttonDom.setTitle("Enter 360");
                        this.buttonDom.setDescription("");

                        if (this.state == State.PRESENTING) {
                            this.emit("exit");
                        }
                        break;
                    case State.PRESENTING:
                        this.buttonDom.setTitle("Exit 360");
                        this.buttonDom.setDescription("");

                        this.emit("enter");
                        break;
                    default:
                        this.emit("error", new Error("Unknown state " + state));
                }

                this.emit("change", state, this.state);
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
     * @param {Number} [options.height=35] specify the height of the button
     * @param {AbstractButtonDom} [options.buttonDom=DefaultButtonDom] specify a custom button class
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
                        this.buttonDom.setTitle("Enter VR");
                        this.buttonDom.setDescription("");
                        this.buttonDom.setTooltip("Enter VR on " + this.display.displayName);
                        if (this.state === State.PRESENTING) {
                            this.emit("exit");
                        }
                        break;

                    case State.PRESENTING:
                        this.buttonDom.setTitle("Exit VR");
                        this.buttonDom.setDescription("");
                        this.emit("enter");
                        break;

                    //all errors fall-through to default, no break
                    case State.ERROR_BROWSER_NOT_SUPPORTED:
                        this.buttonDom.setTitle("Browser not supported", true);
                        this.buttonDom.setDescription("Sorry, your browser doesn't support <a href='http://webvr.info'>WebVR</a>");

                    case State.ERROR_NO_PRESENTABLE_DISPLAYS:
                    case State.ERROR_REQUEST_TO_PRESENT_REJECTED:
                        this.buttonDom.setTitle("Enter VR", true);
                        this.buttonDom.setDescription("No VR headset found. <a href='http://webvr.info'>Learn more</a>");

                    case State.ERROR_EXIT_PRESENT_REJECTED:
                    default:
                        this.emit("error", new Error(state));
                }

                this.emit("change", state, this.state);
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
exports.webvrui = undefined;

var _WebVRManager = _dereq_("./WebVRManager");

var manager = _interopRequireWildcard(_WebVRManager);

var _states = _dereq_("./states");

var State = _interopRequireWildcard(_states);

var _AbstractButton = _dereq_("./AbstractButton");

var _EnterVRButton = _dereq_("./EnterVRButton");

var _Enter360Button = _dereq_("./Enter360Button");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var webvrui = exports.webvrui = {
    EnterVRButton: _EnterVRButton.EnterVRButton,
    Enter360Button: _Enter360Button.Enter360Button,
    AbstractButton: _AbstractButton.AbstractButton,
    State: State,
    manager: manager
};

window.webvrui = webvrui;

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

},{}]},{},[9]);
