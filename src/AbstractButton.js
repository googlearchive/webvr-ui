import { WebVRManager } from './WebVRManager';
import { DefaultButtonDom } from './DefaultButtonDom';



export class AbstractButton {
    constructor(canvasDom, options){
        if(!options) options = {};

        // Option to ccange pixel height of the button.
        if(!options.size){
            options.size = 35;
        }

        if(!options.domClass){
            options.domClass = DefaultButtonDom;
        }

        this.webvrmanager = new WebVRManager(canvasDom);


        this.button = new options.domClass(options.size);
        this.button.injectCss();
        this.button.onClick(this.onClickEvent.bind(this));

        this.domElement = this.button.domElement;
    }

    onClickEvent(e){
    }

    onEnter(func){
        this.onEnterBinding = func;
    }

    onExit(func){
        this.onExitBinding = func;
    }
}
