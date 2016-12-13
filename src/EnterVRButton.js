import {WebVRManager} from "./WebVRManager";
import { cssPrefix, createView  } from "./dom";
import * as State from "./states";
import EventEmitter from "eventemitter3";


const child = (el, suffix)=>
    el.querySelector("."+cssPrefix+"-"+suffix);

/**
 * @private
 * if ".webvr-ui-${suffix}" exists,
 * pass it to the function provided for manipulation.
 * @param el
 * @param suffix
 * @param fn
 */
const ifChild = (el, suffix, fn)=>{
    const c = child(el, suffix);
    c && fn(c);
};

/**
 * A button to allow easy-entry and messaging around a WebVR experience
 * @class
 */
export class EnterVRButton extends EventEmitter  {
    /**
     * Construct a new Enter VR Button
     * @constructor
     * @param {HTMLCanvasElement} sourceCanvas the canvas that you want to present in WebVR
     * @param {Object} [options] optional parameters
     * @param {boolean} [options.add360link=true] set to false if you don't wish to offer a 360 mode fallback
     * @param {Number} [options.height=35] specify the height of the button
     * @param {HTMLElement} [options.domElement] provide your own domElement to bind to
     * @param {Boolean} [options.injectCSS=true] set to false if you want to write your own styles
     * @param {Function} [options.onRequestStateChange] set to a function returning false to prevent default state changes
     * @param {string} [options.textEnterVRTitle] set the text for Enter VR
     * @param {string} [options.textExitVRTitle] set the text for exiting VR
     * @param {string} [options.text360Title] set the text for trying 360 mode
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

        //pass in your own domElement if you really dont want to use ours
        this.domElement = options.domElement || createView(options.height, options.injectCSS);

        if(!options.add360Link){
            ifChild(this.domElement, "enter360", (el)=> el.style.display = "none");
        }

        // Create WebVR Manager
        this.manager = new WebVRManager();
        this.manager.addListener("change", (state)=> this.__onStateChange(state))

        // Bind button click events to __onClick
        this.__onEnterVRClick = this.__onEnterVRClick.bind(this);
        this.__onEnter360Click = this.__onEnter360Click .bind(this);
        const button = child(this.domElement, "button");
        if(!button){
            throw new Error(`No ${cssPrefix}-button found in DOM`);
        }
        button.addEventListener("click", this.__onEnterVRClick);

        ifChild(this.domElement, "enter360", (el)=>
          el.addEventListener("click", this.__onEnter360Click)
        );

        this.setTitle(this.options.textEnterVRTitle);
        this.set360Title(this.options.text360Title);
    }


    setTitle(text, disabled = false){
        ifChild(this.domElement,"button", (button)=>{
            button.title = text;
            button.setAttribute("disabled", disabled);
        });

        ifChild(this.domElement,"title", (title)=>{
            if(!text){
                title.style.display = "none";
            } else {
                title.innerText = text;
                title.style.display = "inherit";
            }
        });

        return this;
    }

    setTooltip(tooltip) {
        ifChild(this.domElement, "button", (button)=> button.title = tooltip);
        return this;
    }

    setDescription(html){
        ifChild(this.domElement, "description", (descrip)=> descrip.innerHTML = html);
        return this;
    }

    set360Title(html){
        ifChild(this.domElement,"enter360", (el)=> el.innerHTML = html);
        return this;
    }

    show(){
        this.domElement.style.display = "inherit";
        return this;
    }

    hide(){
        this.domElement.style.display = "none";
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
                    this.setTitle(this.options.textEnterVRTitle);
                    this.setDescription("Get your headset ready. <a href='http://webvr.info' target='_blank'>Learn more.</a>");
                    if(this.manager.defaultDisplay)
                        this.setTooltip("Enter VR using "+this.manager.defaultDisplay.displayName);
                    this.set360Title(this.options.text360Title);
                    break;

                case State.PRESENTING:
                    this.hide();
                    this.setTitle(this.options.textExitVRTitle);
                    this.setDescription("");
                    this.emit("enter");
                    break;

                // Error states
                case State.ERROR_BROWSER_NOT_SUPPORTED:
                    this.show();
                    this.setTitle("Browser not supported", true);
                    this.setDescription("Sorry, your browser doesn't support <a href='http://webvr.info'>WebVR</a>");
                    this.emit("error", new Error(state));
                    break;

                case State.ERROR_NO_PRESENTABLE_DISPLAYS:
                    this.show();
                    this.setTitle(this.options.textEnterVRTitle, true);
                    this.setDescription("No VR headset found. <a href='http://webvr.info'>Learn more</a>");
                    this.emit("error", new Error(state));
                    break;

                case State.ERROR_REQUEST_TO_PRESENT_REJECTED:
                    this.show();
                    this.setTitle(this.options.textEnterVRTitle, true);
                    this.setDescription("Something went wrong trying to start presenting to your headset.");
                    this.emit("error", new Error(state));
                    break;

                case State.ERROR_EXIT_PRESENT_REJECTED:
                default:
                    this.show();
                    this.setTitle(this.options.textEnterVRTitle, true);
                    this.setDescription("Unknown error.");
                    this.emit("error", new Error(state));
            }
            this.state = state;
        }
    }
}
