import {WebVRManager} from "./WebVRManager";
import { DefaultButtonDom } from "./DefaultButtonDom";
import * as State from "./states";
import EventEmitter from "eventemitter3";

/**
 * A button to allow easy-entry and messaging around a WebVR experience
 * @class
 */
export class EnterVRButton extends EventEmitter  {
    /**
     * Construct a new Enter VR Button
     * @constructor
     * @param {HTMLCanvasElement} sourceCanvas the canvas that you want to present in WebVR
     *
     * @param {Object} [options] optional parameters
     * @param {Number} [options.height=35] specify the height of the button
     * @param {AbstractButtonDom} [options.buttonClass=DefaultButtonDom] specify a custom button class
     * @param {Boolean} [options.injectCSS=true] set to false if you want to write your own styles
     * @param {Function} [options.onRequestStateChange] set to a function returning false to prevent default state changes
     */
    constructor(sourceCanvas, options){
        super();
        options = options || {};
        // Option to change pixel height of the button.
        options.height =  options.height || 45;
        options.injectCSS = options.injectCSS !== false;

        options.onRequestStateChange = options.onRequestStateChange || (() => true);

        options.textEnterVRTitle = options.textEnterVRTitle || 'Enter VR';
        options.textExitVRTitle = options.textExitVRTitle   || 'Exit VR';
        options.text360Title = options.text360Title         || 'or try it in 360° mode';

        this.options = options;


        this.sourceCanvas = sourceCanvas;

        this.buttonClass = options.buttonClass || new DefaultButtonDom(options);

        if(options.injectCSS && this.buttonClass.injectCSS) {
            this.buttonClass.injectCSS();
        }

        // Create WebVR Manager
        this.manager = new WebVRManager();
        this.manager.addListener("change", (state)=> this.__onStateChange(state))

        // Bind button click events to __onClick
        this.__onEnterVRClick = this.__onEnterVRClick.bind(this);
        this.__onEnter360Click = this.__onEnter360Click .bind(this);
        this.buttonClass.on("entervrClick", this.__onEnterVRClick);
        this.buttonClass.on("enter360Click", this.__onEnter360Click);

        // Create wrapper DOM
        this.domElement = document.createElement("div");

        // Add button to wrapper DOM
        this.domElement.appendChild(this.buttonClass.domElement)

        this.buttonClass.setTitle(this.options.textEnterVRTitle)
        this.buttonClass.set360Title(this.options.text360Title)
    }

    show(){
        this.domElement.style.display = 'inherit';
    }

    hide(){
        this.domElement.style.display = 'none';
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

    /**
     * @private
     * Handling click event from button
     */
    __onEnterVRClick(){
        if(this.state == State.READY_TO_PRESENT){
            if(this.options.onRequestStateChange(State.PRESENTING)) {
                this.manager.enterVR(this.manager.defaultDisplay, this.sourceCanvas)
            }
        } else if(this.state == State.PRESENTING) {
            if(this.options.onRequestStateChange(State.READY_TO_PRESENT)) {
                this.manager.exitVR(this.manager.defaultDisplay)
            }
        }
    }

    __onEnter360Click(){
        if(this.state != State.PRESENTING){
            if(this.options.onRequestStateChange(State.PRESENTING)) {
                this.manager.enter360(this.sourceCanvas)
            }
        } else if(this.state == State.PRESENTING) {
            if(this.options.onRequestStateChange(State.READY_TO_PRESENT)) {
                this.manager.exit360()
            }
        }
    }


    /**
     * @private
     */
    __onStateChange(state){
        if(state != this.state) {
            if(this.state === State.PRESENTING){
                this.emit("exit");
            }

            switch (state) {
                case State.READY_TO_PRESENT:
                    this.show();
                    this.buttonClass.setTitle(this.options.textEnterVRTitle);
                    this.buttonClass.setDescription("Get your headset ready. <a href='http://webvr.info' target='_blank'>Learn more.</a>");
                    if(this.manager.defaultDisplay)
                        this.buttonClass.setTooltip("Enter VR using "+this.manager.defaultDisplay.displayName);
                    this.buttonClass.set360Title(this.options.text360Title);
                    break;

                case State.PRESENTING:
                    this.hide();
                    this.buttonClass.setTitle(this.options.textExitVRTitle);
                    this.buttonClass.setDescription("");
                    this.emit("enter");
                    break;

                // Error states
                case State.ERROR_BROWSER_NOT_SUPPORTED:
                    this.show();
                    this.buttonClass.setTitle("Browser not supported", true);
                    this.buttonClass.setDescription("Sorry, your browser doesn't support <a href='http://webvr.info'>WebVR</a>");
                    this.emit("error", new Error(state));
                    break;

                case State.ERROR_NO_PRESENTABLE_DISPLAYS:
                    this.show();
                    this.buttonClass.setTitle(this.options.textEnterVRTitle, true);
                    this.buttonClass.setDescription("No VR headset found. <a href='http://webvr.info'>Learn more</a>");
                    this.emit("error", new Error(state));
                    break;

                case State.ERROR_REQUEST_TO_PRESENT_REJECTED:
                    this.show();
                    this.buttonClass.setTitle(this.options.textEnterVRTitle, true);
                    this.buttonClass.setDescription("Something went wrong trying to start presenting to your headset.");
                    this.emit("error", new Error(state));
                    break;

                case State.ERROR_EXIT_PRESENT_REJECTED:
                default:
                    this.show();
                    this.buttonClass.setTitle(this.options.textEnterVRTitle, true);
                    this.buttonClass.setDescription("Unknown error.");
                    this.emit("error", new Error(state));
            }
            this.state = state;
        }
    }
}
