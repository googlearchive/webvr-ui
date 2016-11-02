import {AbstractButton} from "./AbstractButton";
import * as manager from "./WebVRManager";
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
     * @param {Object} [options] optional parameters
     * @param {Number} [options.height=35] specify the height of the button
     * @param {AbstractButtonDom} [options.buttonDom=DefaultButtonDom] specify a custom button class
     * @param {Boolean} [options.injectCSS=true] set to false if you want to write your own styles
     */
    constructor(sourceCanvas, options){
        super(sourceCanvas, "VR", options);

        // Check if the browser is compatible with WebVR and has headsets.
        manager.getVRDisplay()
            .then((display) => {
                this.display = display;
                this.__setState(State.READY_TO_PRESENT)
            })
            .catch((e) => {
                if(e.name == "NO_DISPLAYS"){
                    this.__setState(State.ERROR_NO_PRESENTABLE_DISPLAYS)
                } else if(e.name == "WEBVR_UNSUPPORTED"){
                    this.__setState(State.ERROR_BROWSER_NOT_SUPPORTED)
                }
            });
        //bind events
        this.__onClick = this.__onClick.bind(this);
        this.domElement.addEventListener("click", this.__onClick);

        this.__onVRDisplayPresentChange = this.__onVRDisplayPresentChange.bind(this);
        window.addEventListener("vrdisplaypresentchange", this.__onVRDisplayPresentChange);
    }

    /**
     * @private
     */
    __onClick(e){

        if(this.state == State.READY_TO_PRESENT){
            manager.enterVR(this.display, this.sourceCanvas)
                .then(
                    ()=> this.__setState(State.PRESENTING),
                    //this could fail if:
                    //1. Display `canPresent` is false
                    //2. Canvas is invalid
                    //3. not executed via user interaction
                    ()=> this.__setState(State.ERROR_REQUEST_TO_PRESENT_REJECTED)
                );

        } else if(this.state == State.PRESENTING) {
            this.__setState(State.READY_TO_PRESENT);
            manager.exitVR(this.display)
                .then(
                    ()=> this.__setState(State.READY_TO_PRESENT),
                    //this could fail if:
                    //1. exit requested while not currently presenting
                    ()=> this.__setState(State.ERROR_EXIT_PRESENT_REJECTED)
                 );
        }
    }


    /**
     * @private
     */
    __onVRDisplayPresentChange(){
        const isPresenting = this.display && this.display.isPresenting;
        this.__setState( isPresenting ? State.PRESENTING : State.READY_TO_PRESENT);
    }

    /**
     * @private
     */
    __setState(state){
        if(state != this.state) {
            switch (state) {
                case State.READY_TO_PRESENT:
                    this.buttonDom.setTitle("Enter VR");
                    this.buttonDom.setDescription("");
                    this.buttonDom.setTooltip("Enter VR on "+this.display.displayName)
                    if(this.state === State.PRESENTING){
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
    remove(){
        window.removeEventListener("vrdisplaypresentchage", this.__onVRDisplayPresentChange);
        this.domElement.removeEventListener("click", this.__onClick);
        super.remove();
    }

}
