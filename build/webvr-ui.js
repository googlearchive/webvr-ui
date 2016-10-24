(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.webvrui = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AbstractButton = exports.State = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _WebVRManager = _dereq_('./WebVRManager');

var _DefaultButtonDom = _dereq_('./DefaultButtonDom');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var State = exports.State = {
    READY_TO_PRESENT: 'READY_TO_PRESENT',
    ERROR_NO_PRESENTABLE_DISPLAYS: 'ERROR_NO_PRESENTABLE_DISPLAYS',
    ERROR_BROWSER_NOT_SUPPORTED: 'ERROR_BROWSER_NOT_SUPPORTED'
};

var AbstractButton = exports.AbstractButton = function () {
    function AbstractButton(canvasDom, options) {
        var _this = this;

        _classCallCheck(this, AbstractButton);

        if (!options) options = {};

        // Option to ccange pixel height of the button.
        if (!options.size) {
            options.size = 40;
        }

        if (!options.domClass) {
            options.domClass = _DefaultButtonDom.DefaultButtonDom;
        }

        this.webvrmanager = new _WebVRManager.WebVRManager(canvasDom);

        this.button = new options.domClass(options.size);
        this.button.injectCss();
        this.button.onClick(this.onClickEvent.bind(this));
        this.domElement = this.button.domElement;

        // Check if the browser is compatible with WebVR.
        this.webvrmanager.getPresentableDevice().then(function (hmd) {
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
    }

    _createClass(AbstractButton, [{
        key: 'setState',
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
        key: 'onClickEvent',
        value: function onClickEvent(e) {
            if (this.state == State.READY_TO_PRESENT) {
                this.webvrmanager.enterVr(this.hmd);
            }
        }
    }]);

    return AbstractButton;
}();

},{"./DefaultButtonDom":3,"./WebVRManager":6}],2:[function(_dereq_,module,exports){
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

            var errorColor = 'red';

            var css = '\n\n\n    button.' + prefix + '-button {\n        border: white ' + borderWidth + 'px solid;\n        border-radius: ' + borderRadius + 'px;\n        box-sizing: border-box;\n        background: rgba(0,0,0, 0);\n\n        height: ' + height + 'px;\n        min-width: ' + height + 'px;\n        display: inline-block;\n        position: relative;\n\n        font-family: \'Karla\', sans-serif;\n        cursor: pointer;\n\n         -webkit-transition: width 0.5s;\n        transition: width 0.5s;\n    }\n\n    /*\n    * Logo\n    */\n\n    .' + prefix + '-logo {\n        width: ' + height + 'px;\n        height: ' + height + 'px;\n        border-radius: ' + borderRadius + 'px;\n        background-color: white;\n        position: absolute;\n        top:-' + borderWidth + 'px;\n        left:-' + borderWidth + 'px;\n    }\n    .' + prefix + '-logo > svg {\n        margin-top: ' + (height - fontSize) / 2 + 'px;\n    }\n\n\n    /*\n    * Title\n    */\n\n    .' + prefix + '-title {\n        color: white;\n        position: relative;\n        font-size: ' + fontSize + 'px;\n        top: -' + borderWidth + 'px;\n        line-height: ' + (height - borderWidth * 2) + 'px;\n        text-align: left;\n        padding-left: ' + height * 1.05 + 'px;\n        padding-right: ' + (borderRadius - 10 < 5 ? 5 : borderRadius - 10) + 'px;\n    }\n\n    /*\n    * Description\n    */\n\n    .' + prefix + '-description{\n        font-size: 13px;\n        margin-top: 5px\n    }\n\n   .' + prefix + '-description, a {\n        color: white\n    }\n\n    /*\n    * Error\n    */\n\n    button.' + prefix + '-button[data-error=true] {\n        border-color: ' + errorColor + ';\n    }\n    button.' + prefix + '-button[data-error=true] > .' + prefix + '-logo {\n        background-color: ' + errorColor + ';\n    }\n    button.' + prefix + '-button[data-error=true] > .' + prefix + '-title {\n        color: ' + errorColor + ';\n    }\n\n    ';

            var style = document.createElement('style');
            style.innerHTML = css;
            return style;
        }
    }]);

    return WebVRButtonStyle;
}();

},{}],5:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EnterVRButton = undefined;

var _AbstractButton2 = _dereq_("./AbstractButton");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EnterVRButton = exports.EnterVRButton = function (_AbstractButton) {
    _inherits(EnterVRButton, _AbstractButton);

    function EnterVRButton(canvasDom, options) {
        _classCallCheck(this, EnterVRButton);

        return _possibleConstructorReturn(this, (EnterVRButton.__proto__ || Object.getPrototypeOf(EnterVRButton)).call(this, canvasDom, options));
    }

    return EnterVRButton;
}(_AbstractButton2.AbstractButton);

},{"./AbstractButton":1}],6:[function(_dereq_,module,exports){
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
    }, {
        key: "enterVr",
        value: function enterVr(hmd) {
            hmd.requestPresent([{
                source: this.domElement
            }]);
        }
    }]);

    return WebVRManager;
}();

},{}],7:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WebVRManager = exports.State = exports.AbstractButton = exports.EnterVRButton = undefined;

var _AbstractButton = _dereq_('./AbstractButton');

var _WebVRManager = _dereq_('./WebVRManager');

var _EnterVRButton = _dereq_('./EnterVRButton');

exports.EnterVRButton = _EnterVRButton.EnterVRButton;
exports.AbstractButton = _AbstractButton.AbstractButton;
exports.State = _AbstractButton.State;
exports.WebVRManager = _WebVRManager.WebVRManager;

},{"./AbstractButton":1,"./EnterVRButton":5,"./WebVRManager":6}]},{},[7])(7)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQWJzdHJhY3RCdXR0b24uanMiLCJzcmMvQWJzdHJhY3RCdXR0b25Eb20uanMiLCJzcmMvRGVmYXVsdEJ1dHRvbkRvbS5qcyIsInNyYy9EZWZhdWx0QnV0dG9uU3R5bGUuanMiLCJzcmMvRW50ZXJWUkJ1dHRvbi5qcyIsInNyYy9XZWJWUk1hbmFnZXIuanMiLCJzcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7QUNBQTs7QUFDQTs7OztBQUdPLElBQU0sd0JBQVE7QUFDakIsc0JBQWtCLGtCQUREO0FBRWpCLG1DQUErQiwrQkFGZDtBQUdqQixpQ0FBNkI7QUFIWixDQUFkOztJQU1NLGMsV0FBQSxjO0FBQ1QsNEJBQVksU0FBWixFQUF1QixPQUF2QixFQUErQjtBQUFBOztBQUFBOztBQUMzQixZQUFHLENBQUMsT0FBSixFQUFhLFVBQVUsRUFBVjs7QUFFYjtBQUNBLFlBQUcsQ0FBQyxRQUFRLElBQVosRUFBaUI7QUFDYixvQkFBUSxJQUFSLEdBQWUsRUFBZjtBQUNIOztBQUVELFlBQUcsQ0FBQyxRQUFRLFFBQVosRUFBcUI7QUFDakIsb0JBQVEsUUFBUjtBQUNIOztBQUVELGFBQUssWUFBTCxHQUFvQiwrQkFBaUIsU0FBakIsQ0FBcEI7O0FBR0EsYUFBSyxNQUFMLEdBQWMsSUFBSSxRQUFRLFFBQVosQ0FBcUIsUUFBUSxJQUE3QixDQUFkO0FBQ0EsYUFBSyxNQUFMLENBQVksU0FBWjtBQUNBLGFBQUssTUFBTCxDQUFZLE9BQVosQ0FBb0IsS0FBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLElBQXZCLENBQXBCO0FBQ0EsYUFBSyxVQUFMLEdBQWtCLEtBQUssTUFBTCxDQUFZLFVBQTlCOztBQUdBO0FBQ0EsYUFBSyxZQUFMLENBQWtCLG9CQUFsQixHQUNLLElBREwsQ0FDVSxVQUFDLEdBQUQsRUFBUztBQUNYLG9CQUFRLEdBQVIsQ0FBWSxH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YixFQUFnQixJQUFJLFNBQVMsTUFBN0IsRUFBcUMsR0FBckMsRUFBMEM7QUFDdEMsZ0NBQVEsR0FBUixDQUFZLFNBQVMsQ0FBVCxDQUFaO0FBQ0EsNEJBQUksU0FBUyxDQUFULGFBQXVCLElBQXZCLElBQStCLFNBQVMsQ0FBVCxFQUFZLFlBQVosQ0FBeUIsVUFBNUQsRUFBd0U7QUFDcEUsb0NBQVEsU0FBUyxDQUFULENBQVI7QUFDQTtBQUNIO0FBQ0o7O0FBRUQsd0JBQUksSUFBSSxJQUFJLEtBQUosQ0FBVSxtQkFBVixDQUFSO0FBQ0Esc0JBQUUsSUFBRixHQUFTLGFBQVQ7QUFDQSwyQkFBTyxDQUFQO0FBQ0gsaUJBYkQsRUFhRyxZQUFXO0FBQ1Y7QUFDQSx3QkFBSSxJQUFJLElBQUksS0FBSixDQUFVLG1CQUFWLENBQVI7QUFDQSxzQkFBRSxJQUFGLEdBQVMsYUFBVDtBQUNBLDJCQUFPLENBQVA7QUFDSCxpQkFsQkQ7QUFtQkgsYUE1Qk0sQ0FBUDtBQTZCSDs7O2dDQUVPLEcsRUFBSTtBQUNSLGdCQUFJLGNBQUosQ0FBbUIsQ0FBQztBQUNoQix3QkFBUyxLQUFLO0FBREUsYUFBRCxDQUFuQjtBQUdIOzs7Ozs7Ozs7Ozs7OztBQzdDTDs7QUFDQTs7QUFDQTs7UUFJSSxhO1FBQ0EsYztRQUNBLEs7UUFDQSxZIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7IFdlYlZSTWFuYWdlciB9IGZyb20gJy4vV2ViVlJNYW5hZ2VyJztcbmltcG9ydCB7IERlZmF1bHRCdXR0b25Eb20gfSBmcm9tICcuL0RlZmF1bHRCdXR0b25Eb20nO1xuXG5cbmV4cG9ydCBjb25zdCBTdGF0ZSA9IHtcbiAgICBSRUFEWV9UT19QUkVTRU5UOiAnUkVBRFlfVE9fUFJFU0VOVCcsXG4gICAgRVJST1JfTk9fUFJFU0VOVEFCTEVfRElTUExBWVM6ICdFUlJPUl9OT19QUkVTRU5UQUJMRV9ESVNQTEFZUycsXG4gICAgRVJST1JfQlJPV1NFUl9OT1RfU1VQUE9SVEVEOiAnRVJST1JfQlJPV1NFUl9OT1RfU1VQUE9SVEVEJ1xufTtcblxuZXhwb3J0IGNsYXNzIEFic3RyYWN0QnV0dG9uIHtcbiAgICBjb25zdHJ1Y3RvcihjYW52YXNEb20sIG9wdGlvbnMpe1xuICAgICAgICBpZighb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuXG4gICAgICAgIC8vIE9wdGlvbiB0byBjY2FuZ2UgcGl4ZWwgaGVpZ2h0IG9mIHRoZSBidXR0b24uXG4gICAgICAgIGlmKCFvcHRpb25zLnNpemUpe1xuICAgICAgICAgICAgb3B0aW9ucy5zaXplID0gNDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZighb3B0aW9ucy5kb21DbGFzcyl7XG4gICAgICAgICAgICBvcHRpb25zLmRvbUNsYXNzID0gRGVmYXVsdEJ1dHRvbkRvbTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMud2VidnJtYW5hZ2VyID0gbmV3IFdlYlZSTWFuYWdlcihjYW52YXNEb20pO1xuXG5cbiAgICAgICAgdGhpcy5idXR0b24gPSBuZXcgb3B0aW9ucy5kb21DbGFzcyhvcHRpb25zLnNpemUpO1xuICAgICAgICB0aGlzLmJ1dHRvbi5pbmplY3RDc3MoKTtcbiAgICAgICAgdGhpcy5idXR0b24ub25DbGljayh0aGlzLm9uQ2xpY2tFdmVudC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5kb21FbGVtZW50ID0gdGhpcy5idXR0b24uZG9tRWxlbWVudDtcblxuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBicm93c2VyIGlzIGNvbXBhdGlibGUgd2l0aCBXZWJWUi5cbiAgICAgICAgdGhpcy53ZWJ2cm1hbmFnZXIuZ2V0UHJlc2VudGFibGVEZXZpY2UoKVxuICAgICAgICAgICAgLnRoZW4oKGhtZCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGhtZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5obWQgPSBobWQ7XG4gICAgICAgICAgICAgICAgaWYoaG1kLmNhcGFiaWxpdGllcy5jYW5QcmVzZW50KXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShTdGF0ZS5SRUFEWV9UT19QUkVTRU5UKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoU3RhdGUuRVJST1JfQlJPV1NFUl9OT1RfU1VQUE9SVEVEKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZihlLm5hbWUgPT0gJ05PX0RJU1BMQVlTJyl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoU3RhdGUuRVJST1JfTk9fUFJFU0VOVEFCTEVfRElTUExBWVMpXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKGUubmFtZSA9PSAnV0VCVlJfVU5TVVBQT1JURUQnKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShTdGF0ZS5FUlJPUl9CUk9XU0VSX05PVF9TVVBQT1JURUQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzZXRTdGF0ZShzdGF0ZSl7XG4gICAgICAgIGlmKHN0YXRlICE9IHRoaXMuc3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFN0YXRlLlJFQURZX1RPX1BSRVNFTlQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldFRpdGxlKFwiRW50ZXIgVlJcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldERlc2NyaXB0aW9uKFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFN0YXRlLkVSUk9SX05PX1BSRVNFTlRBQkxFX0RJU1BMQVlTOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRUaXRsZShcIk5vIFZSIEhlYWRzZXQgZm91bmRcIiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldERlc2NyaXB0aW9uKFwiXCIpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgU3RhdGUuRVJST1JfQlJPV1NFUl9OT1RfU1VQUE9SVEVEOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRUaXRsZShcIkJyb3dzZXIgbm90IHN1cHBvcnRlZFwiLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0RGVzY3JpcHRpb24oXCJTb3JyeSwgeW91ciBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCA8YSBocmVmPSdodHRwOi8vd2VidnIuaW5mbyc+V2ViVlI8L2E+XCIpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJVbmtvd24gV2ViVlIgc3RhdGUgXCIgKyBzdGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkNsaWNrRXZlbnQoZSl7XG4gICAgICAgIGlmKHRoaXMuc3RhdGUgPT0gU3RhdGUuUkVBRFlfVE9fUFJFU0VOVCl7XG4gICAgICAgICAgICB0aGlzLndlYnZybWFuYWdlci5lbnRlclZyKHRoaXMuaG1kKVxuICAgICAgICB9XG4gICAgfVxuXG59XG4iLCJleHBvcnQgY2xhc3MgQWJzdHJhY3RCdXR0b25Eb20ge1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuZG9tRWxlbWVudCA9IHVuZGVmaW5lZDtcblxuICAgIH1cblxuICAgIG9uQ2xpY2soZnVuYyl7XG4gICAgICAgIHRoaXMub25DbGlja0JpbmRpbmcgPSBmdW5jO1xuICAgIH1cblxuICAgIHNldFRpdGxlKHRleHQsIGVycm9yID0gZmFsc2UpIHtcbiAgICB9XG5cbiAgICBzZXREZXNjcmlwdGlvbih0ZXh0KSB7XG4gICAgfVxufSIsImltcG9ydCB7IFdlYlZSQnV0dG9uU3R5bGUgfSBmcm9tICcuL0RlZmF1bHRCdXR0b25TdHlsZSc7XG5pbXBvcnQge0Fic3RyYWN0QnV0dG9uRG9tfSBmcm9tIFwiLi9BYnN0cmFjdEJ1dHRvbkRvbVwiO1xuXG5sZXQgX1dlYlZSVUlfY3NzX2luamVjdGVkID0gZmFsc2U7XG5cbmV4cG9ydCBjbGFzcyBEZWZhdWx0QnV0dG9uRG9tIGV4dGVuZHMgQWJzdHJhY3RCdXR0b25Eb20ge1xuICAgIGNvbnN0cnVjdG9yKGhlaWdodCl7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5vbkNsaWNrQmluZGluZyA9IChlKSA9PiB7fTtcbiAgICAgICAgdGhpcy5jc3NDbGFzc1ByZWZpeCA9IFwid2VidnItdWktYnV0dG9uXCI7XG5cbiAgICAgICAgdGhpcy5mb250U2l6ZSA9IGhlaWdodC8yLjU7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXG5cbiAgICAgICAgdGhpcy5kb21FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5kb21FbGVtZW50LmNsYXNzTmFtZSA9IHRoaXMuY3NzQ2xhc3NQcmVmaXg7XG5cbiAgICAgICAgdGhpcy5idXR0b25FbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLmJ1dHRvbkVsbS5jbGFzc05hbWUgPSB0aGlzLmNzc0NsYXNzUHJlZml4ICArIFwiLWJ1dHRvblwiO1xuICAgICAgICB0aGlzLmJ1dHRvbkVsbS5kYXRhc2V0LmVycm9yID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZG9tRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmJ1dHRvbkVsbSk7XG5cbiAgICAgICAgdGhpcy50aXRsZUVsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMudGl0bGVFbG0uY2xhc3NOYW1lID0gdGhpcy5jc3NDbGFzc1ByZWZpeCAgKyBcIi10aXRsZVwiO1xuICAgICAgICB0aGlzLmJ1dHRvbkVsbS5hcHBlbmRDaGlsZCh0aGlzLnRpdGxlRWxtKTtcblxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uRWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbkVsbS5jbGFzc05hbWUgPSB0aGlzLmNzc0NsYXNzUHJlZml4ICArIFwiLWRlc2NyaXB0aW9uXCI7XG4gICAgICAgIHRoaXMuZG9tRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmRlc2NyaXB0aW9uRWxtKTtcblxuICAgICAgICB0aGlzLmxvZ29FbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmxvZ29FbG0uYXBwZW5kQ2hpbGQoRGVmYXVsdEJ1dHRvbkRvbS5nZW5lcmF0ZVN2Z0ljb24odGhpcy5mb250U2l6ZSkpO1xuICAgICAgICB0aGlzLmxvZ29FbG0uY2xhc3NOYW1lID0gdGhpcy5jc3NDbGFzc1ByZWZpeCAgKyBcIi1sb2dvXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uRWxtLmFwcGVuZENoaWxkKHRoaXMubG9nb0VsbSk7XG5cblxuICAgICAgICB0aGlzLmJ1dHRvbkVsbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZih0aGlzLm9uQ2xpY2tCaW5kaW5nKXtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2xpY2tCaW5kaW5nLmNhbGwodGhpcyxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuXG4gICAgaW5qZWN0Q3NzKCl7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSBpdHMgb25seSBpbmplY3RlZCBvbmNlXG4gICAgICAgIGlmKCFfV2ViVlJVSV9jc3NfaW5qZWN0ZWQpIHtcbiAgICAgICAgICAgIF9XZWJWUlVJX2Nzc19pbmplY3RlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgY3NzXG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBXZWJWUkJ1dHRvblN0eWxlLmdlbmVyYXRlQ3NzKHRoaXMuY3NzQ2xhc3NQcmVmaXggLCB0aGlzLmhlaWdodCwgdGhpcy5mb250U2l6ZSk7XG5cbiAgICAgICAgICAgIHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICAgICAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlLGhlYWQuZmlyc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRUaXRsZSh0ZXh0LCBlcnJvciA9IGZhbHNlKXtcbiAgICAgICAgdGhpcy5idXR0b25FbG0udGl0bGUgPSB0ZXh0O1xuICAgICAgICB0aGlzLmJ1dHRvbkVsbS5kYXRhc2V0LmVycm9yID0gZXJyb3I7XG5cbiAgICAgICAgaWYoIXRleHQpe1xuICAgICAgICAgICAgdGhpcy50aXRsZUVsbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50aXRsZUVsbS5pbm5lclRleHQgPSB0ZXh0O1xuICAgICAgICAgICAgdGhpcy50aXRsZUVsbS5zdHlsZS5kaXNwbGF5ID0gJ2luaGVyaXQnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0RGVzY3JpcHRpb24odGV4dCl7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb25FbG0uaW5uZXJIVE1MID0gdGV4dDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2VuZXJhdGVTdmdJY29uKGhlaWdodCl7XG4gICAgICAgIGxldCBsb2dvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbGV0IGFzcGVjdCA9IDI4LzE4O1xuXG4gICAgICAgIGxvZ28uaW5uZXJIVE1MID1cbiAgICAgICAgICAgIGA8c3ZnIHZlcnNpb249XCIxLjFcIlxuICAgICAgICAgICAgICAgIHg9XCIwcHhcIiB5PVwiMHB4XCIgd2lkdGg9XCIke2FzcGVjdCpoZWlnaHR9cHhcIiBoZWlnaHQ9XCIke2hlaWdodH1weFwiIHZpZXdCb3g9XCIwIDAgMjggMThcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPlxuICAgICAgICAgICAgPHN0eWxlIHR5cGU9XCJ0ZXh0L2Nzc1wiPlxuICAgICAgICAgICAgICAgIC5zdDB7XG4gICAgICAgICAgICAgICAgZmlsbDojMDAwMDAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvc3R5bGU+XG4gICAgICAgICAgICAgICAgPHBhdGggaWQ9XCJYTUxJRF8xNV9cIiBjbGFzcz1cInN0MFwiIGQ9XCJNMjYuOCwxLjFDMjYuMSwwLjQsMjUuMSwwLDI0LjIsMEgzLjRjLTEsMC0xLjcsMC40LTIuNCwxLjFDMC4zLDEuNywwLDIuNywwLDMuNnYxMC43XG4gICAgICAgICAgICBjMCwxLDAuMywxLjksMC45LDIuNkMxLjYsMTcuNiwyLjQsMTgsMy40LDE4aDVjMC43LDAsMS4zLTAuMiwxLjgtMC41YzAuNi0wLjMsMS0wLjgsMS4zLTEuNGwxLjUtMi42QzEzLjIsMTMuMSwxMywxMywxNCwxM3YwaC0wLjJcbiAgICAgICAgICAgIGgwYzAuMywwLDAuNywwLjEsMC44LDAuNWwxLjQsMi42YzAuMywwLjYsMC44LDEuMSwxLjMsMS40YzAuNiwwLjMsMS4yLDAuNSwxLjgsMC41aDVjMSwwLDItMC40LDIuNy0xLjFjMC43LTAuNywxLjItMS42LDEuMi0yLjZcbiAgICAgICAgICAgIFYzLjZDMjgsMi43LDI3LjUsMS43LDI2LjgsMS4xeiBNNy40LDExLjhjLTEuNiwwLTIuOC0xLjMtMi44LTIuOGMwLTEuNiwxLjMtMi44LDIuOC0yLjhjMS42LDAsMi44LDEuMywyLjgsMi44XG4gICAgICAgICAgICBDMTAuMiwxMC41LDguOSwxMS44LDcuNCwxMS44eiBNMjAuMSwxMS44Yy0xLjYsMC0yLjgtMS4zLTIuOC0yLjhjMC0xLjYsMS4zLTIuOCwyLjgtMi44QzIxLjcsNi4yLDIzLDcuNCwyMyw5XG4gICAgICAgICAgICBDMjMsMTAuNSwyMS43LDExLjgsMjAuMSwxMS44elwiLz5cbiAgICAgICAgICAgIDwvc3ZnPmA7XG4gICAgICAgIHJldHVybiBsb2dvLmZpcnN0Q2hpbGQ7XG4gICAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFdlYlZSQnV0dG9uU3R5bGUge1xuICAgIHN0YXRpYyBnZW5lcmF0ZUNzcyhwcmVmaXgsIGhlaWdodCA9IDUwLCBmb250U2l6ZSA9IDE4KXtcbiAgICAgICAgbGV0IGJvcmRlcldpZHRoID0gMjtcbiAgICAgICAgbGV0IGJvcmRlclJhZGl1cyA9IGhlaWdodCAvIDI7XG4gICAgICAgIC8vIGJvcmRlclJhZGl1cyA9IDA7XG5cbiAgICAgICAgbGV0IGVycm9yQ29sb3IgPSAncmVkJztcblxuICAgICAgICBsZXQgY3NzID0gYFxuXG5cbiAgICBidXR0b24uJHtwcmVmaXh9LWJ1dHRvbiB7XG4gICAgICAgIGJvcmRlcjogd2hpdGUgJHtib3JkZXJXaWR0aH1weCBzb2xpZDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogJHtib3JkZXJSYWRpdXN9cHg7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMCwwLDAsIDApO1xuXG4gICAgICAgIGhlaWdodDogJHtoZWlnaHR9cHg7XG4gICAgICAgIG1pbi13aWR0aDogJHtoZWlnaHR9cHg7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gICAgICAgIGZvbnQtZmFtaWx5OiAnS2FybGEnLCBzYW5zLXNlcmlmO1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG5cbiAgICAgICAgIC13ZWJraXQtdHJhbnNpdGlvbjogd2lkdGggMC41cztcbiAgICAgICAgdHJhbnNpdGlvbjogd2lkdGggMC41cztcbiAgICB9XG5cbiAgICAvKlxuICAgICogTG9nb1xuICAgICovXG5cbiAgICAuJHtwcmVmaXh9LWxvZ28ge1xuICAgICAgICB3aWR0aDogJHtoZWlnaHR9cHg7XG4gICAgICAgIGhlaWdodDogJHtoZWlnaHR9cHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6ICR7Ym9yZGVyUmFkaXVzfXB4O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICB0b3A6LSR7Ym9yZGVyV2lkdGh9cHg7XG4gICAgICAgIGxlZnQ6LSR7Ym9yZGVyV2lkdGh9cHg7XG4gICAgfVxuICAgIC4ke3ByZWZpeH0tbG9nbyA+IHN2ZyB7XG4gICAgICAgIG1hcmdpbi10b3A6ICR7KGhlaWdodCAtIGZvbnRTaXplKSAvIDJ9cHg7XG4gICAgfVxuXG5cbiAgICAvKlxuICAgICogVGl0bGVcbiAgICAqL1xuXG4gICAgLiR7cHJlZml4fS10aXRsZSB7XG4gICAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICBmb250LXNpemU6ICR7Zm9udFNpemV9cHg7XG4gICAgICAgIHRvcDogLSR7Ym9yZGVyV2lkdGh9cHg7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAke2hlaWdodCAtIGJvcmRlcldpZHRoICogMn1weDtcbiAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICAgICAgcGFkZGluZy1sZWZ0OiAke2hlaWdodCAqIDEuMDV9cHg7XG4gICAgICAgIHBhZGRpbmctcmlnaHQ6ICR7KGJvcmRlclJhZGl1cy0xMCA8IDUpID8gNSA6IGJvcmRlclJhZGl1cy0xMH1weDtcbiAgICB9XG5cbiAgICAvKlxuICAgICogRGVzY3JpcHRpb25cbiAgICAqL1xuXG4gICAgLiR7cHJlZml4fS1kZXNjcmlwdGlvbntcbiAgICAgICAgZm9udC1zaXplOiAxM3B4O1xuICAgICAgICBtYXJnaW4tdG9wOiA1cHhcbiAgICB9XG5cbiAgIC4ke3ByZWZpeH0tZGVzY3JpcHRpb24sIGEge1xuICAgICAgICBjb2xvcjogd2hpdGVcbiAgICB9XG5cbiAgICAvKlxuICAgICogRXJyb3JcbiAgICAqL1xuXG4gICAgYnV0dG9uLiR7cHJlZml4fS1idXR0b25bZGF0YS1lcnJvcj10cnVlXSB7XG4gICAgICAgIGJvcmRlci1jb2xvcjogJHtlcnJvckNvbG9yfTtcbiAgICB9XG4gICAgYnV0dG9uLiR7cHJlZml4fS1idXR0b25bZGF0YS1lcnJvcj10cnVlXSA+IC4ke3ByZWZpeH0tbG9nbyB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7ZXJyb3JDb2xvcn07XG4gICAgfVxuICAgIGJ1dHRvbi4ke3ByZWZpeH0tYnV0dG9uW2RhdGEtZXJyb3I9dHJ1ZV0gPiAuJHtwcmVmaXh9LXRpdGxlIHtcbiAgICAgICAgY29sb3I6ICR7ZXJyb3JDb2xvcn07XG4gICAgfVxuXG4gICAgYDtcblxuICAgICAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSBjc3M7XG4gICAgICAgIHJldHVybiBzdHlsZTtcbiAgICB9XG5cblxufVxuIiwiaW1wb3J0IHtBYnN0cmFjdEJ1dHRvbn0gZnJvbSBcIi4vQWJzdHJhY3RCdXR0b25cIjtcblxuZXhwb3J0IGNsYXNzIEVudGVyVlJCdXR0b24gZXh0ZW5kcyBBYnN0cmFjdEJ1dHRvbiB7XG4gICAgY29uc3RydWN0b3IoY2FudmFzRG9tLCBvcHRpb25zKXtcbiAgICAgICAgc3VwZXIoY2FudmFzRG9tLCBvcHRpb25zKTtcbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIFdlYlZSTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoY2FudmFzRG9tKXtcbiAgICAgICAgdGhpcy5kb21FbGVtZW50ID0gY2FudmFzRG9tO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogUHJvbWlzZSByZXR1cm5zIHRydWUgaWYgdGhlcmUgaXMgYXQgbGVhc3Qgb25lIEhNRCBkZXZpY2UgYXZhaWxhYmxlLlxuICAgICAqL1xuICAgIGdldFByZXNlbnRhYmxlRGV2aWNlKHR5cGUgPSBWUkRpc3BsYXkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmKCFuYXZpZ2F0b3IgfHwgIW5hdmlnYXRvci5nZXRWUkRpc3BsYXlzKXtcblxuICAgICAgICAgICAgICAgIGxldCBlID0gbmV3IEVycm9yKFwiQnJvd3NlciBub3Qgc3VwcG9ydGluZyBXZWJWUlwiKVxuICAgICAgICAgICAgICAgIGUubmFtZSA9ICdXRUJWUl9VTlNVUFBPUlRFRCc7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbmF2aWdhdG9yLmdldFZSRGlzcGxheXMoKS50aGVuKGZ1bmN0aW9uKGRpc3BsYXlzKSB7XG4gICAgICAgICAgICAgICAgLy8gUHJvbWlzZSBzdWNjZWVkcywgYnV0IGNoZWNrIGlmIHRoZXJlIGFyZSBhbnkgZGlzcGxheXMgYWN0dWFsbHkuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkaXNwbGF5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkaXNwbGF5c1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXNwbGF5c1tpXSBpbnN0YW5jZW9mIHR5cGUgJiYgZGlzcGxheXNbaV0uY2FwYWJpbGl0aWVzLmNhblByZXNlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGlzcGxheXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgZSA9IG5ldyBFcnJvcihcIk5vIGRpc3BsYXlzIGZvdW5kXCIpXG4gICAgICAgICAgICAgICAgZS5uYW1lID0gJ05PX0RJU1BMQVlTJztcbiAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvLyBObyBkaXNwbGF5cyBhcmUgZm91bmQuXG4gICAgICAgICAgICAgICAgbGV0IGUgPSBuZXcgRXJyb3IoXCJObyBkaXNwbGF5cyBmb3VuZFwiKVxuICAgICAgICAgICAgICAgIGUubmFtZSA9ICdOT19ESVNQTEFZUyc7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBlbnRlclZyKGhtZCl7XG4gICAgICAgIGhtZC5yZXF1ZXN0UHJlc2VudChbe1xuICAgICAgICAgICAgc291cmNlOiAgdGhpcy5kb21FbGVtZW50XG4gICAgICAgIH1dKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IFN0YXRlLCBBYnN0cmFjdEJ1dHRvbiB9IGZyb20gJy4vQWJzdHJhY3RCdXR0b24nO1xuaW1wb3J0IHsgV2ViVlJNYW5hZ2VyIH0gZnJvbSAnLi9XZWJWUk1hbmFnZXInO1xuaW1wb3J0IHsgRW50ZXJWUkJ1dHRvbiB9IGZyb20gJy4vRW50ZXJWUkJ1dHRvbic7XG5cblxuZXhwb3J0IHtcbiAgICBFbnRlclZSQnV0dG9uLFxuICAgIEFic3RyYWN0QnV0dG9uLFxuICAgIFN0YXRlLFxuICAgIFdlYlZSTWFuYWdlclxufTtcblxuXG4iXX0=
