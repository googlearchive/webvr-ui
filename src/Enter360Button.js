import {AbstractButton} from "./AbstractButton";

export const State = {
    READY_TO_PRESENT: 'READY_TO_PRESENT',
    PRESENTING: 'PRESENTING'
};

export class Enter360Button extends AbstractButton {
    constructor(canvasDom, options){
        super(canvasDom, '360', options);
        this.canvasDom = canvasDom;

        this.setState(State.READY_TO_PRESENT);



    }

    setState(state){
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

    onClickEvent(e){
        if(this.state == State.READY_TO_PRESENT){
            this.setState(State.PRESENTING);
            this.enterFullscreen();
        } else if(this.state == State.PRESENTING){
            this.setState(State.READY_TO_PRESENT);
        }
    }

    enterFullscreen() {
        let element = this.canvasDom;

        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else {
            return false;
        }
        return true;
    };

    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else {
            return false;
        }

        return true;
    };

}