(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.webvrui = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WebVRButtonDOM = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _webvrButtonStyle = _dereq_("./webvr-button-style");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _WebVRUI_css_injected = false;

var WebVRButtonDOM = exports.WebVRButtonDOM = function () {
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
                var style = _webvrButtonStyle.WebVRButtonStyle.generateCss(this.cssClassPrefix, this.height, this.fontSize);

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

},{"./webvr-button-style":2}],2:[function(_dereq_,module,exports){
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

},{}],3:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Button = exports.State = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _webvrManager = _dereq_('./webvr-manager');

var _webvrButtonDom = _dereq_('./webvr-button-dom');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var State = exports.State = {
    READY_TO_PRESENT: 'READY_TO_PRESENT',
    ERROR_NO_PRESENTABLE_DISPLAYS: 'ERROR_NO_PRESENTABLE_DISPLAYS',
    ERROR_BROWSER_NOT_SUPPORTED: 'ERROR_BROWSER_NOT_SUPPORTED'
};

var Button = exports.Button = function () {
    function Button(canvasDom, options) {
        var _this = this;

        _classCallCheck(this, Button);

        if (!options) options = {};

        // Option to ccange pixel height of the button.
        if (!options.size) {
            options.size = 40;
        }

        this.webvrmanager = new _webvrManager.WebVRManager(canvasDom);

        this.button = new _webvrButtonDom.WebVRButtonDOM(options.size);
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

    _createClass(Button, [{
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

    return Button;
}();

},{"./webvr-button-dom":1,"./webvr-manager":4}],4:[function(_dereq_,module,exports){
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

},{}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd2VidnItYnV0dG9uLWRvbS5qcyIsInNyYy93ZWJ2ci1idXR0b24tc3R5bGUuanMiLCJzcmMvd2VidnItYnV0dG9uLmpzIiwic3JjL3dlYnZyLW1hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7QUNBQTs7OztBQUVBLElBQUksd0JBQXdCLEtBQTVCOztJQUVhLGMsV0FBQSxjO0FBQ1QsNEJBQVksTUFBWixFQUFtQjtBQUFBOztBQUFBOztBQUNmLGFBQUssY0FBTCxHQUFzQixVQUFDLENBQUQsRUFBTyxDQUFFLENBQS9CO0FBQ0EsYUFBSyxjQUFMLEdBQXNCLGlCQUF0Qjs7QUFFQSxhQUFLLFFBQUwsR0FBZ0IsU0FBTyxHQUF2QjtBQUNBLGFBQUssTUFBTCxHQUFjLE1BQWQ7O0FBR0EsYUFBSyxVQUFMLEdBQWtCLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFsQjtBQUNBLGFBQUssVUFBTCxDQUFnQixTQUFoQixHQUE0QixLQUFLLGNBQWpDOztBQUVBLGFBQUssU0FBTCxHQUFpQixTQUFTLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBakI7QUFDQSxhQUFLLFNBQUwsQ0FBZSxTQUFmLEdBQTJCLEtBQUssY0FBTCxHQUF1QixTQUFsRDtBQUNBLGFBQUssU0FBTCxDQUFlLE9BQWYsQ0FBdUIsS0FBdkIsR0FBK0IsS0FBL0I7QUFDQSxhQUFLLFVBQUwsQ0FBZ0IsV0FBaEIsQ0FBNEIsS0FBSyxTQUFqQzs7QUFFQSxhQUFLLFFBQUwsR0FBZ0IsU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQWhCO0FBQ0EsYUFBSyxRQUFMLENBQWMsU0FBZCxHQUEwQixLQUFLLGNBQUwsR0FBdUIsUUFBakQ7QUFDQSxhQUFLLFNBQUwsQ0FBZSxXQUFmLENBQTJCLEtBQUssUUFBaEM7O0FBRUEsYUFBSyxjQUFMLEdBQXNCLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUF0QjtB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QTVCTSxDQUFQO0FBNkJIOzs7Z0NBRU8sRyxFQUFJO0FBQ1IsZ0JBQUksY0FBSixDQUFtQixDQUFDO0FBQ2hCLHdCQUFTLEtBQUs7QUFERSxhQUFELENBQW5CO0FBR0giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHsgV2ViVlJCdXR0b25TdHlsZSB9IGZyb20gJy4vd2VidnItYnV0dG9uLXN0eWxlJztcblxubGV0IF9XZWJWUlVJX2Nzc19pbmplY3RlZCA9IGZhbHNlO1xuXG5leHBvcnQgY2xhc3MgV2ViVlJCdXR0b25ET00ge1xuICAgIGNvbnN0cnVjdG9yKGhlaWdodCl7XG4gICAgICAgIHRoaXMub25DbGlja0JpbmRpbmcgPSAoZSkgPT4ge307XG4gICAgICAgIHRoaXMuY3NzQ2xhc3NQcmVmaXggPSBcIndlYnZyLXVpLWJ1dHRvblwiO1xuXG4gICAgICAgIHRoaXMuZm9udFNpemUgPSBoZWlnaHQvMi41O1xuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuXG4gICAgICAgIHRoaXMuZG9tRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuZG9tRWxlbWVudC5jbGFzc05hbWUgPSB0aGlzLmNzc0NsYXNzUHJlZml4O1xuXG4gICAgICAgIHRoaXMuYnV0dG9uRWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5idXR0b25FbG0uY2xhc3NOYW1lID0gdGhpcy5jc3NDbGFzc1ByZWZpeCAgKyBcIi1idXR0b25cIjtcbiAgICAgICAgdGhpcy5idXR0b25FbG0uZGF0YXNldC5lcnJvciA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRvbUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5idXR0b25FbG0pO1xuXG4gICAgICAgIHRoaXMudGl0bGVFbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLnRpdGxlRWxtLmNsYXNzTmFtZSA9IHRoaXMuY3NzQ2xhc3NQcmVmaXggICsgXCItdGl0bGVcIjtcbiAgICAgICAgdGhpcy5idXR0b25FbG0uYXBwZW5kQ2hpbGQodGhpcy50aXRsZUVsbSk7XG5cbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbkVsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb25FbG0uY2xhc3NOYW1lID0gdGhpcy5jc3NDbGFzc1ByZWZpeCAgKyBcIi1kZXNjcmlwdGlvblwiO1xuICAgICAgICB0aGlzLmRvbUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5kZXNjcmlwdGlvbkVsbSk7XG5cbiAgICAgICAgdGhpcy5sb2dvRWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5sb2dvRWxtLmFwcGVuZENoaWxkKFdlYlZSQnV0dG9uRE9NLmdlbmVyYXRlU3ZnSWNvbih0aGlzLmZvbnRTaXplKSk7XG4gICAgICAgIHRoaXMubG9nb0VsbS5jbGFzc05hbWUgPSB0aGlzLmNzc0NsYXNzUHJlZml4ICArIFwiLWxvZ29cIjtcbiAgICAgICAgdGhpcy5idXR0b25FbG0uYXBwZW5kQ2hpbGQodGhpcy5sb2dvRWxtKTtcblxuXG4gICAgICAgIHRoaXMuYnV0dG9uRWxtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMub25DbGlja0JpbmRpbmcpe1xuICAgICAgICAgICAgICAgIHRoaXMub25DbGlja0JpbmRpbmcuY2FsbCh0aGlzLGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuXG4gICAgaW5qZWN0Q3NzKCl7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSBpdHMgb25seSBpbmplY3RlZCBvbmNlXG4gICAgICAgIGlmKCFfV2ViVlJVSV9jc3NfaW5qZWN0ZWQpIHtcbiAgICAgICAgICAgIF9XZWJWUlVJX2Nzc19pbmplY3RlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgY3NzXG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBXZWJWUkJ1dHRvblN0eWxlLmdlbmVyYXRlQ3NzKHRoaXMuY3NzQ2xhc3NQcmVmaXggLCB0aGlzLmhlaWdodCwgdGhpcy5mb250U2l6ZSk7XG5cbiAgICAgICAgICAgIHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICAgICAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlLGhlYWQuZmlyc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkNsaWNrKGZ1bmMpe1xuICAgICAgICB0aGlzLm9uQ2xpY2tCaW5kaW5nID0gZnVuYztcbiAgICB9XG5cbiAgICBzZXRUaXRsZSh0ZXh0LCBlcnJvciA9IGZhbHNlKXtcbiAgICAgICAgdGhpcy5idXR0b25FbG0udGl0bGUgPSB0ZXh0O1xuICAgICAgICB0aGlzLmJ1dHRvbkVsbS5kYXRhc2V0LmVycm9yID0gZXJyb3I7XG5cbiAgICAgICAgaWYoIXRleHQpe1xuICAgICAgICAgICAgdGhpcy50aXRsZUVsbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50aXRsZUVsbS5pbm5lclRleHQgPSB0ZXh0O1xuICAgICAgICAgICAgdGhpcy50aXRsZUVsbS5zdHlsZS5kaXNwbGF5ID0gJ2luaGVyaXQnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0RGVzY3JpcHRpb24odGV4dCl7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb25FbG0uaW5uZXJIVE1MID0gdGV4dDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2VuZXJhdGVTdmdJY29uKGhlaWdodCl7XG4gICAgICAgIGxldCBsb2dvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbGV0IGFzcGVjdCA9IDI4LzE4O1xuXG4gICAgICAgIGxvZ28uaW5uZXJIVE1MID1cbiAgICAgICAgICAgIGA8c3ZnIHZlcnNpb249XCIxLjFcIlxuICAgICAgICAgICAgICAgIHg9XCIwcHhcIiB5PVwiMHB4XCIgd2lkdGg9XCIke2FzcGVjdCpoZWlnaHR9cHhcIiBoZWlnaHQ9XCIke2hlaWdodH1weFwiIHZpZXdCb3g9XCIwIDAgMjggMThcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPlxuICAgICAgICAgICAgPHN0eWxlIHR5cGU9XCJ0ZXh0L2Nzc1wiPlxuICAgICAgICAgICAgICAgIC5zdDB7XG4gICAgICAgICAgICAgICAgZmlsbDojMDAwMDAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvc3R5bGU+XG4gICAgICAgICAgICAgICAgPHBhdGggaWQ9XCJYTUxJRF8xNV9cIiBjbGFzcz1cInN0MFwiIGQ9XCJNMjYuOCwxLjFDMjYuMSwwLjQsMjUuMSwwLDI0LjIsMEgzLjRjLTEsMC0xLjcsMC40LTIuNCwxLjFDMC4zLDEuNywwLDIuNywwLDMuNnYxMC43XG4gICAgICAgICAgICBjMCwxLDAuMywxLjksMC45LDIuNkMxLjYsMTcuNiwyLjQsMTgsMy40LDE4aDVjMC43LDAsMS4zLTAuMiwxLjgtMC41YzAuNi0wLjMsMS0wLjgsMS4zLTEuNGwxLjUtMi42QzEzLjIsMTMuMSwxMywxMywxNCwxM3YwaC0wLjJcbiAgICAgICAgICAgIGgwYzAuMywwLDAuNywwLjEsMC44LDAuNWwxLjQsMi42YzAuMywwLjYsMC44LDEuMSwxLjMsMS40YzAuNiwwLjMsMS4yLDAuNSwxLjgsMC41aDVjMSwwLDItMC40LDIuNy0xLjFjMC43LTAuNywxLjItMS42LDEuMi0yLjZcbiAgICAgICAgICAgIFYzLjZDMjgsMi43LDI3LjUsMS43LDI2LjgsMS4xeiBNNy40LDExLjhjLTEuNiwwLTIuOC0xLjMtMi44LTIuOGMwLTEuNiwxLjMtMi44LDIuOC0yLjhjMS42LDAsMi44LDEuMywyLjgsMi44XG4gICAgICAgICAgICBDMTAuMiwxMC41LDguOSwxMS44LDcuNCwxMS44eiBNMjAuMSwxMS44Yy0xLjYsMC0yLjgtMS4zLTIuOC0yLjhjMC0xLjYsMS4zLTIuOCwyLjgtMi44QzIxLjcsNi4yLDIzLDcuNCwyMyw5XG4gICAgICAgICAgICBDMjMsMTAuNSwyMS43LDExLjgsMjAuMSwxMS44elwiLz5cbiAgICAgICAgICAgIDwvc3ZnPmA7XG4gICAgICAgIHJldHVybiBsb2dvLmZpcnN0Q2hpbGQ7XG4gICAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFdlYlZSQnV0dG9uU3R5bGUge1xuICAgIHN0YXRpYyBnZW5lcmF0ZUNzcyhwcmVmaXgsIGhlaWdodCA9IDUwLCBmb250U2l6ZSA9IDE4KXtcbiAgICAgICAgbGV0IGJvcmRlcldpZHRoID0gMjtcbiAgICAgICAgbGV0IGJvcmRlclJhZGl1cyA9IGhlaWdodCAvIDI7XG4gICAgICAgIC8vIGJvcmRlclJhZGl1cyA9IDA7XG5cbiAgICAgICAgbGV0IGVycm9yQ29sb3IgPSAncmVkJztcblxuICAgICAgICBsZXQgY3NzID0gYFxuXG5cbiAgICBidXR0b24uJHtwcmVmaXh9LWJ1dHRvbiB7XG4gICAgICAgIGJvcmRlcjogd2hpdGUgJHtib3JkZXJXaWR0aH1weCBzb2xpZDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogJHtib3JkZXJSYWRpdXN9cHg7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMCwwLDAsIDApO1xuXG4gICAgICAgIGhlaWdodDogJHtoZWlnaHR9cHg7XG4gICAgICAgIG1pbi13aWR0aDogJHtoZWlnaHR9cHg7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gICAgICAgIGZvbnQtZmFtaWx5OiAnS2FybGEnLCBzYW5zLXNlcmlmO1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG5cbiAgICAgICAgIC13ZWJraXQtdHJhbnNpdGlvbjogd2lkdGggMC41cztcbiAgICAgICAgdHJhbnNpdGlvbjogd2lkdGggMC41cztcbiAgICB9XG5cbiAgICAvKlxuICAgICogTG9nb1xuICAgICovXG5cbiAgICAuJHtwcmVmaXh9LWxvZ28ge1xuICAgICAgICB3aWR0aDogJHtoZWlnaHR9cHg7XG4gICAgICAgIGhlaWdodDogJHtoZWlnaHR9cHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6ICR7Ym9yZGVyUmFkaXVzfXB4O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICB0b3A6LSR7Ym9yZGVyV2lkdGh9cHg7XG4gICAgICAgIGxlZnQ6LSR7Ym9yZGVyV2lkdGh9cHg7XG4gICAgfVxuICAgIC4ke3ByZWZpeH0tbG9nbyA+IHN2ZyB7XG4gICAgICAgIG1hcmdpbi10b3A6ICR7KGhlaWdodCAtIGZvbnRTaXplKSAvIDJ9cHg7XG4gICAgfVxuXG5cbiAgICAvKlxuICAgICogVGl0bGVcbiAgICAqL1xuXG4gICAgLiR7cHJlZml4fS10aXRsZSB7XG4gICAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICBmb250LXNpemU6ICR7Zm9udFNpemV9cHg7XG4gICAgICAgIHRvcDogLSR7Ym9yZGVyV2lkdGh9cHg7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAke2hlaWdodCAtIGJvcmRlcldpZHRoICogMn1weDtcbiAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICAgICAgcGFkZGluZy1sZWZ0OiAke2hlaWdodCAqIDEuMDV9cHg7XG4gICAgICAgIHBhZGRpbmctcmlnaHQ6ICR7KGJvcmRlclJhZGl1cy0xMCA8IDUpID8gNSA6IGJvcmRlclJhZGl1cy0xMH1weDtcbiAgICB9XG5cbiAgICAvKlxuICAgICogRGVzY3JpcHRpb25cbiAgICAqL1xuXG4gICAgLiR7cHJlZml4fS1kZXNjcmlwdGlvbntcbiAgICAgICAgZm9udC1zaXplOiAxM3B4O1xuICAgICAgICBtYXJnaW4tdG9wOiA1cHhcbiAgICB9XG5cbiAgIC4ke3ByZWZpeH0tZGVzY3JpcHRpb24sIGEge1xuICAgICAgICBjb2xvcjogd2hpdGVcbiAgICB9XG5cbiAgICAvKlxuICAgICogRXJyb3JcbiAgICAqL1xuXG4gICAgYnV0dG9uLiR7cHJlZml4fS1idXR0b25bZGF0YS1lcnJvcj10cnVlXSB7XG4gICAgICAgIGJvcmRlci1jb2xvcjogJHtlcnJvckNvbG9yfTtcbiAgICB9XG4gICAgYnV0dG9uLiR7cHJlZml4fS1idXR0b25bZGF0YS1lcnJvcj10cnVlXSA+IC4ke3ByZWZpeH0tbG9nbyB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7ZXJyb3JDb2xvcn07XG4gICAgfVxuICAgIGJ1dHRvbi4ke3ByZWZpeH0tYnV0dG9uW2RhdGEtZXJyb3I9dHJ1ZV0gPiAuJHtwcmVmaXh9LXRpdGxlIHtcbiAgICAgICAgY29sb3I6ICR7ZXJyb3JDb2xvcn07XG4gICAgfVxuXG4gICAgYDtcblxuICAgICAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSBjc3M7XG4gICAgICAgIHJldHVybiBzdHlsZTtcbiAgICB9XG5cblxufVxuIiwiaW1wb3J0IHsgV2ViVlJNYW5hZ2VyIH0gZnJvbSAnLi93ZWJ2ci1tYW5hZ2VyJztcbmltcG9ydCB7IFdlYlZSQnV0dG9uRE9NIH0gZnJvbSAnLi93ZWJ2ci1idXR0b24tZG9tJztcblxuXG5leHBvcnQgY29uc3QgU3RhdGUgPSB7XG4gICAgUkVBRFlfVE9fUFJFU0VOVDogJ1JFQURZX1RPX1BSRVNFTlQnLFxuICAgIEVSUk9SX05PX1BSRVNFTlRBQkxFX0RJU1BMQVlTOiAnRVJST1JfTk9fUFJFU0VOVEFCTEVfRElTUExBWVMnLFxuICAgIEVSUk9SX0JST1dTRVJfTk9UX1NVUFBPUlRFRDogJ0VSUk9SX0JST1dTRVJfTk9UX1NVUFBPUlRFRCdcbn07XG5cbmV4cG9ydCBjbGFzcyBCdXR0b24ge1xuICAgIGNvbnN0cnVjdG9yKGNhbnZhc0RvbSwgb3B0aW9ucyl7XG4gICAgICAgIGlmKCFvcHRpb25zKSBvcHRpb25zID0ge307XG5cbiAgICAgICAgLy8gT3B0aW9uIHRvIGNjYW5nZSBwaXhlbCBoZWlnaHQgb2YgdGhlIGJ1dHRvbi5cbiAgICAgICAgaWYoIW9wdGlvbnMuc2l6ZSl7XG4gICAgICAgICAgICBvcHRpb25zLnNpemUgPSA0MDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMud2VidnJtYW5hZ2VyID0gbmV3IFdlYlZSTWFuYWdlcihjYW52YXNEb20pO1xuXG5cbiAgICAgICAgdGhpcy5idXR0b24gPSBuZXcgV2ViVlJCdXR0b25ET00ob3B0aW9ucy5zaXplKTtcbiAgICAgICAgdGhpcy5idXR0b24uaW5qZWN0Q3NzKCk7XG4gICAgICAgIHRoaXMuYnV0dG9uLm9uQ2xpY2sodGhpcy5vbkNsaWNrRXZlbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuZG9tRWxlbWVudCA9IHRoaXMuYnV0dG9uLmRvbUVsZW1lbnQ7XG5cblxuICAgICAgICAvLyBDaGVjayBpZiB0aGUgYnJvd3NlciBpcyBjb21wYXRpYmxlIHdpdGggV2ViVlIuXG4gICAgICAgIHRoaXMud2VidnJtYW5hZ2VyLmdldFByZXNlbnRhYmxlRGV2aWNlKClcbiAgICAgICAgICAgIC50aGVuKChobWQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhobWQpO1xuICAgICAgICAgICAgICAgIHRoaXMuaG1kID0gaG1kO1xuICAgICAgICAgICAgICAgIGlmKGhtZC5jYXBhYmlsaXRpZXMuY2FuUHJlc2VudCl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoU3RhdGUuUkVBRFlfVE9fUFJFU0VOVClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFN0YXRlLkVSUk9SX0JST1dTRVJfTk9UX1NVUFBPUlRFRClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoZS5uYW1lID09ICdOT19ESVNQTEFZUycpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFN0YXRlLkVSUk9SX05PX1BSRVNFTlRBQkxFX0RJU1BMQVlTKVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihlLm5hbWUgPT0gJ1dFQlZSX1VOU1VQUE9SVEVEJyl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoU3RhdGUuRVJST1JfQlJPV1NFUl9OT1RfU1VQUE9SVEVEKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG4gICAgc2V0U3RhdGUoc3RhdGUpe1xuICAgICAgICBpZihzdGF0ZSAhPSB0aGlzLnN0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgICAgICAgICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBTdGF0ZS5SRUFEWV9UT19QUkVTRU5UOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXRUaXRsZShcIkVudGVyIFZSXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXREZXNjcmlwdGlvbihcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBTdGF0ZS5FUlJPUl9OT19QUkVTRU5UQUJMRV9ESVNQTEFZUzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0VGl0bGUoXCJObyBWUiBIZWFkc2V0IGZvdW5kXCIsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbi5zZXREZXNjcmlwdGlvbihcIlwiKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFN0YXRlLkVSUk9SX0JST1dTRVJfTk9UX1NVUFBPUlRFRDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b24uc2V0VGl0bGUoXCJCcm93c2VyIG5vdCBzdXBwb3J0ZWRcIiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uLnNldERlc2NyaXB0aW9uKFwiU29ycnksIHlvdXIgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgPGEgaHJlZj0naHR0cDovL3dlYnZyLmluZm8nPldlYlZSPC9hPlwiKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiVW5rb3duIFdlYlZSIHN0YXRlIFwiICsgc3RhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25DbGlja0V2ZW50KGUpe1xuICAgICAgICBpZih0aGlzLnN0YXRlID09IFN0YXRlLlJFQURZX1RPX1BSRVNFTlQpe1xuICAgICAgICAgICAgdGhpcy53ZWJ2cm1hbmFnZXIuZW50ZXJWcih0aGlzLmhtZClcbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiZXhwb3J0IGNsYXNzIFdlYlZSTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoY2FudmFzRG9tKXtcbiAgICAgICAgdGhpcy5kb21FbGVtZW50ID0gY2FudmFzRG9tO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogUHJvbWlzZSByZXR1cm5zIHRydWUgaWYgdGhlcmUgaXMgYXQgbGVhc3Qgb25lIEhNRCBkZXZpY2UgYXZhaWxhYmxlLlxuICAgICAqL1xuICAgIGdldFByZXNlbnRhYmxlRGV2aWNlKHR5cGUgPSBWUkRpc3BsYXkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmKCFuYXZpZ2F0b3IgfHwgIW5hdmlnYXRvci5nZXRWUkRpc3BsYXlzKXtcblxuICAgICAgICAgICAgICAgIGxldCBlID0gbmV3IEVycm9yKFwiQnJvd3NlciBub3Qgc3VwcG9ydGluZyBXZWJWUlwiKVxuICAgICAgICAgICAgICAgIGUubmFtZSA9ICdXRUJWUl9VTlNVUFBPUlRFRCc7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbmF2aWdhdG9yLmdldFZSRGlzcGxheXMoKS50aGVuKGZ1bmN0aW9uKGRpc3BsYXlzKSB7XG4gICAgICAgICAgICAgICAgLy8gUHJvbWlzZSBzdWNjZWVkcywgYnV0IGNoZWNrIGlmIHRoZXJlIGFyZSBhbnkgZGlzcGxheXMgYWN0dWFsbHkuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkaXNwbGF5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkaXNwbGF5c1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXNwbGF5c1tpXSBpbnN0YW5jZW9mIHR5cGUgJiYgZGlzcGxheXNbaV0uY2FwYWJpbGl0aWVzLmNhblByZXNlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGlzcGxheXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgZSA9IG5ldyBFcnJvcihcIk5vIGRpc3BsYXlzIGZvdW5kXCIpXG4gICAgICAgICAgICAgICAgZS5uYW1lID0gJ05PX0RJU1BMQVlTJztcbiAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvLyBObyBkaXNwbGF5cyBhcmUgZm91bmQuXG4gICAgICAgICAgICAgICAgbGV0IGUgPSBuZXcgRXJyb3IoXCJObyBkaXNwbGF5cyBmb3VuZFwiKVxuICAgICAgICAgICAgICAgIGUubmFtZSA9ICdOT19ESVNQTEFZUyc7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBlbnRlclZyKGhtZCl7XG4gICAgICAgIGhtZC5yZXF1ZXN0UHJlc2VudChbe1xuICAgICAgICAgICAgc291cmNlOiAgdGhpcy5kb21FbGVtZW50XG4gICAgICAgIH1dKTtcbiAgICB9XG5cbn1cbiJdfQ==
