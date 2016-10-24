import {AbstractButton} from "./AbstractButton";

export const State = {
    READY_TO_PRESENT: 'READY_TO_PRESENT',
    PRESENTING: 'PRESENTING'
};

export class Enter360Button extends AbstractButton {
    constructor(canvasDom, options){
        super(canvasDom, options);

        this.setState(State.READY_TO_PRESENT);
    }

    setState(state){
        if(state != this.state) {
            this.state = state;
            switch (state) {
                case State.READY_TO_PRESENT:
                    this.button.setTitle("Enter 360");
                    this.button.setDescription("");
                    break;
                case State.PRESENTING:
                    this.button.setTitle("Exit 360");
                    this.button.setDescription("");
                    break;
                default:
                    console.error("Unkown state " + state);
            }
        }
    }

    onClickEvent(e){
        if(this.state == State.READY_TO_PRESENT){
            if(this.onEnterBinding){
                this.setState(State.PRESENTING);
                this.onEnterBinding.call();
            }
        } else if(this.state == State.PRESENTING){
            if(this.onExitBinding){
                this.setState(State.READY_TO_PRESENT);
                this.onExitBinding.call();
            }
        }
    }
}