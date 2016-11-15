import * as State from "./states";
import EventEmitter from "eventemitter3";


export class WebVRManager extends EventEmitter {

    constructor(){
        super();
        this.state = State.PREPARING;

        this.checkDisplays();

        // Bind vr display present change event to __onVRDisplayPresentChange
        this.__onVRDisplayPresentChange = this.__onVRDisplayPresentChange.bind(this);
        window.addEventListener("vrdisplaypresentchange", this.__onVRDisplayPresentChange);
    }

    /**
     * Check if the browser is compatible with WebVR and has headsets.
     * @returns {Promise<VRDisplay>}
     */
    checkDisplays(){
        return WebVRManager.getVRDisplay()
            .then((display) => {
                this.defaultDisplay = display;
                this.__setState(State.READY_TO_PRESENT)
                return display;
            })
            .catch((e) => {
                delete this.defaultDisplay;
                if(e.name == "NO_DISPLAYS"){
                    this.__setState(State.ERROR_NO_PRESENTABLE_DISPLAYS)
                } else if(e.name == "WEBVR_UNSUPPORTED"){
                    this.__setState(State.ERROR_BROWSER_NOT_SUPPORTED)
                } else {
                    this.__setState(State.ERROR_UNKOWN)
                }
            });
    }

    /**
     * clean up object for garbage collection
     */
    remove(){
        window.removeEventListener("vrdisplaypresentchage", this.__onVRDisplayPresentChange);
        super.remove();
    }

    /**
     * returns promise returning list of available VR displays.
     * @returns Promise<VRDisplay>
     */
    static getVRDisplay() {
        return new Promise((resolve, reject) => {
            if (!navigator || !navigator.getVRDisplays) {
                let e = new Error("Browser not supporting WebVR");
                e.name = "WEBVR_UNSUPPORTED";
                reject(e);
                return;
            }

            const rejectNoDisplay = ()=> {
                // No displays are found.
                let e = new Error("No displays found");
                e.name = "NO_DISPLAYS";
                reject(e);
            };

            navigator.getVRDisplays().then(
                function (displays) {
                    // Promise succeeds, but check if there are any displays actually.
                    for (var i = 0; i < displays.length; i++) {
                        console.log(displays[i]);
                        if (displays[i].capabilities.canPresent) {
                            resolve(displays[i]);
                            break;
                        }
                    }

                    rejectNoDisplay();
                },
                rejectNoDisplay);
        });
    }


    /**
     * Enter presentation mode with your set VR display
     */
    static enterVR(display, canvas) {
        return display.requestPresent([{
            source: canvas
        }])
            .then(
                ()=> this.__setState(State.PRESENTING),
                //this could fail if:
                //1. Display `canPresent` is false
                //2. Canvas is invalid
                //3. not executed via user interaction
                ()=> this.__setState(State.ERROR_REQUEST_TO_PRESENT_REJECTED)
            );
    }


    static exitVR(display){
        return display.exitPresent()
            .then(
                ()=> this.__setState(State.READY_TO_PRESENT),
                //this could fail if:
                //1. exit requested while not currently presenting
                ()=> this.__setState(State.ERROR_EXIT_PRESENT_REJECTED)
            );
    }




    /**
     * @private
     */
    __setState(state) {
        if (state != this.state) {
            this.emit('state_change', state, this.state );
            this.state = state;
        }
    }


    /**
     * @private
     */
    __onVRDisplayPresentChange(){
        const isPresenting = this.display && this.display.isPresenting;
        this.__setState( isPresenting ? State.PRESENTING : State.READY_TO_PRESENT);
    }

}


