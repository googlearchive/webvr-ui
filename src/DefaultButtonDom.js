import { WebVRButtonStyle } from './DefaultButtonStyle';
import {AbstractButtonDom} from "./AbstractButtonDom";

let _WebVRUI_css_injected = false;

export class DefaultButtonDom extends AbstractButtonDom {
    constructor(height){
        super();

        this.onClickBinding = (e) => {};
        this.cssClassPrefix = "webvr-ui-button";

        this.fontSize = height/2.5;
        this.height = height;


        this.domElement = document.createElement("div");
        this.domElement.className = this.cssClassPrefix;

        this.buttonElm = document.createElement("button");
        this.buttonElm.className = this.cssClassPrefix  + "-button";
        this.buttonElm.dataset.error = false;
        this.domElement.appendChild(this.buttonElm);

        this.titleElm = document.createElement("div");
        this.titleElm.className = this.cssClassPrefix  + "-title";
        this.buttonElm.appendChild(this.titleElm);

        this.descriptionElm = document.createElement("div");
        this.descriptionElm.className = this.cssClassPrefix  + "-description";
        this.domElement.appendChild(this.descriptionElm);

        this.logoElm = document.createElement("div");
        this.logoElm.appendChild(DefaultButtonDom.generateSvgIcon(this.fontSize));
        this.logoElm.className = this.cssClassPrefix  + "-logo";
        this.buttonElm.appendChild(this.logoElm);


        this.buttonElm.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            if(this.onClickBinding){
                this.onClickBinding.call(this,e);
            }
        });
        return this;
    }


    injectCss(){
        // Make sure its only injected once
        if(!_WebVRUI_css_injected) {
            _WebVRUI_css_injected = true;

            // Create the css
            let style = WebVRButtonStyle.generateCss(this.cssClassPrefix , this.height, this.fontSize);

            var head = document.getElementsByTagName('head')[0];
            head.insertBefore(style,head.firstChild);
        }
    }

    setTitle(text, error = false){
        this.buttonElm.title = text;
        this.buttonElm.dataset.error = error;

        if(!text){
            this.titleElm.style.display = 'none';
        } else {
            this.titleElm.innerText = text;
            this.titleElm.style.display = 'inherit';
        }
    }

    setDescription(text){
        this.descriptionElm.innerHTML = text;
    }

    static generateSvgIcon(height){
        let logo = document.createElement("div");
        let aspect = 28/18;

        logo.innerHTML =
            `<svg version="1.1"
                x="0px" y="0px" width="${aspect*height}px" height="${height}px" viewBox="0 0 28 18" xml:space="preserve">
            <style type="text/css">
                .st0{
                fill:#000000;
                }
            </style>
                <path id="XMLID_15_" class="st0" d="M26.8,1.1C26.1,0.4,25.1,0,24.2,0H3.4c-1,0-1.7,0.4-2.4,1.1C0.3,1.7,0,2.7,0,3.6v10.7
            c0,1,0.3,1.9,0.9,2.6C1.6,17.6,2.4,18,3.4,18h5c0.7,0,1.3-0.2,1.8-0.5c0.6-0.3,1-0.8,1.3-1.4l1.5-2.6C13.2,13.1,13,13,14,13v0h-0.2
            h0c0.3,0,0.7,0.1,0.8,0.5l1.4,2.6c0.3,0.6,0.8,1.1,1.3,1.4c0.6,0.3,1.2,0.5,1.8,0.5h5c1,0,2-0.4,2.7-1.1c0.7-0.7,1.2-1.6,1.2-2.6
            V3.6C28,2.7,27.5,1.7,26.8,1.1z M7.4,11.8c-1.6,0-2.8-1.3-2.8-2.8c0-1.6,1.3-2.8,2.8-2.8c1.6,0,2.8,1.3,2.8,2.8
            C10.2,10.5,8.9,11.8,7.4,11.8z M20.1,11.8c-1.6,0-2.8-1.3-2.8-2.8c0-1.6,1.3-2.8,2.8-2.8C21.7,6.2,23,7.4,23,9
            C23,10.5,21.7,11.8,20.1,11.8z"/>
            </svg>`;
        return logo.firstChild;
    }
}
