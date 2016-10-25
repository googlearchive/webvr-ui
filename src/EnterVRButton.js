import {AbstractButton} from "./AbstractButton";
import {WebVRManager} from "./WebVRManager";

export const State = {
    READY_TO_PRESENT: 'READY_TO_PRESENT',
    PRESENTING: 'PRESENTING',
    ERROR_NO_PRESENTABLE_DISPLAYS: 'ERROR_NO_PRESENTABLE_DISPLAYS',
    ERROR_BROWSER_NOT_SUPPORTED: 'ERROR_BROWSER_NOT_SUPPORTED'
};

export class EnterVRButton extends AbstractButton {
    constructor(canvasDom, options){
        super(canvasDom, 'VR', options);

        this.checkDevices();

        this.webvrmanager.onVRDisplayPresentChange(()=>{
            if(this.webvrmanager.isPresenting()){
                this.setState(State.PRESENTING);
            } else {
                this.setState(State.READY_TO_PRESENT);
            }
        })
    }

    checkDevices(){
        // Check if the browser is compatible with WebVR and has headsets.
        this.webvrmanager.getPresentableDevice()
            .then((hmd) => {
                console.log(hmd);
                this.hmd = hmd;
                this.setState(State.READY_TO_PRESENT)

            })
            .catch((e) => {
                if(e.name == 'NO_DISPLAYS'){
                    this.setState(State.ERROR_NO_PRESENTABLE_DISPLAYS)
                } else if(e.name == 'WEBVR_UNSUPPORTED'){
                    this.setState(State.ERROR_BROWSER_NOT_SUPPORTED)
                }
            });
    }

    setState(state){
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

    onClickEvent(e){
        if(this.state == State.READY_TO_PRESENT){
            this.setState(State.PRESENTING);
            this.webvrmanager.enterVr(this.hmd)
        } else if(this.state == State.PRESENTING) {
            this.setState(State.READY_TO_PRESENT);
            this.webvrmanager.exitVr();
        }
    }

}