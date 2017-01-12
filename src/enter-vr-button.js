// Copyright 2016 Google Inc.
//
//     Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
//     You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
//     Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
//     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
// limitations under the License.


import WebVRManager from "./webvr-manager";
import { createDefaultView  } from "./dom";
import * as State from "./states";
import EventEmitter from "eventemitter3";


/**
 * A button to allow easy-entry and messaging around a WebVR experience
 * @class
 */
export default class EnterVRButton extends EventEmitter  {
    /**
     * Construct a new Enter VR Button
     * @constructor
     * @param {HTMLCanvasElement} sourceCanvas the canvas that you want to present in WebVR
     * @param {Object} [options] optional parameters
     * @param {HTMLElement} [options.domElement] provide your own domElement to bind to
     * @param {Boolean} [options.injectCSS=true] set to false if you want to write your own styles
     * @param {Function} [options.beforeEnter] should return a promise, opportunity to intercept request to enter for custom messaging
     * @param {Function} [options.beforeExit] should return a promise, opportunity to intercept request to exit for updating of UI
     * @param {Function} [options.onRequestStateChange] set to a function returning false to prevent default state changes
     * @param {string} [options.textEnterVRTitle] set the text for Enter VR
     * @param {string} [options.textVRNotFoundTitle] set the text for when a VR display is not found
     * @param {string} [options.textExitVRTitle] set the text for exiting VR
     * @param {string} [options.color] text and icon color
     * @param {string} [options.background] set to false for no brackground or a color
     * @param {string} [options.corners] set to 'round', 'square' or pixel value representing the corner radius
     * @param {string} [options.disabledOpacity] set opacity of button dom when disabled
     * @param {string} [options.cssprefix] set to change the css prefix from default 'webvr-ui'
     */
    constructor(sourceCanvas, options){
        super();
        options = options || {};

        options.color = options.color || 'rgb(80,168,252)';
        options.background = options.background || false;
        options.disabledOpacity = options.disabledOpacity || 0.5;
        options.height =  options.height || 55;
        options.corners = options.corners || 'square';
        options.cssprefix = options.cssprefix || 'webvr-ui';

        options.textEnterVRTitle = options.textEnterVRTitle || 'ENTER VR';
        options.textVRNotFoundTitle = options.textVRNotFoundTitle || 'VR NOT FOUND';
        options.textExitVRTitle = options.textExitVRTitle   || 'EXIT VR';

        options.onRequestStateChange = options.onRequestStateChange || (() => true);
        options.beforeEnter = options.beforeEnter || (()=> new Promise(resolve=> resolve()));
        options.beforeExit = options.beforeExit || (()=> new Promise(resolve=> resolve()));

        options.injectCSS = options.injectCSS !== false;

        this.options = options;

        this.sourceCanvas = sourceCanvas;

        //pass in your own domElement if you really dont want to use ours
        this.domElement = options.domElement || createDefaultView(options);

        // Create WebVR Manager
        this.manager = new WebVRManager();
        this.manager.addListener("change", (state)=> this.__onStateChange(state))

        // Bind button click events to __onClick
        if(this.domElement.nodeName !== 'BUTTON'){
            throw new Error(`No ${cssPrefix}-button <button> element found in DOM`);
        }
        this.domElement.addEventListener("click", ()=> this.__onEnterVRClick());

        this.setTitle(this.options.textEnterVRTitle);
    }


    setTitle(text, disabled = false){
        this.domElement.title = text;
        if(disabled){
            this.domElement.setAttribute("disabled", disabled);
        } else {
            this.domElement.removeAttribute("disabled");
        }

        ifChild(this.domElement, this.options.cssprefix, "title", (title)=>{
            if(!text){
                title.style.display = "none";
            } else {
                title.innerText = text;
                title.style.display = "initial";
            }
        });

        return this;
    }

    setTooltip(tooltip) {
        this.domElement.title = tooltip;
        return this;
    }

    show(){
        this.domElement.style.display = "initial";
        this.emit("show");
        return this;
    }

    hide(){
        this.domElement.style.display = "none";
        this.emit("hide");
        return this;
    }

    /**
     * clean up object for garbage collection
     */
    remove(){
        this.manager.remove();

        if(this.domElement.parentElement){
            this.domElement.parentElement.removeChild(this.domElement);
        }
    }


    getVRDisplay(){
      return WebVRManager.getVRDisplay();
    }

    requestEnterVR(){
        return new Promise((resolve, reject)=> {
            if (this.options.onRequestStateChange(State.PRESENTING)) {
                return this.options.beforeEnter()
                    .then(()=> this.manager.enterVR(this.manager.defaultDisplay, this.sourceCanvas))
                    .then(resolve);
            } else {
                reject(new Error(State.ERROR_REQUEST_STATE_CHANGE_REJECTED));
            }
        });
    }

    requestExitVR(){
        return new Promise((resolve, reject)=> {
            if (this.options.onRequestStateChange(State.READY_TO_PRESENT)) {
                return this.options.beforeExit()
                    .then(()=> this.manager.exitVR(this.manager.defaultDisplay))
                    .then(resolve);
            } else {
                reject(new Error(State.ERROR_REQUEST_STATE_CHANGE_REJECTED));
            }
        });
    }

    requestEnter360(){
        return new Promise((resolve, reject)=> {
            if (this.options.onRequestStateChange(State.PRESENTING_360)) {
                return this.options.beforeEnter()
                    .then(()=>this.manager.enter360(this.sourceCanvas))
                    .then(resolve);
            } else {
                reject(new Error(State.ERROR_REQUEST_STATE_CHANGE_REJECTED));
            }
        });
    }

    requestExit360(){
        return new Promise((resolve, reject)=> {
            if (this.options.onRequestStateChange(State.READY_TO_PRESENT)) {
                return this.options.beforeExit()
                    .then(()=>this.manager.exit360())
                    .then(resolve);
            } else {
                reject(new Error(State.ERROR_REQUEST_STATE_CHANGE_REJECTED));
            }
        });
    }

    /**
     * @private
     * Handling click event from button
     */
    __onEnterVRClick(){
        if(this.state == State.READY_TO_PRESENT){
            this.requestEnterVR();
        } else if(this.state == State.PRESENTING) {
            this.requestExitVR();
        }
    }

    /**
     * @private
     */
    __onStateChange(state){
        if(state != this.state) {
            if(this.state === State.PRESENTING || this.state === State.PRESENTING_360){
                this.emit("exit");
            }
            this.state = state;

            switch (state) {
                case State.READY_TO_PRESENT:
                    this.show();
                    this.setTitle(this.options.textEnterVRTitle);
                    if(this.manager.defaultDisplay)
                        this.setTooltip("Enter VR using "+this.manager.defaultDisplay.displayName);
                    break;

                case State.PRESENTING:
                case State.PRESENTING_360:
                    if(!this.manager.defaultDisplay
                        || !this.manager.defaultDisplay.capabilities.hasExternalDisplay
                        || state == State.PRESENTING_360){
                        this.hide();
                    }
                    this.setTitle(this.options.textExitVRTitle);
                    this.emit("enter");
                    break;

                // Error states
                case State.ERROR_BROWSER_NOT_SUPPORTED:
                    this.show();
                    this.setTitle(this.options.textVRNotFoundTitle, true);
                    this.setTooltip("Browser not supported", true);
                    this.emit("error", new Error(state));
                    break;

                case State.ERROR_NO_PRESENTABLE_DISPLAYS:
                    this.show();
                    this.setTitle(this.options.textVRNotFoundTitle, true);
                    this.setTooltip("No VR headset found.");
                    this.emit("error", new Error(state));
                    break;

                case State.ERROR_REQUEST_TO_PRESENT_REJECTED:
                    this.show();
                    this.setTitle(this.options.textVRNotFoundTitle, true);
                    this.setTooltip("Something went wrong trying to start presenting to your headset.");
                    this.emit("error", new Error(state));
                    break;

                case State.ERROR_EXIT_PRESENT_REJECTED:
                default:
                    this.show();
                    this.setTitle(this.options.textVRNotFoundTitle, true);
                    this.setTooltip("Unknown error.");
                    this.emit("error", new Error(state));
            }
        }
    }
}


const child = (el, cssPrefix, suffix)=>
    el.querySelector("."+cssPrefix+"-"+suffix);

/**
 * @private
 * if ".webvr-ui-${suffix}" exists,
 * pass it to the function provided for manipulation.
 * @param el
 * @param cssprefix
 * @param suffix
 * @param fn
 */
const ifChild = (el, cssPrefix, suffix, fn)=>{
    const c = child(el, cssPrefix, suffix);
    c && fn(c);
};
