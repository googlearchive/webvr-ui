import { DefaultButtonDom } from './DefaultButtonDom';


/**
 * An Abstract class to extend when implementing a custom button
 * @class
 * @abstract
 */
export class AbstractButton {
    /**
     * Constructs a new Abstract Button
     * @constructor
     * @param {HTMLCanvasElement} sourceCanvas
     * @param {String} icon a reference to which icon to use
     * @param {Object} [options] optionally provide parameters
     * @param {Number} [options.size=35] set the height of the button
     * @param {AbstractButtonDom} [options.buttonDom=DefaultButtonDom] set a custom AbstractButtonDom
     * @param {Boolean} [options.injectCSS=true] set to false if you want to write your own styles
     */
    constructor(sourceCanvas, icon, options){
        options = options || {};
        // Option to change pixel height of the button.
        options.size =  options.size || 35;
        options.injectCSS = options.injectCSS !== false;

        this.sourceCanvas = sourceCanvas;

        this.button = options.buttonDom || new DefaultButtonDom(options.size, icon);

        if(options.injectCSS) {
            this.button.injectCss();
        }
    }
    
    get domElement(){
        return this.button.domElement;
    }

    /**
     * dispose of anything that should be garbage collected
     */
    dispose(){
        if(this.domElement.parentElement){
            this.domElement.parentElement.removeChild(this.domElement);
        }
    }
}
