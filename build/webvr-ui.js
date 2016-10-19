(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _webvrButtonStyle = _dereq_("./webvr-button-style.js");

var _webvrButtonStyle2 = _interopRequireDefault(_webvrButtonStyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _WebVRUI_css_injected = false;

var WebVRButtonDOM = function () {
    function WebVRButtonDOM(height) {
        var _this = this;

        _classCallCheck(this, WebVRButtonDOM);

        this.onClickBinding = function (e) {};
        this.cssClassPrefix = "webvr-ui-button";

        this.fontSize = height / 2.5;
        this.height = height;

        this.domElement = document.createElement("div");
        this.domElement.className = this.cssClassPrefix;

        this.buttonElm = document.createElement("button");
        this.buttonElm.className = this.cssClassPrefix + "-button";
        this.buttonElm.dataset.error = false;
        this.domElement.appendChild(this.buttonElm);

        this.titleElm = document.createElement("div");
        this.titleElm.className = this.cssClassPrefix + "-title";
        this.buttonElm.appendChild(this.titleElm);

        this.descriptionElm = document.createElement("div");
        this.descriptionElm.className = this.cssClassPrefix + "-description";
        this.domElement.appendChild(this.descriptionElm);

        this.logoElm = document.createElement("div");
        this.logoElm.appendChild(WebVRButtonDOM.generateSvgIcon(this.fontSize));
        this.logoElm.className = this.cssClassPrefix + "-logo";
        this.buttonElm.appendChild(this.logoElm);

        this.buttonElm.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();

            if (_this.onClickBinding) {
                _this.onClickBinding.call(_this, e);
            }
        });

        return this;
    }

    _createClass(WebVRButtonDOM, [{
        key: "injectCss",
        value: function injectCss() {
            // Make sure its only injected once
            if (!_WebVRUI_css_injected) {
                _WebVRUI_css_injected = true;

                // Create the css
                var style = _webvrButtonStyle2.default.generateCss(this.cssClassPrefix, this.height, this.fontSize);

                var head = document.getElementsByTagName('head')[0];
                head.insertBefore(style, head.firstChild);
            }
        }
    }, {
        key: "onClick",
        value: function onClick(func) {
            this.onClickBinding = func;
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

    return WebVRButtonDOM;
}();

exports.default = WebVRButtonDOM;

},{"./webvr-button-style.js":2}],2:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebVRButtonStyle = function () {
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

            var css = '\n        \n    \n    button.' + prefix + '-button {\n        border: white ' + borderWidth + 'px solid;\n        border-radius: ' + borderRadius + 'px;\n        box-sizing: border-box;\n        background: rgba(0,0,0, 0);\n        \n        height: ' + height + 'px;\n        min-width: ' + height + 'px;\n        display: inline-block;\n        position: relative;\n        \n        font-family: \'Karla\', sans-serif;\n        cursor: pointer;\n        \n         -webkit-transition: width 0.5s;\n        transition: width 0.5s;\n    }\n    \n    /*\n    * Logo\n    */  \n    \n    .' + prefix + '-logo {\n        width: ' + height + 'px;\n        height: ' + height + 'px;\n        border-radius: ' + borderRadius + 'px;\n        background-color: white;\n        position: absolute;\n        top:-' + borderWidth + 'px;\n        left:-' + borderWidth + 'px;\n    }\n    .' + prefix + '-logo > svg {\n        margin-top: ' + (height - fontSize) / 2 + 'px;\n    }\n    \n    \n    /*\n    * Title\n    */\n    \n    .' + prefix + '-title {\n        color: white;\n        position: relative;\n        font-size: ' + fontSize + 'px;\n        top: -' + borderWidth + 'px;\n        line-height: ' + (height - borderWidth * 2) + 'px;\n        text-align: left;\n        padding-left: ' + height * 1.05 + 'px;\n        padding-right: ' + (borderRadius - 10 < 5 ? 5 : borderRadius - 10) + 'px;\n    }\n    \n    /*\n    * Description\n    */\n    \n    .' + prefix + '-description{\n        font-size: 13px;\n        margin-top: 5px\n    }\n    \n   .' + prefix + '-description, a {\n        color: white\n    }\n   \n    /*\n    * Error\n    */   \n     \n    button.' + prefix + '-button[data-error=true] {\n        border-color: ' + errorColor + ';\n    }    \n    button.' + prefix + '-button[data-error=true] > .' + prefix + '-logo {\n        background-color: ' + errorColor + ';\n    }    \n    button.' + prefix + '-button[data-error=true] > .' + prefix + '-title {\n        color: ' + errorColor + ';\n    }\n    \n    ';

            var style = document.createElement('style');
            style.innerHTML = css;
            return style;
        }
    }]);

    return WebVRButtonStyle;
}();

exports.default = WebVRButtonStyle;

},{}],3:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _webvrManager = _dereq_('./webvr-manager.js');

var _webvrManager2 = _interopRequireDefault(_webvrManager);

var _webvrButtonDom = _dereq_('./webvr-button-dom.js');

var _webvrButtonDom2 = _interopRequireDefault(_webvrButtonDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebVRUIState = {
    READY_TO_PRESENT: 'READY_TO_PRESENT',
    ERROR_NO_PRESENTABLE_DISPLAYS: 'ERROR_NO_PRESENTABLE_DISPLAYS',
    ERROR_BROWSER_NOT_SUPPORTED: 'ERROR_BROWSER_NOT_SUPPORTED'
};

var WebVRUI = function () {
    function WebVRUI(canvasDom, options) {
        var _this = this;

        _classCallCheck(this, WebVRUI);

        if (!options) options = {};

        // Option to ccange pixel height of the button.
        if (!options.size) {
            options.size = 40;
        }

        this.webvrmanager = new _webvrManager2.default(canvasDom);

        this.button = new _webvrButtonDom2.default(options.size);
        this.button.injectCss();
        this.button.onClick(this.onClickEvent.bind(this));
        this.domElement = this.button.domElement;

        // Check if the browser is compatible with WebVR.
        this.webvrmanager.getPresentableDevice().then(function (hmd) {
            console.log(hmd);
            _this.hmd = hmd;
            if (hmd.capabilities.canPresent) {
                _this.setState(WebVRUIState.READY_TO_PRESENT);
            } else {
                _this.setState(WebVRUIState.ERROR_BROWSER_NOT_SUPPORTED);
            }
        }).catch(function (e) {
            if (e.name == 'NO_DISPLAYS') {
                _this.setState(WebVRUIState.ERROR_NO_PRESENTABLE_DISPLAYS);
            } else if (e.name == 'WEBVR_UNSUPPORTED') {
                _this.setState(WebVRUIState.ERROR_BROWSER_NOT_SUPPORTED);
            }
        });
    }

    _createClass(WebVRUI, [{
        key: 'setState',
        value: function setState(state) {
            if (state != this.state) {
                this.state = state;
                switch (state) {
                    case WebVRUIState.READY_TO_PRESENT:
                        this.button.setTitle("Enter VR");
                        this.button.setDescription("");
                        break;
                    case WebVRUIState.ERROR_NO_PRESENTABLE_DISPLAYS:
                        this.button.setTitle("No VR Headset found", true);
                        this.button.setDescription("");
                        break;
                    case WebVRUIState.ERROR_BROWSER_NOT_SUPPORTED:
                        this.button.setTitle("Browser not supported", true);
                        this.button.setDescription("Sorry, your browser doesn't support <a href='http://webvr.info'>WebVR</a>");
                        break;
                    default:
                        console.error("Unkown WebVRUIState " + state);
                }
            }
        }
    }, {
        key: 'onClickEvent',
        value: function onClickEvent(e) {
            if (this.state == WebVRUIState.READY_TO_PRESENT) {
                this.webvrmanager.enterVr(this.hmd);
            }
        }
    }]);

    return WebVRUI;
}();

exports.default = WebVRUI;


window.WebVRUI = WebVRUI;

},{"./webvr-button-dom.js":1,"./webvr-manager.js":4}],4:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebVRManager = function () {
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

exports.default = WebVRManager;

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd2VidnItYnV0dG9uLWRvbS5qcyIsInNyYy93ZWJ2ci1idXR0b24tc3R5bGUuanMiLCJzcmMvd2VidnItYnV0dG9uLmpzIiwic3JjL3dlYnZyLW1hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0FBOzs7Ozs7OztBQUVBLElBQUksd0JBQXdCLEtBQTVCOztJQUVxQixjO0FBQ2pCLDRCQUFZLE1BQVosRUFBbUI7QUFBQTs7QUFBQTs7QUFDZixhQUFLLGNBQUwsR0FBc0IsVUFBQyxDQUFELEVBQU8sQ0FBRSxDQUEvQjtBQUNBLGFBQUssY0FBTCxHQUFzQixpQkFBdEI7O0FBRUEsYUFBSyxRQUFMLEdBQWdCLFNBQU8sR0FBdkI7QUFDQSxhQUFLLE1BQUwsR0FBYyxNQUFkOztBQUdBLGFBQUssVUFBTCxHQUFrQixTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBbEI7QUFDQSxhQUFLLFVBQUwsQ0FBZ0IsU0FBaEIsR0FBNEIsS0FBSyxjQUFqQzs7QUFFQSxhQUFLLFNBQUwsR0FBaUIsU0FBUyxhQUFULENBQXVCLFFBQXZCLENBQWpCO0FBQ0EsYUFBSyxTQUFMLENBQWUsU0FBZixHQUEyQixLQUFLLGNBQUwsR0FBdUIsU0FBbEQ7QUFDQSxhQUFLLFNBQUwsQ0FBZSxPQUFmLENBQXVCLEtBQXZCLEdBQStCLEtBQS9CO0FBQ0EsYUFBSyxVQUFMLENBQWdCLFdBQWhCLENBQTRCLEtBQUssU0FBakM7O0FBRUEsYUFBSyxRQUFMLEdBQWdCLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFoQjtBQUNBLGFBQUssUUFBTCxDQUFjLFNBQWQsR0FBMEIsS0FBSyxjQUFMLEdBQXVCLFFBQWpEO0FBQ0EsYUFBSyxTQUFMLENBQWUsV0FBZixDQUEyQixLQUFLLFFBQWhDOztBQUVBLGFBQUssY0FBTCxHQUFzQixTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBdEI7QUFD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RSxJQUFGLEdBQVMsYUFBVDtBQUNBLDJCQUFPLENBQVA7QUFDSCxpQkFsQkQ7QUFtQkgsYUE1Qk0sQ0FBUDtBQTZCSDs7O2dDQUVPLEcsRUFBSTtBQUNSLGdCQUFJLGNBQUosQ0FBbUIsQ0FBQztBQUNoQix3QkFBUyxLQUFLO0FBREUsYUFBRCxDQUFuQjtBQUdIOzs7Ozs7a0JBN0NnQixZIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBXZWJWUkJ1dHRvblN0eWxlIGZyb20gJy4vd2VidnItYnV0dG9uLXN0eWxlLmpzJ1xuXG5sZXQgX1dlYlZSVUlfY3NzX2luamVjdGVkID0gZmFsc2U7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYlZSQnV0dG9uRE9NIHtcbiAgICBjb25zdHJ1Y3RvcihoZWlnaHQpe1xuICAgICAgICB0aGlzLm9uQ2xpY2tCaW5kaW5nID0gKGUpID0+IHt9O1xuICAgICAgICB0aGlzLmNzc0NsYXNzUHJlZml4ID0gXCJ3ZWJ2ci11aS1idXR0b25cIjtcblxuICAgICAgICB0aGlzLmZvbnRTaXplID0gaGVpZ2h0LzIuNTtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cblxuICAgICAgICB0aGlzLmRvbUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmRvbUVsZW1lbnQuY2xhc3NOYW1lID0gdGhpcy5jc3NDbGFzc1ByZWZpeDtcblxuICAgICAgICB0aGlzLmJ1dHRvbkVsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMuYnV0dG9uRWxtLmNsYXNzTmFtZSA9IHRoaXMuY3NzQ2xhc3NQcmVmaXggICsgXCItYnV0dG9uXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uRWxtLmRhdGFzZXQuZXJyb3IgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kb21FbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuYnV0dG9uRWxtKTtcblxuICAgICAgICB0aGlzLnRpdGxlRWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy50aXRsZUVsbS5jbGFzc05hbWUgPSB0aGlzLmNzc0NsYXNzUHJlZml4ICArIFwiLXRpdGxlXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uRWxtLmFwcGVuZENoaWxkKHRoaXMudGl0bGVFbG0pO1xuXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb25FbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uRWxtLmNsYXNzTmFtZSA9IHRoaXMuY3NzQ2xhc3NQcmVmaXggICsgXCItZGVzY3JpcHRpb25cIjtcbiAgICAgICAgdGhpcy5kb21FbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZGVzY3JpcHRpb25FbG0pO1xuXG4gICAgICAgIHRoaXMubG9nb0VsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMubG9nb0VsbS5hcHBlbmRDaGlsZChXZWJWUkJ1dHRvbkRPTS5nZW5lcmF0ZVN2Z0ljb24odGhpcy5mb250U2l6ZSkpO1xuICAgICAgICB0aGlzLmxvZ29FbG0uY2xhc3NOYW1lID0gdGhpcy5jc3NDbGFzc1ByZWZpeCAgKyBcIi1sb2dvXCI7XG4gICAgICAgIHRoaXMuYnV0dG9uRWxtLmFwcGVuZENoaWxkKHRoaXMubG9nb0VsbSk7XG5cblxuICAgICAgICB0aGlzLmJ1dHRvbkVsbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZih0aGlzLm9uQ2xpY2tCaW5kaW5nKXtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2xpY2tCaW5kaW5nLmNhbGwodGhpcyxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cblxuICAgIGluamVjdENzcygpe1xuICAgICAgICAvLyBNYWtlIHN1cmUgaXRzIG9ubHkgaW5qZWN0ZWQgb25jZVxuICAgICAgICBpZighX1dlYlZSVUlfY3NzX2luamVjdGVkKSB7XG4gICAgICAgICAgICBfV2ViVlJVSV9jc3NfaW5qZWN0ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgdGhlIGNzc1xuICAgICAgICAgICAgbGV0IHN0eWxlID0gV2ViVlJCdXR0b25TdHlsZS5nZW5lcmF0ZUNzcyh0aGlzLmNzc0NsYXNzUHJlZml4ICwgdGhpcy5oZWlnaHQsIHRoaXMuZm9udFNpemUpO1xuXG4gICAgICAgICAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gICAgICAgICAgICBoZWFkLmluc2VydEJlZm9yZShzdHlsZSxoZWFkLmZpcnN0Q2hpbGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25DbGljayhmdW5jKXtcbiAgICAgICAgdGhpcy5vbkNsaWNrQmluZGluZyA9IGZ1bmM7XG4gICAgfVxuXG4gICAgc2V0VGl0bGUodGV4dCwgZXJyb3IgPSBmYWxzZSl7XG4gICAgICAgIHRoaXMuYnV0dG9uRWxtLnRpdGxlID0gdGV4dDtcbiAgICAgICAgdGhpcy5idXR0b25FbG0uZGF0YXNldC5lcnJvciA9IGVycm9yO1xuXG4gICAgICAgIGlmKCF0ZXh0KXtcbiAgICAgICAgICAgIHRoaXMudGl0bGVFbG0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGl0bGVFbG0uaW5uZXJUZXh0ID0gdGV4dDtcbiAgICAgICAgICAgIHRoaXMudGl0bGVFbG0uc3R5bGUuZGlzcGxheSA9ICdpbmhlcml0JztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldERlc2NyaXB0aW9uKHRleHQpe1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uRWxtLmlubmVySFRNTCA9IHRleHQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGdlbmVyYXRlU3ZnSWNvbihoZWlnaHQpe1xuICAgICAgICBsZXQgbG9nbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGxldCBhc3BlY3QgPSAyOC8xODtcblxuICAgICAgICBsb2dvLmlubmVySFRNTCA9XG4gICAgICAgICAgICBgPHN2ZyB2ZXJzaW9uPVwiMS4xXCJcbiAgICAgICAgICAgICAgICB4PVwiMHB4XCIgeT1cIjBweFwiIHdpZHRoPVwiJHthc3BlY3QqaGVpZ2h0fXB4XCIgaGVpZ2h0PVwiJHtoZWlnaHR9cHhcIiB2aWV3Qm94PVwiMCAwIDI4IDE4XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj5cbiAgICAgICAgICAgIDxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIj5cbiAgICAgICAgICAgICAgICAuc3Qwe1xuICAgICAgICAgICAgICAgIGZpbGw6IzAwMDAwMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA8L3N0eWxlPlxuICAgICAgICAgICAgICAgIDxwYXRoIGlkPVwiWE1MSURfMTVfXCIgY2xhc3M9XCJzdDBcIiBkPVwiTTI2LjgsMS4xQzI2LjEsMC40LDI1LjEsMCwyNC4yLDBIMy40Yy0xLDAtMS43LDAuNC0yLjQsMS4xQzAuMywxLjcsMCwyLjcsMCwzLjZ2MTAuN1xuICAgICAgICAgICAgYzAsMSwwLjMsMS45LDAuOSwyLjZDMS42LDE3LjYsMi40LDE4LDMuNCwxOGg1YzAuNywwLDEuMy0wLjIsMS44LTAuNWMwLjYtMC4zLDEtMC44LDEuMy0xLjRsMS41LTIuNkMxMy4yLDEzLjEsMTMsMTMsMTQsMTN2MGgtMC4yXG4gICAgICAgICAgICBoMGMwLjMsMCwwLjcsMC4xLDAuOCwwLjVsMS40LDIuNmMwLjMsMC42LDAuOCwxLjEsMS4zLDEuNGMwLjYsMC4zLDEuMiwwLjUsMS44LDAuNWg1YzEsMCwyLTAuNCwyLjctMS4xYzAuNy0wLjcsMS4yLTEuNiwxLjItMi42XG4gICAgICAgICAgICBWMy42QzI4LDIuNywyNy41LDEuNywyNi44LDEuMXogTTcuNCwxMS44Yy0xLjYsMC0yLjgtMS4zLTIuOC0yLjhjMC0xLjYsMS4zLTIuOCwyLjgtMi44YzEuNiwwLDIuOCwxLjMsMi44LDIuOFxuICAgICAgICAgICAgQzEwLjIsMTAuNSw4LjksMTEuOCw3LjQsMTEuOHogTTIwLjEsMTEuOGMtMS42LDAtMi44LTEuMy0yLjgtMi44YzAtMS42LDEuMy0yLjgsMi44LTIuOEMyMS43LDYuMiwyMyw3LjQsMjMsOVxuICAgICAgICAgICAgQzIzLDEwLjUsMjEuNywxMS44LDIwLjEsMTEuOHpcIi8+XG4gICAgICAgICAgICA8L3N2Zz5gO1xuICAgICAgICByZXR1cm4gbG9nby5maXJzdENoaWxkO1xuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBXZWJWUkJ1dHRvblN0eWxlXG57XG4gICAgc3RhdGljIGdlbmVyYXRlQ3NzKHByZWZpeCwgaGVpZ2h0ID0gNTAsIGZvbnRTaXplID0gMTgpe1xuICAgICAgICBsZXQgYm9yZGVyV2lkdGggPSAyO1xuICAgICAgICBsZXQgYm9yZGVyUmFkaXVzID0gaGVpZ2h0IC8gMjtcbiAgICAgICAgLy8gYm9yZGVyUmFkaXVzID0gMDtcblxuICAgICAgICBsZXQgZXJyb3JDb2xvciA9ICdyZWQnO1xuXG4gICAgICAgIGxldCBjc3MgPSBgXG4gICAgICAgIFxuICAgIFxuICAgIGJ1dHRvbi4ke3ByZWZpeH0tYnV0dG9uIHtcbiAgICAgICAgYm9yZGVyOiB3aGl0ZSAke2JvcmRlcldpZHRofXB4IHNvbGlkO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAke2JvcmRlclJhZGl1c31weDtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgYmFja2dyb3VuZDogcmdiYSgwLDAsMCwgMCk7XG4gICAgICAgIFxuICAgICAgICBoZWlnaHQ6ICR7aGVpZ2h0fXB4O1xuICAgICAgICBtaW4td2lkdGg6ICR7aGVpZ2h0fXB4O1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgXG4gICAgICAgIGZvbnQtZmFtaWx5OiAnS2FybGEnLCBzYW5zLXNlcmlmO1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIFxuICAgICAgICAgLXdlYmtpdC10cmFuc2l0aW9uOiB3aWR0aCAwLjVzO1xuICAgICAgICB0cmFuc2l0aW9uOiB3aWR0aCAwLjVzO1xuICAgIH1cbiAgICBcbiAgICAvKlxuICAgICogTG9nb1xuICAgICovICBcbiAgICBcbiAgICAuJHtwcmVmaXh9LWxvZ28ge1xuICAgICAgICB3aWR0aDogJHtoZWlnaHR9cHg7XG4gICAgICAgIGhlaWdodDogJHtoZWlnaHR9cHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6ICR7Ym9yZGVyUmFkaXVzfXB4O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICB0b3A6LSR7Ym9yZGVyV2lkdGh9cHg7XG4gICAgICAgIGxlZnQ6LSR7Ym9yZGVyV2lkdGh9cHg7XG4gICAgfVxuICAgIC4ke3ByZWZpeH0tbG9nbyA+IHN2ZyB7XG4gICAgICAgIG1hcmdpbi10b3A6ICR7KGhlaWdodCAtIGZvbnRTaXplKSAvIDJ9cHg7XG4gICAgfVxuICAgIFxuICAgIFxuICAgIC8qXG4gICAgKiBUaXRsZVxuICAgICovXG4gICAgXG4gICAgLiR7cHJlZml4fS10aXRsZSB7XG4gICAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICBmb250LXNpemU6ICR7Zm9udFNpemV9cHg7XG4gICAgICAgIHRvcDogLSR7Ym9yZGVyV2lkdGh9cHg7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAke2hlaWdodCAtIGJvcmRlcldpZHRoICogMn1weDtcbiAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICAgICAgcGFkZGluZy1sZWZ0OiAke2hlaWdodCAqIDEuMDV9cHg7XG4gICAgICAgIHBhZGRpbmctcmlnaHQ6ICR7KGJvcmRlclJhZGl1cy0xMCA8IDUpID8gNSA6IGJvcmRlclJhZGl1cy0xMH1weDtcbiAgICB9XG4gICAgXG4gICAgLypcbiAgICAqIERlc2NyaXB0aW9uXG4gICAgKi9cbiAgICBcbiAgICAuJHtwcmVmaXh9LWRlc2NyaXB0aW9ue1xuICAgICAgICBmb250LXNpemU6IDEzcHg7XG4gICAgICAgIG1hcmdpbi10b3A6IDVweFxuICAgIH1cbiAgICBcbiAgIC4ke3ByZWZpeH0tZGVzY3JpcHRpb24sIGEge1xuICAgICAgICBjb2xvcjogd2hpdGVcbiAgICB9XG4gICBcbiAgICAvKlxuICAgICogRXJyb3JcbiAgICAqLyAgIFxuICAgICBcbiAgICBidXR0b24uJHtwcmVmaXh9LWJ1dHRvbltkYXRhLWVycm9yPXRydWVdIHtcbiAgICAgICAgYm9yZGVyLWNvbG9yOiAke2Vycm9yQ29sb3J9O1xuICAgIH0gICAgXG4gICAgYnV0dG9uLiR7cHJlZml4fS1idXR0b25bZGF0YS1lcnJvcj10cnVlXSA+IC4ke3ByZWZpeH0tbG9nbyB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7ZXJyb3JDb2xvcn07XG4gICAgfSAgICBcbiAgICBidXR0b24uJHtwcmVmaXh9LWJ1dHRvbltkYXRhLWVycm9yPXRydWVdID4gLiR7cHJlZml4fS10aXRsZSB7XG4gICAgICAgIGNvbG9yOiAke2Vycm9yQ29sb3J9O1xuICAgIH1cbiAgICBcbiAgICBgO1xuXG4gICAgICAgIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHN0eWxlLmlubmVySFRNTCA9IGNzcztcbiAgICAgICAgcmV0dXJuIHN0eWxlO1xuICAgIH1cblxuXG59IiwiaW1wb3J0IFdlYlZSTWFuYWdlciBmcm9tICcuL3dlYnZyLW1hbmFnZXIuanMnXG5pbXBvcnQgV2ViVlJCdXR0b25ET00gZnJvbSAnLi93ZWJ2ci1idXR0b24tZG9tLmpzJ1xuXG5cbmNvbnN0IFdlYlZSVUlTdGF0ZSA9IHtcbiAgICBSRUFEWV9UT19QUkVTRU5UOiAnUkVBRFlfVE9fUFJFU0VOVCcsXG4gICAgRVJST1JfTk9fUFJFU0VOVEFCTEVfRElTUExBWVM6ICdFUlJPUl9OT19QUkVTRU5UQUJMRV9ESVNQTEFZUycsXG4gICAgRVJST1JfQlJPV1NFUl9OT1RfU1VQUE9SVEVEOiAnRVJST1JfQlJPV1NFUl9OT1RfU1VQUE9SVEVEJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViVlJVSSB7XG4gICAgY29uc3RydWN0b3IoY2FudmFzRG9tLCBvcHRpb25zKXtcbiAgICAgICAgaWYoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcblxuICAgICAgICAvLyBPcHRpb24gdG8gY2NhbmdlIHBpeGVsIGhlaWdodCBvZiB0aGUgYnV0dG9uLlxuICAgICAgICBpZighb3B0aW9ucy5zaXplKXtcbiAgICAgICAgICAgIG9wdGlvbnMuc2l6ZSA9IDQwO1xuICAgICAgICB9XG5cblxuICAgICAgICB0aGlzLndlYnZybWFuYWdlciA9IG5ldyBXZWJWUk1hbmFnZXIoY2FudmFzRG9tKTtcblxuXG4gICAgICAgIHRoaXMuYnV0dG9uID0gbmV3IFdlYlZSQnV0dG9uRE9NKG9wdGlvbnMuc2l6ZSk7XG4gICAgICAgIHRoaXMuYnV0dG9uLmluamVjdENzcygpO1xuICAgICAgICB0aGlzLmJ1dHRvbi5vbkNsaWNrKHRoaXMub25DbGlja0V2ZW50LmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLmRvbUVsZW1lbnQgPSB0aGlzLmJ1dHRvbi5kb21FbGVtZW50O1xuXG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGJyb3dzZXIgaXMgY29tcGF0aWJsZSB3aXRoIFdlYlZSLlxuICAgICAgICB0aGlzLndlYnZybWFuYWdlci5nZXRQcmVzZW50YWJsZURldmljZSgpXG4gICAgICAgICAgICAudGhlbigoaG1kKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaG1kKTtcbiAgICAgICAgICAgICAgICB0aGlzLmhtZCA9IGhtZDtcbiAgICAgICAgICAgICAgICBpZihobWQuY2FwYWJpbGl0aWVzLmNhblByZXNlbnQpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFdlYlZSVUlTdGF0ZS5SRUFEWV9UT19QUkVTRU5UKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoV2ViVlJVSVN0YXRlLkVSUk9SX0JST1dTRVJfTk9UX1NVUFBPUlRFRClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoZS5uYW1lID09ICdOT19ESVNQTEFZUycpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFdlYlZSVUlTdGF0ZS5FUlJPUl9OT19QUkVTRU5UQUJMRV9ESVNQTEFZUylcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoZS5uYW1lID09ICdXRUJWUl9VTlNVUFBPUlRFRCcpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFdlYlZSVUlTdGF0ZS5FUlJPUl9CUk9XU0VSX05PVF9TVVBQT1JURUQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzZXRTdGF0ZShzdGF0ZSl7XG4gICAgICAgIGlmKHN0YXRlICE9IHRoaXMuc3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFdlYlZSVUlTdGF0ZS5SRUFEWV9UT19QUkVTRU5UOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRUaXRsZShcIkVudGVyIFZSXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXREZXNjcmlwdGlvbihcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBXZWJWUlVJU3RhdGUuRVJST1JfTk9fUFJFU0VOVEFCTEVfRElTUExBWVM6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldFRpdGxlKFwiTm8gVlIgSGVhZHNldCBmb3VuZFwiLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0RGVzY3JpcHRpb24oXCJcIilcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBXZWJWUlVJU3RhdGUuRVJST1JfQlJPV1NFUl9OT1RfU1VQUE9SVEVEOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRUaXRsZShcIkJyb3dzZXIgbm90IHN1cHBvcnRlZFwiLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0RGVzY3JpcHRpb24oXCJTb3JyeSwgeW91ciBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCA8YSBocmVmPSdodHRwOi8vd2VidnIuaW5mbyc+V2ViVlI8L2E+XCIpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJVbmtvd24gV2ViVlJVSVN0YXRlIFwiICsgc3RhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25DbGlja0V2ZW50KGUpe1xuICAgICAgICBpZih0aGlzLnN0YXRlID09IFdlYlZSVUlTdGF0ZS5SRUFEWV9UT19QUkVTRU5UKXtcbiAgICAgICAgICAgIHRoaXMud2VidnJtYW5hZ2VyLmVudGVyVnIodGhpcy5obWQpXG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxud2luZG93LldlYlZSVUkgPSBXZWJWUlVJOyIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYlZSTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoY2FudmFzRG9tKXtcbiAgICAgICAgdGhpcy5kb21FbGVtZW50ID0gY2FudmFzRG9tO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogUHJvbWlzZSByZXR1cm5zIHRydWUgaWYgdGhlcmUgaXMgYXQgbGVhc3Qgb25lIEhNRCBkZXZpY2UgYXZhaWxhYmxlLlxuICAgICAqL1xuICAgIGdldFByZXNlbnRhYmxlRGV2aWNlKHR5cGUgPSBWUkRpc3BsYXkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmKCFuYXZpZ2F0b3IgfHwgIW5hdmlnYXRvci5nZXRWUkRpc3BsYXlzKXtcblxuICAgICAgICAgICAgICAgIGxldCBlID0gbmV3IEVycm9yKFwiQnJvd3NlciBub3Qgc3VwcG9ydGluZyBXZWJWUlwiKVxuICAgICAgICAgICAgICAgIGUubmFtZSA9ICdXRUJWUl9VTlNVUFBPUlRFRCc7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbmF2aWdhdG9yLmdldFZSRGlzcGxheXMoKS50aGVuKGZ1bmN0aW9uKGRpc3BsYXlzKSB7XG4gICAgICAgICAgICAgICAgLy8gUHJvbWlzZSBzdWNjZWVkcywgYnV0IGNoZWNrIGlmIHRoZXJlIGFyZSBhbnkgZGlzcGxheXMgYWN0dWFsbHkuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkaXNwbGF5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkaXNwbGF5c1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXNwbGF5c1tpXSBpbnN0YW5jZW9mIHR5cGUgJiYgZGlzcGxheXNbaV0uY2FwYWJpbGl0aWVzLmNhblByZXNlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGlzcGxheXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgZSA9IG5ldyBFcnJvcihcIk5vIGRpc3BsYXlzIGZvdW5kXCIpXG4gICAgICAgICAgICAgICAgZS5uYW1lID0gJ05PX0RJU1BMQVlTJztcbiAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvLyBObyBkaXNwbGF5cyBhcmUgZm91bmQuXG4gICAgICAgICAgICAgICAgbGV0IGUgPSBuZXcgRXJyb3IoXCJObyBkaXNwbGF5cyBmb3VuZFwiKVxuICAgICAgICAgICAgICAgIGUubmFtZSA9ICdOT19ESVNQTEFZUyc7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBlbnRlclZyKGhtZCl7XG4gICAgICAgIGhtZC5yZXF1ZXN0UHJlc2VudChbe1xuICAgICAgICAgICAgc291cmNlOiAgdGhpcy5kb21FbGVtZW50XG4gICAgICAgIH1dKTtcbiAgICB9XG5cbn0iXX0=
