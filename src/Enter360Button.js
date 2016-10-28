import screenfull from 'screenfull';
import {AbstractButton} from "./AbstractButton";

export const State = {
    READY_TO_PRESENT: 'READY_TO_PRESENT',
    PRESENTING: 'PRESENTING'
};



export class Enter360Button extends AbstractButton {
    constructor(sourceCanvas, options){
        super(sourceCanvas, '360', options);
        this.__setState(State.READY_TO_PRESENT);
        
        this.__onClick = this.__onClick.bind(this);
        this.domElement.addEventListener('click', this.__onClick);
    }

    /**
     * @private
     */
    __setState(state){
        if(state != this.state) {
            this.state = state;
            switch (state) {
                case State.READY_TO_PRESENT:
                    this.button.setTitle("Enter 360");
                    this.button.setDescription("");

                    if(this.onExitBinding && this.laststate == State.PRESENTING){
                        this.onExitBinding.call();
                    }
                    break;
                case State.PRESENTING:
                    this.button.setTitle("Exit 360");
                    this.button.setDescription("");

                    if(this.onEnterBinding) {
                        this.onEnterBinding.call();
                    }
                    break;
                default:
                    console.error("Unkown state " + state);
            }

            this.laststate = this.state;
        }
    }

    __onClick(e){
        if(this.state == State.READY_TO_PRESENT){
            this.__setState(State.PRESENTING);
            this.enterFullscreen();
        } else if(this.state == State.PRESENTING){
            this.__setState(State.READY_TO_PRESENT);
        }
    }

    enterFullscreen() {
        if(screenfull.enabled){
            screenfull.request(this.sourceCanvas);
            return true;
        }
        return false;
    };

    exitFullscreen() {
        if(screenfull.enabled && screenfull.isFullscreen){
            screenfull.exit();
            return true;
        }
        return false;
    };

}