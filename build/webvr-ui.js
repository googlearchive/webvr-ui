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
    function AbstractButton(canvasDom, icon, options) {
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

        this.button = new options.domClass(options.size, icon);
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

    function DefaultButtonDom(height, icon) {
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

        if (icon == 'VR') {
            _this.logoElm.appendChild(DefaultButtonDom.generateSvgIcon(_this.fontSize));
        } else {
            _this.logoElm.appendChild(DefaultButtonDom.generate360SvgIcon(_this.fontSize));
        }
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
    }, {
        key: "generate360SvgIcon",
        value: function generate360SvgIcon(height) {

            var logo = document.createElement("div");
            var aspect = 28 / 18;

            logo.innerHTML = "<svg version=\"1.1\"\n        x=\"0px\" y=\"0px\" width=\"" + aspect * height + "px\" height=\"" + height + "px\" viewBox=\"0 0 28 11\" xml:space=\"preserve\">\n            <path id=\"XMLID_16_\" d=\"M17.3,7.1c0.3,0,0.9,0,1.6,0c0.7,0,1.5-0.1,2.4-0.2c0.9-0.1,2-0.3,3-0.6c0.5-0.2,1.1-0.4,1.6-0.7\n        c0.5-0.3,0.8-0.7,0.8-0.9c0-0.1-0.1-0.3-0.3-0.5c-0.2-0.2-0.5-0.3-0.8-0.5c-0.6-0.3-1.3-0.5-2-0.6c-1.4-0.3-3-0.5-4.6-0.6\n        c-0.7-0.1-1.7-0.1-2.3-0.1v-1c0.6,0,1.6,0,2.4,0.1c1.6,0.1,3.2,0.2,4.7,0.5c0.8,0.2,1.5,0.3,2.2,0.6c0.4,0.2,0.7,0.3,1.1,0.6\n        C27.5,3.6,27.9,4,28,4.6c0.1,0.6-0.2,1.1-0.4,1.5c-0.3,0.3-0.6,0.6-0.9,0.8c-0.6,0.4-1.2,0.7-1.8,0.9c-1.2,0.5-2.3,0.7-3.3,1\n        c-1,0.2-1.9,0.3-2.6,0.4c-0.7,0.1-1.4,0.1-1.8,0.2c-0.2,0-0.5,0-0.5,0v1.6L13.7,8l3.1-2.9v1.9C16.8,7.1,17.1,7.1,17.3,7.1z\"/>\n        <path id=\"XMLID_15_\" d=\"M10.5,3.8c-0.3,0-0.8,0-1.5,0C8.4,3.8,7.6,3.9,6.7,4c-0.9,0.1-2,0.3-3,0.6C3.1,4.8,2.6,5,2.1,5.3\n        C1.6,5.6,1.3,6,1.3,6.2c0,0.1,0.1,0.3,0.3,0.5C1.8,6.8,2.1,7,2.4,7.1c0.6,0.3,1.3,0.5,2,0.6c1.4,0.3,2.8,0.5,4.4,0.6\n        c0.7,0.1,1.5,0.1,2.1,0.1v1c-0.6,0-1.4,0-2.2-0.1C7.1,9.3,5.6,9.1,4.1,8.8C3.3,8.7,2.6,8.5,1.9,8.2C1.5,8,1.2,7.9,0.8,7.6\n        C0.5,7.4,0.1,7,0,6.4c-0.1-0.6,0.2-1.1,0.4-1.5C0.7,4.6,1,4.3,1.3,4.1c0.6-0.4,1.2-0.7,1.8-0.9c1.2-0.5,2.3-0.7,3.3-1\n        C7.4,2,8.2,1.9,9,1.8c0.7-0.1,1.2-0.1,1.6-0.2c0.2,0,0.3,0,0.3,0V0L14,2.9l-3.1,2.9V3.9C10.9,3.9,10.7,3.8,10.5,3.8z\"/>\n        </svg>";
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

            var css = '\n\n\n    button.' + prefix + '-button {\n        border: white ' + borderWidth + 'px solid;\n        border-radius: ' + borderRadius + 'px;\n        box-sizing: border-box;\n        background: rgba(0,0,0, 0);\n\n        height: ' + height + 'px;\n        min-width: ' + 125 + 'px;\n        display: inline-block;\n        position: relative;\n        \n        margin-top: 8px;\n\n        font-family: \'Karla\', sans-serif;\n        cursor: pointer;\n\n         -webkit-transition: width 0.5s;\n        transition: width 0.5s;\n    }\n\n    /*\n    * Logo\n    */\n\n    .' + prefix + '-logo {\n        width: ' + height + 'px;\n        height: ' + height + 'px;\n        border-radius: ' + borderRadius + 'px;\n        background-color: white;\n        position: absolute;\n        top:-' + borderWidth + 'px;\n        left:-' + borderWidth + 'px;\n    }\n    .' + prefix + '-logo > svg {\n        margin-top: ' + (height - fontSize) / 2 + 'px;\n    }\n\n\n    /*\n    * Title\n    */\n\n    .' + prefix + '-title {\n        color: white;\n        position: relative;\n        font-size: ' + fontSize + 'px;\n        top: -' + borderWidth + 'px;\n        line-height: ' + (height - borderWidth * 2) + 'px;\n        text-align: left;\n        padding-left: ' + height * 1.05 + 'px;\n        padding-right: ' + (borderRadius - 10 < 5 ? 5 : borderRadius - 10) + 'px;\n    }\n\n    /*\n    * Description\n    */\n\n    .' + prefix + '-description{\n        font-size: 13px;\n        margin-top: 5px;\n        margin-bottom: 10px;\n        \n    }\n\n   .' + prefix + '-description, a {\n        color: white\n    }\n\n    /*\n    * Error\n    */\n\n    button.' + prefix + '-button[data-error=true] {\n        border-color: ' + errorColor + ';\n    }\n    button.' + prefix + '-button[data-error=true] > .' + prefix + '-logo {\n        background-color: ' + errorColor + ';\n    }\n    button.' + prefix + '-button[data-error=true] > .' + prefix + '-title {\n        color: ' + errorColor + ';\n    }\n\n    ';

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

        var _this = _possibleConstructorReturn(this, (Enter360Button.__proto__ || Object.getPrototypeOf(Enter360Button)).call(this, canvasDom, '360', options));

        _this.canvasDom = canvasDom;

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

                        if (this.onExitBinding && this.laststate == State.PRESENTING) {
                            this.onExitBinding.call();
                        }
                        break;
                    case State.PRESENTING:
                        this.button.setTitle("Exit 360");
                        this.button.setDescription("");

                        if (this.onEnterBinding) {
                            this.onEnterBinding.call();
                        }
                        break;
                    default:
                        console.error("Unkown state " + state);
                }

                this.laststate = this.state;
            }
        }
    }, {
        key: 'onClickEvent',
        value: function onClickEvent(e) {
            if (this.state == State.READY_TO_PRESENT) {
                this.setState(State.PRESENTING);
                this.enterFullscreen();
            } else if (this.state == State.PRESENTING) {
                this.setState(State.READY_TO_PRESENT);
            }
        }
    }, {
        key: 'enterFullscreen',
        value: function enterFullscreen() {
            var element = this.canvasDom;

            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            } else {
                return false;
            }
            return true;
        }
    }, {
        key: 'exitFullscreen',
        value: function exitFullscreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else {
                return false;
            }

            return true;
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
    PRESENTING: 'PRESENTING',
    ERROR_NO_PRESENTABLE_DISPLAYS: 'ERROR_NO_PRESENTABLE_DISPLAYS',
    ERROR_BROWSER_NOT_SUPPORTED: 'ERROR_BROWSER_NOT_SUPPORTED'
};

var EnterVRButton = exports.EnterVRButton = function (_AbstractButton) {
    _inherits(EnterVRButton, _AbstractButton);

    function EnterVRButton(canvasDom, options) {
        _classCallCheck(this, EnterVRButton);

        var _this = _possibleConstructorReturn(this, (EnterVRButton.__proto__ || Object.getPrototypeOf(EnterVRButton)).call(this, canvasDom, 'VR', options));

        _this.checkDevices();

        _this.webvrmanager.onVRDisplayPresentChange(function () {
            if (_this.webvrmanager.isPresenting()) {
                _this.setState(State.PRESENTING);
            } else {
                _this.setState(State.READY_TO_PRESENT);
            }
        });
        return _this;
    }

    _createClass(EnterVRButton, [{
        key: "checkDevices",
        value: function checkDevices() {
            var _this2 = this;

            // Check if the browser is compatible with WebVR and has headsets.
            this.webvrmanager.getPresentableDevice().then(function (hmd) {
                console.log(hmd);
                _this2.hmd = hmd;
                _this2.setState(State.READY_TO_PRESENT);
            }).catch(function (e) {
                if (e.name == 'NO_DISPLAYS') {
                    _this2.setState(State.ERROR_NO_PRESENTABLE_DISPLAYS);
                } else if (e.name == 'WEBVR_UNSUPPORTED') {
                    _this2.setState(State.ERROR_BROWSER_NOT_SUPPORTED);
                }
            });
        }
    }, {
        key: "setState",
        value: function setState(state) {
            if (state != this.state) {
                this.state = state;
                switch (state) {
                    case State.READY_TO_PRESENT:
                        this.button.setTitle("Enter VR");
                        this.button.setDescription("");
                        break;
                    case State.PRESENTING:
                        this.button.setTitle("Exit VR");
                        this.button.setDescription("");
                        break;
                    case State.ERROR_NO_PRESENTABLE_DISPLAYS:
                        this.button.setTitle("Enter VR", true);
                        this.button.setDescription("No VR Headset found");
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
                this.setState(State.PRESENTING);
                this.webvrmanager.enterVr(this.hmd);
            } else if (this.state == State.PRESENTING) {
                this.setState(State.READY_TO_PRESENT);
                this.webvrmanager.exitVr();
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
        //
        //
        // // Bind to fullscreen events.
        // document.addEventListener('webkitfullscreenchange',
        //     this.onFullscreenChange_.bind(this));
        // document.addEventListener('mozfullscreenchange',
        //     this.onFullscreenChange_.bind(this));
        // document.addEventListener('msfullscreenchange',
        //     this.onFullscreenChange_.bind(this));
        //
        // // Bind to VR* specific events.
        // window.addEventListener('vrdisplaydeviceparamschange',
        //     this.onVRDisplayPresentChange_.bind(this));
    }

    /**
     * Promise returns true if there is at least one HMD device available.
     */


    _createClass(WebVRManager, [{
        key: "getPresentableDevice",
        value: function getPresentableDevice() {
            var displayType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : VRDisplay;

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
                        if (displays[i] instanceof displayType && displays[i].capabilities.canPresent) {
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
    }, {
        key: "enterVr",
        value: function enterVr(hmd) {
            this.presentingHmd = hmd;
            hmd.requestPresent([{
                source: this.domElement
            }]);
        }
    }, {
        key: "exitVr",
        value: function exitVr() {
            if (this.presentingHmd) {
                this.presentingHmd.exitPresent();
                delete this.presentingHmd;
            }
        }
    }, {
        key: "isPresenting",
        value: function isPresenting() {
            return this.presentingHmd && this.presentingHmd.isPresenting;
        }
    }, {
        key: "onVRDisplayPresentChange",
        value: function onVRDisplayPresentChange(func) {
            window.addEventListener('vrdisplaypresentchange', func.bind(this));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQWJzdHJhY3RCdXR0b24uanMiLCJzcmMvQWJzdHJhY3RCdXR0b25Eb20uanMiLCJzcmMvRGVmYXVsdEJ1dHRvbkRvbS5qcyIsInNyYy9EZWZhdWx0QnV0dG9uU3R5bGUuanMiLCJzcmMvRW50ZXIzNjBCdXR0b24uanMiLCJzcmMvRW50ZXJWUkJ1dHRvbi5qcyIsInNyYy9XZWJWUk1hbmFnZXIuanMiLCJzcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7QUNBQTs7QUFDQTs7OztJQUlhLGMsV0FBQSxjO0FBQ1QsNEJBQVksU0FBWixFQUF1QixJQUF2QixFQUE2QixPQUE3QixFQUFxQztBQUFBOztBQUNqQyxZQUFHLENBQUMsT0FBSixFQUFhLFVBQVUsRUFBVjs7QUFFYjtBQUNBLFlBQUcsQ0FBQyxRQUFRLElBQVosRUFBaUI7QUFDYixvQkFBUSxJQUFSLEdBQWUsRUFBZjtBQUNIOztBQUVELFlBQUcsQ0FBQyxRQUFRLFFBQVosRUFBcUI7QUFDakIsb0JBQVEsUUFBUjtBQUNIOztBQUVELGFBQUssWUFBTCxHQUFvQiwrQkFBaUIsU0FBakIsQ0FBcEI7O0FBRUEsYUFBSyxNQUFMLEdBQWMsSUFBSSxRQUFRLFFBQVosQ0FBcUIsUUFBUSxJQUE3QixFQUFtQyxJQUFuQyxDQUFkO0FBQ0EsYUFBSyxNQUFMLENBQVksU0FBWjtBQUNBLGFBQUssTUFBTCxDQUFZLE9BQVosQ0FBb0IsS0FBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLElBQXZCLENBQXBCOztBQUVBLGFBQUssVUFBTCxHQUFrQixLQUFLLE1BQUwsQ0FBWSxVQUE5QjtBQUNIOzs7O3FDQUVZLEMsRUFBRSxDQUNkOzs7Z0NBRU8sSSxFQUFLO0FBQ1QsaUJBQUssY0FBTCxHQUFzQixJQUF0QjtBQUNIOzs7K0JBRU0sSSxFQUFLO0FBQ1IsaUJBQUssYUFBTCxHQUFxQixJQUFyQjtBQUNI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QUNBO0FBQ0g7QUFDSjs7QUFFRCx3QkFBSSxJQUFJLElBQUksS0FBSixDQUFVLG1CQUFWLENBQVI7QUFDQSxzQkFBRSxJQUFGLEdBQVMsYUFBVDtBQUNBLDJCQUFPLENBQVA7QUFDSCxpQkFiRCxFQWFHLFlBQVc7QUFDVjtBQUNBLHdCQUFJLElBQUksSUFBSSxLQUFKLENBQVUsbUJBQVYsQ0FBUjtBQUNBLHNCQUFFLElBQUYsR0FBUyxhQUFUO0FBQ0EsMkJBQU8sQ0FBUDtBQUNILGlCQWxCRDtBQW1CSCxhQTNCTSxDQUFQO0FBNEJIOzs7Z0NBRU8sRyxFQUFJO0FBQ1IsaUJBQUssYUFBTCxHQUFxQixHQUFyQjtBQUNBLGdCQUFJLGNBQUosQ0FBbUIsQ0FBQztBQUNoQix3QkFBUyxLQUFLO0FBREUsYUFBRCxDQUFuQjtBQUdIOzs7aUNBRU87QUFDSixnQkFBRyxLQUFLLGFBQVIsRUFBc0I7QUFDbEIscUJBQUssYUFBTCxDQUFtQixXQUFuQjtBQUNBLHVCQUFPLEtBQUssYUFBWjtBQUNIO0FBQ0o7Ozt1Q0FFYTtBQUNWLG1CQUFPLEtBQUssYUFBTCxJQUFzQixLQUFLLGFBQUwsQ0FBbUIsWUFBaEQ7QUFDSDs7O2lEQUV3QixJLEVBQUs7QUFDMUIsbUJBQU8sZ0JBQVAsQ0FBd0Isd0JBQXhCLEVBQ0ksS0FBSyxJQUFMLENBQVUsSUFBVixDQURKO0FBRUg7Ozs7Ozs7Ozs7Ozs7O0FDMUVMOztBQUNBOztBQUNBOztBQUNBOztRQUlJLGE7UUFDQSxjO1FBQ0EsYztRQUNBLEs7UUFDQSxZIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7IFdlYlZSTWFuYWdlciB9IGZyb20gJy4vV2ViVlJNYW5hZ2VyJztcbmltcG9ydCB7IERlZmF1bHRCdXR0b25Eb20gfSBmcm9tICcuL0RlZmF1bHRCdXR0b25Eb20nO1xuXG5cblxuZXhwb3J0IGNsYXNzIEFic3RyYWN0QnV0dG9uIHtcbiAgICBjb25zdHJ1Y3RvcihjYW52YXNEb20sIGljb24sIG9wdGlvbnMpe1xuICAgICAgICBpZighb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuXG4gICAgICAgIC8vIE9wdGlvbiB0byBjY2FuZ2UgcGl4ZWwgaGVpZ2h0IG9mIHRoZSBidXR0b24uXG4gICAgICAgIGlmKCFvcHRpb25zLnNpemUpe1xuICAgICAgICAgICAgb3B0aW9ucy5zaXplID0gMzU7XG4gICAgICAgIH1cblxuICAgICAgICBpZighb3B0aW9ucy5kb21DbGFzcyl7XG4gICAgICAgICAgICBvcHRpb25zLmRvbUNsYXNzID0gRGVmYXVsdEJ1dHRvbkRvbTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMud2VidnJtYW5hZ2VyID0gbmV3IFdlYlZSTWFuYWdlcihjYW52YXNEb20pO1xuXG4gICAgICAgIHRoaXMuYnV0dG9uID0gbmV3IG9wdGlvbnMuZG9tQ2xhc3Mob3B0aW9ucy5zaXplLCBpY29uKTtcbiAgICAgICAgdGhpcy5idXR0b24uaW5qZWN0Q3NzKCk7XG4gICAgICAgIHRoaXMuYnV0dG9uLm9uQ2xpY2sodGhpcy5vbkNsaWNrRXZlbnQuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGhpcy5kb21FbGVtZW50ID0gdGhpcy5idXR0b24uZG9tRWxlbWVudDtcbiAgICB9XG5cbiAgICBvbkNsaWNrRXZlbnQoZSl7XG4gICAgfVxuXG4gICAgb25FbnRlcihmdW5jKXtcbiAgICAgICAgdGhpcy5vbkVudGVyQmluZGluZyA9IGZ1bmM7XG4gICAgfVxuXG4gICAgb25FeGl0KGZ1bmMpe1xuICAgICAgICB0aGlzLm9uRXhpdEJpbmRpbmcgPSBmdW5jO1xuICAgIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBBYnN0cmFjdEJ1dHRvbkRvbSB7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5kb21FbGVtZW50ID0gdW5kZWZpbmVkO1xuXG4gICAgfVxuXG4gICAgb25DbGljayhmdW5jKXtcbiAgICAgICAgdGhpcy5vbkNsaWNrQmluZGluZyA9IGZ1bmM7XG4gICAgfVxuXG4gICAgc2V0VGl0bGUodGV4dCwgZXJyb3IgPSBmYWxzZSkge1xuICAgIH1cblxuICAgIHNldERlc2NyaXB0aW9uKHRleHQpIHtcbiAgICB9XG59IiwiaW1wb3J0IHsgV2ViVlJCdXR0b25TdHlsZSB9IGZyb20gJy4vRGVmYXVsdEJ1dHRvblN0eWxlJztcbmltcG9ydCB7QWJzdHJhY3RCdXR0b25Eb219IGZyb20gXCIuL0Fic3RyYWN0QnV0dG9uRG9tXCI7XG5cbmxldCBfV2ViVlJVSV9jc3NfaW5qZWN0ZWQgPSBmYWxzZTtcblxuZXhwb3J0IGNsYXNzIERlZmF1bHRCdXR0b25Eb20gZXh0ZW5kcyBBYnN0cmFjdEJ1dHRvbkRvbSB7XG4gICAgY29uc3RydWN0b3IoaGVpZ2h0LCBpY29uKXtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLm9uQ2xpY2tCaW5kaW5nID0gKGUpID0+IHt9O1xuICAgICAgICB0aGlzLmNzc0NsYXNzUHJlZml4ID0gXCJ3ZWJ2ci11aS1idXR0b25cIjtcblxuICAgICAgICB0aGlzLmZvbnRTaXplID0gaGVpZ2h0LzIuNTtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cblxuICAgICAgICB0aGlzLmRvbUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmRvbUVsZW1lbnQuY2xhc3NOYW1lID0gdGhpcy5jc3NDbGFzc1ByZWZpeDtcblxuICAgICAgICB0aGlzLmJ1dHRvbkVsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMuYnV0dG9uRWxtLmNsYXNzTmFtZSA9IHRoaXMuY3NzQ2xhc3NQcmVmaXggICsgXCItYnV0dG9uXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uRWxtLmRhdGFzZXQuZXJyb3IgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kb21FbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuYnV0dG9uRWxtKTtcblxuICAgICAgICB0aGlzLnRpdGxlRWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy50aXRsZUVsbS5jbGFzc05hbWUgPSB0aGlzLmNzc0NsYXNzUHJlZml4ICArIFwiLXRpdGxlXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uRWxtLmFwcGVuZENoaWxkKHRoaXMudGl0bGVFbG0pO1xuXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb25FbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uRWxtLmNsYXNzTmFtZSA9IHRoaXMuY3NzQ2xhc3NQcmVmaXggICsgXCItZGVzY3JpcHRpb25cIjtcbiAgICAgICAgdGhpcy5kb21FbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZGVzY3JpcHRpb25FbG0pO1xuXG4gICAgICAgIHRoaXMubG9nb0VsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgaWYoaWNvbiA9PSAnVlInKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ29FbG0uYXBwZW5kQ2hpbGQoRGVmYXVsdEJ1dHRvbkRvbS5nZW5lcmF0ZVN2Z0ljb24odGhpcy5mb250U2l6ZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sb2dvRWxtLmFwcGVuZENoaWxkKERlZmF1bHRCdXR0b25Eb20uZ2VuZXJhdGUzNjBTdmdJY29uKHRoaXMuZm9udFNpemUpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ29FbG0uY2xhc3NOYW1lID0gdGhpcy5jc3NDbGFzc1ByZWZpeCAgKyBcIi1sb2dvXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uRWxtLmFwcGVuZENoaWxkKHRoaXMubG9nb0VsbSk7XG5cblxuICAgICAgICB0aGlzLmJ1dHRvbkVsbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZih0aGlzLm9uQ2xpY2tCaW5kaW5nKXtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2xpY2tCaW5kaW5nLmNhbGwodGhpcyxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuXG4gICAgaW5qZWN0Q3NzKCl7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSBpdHMgb25seSBpbmplY3RlZCBvbmNlXG4gICAgICAgIGlmKCFfV2ViVlJVSV9jc3NfaW5qZWN0ZWQpIHtcbiAgICAgICAgICAgIF9XZWJWUlVJX2Nzc19pbmplY3RlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgY3NzXG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBXZWJWUkJ1dHRvblN0eWxlLmdlbmVyYXRlQ3NzKHRoaXMuY3NzQ2xhc3NQcmVmaXggLCB0aGlzLmhlaWdodCwgdGhpcy5mb250U2l6ZSk7XG5cbiAgICAgICAgICAgIHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICAgICAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlLGhlYWQuZmlyc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRUaXRsZSh0ZXh0LCBlcnJvciA9IGZhbHNlKXtcbiAgICAgICAgdGhpcy5idXR0b25FbG0udGl0bGUgPSB0ZXh0O1xuICAgICAgICB0aGlzLmJ1dHRvbkVsbS5kYXRhc2V0LmVycm9yID0gZXJyb3I7XG5cbiAgICAgICAgaWYoIXRleHQpe1xuICAgICAgICAgICAgdGhpcy50aXRsZUVsbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50aXRsZUVsbS5pbm5lclRleHQgPSB0ZXh0O1xuICAgICAgICAgICAgdGhpcy50aXRsZUVsbS5zdHlsZS5kaXNwbGF5ID0gJ2luaGVyaXQnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0RGVzY3JpcHRpb24odGV4dCl7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb25FbG0uaW5uZXJIVE1MID0gdGV4dDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2VuZXJhdGVTdmdJY29uKGhlaWdodCl7XG4gICAgICAgIGxldCBsb2dvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbGV0IGFzcGVjdCA9IDI4LzE4O1xuXG4gICAgICAgIGxvZ28uaW5uZXJIVE1MID1cbiAgICAgICAgICAgIGA8c3ZnIHZlcnNpb249XCIxLjFcIlxuICAgICAgICAgICAgICAgIHg9XCIwcHhcIiB5PVwiMHB4XCIgd2lkdGg9XCIke2FzcGVjdCpoZWlnaHR9cHhcIiBoZWlnaHQ9XCIke2hlaWdodH1weFwiIHZpZXdCb3g9XCIwIDAgMjggMThcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPlxuICAgICAgICAgICAgPHN0eWxlIHR5cGU9XCJ0ZXh0L2Nzc1wiPlxuICAgICAgICAgICAgICAgIC5zdDB7XG4gICAgICAgICAgICAgICAgZmlsbDojMDAwMDAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvc3R5bGU+XG4gICAgICAgICAgICAgICAgPHBhdGggaWQ9XCJYTUxJRF8xNV9cIiBjbGFzcz1cInN0MFwiIGQ9XCJNMjYuOCwxLjFDMjYuMSwwLjQsMjUuMSwwLDI0LjIsMEgzLjRjLTEsMC0xLjcsMC40LTIuNCwxLjFDMC4zLDEuNywwLDIuNywwLDMuNnYxMC43XG4gICAgICAgICAgICBjMCwxLDAuMywxLjksMC45LDIuNkMxLjYsMTcuNiwyLjQsMTgsMy40LDE4aDVjMC43LDAsMS4zLTAuMiwxLjgtMC41YzAuNi0wLjMsMS0wLjgsMS4zLTEuNGwxLjUtMi42QzEzLjIsMTMuMSwxMywxMywxNCwxM3YwaC0wLjJcbiAgICAgICAgICAgIGgwYzAuMywwLDAuNywwLjEsMC44LDAuNWwxLjQsMi42YzAuMywwLjYsMC44LDEuMSwxLjMsMS40YzAuNiwwLjMsMS4yLDAuNSwxLjgsMC41aDVjMSwwLDItMC40LDIuNy0xLjFjMC43LTAuNywxLjItMS42LDEuMi0yLjZcbiAgICAgICAgICAgIFYzLjZDMjgsMi43LDI3LjUsMS43LDI2LjgsMS4xeiBNNy40LDExLjhjLTEuNiwwLTIuOC0xLjMtMi44LTIuOGMwLTEuNiwxLjMtMi44LDIuOC0yLjhjMS42LDAsMi44LDEuMywyLjgsMi44XG4gICAgICAgICAgICBDMTAuMiwxMC41LDguOSwxMS44LDcuNCwxMS44eiBNMjAuMSwxMS44Yy0xLjYsMC0yLjgtMS4zLTIuOC0yLjhjMC0xLjYsMS4zLTIuOCwyLjgtMi44QzIxLjcsNi4yLDIzLDcuNCwyMyw5XG4gICAgICAgICAgICBDMjMsMTAuNSwyMS43LDExLjgsMjAuMSwxMS44elwiLz5cbiAgICAgICAgICAgIDwvc3ZnPmA7XG4gICAgICAgIHJldHVybiBsb2dvLmZpcnN0Q2hpbGQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGdlbmVyYXRlMzYwU3ZnSWNvbihoZWlnaHQpe1xuXG4gICAgICAgIGxldCBsb2dvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbGV0IGFzcGVjdCA9IDI4LzE4O1xuXG4gICAgICAgIGxvZ28uaW5uZXJIVE1MID1cbiAgICAgICAgICAgIGA8c3ZnIHZlcnNpb249XCIxLjFcIlxuICAgICAgICB4PVwiMHB4XCIgeT1cIjBweFwiIHdpZHRoPVwiJHthc3BlY3QqaGVpZ2h0fXB4XCIgaGVpZ2h0PVwiJHtoZWlnaHR9cHhcIiB2aWV3Qm94PVwiMCAwIDI4IDExXCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj5cbiAgICAgICAgICAgIDxwYXRoIGlkPVwiWE1MSURfMTZfXCIgZD1cIk0xNy4zLDcuMWMwLjMsMCwwLjksMCwxLjYsMGMwLjcsMCwxLjUtMC4xLDIuNC0wLjJjMC45LTAuMSwyLTAuMywzLTAuNmMwLjUtMC4yLDEuMS0wLjQsMS42LTAuN1xuICAgICAgICBjMC41LTAuMywwLjgtMC43LDAuOC0wLjljMC0wLjEtMC4xLTAuMy0wLjMtMC41Yy0wLjItMC4yLTAuNS0wLjMtMC44LTAuNWMtMC42LTAuMy0xLjMtMC41LTItMC42Yy0xLjQtMC4zLTMtMC41LTQuNi0wLjZcbiAgICAgICAgYy0wLjctMC4xLTEuNy0wLjEtMi4zLTAuMXYtMWMwLjYsMCwxLjYsMCwyLjQsMC4xYzEuNiwwLjEsMy4yLDAuMiw0LjcsMC41YzAuOCwwLjIsMS41LDAuMywyLjIsMC42YzAuNCwwLjIsMC43LDAuMywxLjEsMC42XG4gICAgICAgIEMyNy41LDMuNiwyNy45LDQsMjgsNC42YzAuMSwwLjYtMC4yLDEuMS0wLjQsMS41Yy0wLjMsMC4zLTAuNiwwLjYtMC45LDAuOGMtMC42LDAuNC0xLjIsMC43LTEuOCwwLjljLTEuMiwwLjUtMi4zLDAuNy0zLjMsMVxuICAgICAgICBjLTEsMC4yLTEuOSwwLjMtMi42LDAuNGMtMC43LDAuMS0xLjQsMC4xLTEuOCwwLjJjLTAuMiwwLTAuNSwwLTAuNSwwdjEuNkwxMy43LDhsMy4xLTIuOXYxLjlDMTYuOCw3LjEsMTcuMSw3LjEsMTcuMyw3LjF6XCIvPlxuICAgICAgICA8cGF0aCBpZD1cIlhNTElEXzE1X1wiIGQ9XCJNMTAuNSwzLjhjLTAuMywwLTAuOCwwLTEuNSwwQzguNCwzLjgsNy42LDMuOSw2LjcsNGMtMC45LDAuMS0yLDAuMy0zLDAuNkMzLjEsNC44LDIuNiw1LDIuMSw1LjNcbiAgICAgICAgQzEuNiw1LjYsMS4zLDYsMS4zLDYuMmMwLDAuMSwwLjEsMC4zLDAuMywwLjVDMS44LDYuOCwyLjEsNywyLjQsNy4xYzAuNiwwLjMsMS4zLDAuNSwyLDAuNmMxLjQsMC4zLDIuOCwwLjUsNC40LDAuNlxuICAgICAgICBjMC43LDAuMSwxLjUsMC4xLDIuMSwwLjF2MWMtMC42LDAtMS40LDAtMi4yLTAuMUM3LjEsOS4zLDUuNiw5LjEsNC4xLDguOEMzLjMsOC43LDIuNiw4LjUsMS45LDguMkMxLjUsOCwxLjIsNy45LDAuOCw3LjZcbiAgICAgICAgQzAuNSw3LjQsMC4xLDcsMCw2LjRjLTAuMS0wLjYsMC4yLTEuMSwwLjQtMS41QzAuNyw0LjYsMSw0LjMsMS4zLDQuMWMwLjYtMC40LDEuMi0wLjcsMS44LTAuOWMxLjItMC41LDIuMy0wLjcsMy4zLTFcbiAgICAgICAgQzcuNCwyLDguMiwxLjksOSwxLjhjMC43LTAuMSwxLjItMC4xLDEuNi0wLjJjMC4yLDAsMC4zLDAsMC4zLDBWMEwxNCwyLjlsLTMuMSwyLjlWMy45QzEwLjksMy45LDEwLjcsMy44LDEwLjUsMy44elwiLz5cbiAgICAgICAgPC9zdmc+YDtcbiAgICAgICAgcmV0dXJuIGxvZ28uZmlyc3RDaGlsZDtcblxuXG5cblxuICAgIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBXZWJWUkJ1dHRvblN0eWxlIHtcbiAgICBzdGF0aWMgZ2VuZXJhdGVDc3MocHJlZml4LCBoZWlnaHQgPSA1MCwgZm9udFNpemUgPSAxOCl7XG4gICAgICAgIGxldCBib3JkZXJXaWR0aCA9IDI7XG4gICAgICAgIGxldCBib3JkZXJSYWRpdXMgPSBoZWlnaHQgLyAyO1xuICAgICAgICAvLyBib3JkZXJSYWRpdXMgPSAwO1xuXG4gICAgICAgIGxldCBlcnJvckNvbG9yID0gJ3JnYmEoMjU1LDI1NSwyNTUsMC40KSc7XG5cbiAgICAgICAgbGV0IGNzcyA9IGBcblxuXG4gICAgYnV0dG9uLiR7cHJlZml4fS1idXR0b24ge1xuICAgICAgICBib3JkZXI6IHdoaXRlICR7Ym9yZGVyV2lkdGh9cHggc29saWQ7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6ICR7Ym9yZGVyUmFkaXVzfXB4O1xuICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsMCwwLCAwKTtcblxuICAgICAgICBoZWlnaHQ6ICR7aGVpZ2h0fXB4O1xuICAgICAgICBtaW4td2lkdGg6ICR7MTI1fXB4O1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgXG4gICAgICAgIG1hcmdpbi10b3A6IDhweDtcblxuICAgICAgICBmb250LWZhbWlseTogJ0thcmxhJywgc2Fucy1zZXJpZjtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuXG4gICAgICAgICAtd2Via2l0LXRyYW5zaXRpb246IHdpZHRoIDAuNXM7XG4gICAgICAgIHRyYW5zaXRpb246IHdpZHRoIDAuNXM7XG4gICAgfVxuXG4gICAgLypcbiAgICAqIExvZ29cbiAgICAqL1xuXG4gICAgLiR7cHJlZml4fS1sb2dvIHtcbiAgICAgICAgd2lkdGg6ICR7aGVpZ2h0fXB4O1xuICAgICAgICBoZWlnaHQ6ICR7aGVpZ2h0fXB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiAke2JvcmRlclJhZGl1c31weDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgdG9wOi0ke2JvcmRlcldpZHRofXB4O1xuICAgICAgICBsZWZ0Oi0ke2JvcmRlcldpZHRofXB4O1xuICAgIH1cbiAgICAuJHtwcmVmaXh9LWxvZ28gPiBzdmcge1xuICAgICAgICBtYXJnaW4tdG9wOiAkeyhoZWlnaHQgLSBmb250U2l6ZSkgLyAyfXB4O1xuICAgIH1cblxuXG4gICAgLypcbiAgICAqIFRpdGxlXG4gICAgKi9cblxuICAgIC4ke3ByZWZpeH0tdGl0bGUge1xuICAgICAgICBjb2xvcjogd2hpdGU7XG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgZm9udC1zaXplOiAke2ZvbnRTaXplfXB4O1xuICAgICAgICB0b3A6IC0ke2JvcmRlcldpZHRofXB4O1xuICAgICAgICBsaW5lLWhlaWdodDogJHtoZWlnaHQgLSBib3JkZXJXaWR0aCAqIDJ9cHg7XG4gICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgICAgIHBhZGRpbmctbGVmdDogJHtoZWlnaHQgKiAxLjA1fXB4O1xuICAgICAgICBwYWRkaW5nLXJpZ2h0OiAkeyhib3JkZXJSYWRpdXMtMTAgPCA1KSA/IDUgOiBib3JkZXJSYWRpdXMtMTB9cHg7XG4gICAgfVxuXG4gICAgLypcbiAgICAqIERlc2NyaXB0aW9uXG4gICAgKi9cblxuICAgIC4ke3ByZWZpeH0tZGVzY3JpcHRpb257XG4gICAgICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgICAgICAgbWFyZ2luLXRvcDogNXB4O1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xuICAgICAgICBcbiAgICB9XG5cbiAgIC4ke3ByZWZpeH0tZGVzY3JpcHRpb24sIGEge1xuICAgICAgICBjb2xvcjogd2hpdGVcbiAgICB9XG5cbiAgICAvKlxuICAgICogRXJyb3JcbiAgICAqL1xuXG4gICAgYnV0dG9uLiR7cHJlZml4fS1idXR0b25bZGF0YS1lcnJvcj10cnVlXSB7XG4gICAgICAgIGJvcmRlci1jb2xvcjogJHtlcnJvckNvbG9yfTtcbiAgICB9XG4gICAgYnV0dG9uLiR7cHJlZml4fS1idXR0b25bZGF0YS1lcnJvcj10cnVlXSA+IC4ke3ByZWZpeH0tbG9nbyB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7ZXJyb3JDb2xvcn07XG4gICAgfVxuICAgIGJ1dHRvbi4ke3ByZWZpeH0tYnV0dG9uW2RhdGEtZXJyb3I9dHJ1ZV0gPiAuJHtwcmVmaXh9LXRpdGxlIHtcbiAgICAgICAgY29sb3I6ICR7ZXJyb3JDb2xvcn07XG4gICAgfVxuXG4gICAgYDtcblxuICAgICAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSBjc3M7XG4gICAgICAgIHJldHVybiBzdHlsZTtcbiAgICB9XG5cblxufVxuIiwiaW1wb3J0IHtBYnN0cmFjdEJ1dHRvbn0gZnJvbSBcIi4vQWJzdHJhY3RCdXR0b25cIjtcblxuZXhwb3J0IGNvbnN0IFN0YXRlID0ge1xuICAgIFJFQURZX1RPX1BSRVNFTlQ6ICdSRUFEWV9UT19QUkVTRU5UJyxcbiAgICBQUkVTRU5USU5HOiAnUFJFU0VOVElORydcbn07XG5cbmV4cG9ydCBjbGFzcyBFbnRlcjM2MEJ1dHRvbiBleHRlbmRzIEFic3RyYWN0QnV0dG9uIHtcbiAgICBjb25zdHJ1Y3RvcihjYW52YXNEb20sIG9wdGlvbnMpe1xuICAgICAgICBzdXBlcihjYW52YXNEb20sICczNjAnLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5jYW52YXNEb20gPSBjYW52YXNEb207XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZShTdGF0ZS5SRUFEWV9UT19QUkVTRU5UKTtcblxuXG5cbiAgICB9XG5cbiAgICBzZXRTdGF0ZShzdGF0ZSl7XG4gICAgICAgIGlmKHN0YXRlICE9IHRoaXMuc3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFN0YXRlLlJFQURZX1RPX1BSRVNFTlQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldFRpdGxlKFwiRW50ZXIgMzYwXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXREZXNjcmlwdGlvbihcIlwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLm9uRXhpdEJpbmRpbmcgJiYgdGhpcy5sYXN0c3RhdGUgPT0gU3RhdGUuUFJFU0VOVElORyl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uRXhpdEJpbmRpbmcuY2FsbCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgU3RhdGUuUFJFU0VOVElORzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0VGl0bGUoXCJFeGl0IDM2MFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0RGVzY3JpcHRpb24oXCJcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5vbkVudGVyQmluZGluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkVudGVyQmluZGluZy5jYWxsKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlVua293biBzdGF0ZSBcIiArIHN0YXRlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5sYXN0c3RhdGUgPSB0aGlzLnN0YXRlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25DbGlja0V2ZW50KGUpe1xuICAgICAgICBpZih0aGlzLnN0YXRlID09IFN0YXRlLlJFQURZX1RPX1BSRVNFTlQpe1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShTdGF0ZS5QUkVTRU5USU5HKTtcbiAgICAgICAgICAgIHRoaXMuZW50ZXJGdWxsc2NyZWVuKCk7XG4gICAgICAgIH0gZWxzZSBpZih0aGlzLnN0YXRlID09IFN0YXRlLlBSRVNFTlRJTkcpe1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShTdGF0ZS5SRUFEWV9UT19QUkVTRU5UKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVudGVyRnVsbHNjcmVlbigpIHtcbiAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmNhbnZhc0RvbTtcblxuICAgICAgICBpZiAoZWxlbWVudC5yZXF1ZXN0RnVsbHNjcmVlbikge1xuICAgICAgICAgICAgZWxlbWVudC5yZXF1ZXN0RnVsbHNjcmVlbigpO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgIGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4oKTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50Lm1velJlcXVlc3RGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICBlbGVtZW50Lm1velJlcXVlc3RGdWxsU2NyZWVuKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5tc1JlcXVlc3RGdWxsc2NyZWVuKSB7XG4gICAgICAgICAgICBlbGVtZW50Lm1zUmVxdWVzdEZ1bGxzY3JlZW4oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgZXhpdEZ1bGxzY3JlZW4oKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5leGl0RnVsbHNjcmVlbikge1xuICAgICAgICAgICAgZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4oKTtcbiAgICAgICAgfSBlbHNlIGlmIChkb2N1bWVudC53ZWJraXRFeGl0RnVsbHNjcmVlbikge1xuICAgICAgICAgICAgZG9jdW1lbnQud2Via2l0RXhpdEZ1bGxzY3JlZW4oKTtcbiAgICAgICAgfSBlbHNlIGlmIChkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQubXNFeGl0RnVsbHNjcmVlbikge1xuICAgICAgICAgICAgZG9jdW1lbnQubXNFeGl0RnVsbHNjcmVlbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxufSIsImltcG9ydCB7QWJzdHJhY3RCdXR0b259IGZyb20gXCIuL0Fic3RyYWN0QnV0dG9uXCI7XG5pbXBvcnQge1dlYlZSTWFuYWdlcn0gZnJvbSBcIi4vV2ViVlJNYW5hZ2VyXCI7XG5cbmV4cG9ydCBjb25zdCBTdGF0ZSA9IHtcbiAgICBSRUFEWV9UT19QUkVTRU5UOiAnUkVBRFlfVE9fUFJFU0VOVCcsXG4gICAgUFJFU0VOVElORzogJ1BSRVNFTlRJTkcnLFxuICAgIEVSUk9SX05PX1BSRVNFTlRBQkxFX0RJU1BMQVlTOiAnRVJST1JfTk9fUFJFU0VOVEFCTEVfRElTUExBWVMnLFxuICAgIEVSUk9SX0JST1dTRVJfTk9UX1NVUFBPUlRFRDogJ0VSUk9SX0JST1dTRVJfTk9UX1NVUFBPUlRFRCdcbn07XG5cbmV4cG9ydCBjbGFzcyBFbnRlclZSQnV0dG9uIGV4dGVuZHMgQWJzdHJhY3RCdXR0b24ge1xuICAgIGNvbnN0cnVjdG9yKGNhbnZhc0RvbSwgb3B0aW9ucyl7XG4gICAgICAgIHN1cGVyKGNhbnZhc0RvbSwgJ1ZSJywgb3B0aW9ucyk7XG5cbiAgICAgICAgdGhpcy5jaGVja0RldmljZXMoKTtcblxuICAgICAgICB0aGlzLndlYnZybWFuYWdlci5vblZSRGlzcGxheVByZXNlbnRDaGFuZ2UoKCk9PntcbiAgICAgICAgICAgIGlmKHRoaXMud2VidnJtYW5hZ2VyLmlzUHJlc2VudGluZygpKXtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFN0YXRlLlBSRVNFTlRJTkcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFN0YXRlLlJFQURZX1RPX1BSRVNFTlQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGNoZWNrRGV2aWNlcygpe1xuICAgICAgICAvLyBDaGVjayBpZiB0aGUgYnJvd3NlciBpcyBjb21wYXRpYmxlIHdpdGggV2ViVlIgYW5kIGhhcyBoZWFkc2V0cy5cbiAgICAgICAgdGhpcy53ZWJ2cm1hbmFnZXIuZ2V0UHJlc2VudGFibGVEZXZpY2UoKVxuICAgICAgICAgICAgLnRoZW4oKGhtZCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGhtZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5obWQgPSBobWQ7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShTdGF0ZS5SRUFEWV9UT19QUkVTRU5UKVxuXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoZS5uYW1lID09ICdOT19ESVNQTEFZUycpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFN0YXRlLkVSUk9SX05PX1BSRVNFTlRBQkxFX0RJU1BMQVlTKVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihlLm5hbWUgPT0gJ1dFQlZSX1VOU1VQUE9SVEVEJyl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoU3RhdGUuRVJST1JfQlJPV1NFUl9OT1RfU1VQUE9SVEVEKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNldFN0YXRlKHN0YXRlKXtcbiAgICAgICAgaWYoc3RhdGUgIT0gdGhpcy5zdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICAgICAgc3dpdGNoIChzdGF0ZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgU3RhdGUuUkVBRFlfVE9fUFJFU0VOVDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0VGl0bGUoXCJFbnRlciBWUlwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0RGVzY3JpcHRpb24oXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgU3RhdGUuUFJFU0VOVElORzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0VGl0bGUoXCJFeGl0IFZSXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXREZXNjcmlwdGlvbihcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBTdGF0ZS5FUlJPUl9OT19QUkVTRU5UQUJMRV9ESVNQTEFZUzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0VGl0bGUoXCJFbnRlciBWUlwiLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0RGVzY3JpcHRpb24oXCJObyBWUiBIZWFkc2V0IGZvdW5kXCIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFN0YXRlLkVSUk9SX0JST1dTRVJfTk9UX1NVUFBPUlRFRDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0VGl0bGUoXCJCcm93c2VyIG5vdCBzdXBwb3J0ZWRcIiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldERlc2NyaXB0aW9uKFwiU29ycnksIHlvdXIgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgPGEgaHJlZj0naHR0cDovL3dlYnZyLmluZm8nPldlYlZSPC9hPlwiKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlVua293biBXZWJWUiBzdGF0ZSBcIiArIHN0YXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQ2xpY2tFdmVudChlKXtcbiAgICAgICAgaWYodGhpcy5zdGF0ZSA9PSBTdGF0ZS5SRUFEWV9UT19QUkVTRU5UKXtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoU3RhdGUuUFJFU0VOVElORyk7XG4gICAgICAgICAgICB0aGlzLndlYnZybWFuYWdlci5lbnRlclZyKHRoaXMuaG1kKVxuICAgICAgICB9IGVsc2UgaWYodGhpcy5zdGF0ZSA9PSBTdGF0ZS5QUkVTRU5USU5HKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKFN0YXRlLlJFQURZX1RPX1BSRVNFTlQpO1xuICAgICAgICAgICAgdGhpcy53ZWJ2cm1hbmFnZXIuZXhpdFZyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJleHBvcnQgY2xhc3MgV2ViVlJNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihjYW52YXNEb20pe1xuICAgICAgICB0aGlzLmRvbUVsZW1lbnQgPSBjYW52YXNEb207XG4gICAgICAgIC8vXG4gICAgICAgIC8vXG4gICAgICAgIC8vIC8vIEJpbmQgdG8gZnVsbHNjcmVlbiBldmVudHMuXG4gICAgICAgIC8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3dlYmtpdGZ1bGxzY3JlZW5jaGFuZ2UnLFxuICAgICAgICAvLyAgICAgdGhpcy5vbkZ1bGxzY3JlZW5DaGFuZ2VfLmJpbmQodGhpcykpO1xuICAgICAgICAvLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3pmdWxsc2NyZWVuY2hhbmdlJyxcbiAgICAgICAgLy8gICAgIHRoaXMub25GdWxsc2NyZWVuQ2hhbmdlXy5iaW5kKHRoaXMpKTtcbiAgICAgICAgLy8gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbXNmdWxsc2NyZWVuY2hhbmdlJyxcbiAgICAgICAgLy8gICAgIHRoaXMub25GdWxsc2NyZWVuQ2hhbmdlXy5iaW5kKHRoaXMpKTtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gLy8gQmluZCB0byBWUiogc3BlY2lmaWMgZXZlbnRzLlxuICAgICAgICAvLyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndnJkaXNwbGF5ZGV2aWNlcGFyYW1zY2hhbmdlJyxcbiAgICAgICAgLy8gICAgIHRoaXMub25WUkRpc3BsYXlQcmVzZW50Q2hhbmdlXy5iaW5kKHRoaXMpKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFByb21pc2UgcmV0dXJucyB0cnVlIGlmIHRoZXJlIGlzIGF0IGxlYXN0IG9uZSBITUQgZGV2aWNlIGF2YWlsYWJsZS5cbiAgICAgKi9cbiAgICBnZXRQcmVzZW50YWJsZURldmljZShkaXNwbGF5VHlwZSA9IFZSRGlzcGxheSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYoIW5hdmlnYXRvciB8fCAhbmF2aWdhdG9yLmdldFZSRGlzcGxheXMpe1xuICAgICAgICAgICAgICAgIGxldCBlID0gbmV3IEVycm9yKFwiQnJvd3NlciBub3Qgc3VwcG9ydGluZyBXZWJWUlwiKTtcbiAgICAgICAgICAgICAgICBlLm5hbWUgPSAnV0VCVlJfVU5TVVBQT1JURUQnO1xuICAgICAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5hdmlnYXRvci5nZXRWUkRpc3BsYXlzKCkudGhlbihmdW5jdGlvbihkaXNwbGF5cykge1xuICAgICAgICAgICAgICAgIC8vIFByb21pc2Ugc3VjY2VlZHMsIGJ1dCBjaGVjayBpZiB0aGVyZSBhcmUgYW55IGRpc3BsYXlzIGFjdHVhbGx5LlxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGlzcGxheXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGlzcGxheXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGlzcGxheXNbaV0gaW5zdGFuY2VvZiBkaXNwbGF5VHlwZSAmJiBkaXNwbGF5c1tpXS5jYXBhYmlsaXRpZXMuY2FuUHJlc2VudCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGlzcGxheXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgZSA9IG5ldyBFcnJvcihcIk5vIGRpc3BsYXlzIGZvdW5kXCIpO1xuICAgICAgICAgICAgICAgIGUubmFtZSA9ICdOT19ESVNQTEFZUyc7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy8gTm8gZGlzcGxheXMgYXJlIGZvdW5kLlxuICAgICAgICAgICAgICAgIGxldCBlID0gbmV3IEVycm9yKFwiTm8gZGlzcGxheXMgZm91bmRcIik7XG4gICAgICAgICAgICAgICAgZS5uYW1lID0gJ05PX0RJU1BMQVlTJztcbiAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGVudGVyVnIoaG1kKXtcbiAgICAgICAgdGhpcy5wcmVzZW50aW5nSG1kID0gaG1kO1xuICAgICAgICBobWQucmVxdWVzdFByZXNlbnQoW3tcbiAgICAgICAgICAgIHNvdXJjZTogIHRoaXMuZG9tRWxlbWVudFxuICAgICAgICB9XSk7XG4gICAgfVxuXG4gICAgZXhpdFZyKCl7XG4gICAgICAgIGlmKHRoaXMucHJlc2VudGluZ0htZCl7XG4gICAgICAgICAgICB0aGlzLnByZXNlbnRpbmdIbWQuZXhpdFByZXNlbnQoKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnByZXNlbnRpbmdIbWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc1ByZXNlbnRpbmcoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlc2VudGluZ0htZCAmJiB0aGlzLnByZXNlbnRpbmdIbWQuaXNQcmVzZW50aW5nO1xuICAgIH1cblxuICAgIG9uVlJEaXNwbGF5UHJlc2VudENoYW5nZShmdW5jKXtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3ZyZGlzcGxheXByZXNlbnRjaGFuZ2UnLFxuICAgICAgICAgICAgZnVuYy5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFN0YXRlLCBBYnN0cmFjdEJ1dHRvbiB9IGZyb20gJy4vQWJzdHJhY3RCdXR0b24nO1xuaW1wb3J0IHsgV2ViVlJNYW5hZ2VyIH0gZnJvbSAnLi9XZWJWUk1hbmFnZXInO1xuaW1wb3J0IHsgRW50ZXJWUkJ1dHRvbiB9IGZyb20gJy4vRW50ZXJWUkJ1dHRvbic7XG5pbXBvcnQgeyBFbnRlcjM2MEJ1dHRvbiB9IGZyb20gJy4vRW50ZXIzNjBCdXR0b24nO1xuXG5cbmV4cG9ydCB7XG4gICAgRW50ZXJWUkJ1dHRvbixcbiAgICBFbnRlcjM2MEJ1dHRvbixcbiAgICBBYnN0cmFjdEJ1dHRvbixcbiAgICBTdGF0ZSxcbiAgICBXZWJWUk1hbmFnZXJcbn07XG5cblxuIl19
