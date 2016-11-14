import EventEmitter from "eventemitter3";
import { DefaultButtonDom } from "./DefaultButtonDom";


/**
 * An Abstract class to extend when implementing a custom button
 * @class
 * @abstract
 */
export class AbstractButton extends EventEmitter {
    /**
     * Constructs a new Abstract Button
     * @constructor
     * @param {HTMLCanvasElement} sourceCanvas
     * @param {String} icon a reference to which icon to use
     * @param {Object} [options] optionally provide parameters
     * @param {Number} [options.height=35] set the height of the button
     * @param {AbstractButtonDom} [options.buttonDom=DefaultButtonDom] set a custom AbstractButtonDom
     * @param {Boolean} [options.injectCSS=true] set to false if you want to write your own styles
     */
    constructor(sourceCanvas, icon, options){
        super();
        options = options || {};
        // Option to change pixel height of the button.
        options.height =  options.height || 45;
        options.injectCSS = options.injectCSS !== false;

        this.onRequestStateChange = options.onRequestStateChange || () => true;

        this.sourceCanvas = sourceCanvas;

        this.buttonDom = options.buttonDom || new DefaultButtonDom(options.height, icon);

        if(options.injectCSS) {
            this.buttonDom.injectCSS();
        }
    }

    get domElement(){
        return this.buttonDom.domElement;
    }

    /**
     * remove any listeners and remove from DOM if currently in it
     */
    remove(){
        if(this.domElement.parentElement){
            this.domElement.parentElement.removeChild(this.domElement);
        }
    }
}
