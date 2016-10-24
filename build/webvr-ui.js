(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.webvrui = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AbstractButton = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _WebVRManager = _dereq_('./WebVRManager');

var _DefaultButtonDom = _dereq_('./DefaultButtonDom');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractButton = exports.AbstractButton = function () {
    function AbstractButton(canvasDom, options) {
        _classCallCheck(this, AbstractButton);

        if (!options) options = {};

        // Option to ccange pixel height of the button.
        if (!options.size) {
            options.size = 35;
        }

        if (!options.domClass) {
            options.domClass = _DefaultButtonDom.DefaultButtonDom;
        }

        this.webvrmanager = new _WebVRManager.WebVRManager(canvasDom);

        this.button = new options.domClass(options.size);
        this.button.injectCss();
        this.button.onClick(this.onClickEvent.bind(this));

        this.domElement = this.button.domElement;
    }

    _createClass(AbstractButton, [{
        key: 'onClickEvent',
        value: function onClickEvent(e) {}
    }, {
        key: 'onEnter',
        value: function onEnter(func) {
            this.onEnterBinding = func;
        }
    }, {
        key: 'onExit',
        value: function onExit(func) {
            this.onExitBinding = func;
        }
    }]);

    return AbstractButton;
}();

},{"./DefaultButtonDom":3,"./WebVRManager":7}],2:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractButtonDom = exports.AbstractButtonDom = function () {
    function AbstractButtonDom() {
        _classCallCheck(this, AbstractButtonDom);

        this.domElement = undefined;
    }

    _createClass(AbstractButtonDom, [{
        key: "onClick",
        value: function onClick(func) {
            this.onClickBinding = func;
        }
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

},{}],3:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DefaultButtonDom = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DefaultButtonStyle = _dereq_("./DefaultButtonStyle");

var _AbstractButtonDom2 = _dereq_("./AbstractButtonDom");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _WebVRUI_css_injected = false;

var DefaultButtonDom = exports.DefaultButtonDom = function (_AbstractButtonDom) {
    _inherits(DefaultButtonDom, _AbstractButtonDom);

    function DefaultButtonDom(height) {
        var _ret;

        _classCallCheck(this, DefaultButtonDom);

        var _this = _possibleConstructorReturn(this, (DefaultButtonDom.__proto__ || Object.getPrototypeOf(DefaultButtonDom)).call(this));

        _this.onClickBinding = function (e) {};
        _this.cssClassPrefix = "webvr-ui-button";

        _this.fontSize = height / 2.5;
        _this.height = height;

        _this.domElement = document.createElement("div");
        _this.domElement.className = _this.cssClassPrefix;

        _this.buttonElm = document.createElement("button");
        _this.buttonElm.className = _this.cssClassPrefix + "-button";
        _this.buttonElm.dataset.error = false;
        _this.domElement.appendChild(_this.buttonElm);

        _this.titleElm = document.createElement("div");
        _this.titleElm.className = _this.cssClassPrefix + "-title";
        _this.buttonElm.appendChild(_this.titleElm);

        _this.descriptionElm = document.createElement("div");
        _this.descriptionElm.className = _this.cssClassPrefix + "-description";
        _this.domElement.appendChild(_this.descriptionElm);

        _this.logoElm = document.createElement("div");
        _this.logoElm.appendChild(DefaultButtonDom.generateSvgIcon(_this.fontSize));
        _this.logoElm.className = _this.cssClassPrefix + "-logo";
        _this.buttonElm.appendChild(_this.logoElm);

        _this.buttonElm.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();

            if (_this.onClickBinding) {
                _this.onClickBinding.call(_this, e);
            }
        });
        return _ret = _this, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(DefaultButtonDom, [{
        key: "injectCss",
        value: function injectCss() {
            // Make sure its only injected once
            if (!_WebVRUI_css_injected) {
                _WebVRUI_css_injected = true;

                // Create the css
                var style = _DefaultButtonStyle.WebVRButtonStyle.generateCss(this.cssClassPrefix, this.height, this.fontSize);

                var head = document.getElementsByTagName('head')[0];
                head.insertBefore(style, head.firstChild);
            }
        }
    }, {
        key: "setTitle",
        value: function setTitle(text) {
            var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            this.buttonElm.title = text;
            this.buttonElm.dataset.error = error;

            if (!text) {
                this.titleElm.style.display = 'none';
            } else {
                this.titleElm.innerText = text;
                this.titleElm.style.display = 'inherit';
            }
        }
    }, {
        key: "setDescription",
        value: function setDescription(text) {
            this.descriptionElm.innerHTML = text;
        }
    }], [{
        key: "generateSvgIcon",
        value: function generateSvgIcon(height) {
            var logo = document.createElement("div");
            var aspect = 28 / 18;

            logo.innerHTML = "<svg version=\"1.1\"\n                x=\"0px\" y=\"0px\" width=\"" + aspect * height + "px\" height=\"" + height + "px\" viewBox=\"0 0 28 18\" xml:space=\"preserve\">\n            <style type=\"text/css\">\n                .st0{\n                fill:#000000;\n                }\n            </style>\n                <path id=\"XMLID_15_\" class=\"st0\" d=\"M26.8,1.1C26.1,0.4,25.1,0,24.2,0H3.4c-1,0-1.7,0.4-2.4,1.1C0.3,1.7,0,2.7,0,3.6v10.7\n            c0,1,0.3,1.9,0.9,2.6C1.6,17.6,2.4,18,3.4,18h5c0.7,0,1.3-0.2,1.8-0.5c0.6-0.3,1-0.8,1.3-1.4l1.5-2.6C13.2,13.1,13,13,14,13v0h-0.2\n            h0c0.3,0,0.7,0.1,0.8,0.5l1.4,2.6c0.3,0.6,0.8,1.1,1.3,1.4c0.6,0.3,1.2,0.5,1.8,0.5h5c1,0,2-0.4,2.7-1.1c0.7-0.7,1.2-1.6,1.2-2.6\n            V3.6C28,2.7,27.5,1.7,26.8,1.1z M7.4,11.8c-1.6,0-2.8-1.3-2.8-2.8c0-1.6,1.3-2.8,2.8-2.8c1.6,0,2.8,1.3,2.8,2.8\n            C10.2,10.5,8.9,11.8,7.4,11.8z M20.1,11.8c-1.6,0-2.8-1.3-2.8-2.8c0-1.6,1.3-2.8,2.8-2.8C21.7,6.2,23,7.4,23,9\n            C23,10.5,21.7,11.8,20.1,11.8z\"/>\n            </svg>";
            return logo.firstChild;
        }
    }]);

    return DefaultButtonDom;
}(_AbstractButtonDom2.AbstractButtonDom);

},{"./AbstractButtonDom":2,"./DefaultButtonStyle":4}],4:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebVRButtonStyle = exports.WebVRButtonStyle = function () {
    function WebVRButtonStyle() {
        _classCallCheck(this, WebVRButtonStyle);
    }

    _createClass(WebVRButtonStyle, null, [{
        key: 'generateCss',
        value: function generateCss(prefix) {
            var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
            var fontSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 18;

            var borderWidth = 2;
            var borderRadius = height / 2;
            // borderRadius = 0;

            var errorColor = 'rgba(255,255,255,0.4)';

            var css = '\n\n\n    button.' + prefix + '-button {\n        border: white ' + borderWidth + 'px solid;\n        border-radius: ' + borderRadius + 'px;\n        box-sizing: border-box;\n        background: rgba(0,0,0, 0);\n\n        height: ' + height + 'px;\n        min-width: ' + height + 'px;\n        display: inline-block;\n        position: relative;\n        \n        margin-top: 8px;\n\n        font-family: \'Karla\', sans-serif;\n        cursor: pointer;\n\n         -webkit-transition: width 0.5s;\n        transition: width 0.5s;\n    }\n\n    /*\n    * Logo\n    */\n\n    .' + prefix + '-logo {\n        width: ' + height + 'px;\n        height: ' + height + 'px;\n        border-radius: ' + borderRadius + 'px;\n        background-color: white;\n        position: absolute;\n        top:-' + borderWidth + 'px;\n        left:-' + borderWidth + 'px;\n    }\n    .' + prefix + '-logo > svg {\n        margin-top: ' + (height - fontSize) / 2 + 'px;\n    }\n\n\n    /*\n    * Title\n    */\n\n    .' + prefix + '-title {\n        color: white;\n        position: relative;\n        font-size: ' + fontSize + 'px;\n        top: -' + borderWidth + 'px;\n        line-height: ' + (height - borderWidth * 2) + 'px;\n        text-align: left;\n        padding-left: ' + height * 1.05 + 'px;\n        padding-right: ' + (borderRadius - 10 < 5 ? 5 : borderRadius - 10) + 'px;\n    }\n\n    /*\n    * Description\n    */\n\n    .' + prefix + '-description{\n        font-size: 13px;\n        margin-top: 5px\n    }\n\n   .' + prefix + '-description, a {\n        color: white\n    }\n\n    /*\n    * Error\n    */\n\n    button.' + prefix + '-button[data-error=true] {\n        border-color: ' + errorColor + ';\n    }\n    button.' + prefix + '-button[data-error=true] > .' + prefix + '-logo {\n        background-color: ' + errorColor + ';\n    }\n    button.' + prefix + '-button[data-error=true] > .' + prefix + '-title {\n        color: ' + errorColor + ';\n    }\n\n    ';

            var style = document.createElement('style');
            style.innerHTML = css;
            return style;
        }
    }]);

    return WebVRButtonStyle;
}();

},{}],5:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Enter360Button = exports.State = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractButton2 = _dereq_('./AbstractButton');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var State = exports.State = {
    READY_TO_PRESENT: 'READY_TO_PRESENT',
    PRESENTING: 'PRESENTING'
};

var Enter360Button = exports.Enter360Button = function (_AbstractButton) {
    _inherits(Enter360Button, _AbstractButton);

    function Enter360Button(canvasDom, options) {
        _classCallCheck(this, Enter360Button);

        var _this = _possibleConstructorReturn(this, (Enter360Button.__proto__ || Object.getPrototypeOf(Enter360Button)).call(this, canvasDom, options));

        _this.setState(State.READY_TO_PRESENT);
        return _this;
    }

    _createClass(Enter360Button, [{
        key: 'setState',
        value: function setState(state) {
            if (state != this.state) {
                this.state = state;
                switch (state) {
                    case State.READY_TO_PRESENT:
                        this.button.setTitle("Enter 360");
                        this.button.setDescription("");
                        break;
                    case State.PRESENTING:
                        this.button.setTitle("Exit 360");
                        this.button.setDescription("");
                        break;
                    default:
                        console.error("Unkown state " + state);
                }
            }
        }
    }, {
        key: 'onClickEvent',
        value: function onClickEvent(e) {
            if (this.state == State.READY_TO_PRESENT) {
                if (this.onEnterBinding) {
                    this.setState(State.PRESENTING);
                    this.onEnterBinding.call();
                }
            } else if (this.state == State.PRESENTING) {
                if (this.onExitBinding) {
                    this.setState(State.READY_TO_PRESENT);
                    this.onExitBinding.call();
                }
            }
        }
    }]);

    return Enter360Button;
}(_AbstractButton2.AbstractButton);

},{"./AbstractButton":1}],6:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EnterVRButton = exports.State = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractButton2 = _dereq_("./AbstractButton");

var _WebVRManager = _dereq_("./WebVRManager");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var State = exports.State = {
    READY_TO_PRESENT: 'READY_TO_PRESENT',
    ERROR_NO_PRESENTABLE_DISPLAYS: 'ERROR_NO_PRESENTABLE_DISPLAYS',
    ERROR_BROWSER_NOT_SUPPORTED: 'ERROR_BROWSER_NOT_SUPPORTED'
};

var EnterVRButton = exports.EnterVRButton = function (_AbstractButton) {
    _inherits(EnterVRButton, _AbstractButton);

    function EnterVRButton(canvasDom, options) {
        _classCallCheck(this, EnterVRButton);

        // Check if the browser is compatible with WebVR.
        var _this = _possibleConstructorReturn(this, (EnterVRButton.__proto__ || Object.getPrototypeOf(EnterVRButton)).call(this, canvasDom, options));

        _WebVRManager.WebVRManager.getPresentableDevice().then(function (hmd) {
            console.log(hmd);
            _this.hmd = hmd;
            if (hmd.capabilities.canPresent) {
                _this.setState(State.READY_TO_PRESENT);
            } else {
                _this.setState(State.ERROR_BROWSER_NOT_SUPPORTED);
            }
        }).catch(function (e) {
            if (e.name == 'NO_DISPLAYS') {
                _this.setState(State.ERROR_NO_PRESENTABLE_DISPLAYS);
            } else if (e.name == 'WEBVR_UNSUPPORTED') {
                _this.setState(State.ERROR_BROWSER_NOT_SUPPORTED);
            }
        });
        return _this;
    }

    _createClass(EnterVRButton, [{
        key: "setState",
        value: function setState(state) {
            if (state != this.state) {
                this.state = state;
                switch (state) {
                    case State.READY_TO_PRESENT:
                        this.button.setTitle("Enter VR");
                        this.button.setDescription("");
                        break;
                    case State.ERROR_NO_PRESENTABLE_DISPLAYS:
                        this.button.setTitle("No VR Headset found", true);
                        this.button.setDescription("");
                        break;
                    case State.ERROR_BROWSER_NOT_SUPPORTED:
                        this.button.setTitle("Browser not supported", true);
                        this.button.setDescription("Sorry, your browser doesn't support <a href='http://webvr.info'>WebVR</a>");
                        break;
                    default:
                        console.error("Unkown WebVR state " + state);
                }
            }
        }
    }, {
        key: "onClickEvent",
        value: function onClickEvent(e) {
            if (this.state == State.READY_TO_PRESENT) {
                this.webvrmanager.enterVr(this.hmd);
            }
        }
    }]);

    return EnterVRButton;
}(_AbstractButton2.AbstractButton);

},{"./AbstractButton":1,"./WebVRManager":7}],7:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebVRManager = exports.WebVRManager = function () {
    function WebVRManager(canvasDom) {
        _classCallCheck(this, WebVRManager);

        this.domElement = canvasDom;
    }

    /**
     * Promise returns true if there is at least one HMD device available.
     */


    _createClass(WebVRManager, [{
        key: "enterVr",
        value: function enterVr(hmd) {
            hmd.requestPresent([{
                source: this.domElement
            }]);
        }
    }], [{
        key: "getPresentableDevice",
        value: function getPresentableDevice() {
            var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : VRDisplay;

            return new Promise(function (resolve, reject) {
                if (!navigator || !navigator.getVRDisplays) {

                    var e = new Error("Browser not supporting WebVR");
                    e.name = 'WEBVR_UNSUPPORTED';
                    reject(e);
                    return;
                }

                navigator.getVRDisplays().then(function (displays) {
                    // Promise succeeds, but check if there are any displays actually.
                    for (var i = 0; i < displays.length; i++) {
                        console.log(displays[i]);
                        if (displays[i] instanceof type && displays[i].capabilities.canPresent) {
                            resolve(displays[i]);
                            break;
                        }
                    }

                    var e = new Error("No displays found");
                    e.name = 'NO_DISPLAYS';
                    reject(e);
                }, function () {
                    // No displays are found.
                    var e = new Error("No displays found");
                    e.name = 'NO_DISPLAYS';
                    reject(e);
                });
            });
        }
    }]);

    return WebVRManager;
}();

},{}],8:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WebVRManager = exports.State = exports.AbstractButton = exports.Enter360Button = exports.EnterVRButton = undefined;

var _AbstractButton = _dereq_('./AbstractButton');

var _WebVRManager = _dereq_('./WebVRManager');

var _EnterVRButton = _dereq_('./EnterVRButton');

var _Enter360Button = _dereq_('./Enter360Button');

exports.EnterVRButton = _EnterVRButton.EnterVRButton;
exports.Enter360Button = _Enter360Button.Enter360Button;
exports.AbstractButton = _AbstractButton.AbstractButton;
exports.State = _AbstractButton.State;
exports.WebVRManager = _WebVRManager.WebVRManager;

},{"./AbstractButton":1,"./Enter360Button":5,"./EnterVRButton":6,"./WebVRManager":7}]},{},[8])(8)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQWJzdHJhY3RCdXR0b24uanMiLCJzcmMvQWJzdHJhY3RCdXR0b25Eb20uanMiLCJzcmMvRGVmYXVsdEJ1dHRvbkRvbS5qcyIsInNyYy9EZWZhdWx0QnV0dG9uU3R5bGUuanMiLCJzcmMvRW50ZXIzNjBCdXR0b24uanMiLCJzcmMvRW50ZXJWUkJ1dHRvbi5qcyIsInNyYy9XZWJWUk1hbmFnZXIuanMiLCJzcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7QUNBQTs7QUFDQTs7OztJQUlhLGMsV0FBQSxjO0FBQ1QsNEJBQVksU0FBWixFQUF1QixPQUF2QixFQUErQjtBQUFBOztBQUMzQixZQUFHLENBQUMsT0FBSixFQUFhLFVBQVUsRUFBVjs7QUFFYjtBQUNBLFlBQUcsQ0FBQyxRQUFRLElBQVosRUFBaUI7QUFDYixvQkFBUSxJQUFSLEdBQWUsRUFBZjtBQUNIOztBQUVELFlBQUcsQ0FBQyxRQUFRLFFBQVosRUFBcUI7QUFDakIsb0JBQVEsUUFBUjtBQUNIOztBQUVELGFBQUssWUFBTCxHQUFvQiwrQkFBaUIsU0FBakIsQ0FBcEI7O0FBR0EsYUFBSyxNQUFMLEdBQWMsSUFBSSxRQUFRLFFBQVosQ0FBcUIsUUFBUSxJQUE3QixDQUFkO0FBQ0EsYUFBSyxNQUFMLENBQVksU0FBWjtBQUNBLGFBQUssTUFBTCxDQUFZLE9BQVosQ0FBb0IsS0FBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLElBQXZCLENBQXBCOztBQUVBLGFBQUssVUFBTCxHQUFrQixLQUFLLE1BQUwsQ0FBWSxVQUE5QjtBQUNIOzs7O3FDQUVZLEMsRUFBRSxDQUNkOzs7Z0NBRU8sSSxFQUFLO0FBQ1QsaUJBQUssY0FBTCxHQUFzQixJQUF0QjtBQUNIOzs7K0JBRU0sSSxFQUFLO0FBQ1IsaUJBQUssYUFBTCxHQUFxQixJQUFyQjtBQUNIOzs7Ozs7Ozs7Ozs7Ozs7OztJQ3JDUSxp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QUFjLENBQUMsVUFBVSxhQUE1QixFQUEwQzs7QUFFdEMsd0JBQUksSUFBSSxJQUFJLEtBQUosQ0FBVSw4QkFBVixDQUFSO0FBQ0Esc0JBQUUsSUFBRixHQUFTLG1CQUFUO0FBQ0EsMkJBQU8sQ0FBUDtBQUNBO0FBQ0g7O0FBRUQsMEJBQVUsYUFBVixHQUEwQixJQUExQixDQUErQixVQUFTLFFBQVQsRUFBbUI7QUFDOUM7QUFDQSx5QkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFNBQVMsTUFBN0IsRUFBcUMsR0FBckMsRUFBMEM7QUFDdEMsZ0NBQVEsR0FBUixDQUFZLFNBQVMsQ0FBVCxDQUFaO0FBQ0EsNEJBQUksU0FBUyxDQUFULGFBQXVCLElBQXZCLElBQStCLFNBQVMsQ0FBVCxFQUFZLFlBQVosQ0FBeUIsVUFBNUQsRUFBd0U7QUFDcEUsb0NBQVEsU0FBUyxDQUFULENBQVI7QUFDQTtBQUNIO0FBQ0o7O0FBRUQsd0JBQUksSUFBSSxJQUFJLEtBQUosQ0FBVSxtQkFBVixDQUFSO0FBQ0Esc0JBQUUsSUFBRixHQUFTLGFBQVQ7QUFDQSwyQkFBTyxDQUFQO0FBQ0gsaUJBYkQsRUFhRyxZQUFXO0FBQ1Y7QUFDQSx3QkFBSSxJQUFJLElBQUksS0FBSixDQUFVLG1CQUFWLENBQVI7QUFDQSxzQkFBRSxJQUFGLEdBQVMsYUFBVDtBQUNBLDJCQUFPLENBQVA7QUFDSCxpQkFsQkQ7QUFtQkgsYUE1Qk0sQ0FBUDtBQTZCSDs7Ozs7Ozs7Ozs7Ozs7QUN2Q0w7O0FBQ0E7O0FBQ0E7O0FBQ0E7O1FBSUksYTtRQUNBLGM7UUFDQSxjO1FBQ0EsSztRQUNBLFkiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHsgV2ViVlJNYW5hZ2VyIH0gZnJvbSAnLi9XZWJWUk1hbmFnZXInO1xuaW1wb3J0IHsgRGVmYXVsdEJ1dHRvbkRvbSB9IGZyb20gJy4vRGVmYXVsdEJ1dHRvbkRvbSc7XG5cblxuXG5leHBvcnQgY2xhc3MgQWJzdHJhY3RCdXR0b24ge1xuICAgIGNvbnN0cnVjdG9yKGNhbnZhc0RvbSwgb3B0aW9ucyl7XG4gICAgICAgIGlmKCFvcHRpb25zKSBvcHRpb25zID0ge307XG5cbiAgICAgICAgLy8gT3B0aW9uIHRvIGNjYW5nZSBwaXhlbCBoZWlnaHQgb2YgdGhlIGJ1dHRvbi5cbiAgICAgICAgaWYoIW9wdGlvbnMuc2l6ZSl7XG4gICAgICAgICAgICBvcHRpb25zLnNpemUgPSAzNTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCFvcHRpb25zLmRvbUNsYXNzKXtcbiAgICAgICAgICAgIG9wdGlvbnMuZG9tQ2xhc3MgPSBEZWZhdWx0QnV0dG9uRG9tO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy53ZWJ2cm1hbmFnZXIgPSBuZXcgV2ViVlJNYW5hZ2VyKGNhbnZhc0RvbSk7XG5cblxuICAgICAgICB0aGlzLmJ1dHRvbiA9IG5ldyBvcHRpb25zLmRvbUNsYXNzKG9wdGlvbnMuc2l6ZSk7XG4gICAgICAgIHRoaXMuYnV0dG9uLmluamVjdENzcygpO1xuICAgICAgICB0aGlzLmJ1dHRvbi5vbkNsaWNrKHRoaXMub25DbGlja0V2ZW50LmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMuZG9tRWxlbWVudCA9IHRoaXMuYnV0dG9uLmRvbUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgb25DbGlja0V2ZW50KGUpe1xuICAgIH1cblxuICAgIG9uRW50ZXIoZnVuYyl7XG4gICAgICAgIHRoaXMub25FbnRlckJpbmRpbmcgPSBmdW5jO1xuICAgIH1cblxuICAgIG9uRXhpdChmdW5jKXtcbiAgICAgICAgdGhpcy5vbkV4aXRCaW5kaW5nID0gZnVuYztcbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgQWJzdHJhY3RCdXR0b25Eb20ge1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuZG9tRWxlbWVudCA9IHVuZGVmaW5lZDtcblxuICAgIH1cblxuICAgIG9uQ2xpY2soZnVuYyl7XG4gICAgICAgIHRoaXMub25DbGlja0JpbmRpbmcgPSBmdW5jO1xuICAgIH1cblxuICAgIHNldFRpdGxlKHRleHQsIGVycm9yID0gZmFsc2UpIHtcbiAgICB9XG5cbiAgICBzZXREZXNjcmlwdGlvbih0ZXh0KSB7XG4gICAgfVxufSIsImltcG9ydCB7IFdlYlZSQnV0dG9uU3R5bGUgfSBmcm9tICcuL0RlZmF1bHRCdXR0b25TdHlsZSc7XG5pbXBvcnQge0Fic3RyYWN0QnV0dG9uRG9tfSBmcm9tIFwiLi9BYnN0cmFjdEJ1dHRvbkRvbVwiO1xuXG5sZXQgX1dlYlZSVUlfY3NzX2luamVjdGVkID0gZmFsc2U7XG5cbmV4cG9ydCBjbGFzcyBEZWZhdWx0QnV0dG9uRG9tIGV4dGVuZHMgQWJzdHJhY3RCdXR0b25Eb20ge1xuICAgIGNvbnN0cnVjdG9yKGhlaWdodCl7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5vbkNsaWNrQmluZGluZyA9IChlKSA9PiB7fTtcbiAgICAgICAgdGhpcy5jc3NDbGFzc1ByZWZpeCA9IFwid2VidnItdWktYnV0dG9uXCI7XG5cbiAgICAgICAgdGhpcy5mb250U2l6ZSA9IGhlaWdodC8yLjU7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXG5cbiAgICAgICAgdGhpcy5kb21FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5kb21FbGVtZW50LmNsYXNzTmFtZSA9IHRoaXMuY3NzQ2xhc3NQcmVmaXg7XG5cbiAgICAgICAgdGhpcy5idXR0b25FbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLmJ1dHRvbkVsbS5jbGFzc05hbWUgPSB0aGlzLmNzc0NsYXNzUHJlZml4ICArIFwiLWJ1dHRvblwiO1xuICAgICAgICB0aGlzLmJ1dHRvbkVsbS5kYXRhc2V0LmVycm9yID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZG9tRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmJ1dHRvbkVsbSk7XG5cbiAgICAgICAgdGhpcy50aXRsZUVsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMudGl0bGVFbG0uY2xhc3NOYW1lID0gdGhpcy5jc3NDbGFzc1ByZWZpeCAgKyBcIi10aXRsZVwiO1xuICAgICAgICB0aGlzLmJ1dHRvbkVsbS5hcHBlbmRDaGlsZCh0aGlzLnRpdGxlRWxtKTtcblxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uRWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbkVsbS5jbGFzc05hbWUgPSB0aGlzLmNzc0NsYXNzUHJlZml4ICArIFwiLWRlc2NyaXB0aW9uXCI7XG4gICAgICAgIHRoaXMuZG9tRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmRlc2NyaXB0aW9uRWxtKTtcblxuICAgICAgICB0aGlzLmxvZ29FbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmxvZ29FbG0uYXBwZW5kQ2hpbGQoRGVmYXVsdEJ1dHRvbkRvbS5nZW5lcmF0ZVN2Z0ljb24odGhpcy5mb250U2l6ZSkpO1xuICAgICAgICB0aGlzLmxvZ29FbG0uY2xhc3NOYW1lID0gdGhpcy5jc3NDbGFzc1ByZWZpeCAgKyBcIi1sb2dvXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uRWxtLmFwcGVuZENoaWxkKHRoaXMubG9nb0VsbSk7XG5cblxuICAgICAgICB0aGlzLmJ1dHRvbkVsbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZih0aGlzLm9uQ2xpY2tCaW5kaW5nKXtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2xpY2tCaW5kaW5nLmNhbGwodGhpcyxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuXG4gICAgaW5qZWN0Q3NzKCl7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSBpdHMgb25seSBpbmplY3RlZCBvbmNlXG4gICAgICAgIGlmKCFfV2ViVlJVSV9jc3NfaW5qZWN0ZWQpIHtcbiAgICAgICAgICAgIF9XZWJWUlVJX2Nzc19pbmplY3RlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgY3NzXG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBXZWJWUkJ1dHRvblN0eWxlLmdlbmVyYXRlQ3NzKHRoaXMuY3NzQ2xhc3NQcmVmaXggLCB0aGlzLmhlaWdodCwgdGhpcy5mb250U2l6ZSk7XG5cbiAgICAgICAgICAgIHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICAgICAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlLGhlYWQuZmlyc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRUaXRsZSh0ZXh0LCBlcnJvciA9IGZhbHNlKXtcbiAgICAgICAgdGhpcy5idXR0b25FbG0udGl0bGUgPSB0ZXh0O1xuICAgICAgICB0aGlzLmJ1dHRvbkVsbS5kYXRhc2V0LmVycm9yID0gZXJyb3I7XG5cbiAgICAgICAgaWYoIXRleHQpe1xuICAgICAgICAgICAgdGhpcy50aXRsZUVsbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50aXRsZUVsbS5pbm5lclRleHQgPSB0ZXh0O1xuICAgICAgICAgICAgdGhpcy50aXRsZUVsbS5zdHlsZS5kaXNwbGF5ID0gJ2luaGVyaXQnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0RGVzY3JpcHRpb24odGV4dCl7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb25FbG0uaW5uZXJIVE1MID0gdGV4dDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2VuZXJhdGVTdmdJY29uKGhlaWdodCl7XG4gICAgICAgIGxldCBsb2dvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbGV0IGFzcGVjdCA9IDI4LzE4O1xuXG4gICAgICAgIGxvZ28uaW5uZXJIVE1MID1cbiAgICAgICAgICAgIGA8c3ZnIHZlcnNpb249XCIxLjFcIlxuICAgICAgICAgICAgICAgIHg9XCIwcHhcIiB5PVwiMHB4XCIgd2lkdGg9XCIke2FzcGVjdCpoZWlnaHR9cHhcIiBoZWlnaHQ9XCIke2hlaWdodH1weFwiIHZpZXdCb3g9XCIwIDAgMjggMThcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPlxuICAgICAgICAgICAgPHN0eWxlIHR5cGU9XCJ0ZXh0L2Nzc1wiPlxuICAgICAgICAgICAgICAgIC5zdDB7XG4gICAgICAgICAgICAgICAgZmlsbDojMDAwMDAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvc3R5bGU+XG4gICAgICAgICAgICAgICAgPHBhdGggaWQ9XCJYTUxJRF8xNV9cIiBjbGFzcz1cInN0MFwiIGQ9XCJNMjYuOCwxLjFDMjYuMSwwLjQsMjUuMSwwLDI0LjIsMEgzLjRjLTEsMC0xLjcsMC40LTIuNCwxLjFDMC4zLDEuNywwLDIuNywwLDMuNnYxMC43XG4gICAgICAgICAgICBjMCwxLDAuMywxLjksMC45LDIuNkMxLjYsMTcuNiwyLjQsMTgsMy40LDE4aDVjMC43LDAsMS4zLTAuMiwxLjgtMC41YzAuNi0wLjMsMS0wLjgsMS4zLTEuNGwxLjUtMi42QzEzLjIsMTMuMSwxMywxMywxNCwxM3YwaC0wLjJcbiAgICAgICAgICAgIGgwYzAuMywwLDAuNywwLjEsMC44LDAuNWwxLjQsMi42YzAuMywwLjYsMC44LDEuMSwxLjMsMS40YzAuNiwwLjMsMS4yLDAuNSwxLjgsMC41aDVjMSwwLDItMC40LDIuNy0xLjFjMC43LTAuNywxLjItMS42LDEuMi0yLjZcbiAgICAgICAgICAgIFYzLjZDMjgsMi43LDI3LjUsMS43LDI2LjgsMS4xeiBNNy40LDExLjhjLTEuNiwwLTIuOC0xLjMtMi44LTIuOGMwLTEuNiwxLjMtMi44LDIuOC0yLjhjMS42LDAsMi44LDEuMywyLjgsMi44XG4gICAgICAgICAgICBDMTAuMiwxMC41LDguOSwxMS44LDcuNCwxMS44eiBNMjAuMSwxMS44Yy0xLjYsMC0yLjgtMS4zLTIuOC0yLjhjMC0xLjYsMS4zLTIuOCwyLjgtMi44QzIxLjcsNi4yLDIzLDcuNCwyMyw5XG4gICAgICAgICAgICBDMjMsMTAuNSwyMS43LDExLjgsMjAuMSwxMS44elwiLz5cbiAgICAgICAgICAgIDwvc3ZnPmA7XG4gICAgICAgIHJldHVybiBsb2dvLmZpcnN0Q2hpbGQ7XG4gICAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFdlYlZSQnV0dG9uU3R5bGUge1xuICAgIHN0YXRpYyBnZW5lcmF0ZUNzcyhwcmVmaXgsIGhlaWdodCA9IDUwLCBmb250U2l6ZSA9IDE4KXtcbiAgICAgICAgbGV0IGJvcmRlcldpZHRoID0gMjtcbiAgICAgICAgbGV0IGJvcmRlclJhZGl1cyA9IGhlaWdodCAvIDI7XG4gICAgICAgIC8vIGJvcmRlclJhZGl1cyA9IDA7XG5cbiAgICAgICAgbGV0IGVycm9yQ29sb3IgPSAncmdiYSgyNTUsMjU1LDI1NSwwLjQpJztcblxuICAgICAgICBsZXQgY3NzID0gYFxuXG5cbiAgICBidXR0b24uJHtwcmVmaXh9LWJ1dHRvbiB7XG4gICAgICAgIGJvcmRlcjogd2hpdGUgJHtib3JkZXJXaWR0aH1weCBzb2xpZDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogJHtib3JkZXJSYWRpdXN9cHg7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMCwwLDAsIDApO1xuXG4gICAgICAgIGhlaWdodDogJHtoZWlnaHR9cHg7XG4gICAgICAgIG1pbi13aWR0aDogJHtoZWlnaHR9cHg7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICBcbiAgICAgICAgbWFyZ2luLXRvcDogOHB4O1xuXG4gICAgICAgIGZvbnQtZmFtaWx5OiAnS2FybGEnLCBzYW5zLXNlcmlmO1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG5cbiAgICAgICAgIC13ZWJraXQtdHJhbnNpdGlvbjogd2lkdGggMC41cztcbiAgICAgICAgdHJhbnNpdGlvbjogd2lkdGggMC41cztcbiAgICB9XG5cbiAgICAvKlxuICAgICogTG9nb1xuICAgICovXG5cbiAgICAuJHtwcmVmaXh9LWxvZ28ge1xuICAgICAgICB3aWR0aDogJHtoZWlnaHR9cHg7XG4gICAgICAgIGhlaWdodDogJHtoZWlnaHR9cHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6ICR7Ym9yZGVyUmFkaXVzfXB4O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICB0b3A6LSR7Ym9yZGVyV2lkdGh9cHg7XG4gICAgICAgIGxlZnQ6LSR7Ym9yZGVyV2lkdGh9cHg7XG4gICAgfVxuICAgIC4ke3ByZWZpeH0tbG9nbyA+IHN2ZyB7XG4gICAgICAgIG1hcmdpbi10b3A6ICR7KGhlaWdodCAtIGZvbnRTaXplKSAvIDJ9cHg7XG4gICAgfVxuXG5cbiAgICAvKlxuICAgICogVGl0bGVcbiAgICAqL1xuXG4gICAgLiR7cHJlZml4fS10aXRsZSB7XG4gICAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICBmb250LXNpemU6ICR7Zm9udFNpemV9cHg7XG4gICAgICAgIHRvcDogLSR7Ym9yZGVyV2lkdGh9cHg7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAke2hlaWdodCAtIGJvcmRlcldpZHRoICogMn1weDtcbiAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICAgICAgcGFkZGluZy1sZWZ0OiAke2hlaWdodCAqIDEuMDV9cHg7XG4gICAgICAgIHBhZGRpbmctcmlnaHQ6ICR7KGJvcmRlclJhZGl1cy0xMCA8IDUpID8gNSA6IGJvcmRlclJhZGl1cy0xMH1weDtcbiAgICB9XG5cbiAgICAvKlxuICAgICogRGVzY3JpcHRpb25cbiAgICAqL1xuXG4gICAgLiR7cHJlZml4fS1kZXNjcmlwdGlvbntcbiAgICAgICAgZm9udC1zaXplOiAxM3B4O1xuICAgICAgICBtYXJnaW4tdG9wOiA1cHhcbiAgICB9XG5cbiAgIC4ke3ByZWZpeH0tZGVzY3JpcHRpb24sIGEge1xuICAgICAgICBjb2xvcjogd2hpdGVcbiAgICB9XG5cbiAgICAvKlxuICAgICogRXJyb3JcbiAgICAqL1xuXG4gICAgYnV0dG9uLiR7cHJlZml4fS1idXR0b25bZGF0YS1lcnJvcj10cnVlXSB7XG4gICAgICAgIGJvcmRlci1jb2xvcjogJHtlcnJvckNvbG9yfTtcbiAgICB9XG4gICAgYnV0dG9uLiR7cHJlZml4fS1idXR0b25bZGF0YS1lcnJvcj10cnVlXSA+IC4ke3ByZWZpeH0tbG9nbyB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7ZXJyb3JDb2xvcn07XG4gICAgfVxuICAgIGJ1dHRvbi4ke3ByZWZpeH0tYnV0dG9uW2RhdGEtZXJyb3I9dHJ1ZV0gPiAuJHtwcmVmaXh9LXRpdGxlIHtcbiAgICAgICAgY29sb3I6ICR7ZXJyb3JDb2xvcn07XG4gICAgfVxuXG4gICAgYDtcblxuICAgICAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSBjc3M7XG4gICAgICAgIHJldHVybiBzdHlsZTtcbiAgICB9XG5cblxufVxuIiwiaW1wb3J0IHtBYnN0cmFjdEJ1dHRvbn0gZnJvbSBcIi4vQWJzdHJhY3RCdXR0b25cIjtcblxuZXhwb3J0IGNvbnN0IFN0YXRlID0ge1xuICAgIFJFQURZX1RPX1BSRVNFTlQ6ICdSRUFEWV9UT19QUkVTRU5UJyxcbiAgICBQUkVTRU5USU5HOiAnUFJFU0VOVElORydcbn07XG5cbmV4cG9ydCBjbGFzcyBFbnRlcjM2MEJ1dHRvbiBleHRlbmRzIEFic3RyYWN0QnV0dG9uIHtcbiAgICBjb25zdHJ1Y3RvcihjYW52YXNEb20sIG9wdGlvbnMpe1xuICAgICAgICBzdXBlcihjYW52YXNEb20sIG9wdGlvbnMpO1xuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoU3RhdGUuUkVBRFlfVE9fUFJFU0VOVCk7XG4gICAgfVxuXG4gICAgc2V0U3RhdGUoc3RhdGUpe1xuICAgICAgICBpZihzdGF0ZSAhPSB0aGlzLnN0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgICAgICAgICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBTdGF0ZS5SRUFEWV9UT19QUkVTRU5UOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRUaXRsZShcIkVudGVyIDM2MFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0RGVzY3JpcHRpb24oXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgU3RhdGUuUFJFU0VOVElORzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0VGl0bGUoXCJFeGl0IDM2MFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0RGVzY3JpcHRpb24oXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJVbmtvd24gc3RhdGUgXCIgKyBzdGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkNsaWNrRXZlbnQoZSl7XG4gICAgICAgIGlmKHRoaXMuc3RhdGUgPT0gU3RhdGUuUkVBRFlfVE9fUFJFU0VOVCl7XG4gICAgICAgICAgICBpZih0aGlzLm9uRW50ZXJCaW5kaW5nKXtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFN0YXRlLlBSRVNFTlRJTkcpO1xuICAgICAgICAgICAgICAgIHRoaXMub25FbnRlckJpbmRpbmcuY2FsbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYodGhpcy5zdGF0ZSA9PSBTdGF0ZS5QUkVTRU5USU5HKXtcbiAgICAgICAgICAgIGlmKHRoaXMub25FeGl0QmluZGluZyl7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShTdGF0ZS5SRUFEWV9UT19QUkVTRU5UKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uRXhpdEJpbmRpbmcuY2FsbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7QWJzdHJhY3RCdXR0b259IGZyb20gXCIuL0Fic3RyYWN0QnV0dG9uXCI7XG5pbXBvcnQge1dlYlZSTWFuYWdlcn0gZnJvbSBcIi4vV2ViVlJNYW5hZ2VyXCI7XG5cbmV4cG9ydCBjb25zdCBTdGF0ZSA9IHtcbiAgICBSRUFEWV9UT19QUkVTRU5UOiAnUkVBRFlfVE9fUFJFU0VOVCcsXG4gICAgRVJST1JfTk9fUFJFU0VOVEFCTEVfRElTUExBWVM6ICdFUlJPUl9OT19QUkVTRU5UQUJMRV9ESVNQTEFZUycsXG4gICAgRVJST1JfQlJPV1NFUl9OT1RfU1VQUE9SVEVEOiAnRVJST1JfQlJPV1NFUl9OT1RfU1VQUE9SVEVEJ1xufTtcblxuZXhwb3J0IGNsYXNzIEVudGVyVlJCdXR0b24gZXh0ZW5kcyBBYnN0cmFjdEJ1dHRvbiB7XG4gICAgY29uc3RydWN0b3IoY2FudmFzRG9tLCBvcHRpb25zKXtcbiAgICAgICAgc3VwZXIoY2FudmFzRG9tLCBvcHRpb25zKTtcblxuICAgICAgICAvLyBDaGVjayBpZiB0aGUgYnJvd3NlciBpcyBjb21wYXRpYmxlIHdpdGggV2ViVlIuXG4gICAgICAgIFdlYlZSTWFuYWdlci5nZXRQcmVzZW50YWJsZURldmljZSgpXG4gICAgICAgICAgICAudGhlbigoaG1kKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaG1kKTtcbiAgICAgICAgICAgICAgICB0aGlzLmhtZCA9IGhtZDtcbiAgICAgICAgICAgICAgICBpZihobWQuY2FwYWJpbGl0aWVzLmNhblByZXNlbnQpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFN0YXRlLlJFQURZX1RPX1BSRVNFTlQpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShTdGF0ZS5FUlJPUl9CUk9XU0VSX05PVF9TVVBQT1JURUQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmKGUubmFtZSA9PSAnTk9fRElTUExBWVMnKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShTdGF0ZS5FUlJPUl9OT19QUkVTRU5UQUJMRV9ESVNQTEFZUylcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoZS5uYW1lID09ICdXRUJWUl9VTlNVUFBPUlRFRCcpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFN0YXRlLkVSUk9SX0JST1dTRVJfTk9UX1NVUFBPUlRFRClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgIH1cblxuICAgIHNldFN0YXRlKHN0YXRlKXtcbiAgICAgICAgaWYoc3RhdGUgIT0gdGhpcy5zdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICAgICAgc3dpdGNoIChzdGF0ZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgU3RhdGUuUkVBRFlfVE9fUFJFU0VOVDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0VGl0bGUoXCJFbnRlciBWUlwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0RGVzY3JpcHRpb24oXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgU3RhdGUuRVJST1JfTk9fUFJFU0VOVEFCTEVfRElTUExBWVM6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldFRpdGxlKFwiTm8gVlIgSGVhZHNldCBmb3VuZFwiLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0RGVzY3JpcHRpb24oXCJcIilcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBTdGF0ZS5FUlJPUl9CUk9XU0VSX05PVF9TVVBQT1JURUQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldFRpdGxlKFwiQnJvd3NlciBub3Qgc3VwcG9ydGVkXCIsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXREZXNjcmlwdGlvbihcIlNvcnJ5LCB5b3VyIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IDxhIGhyZWY9J2h0dHA6Ly93ZWJ2ci5pbmZvJz5XZWJWUjwvYT5cIilcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlVua293biBXZWJWUiBzdGF0ZSBcIiArIHN0YXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQ2xpY2tFdmVudChlKXtcbiAgICAgICAgaWYodGhpcy5zdGF0ZSA9PSBTdGF0ZS5SRUFEWV9UT19QUkVTRU5UKXtcbiAgICAgICAgICAgIHRoaXMud2VidnJtYW5hZ2VyLmVudGVyVnIodGhpcy5obWQpXG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJleHBvcnQgY2xhc3MgV2ViVlJNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihjYW52YXNEb20pe1xuICAgICAgICB0aGlzLmRvbUVsZW1lbnQgPSBjYW52YXNEb207XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBQcm9taXNlIHJldHVybnMgdHJ1ZSBpZiB0aGVyZSBpcyBhdCBsZWFzdCBvbmUgSE1EIGRldmljZSBhdmFpbGFibGUuXG4gICAgICovXG4gICAgc3RhdGljIGdldFByZXNlbnRhYmxlRGV2aWNlKHR5cGUgPSBWUkRpc3BsYXkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmKCFuYXZpZ2F0b3IgfHwgIW5hdmlnYXRvci5nZXRWUkRpc3BsYXlzKXtcblxuICAgICAgICAgICAgICAgIGxldCBlID0gbmV3IEVycm9yKFwiQnJvd3NlciBub3Qgc3VwcG9ydGluZyBXZWJWUlwiKVxuICAgICAgICAgICAgICAgIGUubmFtZSA9ICdXRUJWUl9VTlNVUFBPUlRFRCc7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbmF2aWdhdG9yLmdldFZSRGlzcGxheXMoKS50aGVuKGZ1bmN0aW9uKGRpc3BsYXlzKSB7XG4gICAgICAgICAgICAgICAgLy8gUHJvbWlzZSBzdWNjZWVkcywgYnV0IGNoZWNrIGlmIHRoZXJlIGFyZSBhbnkgZGlzcGxheXMgYWN0dWFsbHkuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkaXNwbGF5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkaXNwbGF5c1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXNwbGF5c1tpXSBpbnN0YW5jZW9mIHR5cGUgJiYgZGlzcGxheXNbaV0uY2FwYWJpbGl0aWVzLmNhblByZXNlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGlzcGxheXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgZSA9IG5ldyBFcnJvcihcIk5vIGRpc3BsYXlzIGZvdW5kXCIpXG4gICAgICAgICAgICAgICAgZS5uYW1lID0gJ05PX0RJU1BMQVlTJztcbiAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvLyBObyBkaXNwbGF5cyBhcmUgZm91bmQuXG4gICAgICAgICAgICAgICAgbGV0IGUgPSBuZXcgRXJyb3IoXCJObyBkaXNwbGF5cyBmb3VuZFwiKVxuICAgICAgICAgICAgICAgIGUubmFtZSA9ICdOT19ESVNQTEFZUyc7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBlbnRlclZyKGhtZCl7XG4gICAgICAgIGhtZC5yZXF1ZXN0UHJlc2VudChbe1xuICAgICAgICAgICAgc291cmNlOiAgdGhpcy5kb21FbGVtZW50XG4gICAgICAgIH1dKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFN0YXRlLCBBYnN0cmFjdEJ1dHRvbiB9IGZyb20gJy4vQWJzdHJhY3RCdXR0b24nO1xuaW1wb3J0IHsgV2ViVlJNYW5hZ2VyIH0gZnJvbSAnLi9XZWJWUk1hbmFnZXInO1xuaW1wb3J0IHsgRW50ZXJWUkJ1dHRvbiB9IGZyb20gJy4vRW50ZXJWUkJ1dHRvbic7XG5pbXBvcnQgeyBFbnRlcjM2MEJ1dHRvbiB9IGZyb20gJy4vRW50ZXIzNjBCdXR0b24nO1xuXG5cbmV4cG9ydCB7XG4gICAgRW50ZXJWUkJ1dHRvbixcbiAgICBFbnRlcjM2MEJ1dHRvbixcbiAgICBBYnN0cmFjdEJ1dHRvbixcbiAgICBTdGF0ZSxcbiAgICBXZWJWUk1hbmFnZXJcbn07XG5cblxuIl19
