import {AbstractButton} from "./AbstractButton";
import {WebVRManager} from "./WebVRManager";
import * as State from "./states";

/**
 * A button to allow easy-entry and messaging around a WebVR experience
 * @class
 */
export class EnterVRButton extends AbstractButton {
    /**
     * Construct a new Enter VR Button
     * @constructor
     * @param {HTMLCanvasElement} sourceCanvas the canvas that you want to present in WebVR
     *
     * @param {Object} [options] optional parameters
     * @param {Number} [options.height=35] specify the height of the button
     * @param {AbstractButtonDom} [options.buttonDom=DefaultButtonDom] specify a custom button class
     * @param {Boolean} [options.injectCSS=true] set to false if you want to write your own styles
     * @param {Function} [options.onRequestStateChange] set to a function returning false to prevent default state changes
     */
    constructor(sourceCanvas, options){
        super(sourceCanvas, "VR", options);

        this.manager = new WebVRManager();
        this.manager.addListener('state_change', (state)=> this.__onStateChange(state))

        // Bind button click events to __onClick
        this.__onClick = this.__onClick.bind(this);
        this.domElement.addEventListener("click", this.__onClick);
    }


    /**
     * clean up object for garbage collection
     */
    remove(){
        this.manager.remove();
        this.domElement.removeEventListener("click", this.__onClick);
        super.remove();
    }

    /**
     * @private
     * Handling click event from button
     */
    __onClick(){
        if(this.state == State.READY_TO_PRESENT){
            if(this.onRequestStateChange(State.PRESENTING)) {
                WebVRManager.enterVR(this.manager.defaultDisplay, this.sourceCanvas)
            }
        } else if(this.state == State.PRESENTING) {
            if(this.onRequestStateChange(State.READY_TO_PRESENT)) {
                WebVRManager.exitVR(this.manager.defaultDisplay)
            }
        }
    }


    /**
     * @private
     */
    __onStateChange(state){
        if(state != this.state) {
            switch (state) {
                case State.READY_TO_PRESENT:
                    this.buttonDom.setTitle("Enter VR");
                    this.buttonDom.setDescription("");
                    this.buttonDom.setTooltip("Enter VR using "+this.manager.defaultDisplay.displayName)
                    if(this.state === State.PRESENTING){
                        this.emit("exit");
                    }
                    break;
                
                case State.PRESENTING:
                    this.buttonDom.setTitle("Exit VR");
                    this.buttonDom.setDescription("");
                    this.emit("enter");
                    break;

                // Error states
                case State.ERROR_BROWSER_NOT_SUPPORTED:
                    this.buttonDom.setTitle("Browser not supported", true);
                    this.buttonDom.setDescription("Sorry, your browser doesn't support <a href='http://webvr.info'>WebVR</a>");
                    this.emit("error", new Error(state));
                    break;

                case State.ERROR_NO_PRESENTABLE_DISPLAYS:
                    this.buttonDom.setTitle("Enter VR", true);
                    this.buttonDom.setDescription("No VR headset found. <a href='http://webvr.info'>Learn more</a>");
                    this.emit("error", new Error(state));
                    break;

                case State.ERROR_REQUEST_TO_PRESENT_REJECTED:
                    this.buttonDom.setTitle("Enter VR", true);
                    this.buttonDom.setDescription("Something went wrong trying to start presenting to your headset.");
                    this.emit("error", new Error(state));
                    break;

                case State.ERROR_EXIT_PRESENT_REJECTED:
                default:
                    this.buttonDom.setTitle("Enter VR", true);
                    this.buttonDom.setDescription("Unknown error.");
                    this.emit("error", new Error(state));
            }
            this.state = state;
        }
    }
}
