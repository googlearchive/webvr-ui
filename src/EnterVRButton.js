import {AbstractButton} from "./AbstractButton";
import * as manager from './WebVRManager';


export const State = {
    READY_TO_PRESENT: 'READY_TO_PRESENT',
    PRESENTING: 'PRESENTING',
    ERROR_NO_PRESENTABLE_DISPLAYS: 'ERROR_NO_PRESENTABLE_DISPLAYS',
    ERROR_BROWSER_NOT_SUPPORTED: 'ERROR_BROWSER_NOT_SUPPORTED'
};

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
     * @param {Number} [options.size=35] specify the height of the button
     * @param {AbstractButtonDom} [options.buttonConstructor=DefaultButtonDom] specify a custom button class
     * @param {Boolean} [options.injectCSS=true] set to false if you want to write your own styles
     */
    constructor(sourceCanvas, options){
        super(sourceCanvas, 'VR', options);

        // Check if the browser is compatible with WebVR and has headsets.
        manager.getVRDisplay()
            .then((display) => {
                this.display = display;
                this.__setState(State.READY_TO_PRESENT)
            })
            .catch((e) => {
                if(e.name == 'NO_DISPLAYS'){
                    this.__setState(State.ERROR_NO_PRESENTABLE_DISPLAYS)
                } else if(e.name == 'WEBVR_UNSUPPORTED'){
                    this.__setState(State.ERROR_BROWSER_NOT_SUPPORTED)
                }
            });
        //bind events
        this.__onClick = this.__onClick.bind(this);
        this.button.domElement.addEventListener('click', this.__onClick);

        this.__onVRDisplayPresentChange = this.__onVRDisplayPresentChange.bind(this);
        window.addEventListener('vrdisplaypresentchange', this.__onVRDisplayPresentChange);
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

    /**
     * clean up object for garbage collection
     */
    remove(){
        window.removeEventListener('vrdisplaypresentchage', this.__onVRDisplayPresentChange);
        this.domElement.removeEventListener('click', this.__onClick);
        super.remove();
    }

    __onClick(e){

        const onPresent = ()=> this.__setState(State.PRESENTING);
        const onExit = ()=> this.__setState(State.READY_TO_PRESENT);

        if(this.state == State.READY_TO_PRESENT){
            manager.enterVR(this.display, this.sourceCanvas)
                .then(onPresent, onExit);

        } else if(this.state == State.PRESENTING) {
            this.__setState(State.READY_TO_PRESENT);
            manager.exitVR(this.display)
                .then(onExit, onPresent);
        }
    }

}