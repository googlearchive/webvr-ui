import { WebVRManager } from './webvr-manager';
import { WebVRButtonDOM } from './webvr-button-dom';


export const State = {
    READY_TO_PRESENT: 'READY_TO_PRESENT',
    ERROR_NO_PRESENTABLE_DISPLAYS: 'ERROR_NO_PRESENTABLE_DISPLAYS',
    ERROR_BROWSER_NOT_SUPPORTED: 'ERROR_BROWSER_NOT_SUPPORTED'
};

export class Button {
    constructor(canvasDom, options){
        if(!options) options = {};

        // Option to ccange pixel height of the button.
        if(!options.size){
            options.size = 40;
        }

        this.webvrmanager = new WebVRManager(canvasDom);


        this.button = new WebVRButtonDOM(options.size);
        this.button.injectCss();
        this.button.onClick(this.onClickEvent.bind(this));
        this.domElement = this.button.domElement;


        // Check if the browser is compatible with WebVR.
        this.webvrmanager.getPresentableDevice()
            .then((hmd) => {
                console.log(hmd);
                this.hmd = hmd;
                if(hmd.capabilities.canPresent){
                    this.setState(State.READY_TO_PRESENT)
                } else {
                    this.setState(State.ERROR_BROWSER_NOT_SUPPORTED)
                }
            })
            .catch((e) => {
                if(e.name == 'NO_DISPLAYS'){
                    this.setState(State.ERROR_NO_PRESENTABLE_DISPLAYS)
                } else if(e.name == 'WEBVR_UNSUPPORTED'){
                    this.setState(State.ERROR_BROWSER_NOT_SUPPORTED)
                }
            })
    }

    setState(state){
        if(state != this.state) {
            this.state = state;
            switch (state) {
                case State.READY_TO_PRESENT:
                    this.button.setTitle("Enter VR");
                    this.button.setDescription("");
                    break;
                case State.ERROR_NO_PRESENTABLE_DISPLAYS:
                    this.button.setTitle("No VR Headset found", true);
                    this.button.setDescription("")
                    break;
                case State.ERROR_BROWSER_NOT_SUPPORTED:
                    this.button.setTitle("Browser not supported", true);
                    this.button.setDescription("Sorry, your browser doesn't support <a href='http://webvr.info'>WebVR</a>")
                    break;
                default:
                    console.error("Unkown WebVR state " + state);
            }
        }
    }

    onClickEvent(e){
        if(this.state == State.READY_TO_PRESENT){
            this.webvrmanager.enterVr(this.hmd)
        }
    }

}
