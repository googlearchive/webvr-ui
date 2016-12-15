// Copyright 2016 Google Inc.
//
//     Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
//     You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
//     Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
//     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
// limitations under the License.


let _WebVRUI_css_injected = false;

/**
 * the css class prefix,
 * every element has a class pattern if "webvr-ui-${name}"
 * @type {string}
 */
export const cssPrefix = "webvr-ui";

const child = (el, suffix)=>
    el.querySelector("."+cssPrefix+"-"+suffix);

/**
 * @private
 * generate the innerHTML for the button
 * @param {Number} fontSize
 * @param {String} theme either 'light' or 'dark'
 * @returns {string}
 */
const generateInnerHTML = (height, fontSize, theme)=>{
    const svgString = generateVRIcon(height,fontSize, theme);

    return `<button class="${cssPrefix}-button">
          <div class="${cssPrefix}-title"></div>
          <div class="${cssPrefix}-logo" >${svgString}</div>
        </button>`;
};

/**
 * inject the CSS string to the head of the document
 * @param {string} cssText the css to inject
 */
export const injectCSS = (cssText)=>{
    // Make sure its only injected once
    if(!_WebVRUI_css_injected) {
        _WebVRUI_css_injected = true;

        // Create the css
        const style = document.createElement("style");
        style.innerHTML = cssText;

        var head = document.getElementsByTagName("head")[0];
        head.insertBefore(style,head.firstChild);
    }
};

/**
 * generate DOM element view for button
 * @param {Number} height
 * @param {boolean} [injectCSSStyles=true] inject the view's CSS into the DOM
 * @param {String} theme either 'light' or 'dark'
 * @returns {HTMLElement}
 */
export const createDefaultView = (height, injectCSSStyles=true, theme='light')=>{
    const fontSize = height / 2.5;
    if(injectCSSStyles){
        injectCSS(generateCSS(height, fontSize, theme));
    }

    const el = document.createElement("div");
    el.innerHTML = generateInnerHTML(height, fontSize, theme);
    var domElement = el.firstChild;


    let __animating = false;
    let __dragIcon;
    let __dragTransition;

    domElement.addEventListener('click', (e)=>{
        if(!__animating) {
            __animating = true;
            e.stopPropagation();
            domElement.classList.add("animate");
            setTimeout(()=> {
                domElement.click();
            }, 800);

            setTimeout(()=>{
                domElement.classList.remove("animate");
                __animating = false;
            },2000)
        }
    }, true);

    const __setTransition = (pct)=>{
        __dragTransition = pct;

        const bounding = domElement.getBoundingClientRect();
        const left = pct * (bounding.width-height);
        child(domElement, 'logo').style.left = left+"px";

        child(domElement, 'title').style.clipPath = `inset(0 0 0 ${left + height/1.5}px)`;
        child(domElement, 'title').style.webkitClipPath = `inset(0 0 0 ${left+ height/1.5}px)`;
    };

    const __onDrag = (e) => {
        if(!domElement.disabled) {
            var bounding = domElement.getBoundingClientRect();

            let left;
            if (e.pageX) left = e.pageX;
            else left = e.touches[0].pageX;

            left = left - bounding.left;
            left = (left - height / 2);
            if (left < 0) left = 0;
            if (left > bounding.width - height) left = bounding.width - height;

            __setTransition(left / (bounding.width - height))
        }
    };

    const __onDragEnd = (e) => {
        if(!domElement.disabled) {
            if (__dragTransition > 0.8) {
                __animating = true;
                domElement.click()
                setTimeout(() => __animating = false, 500);
            }
            __setTransition(0)
        }
    };

    child(domElement, 'logo').addEventListener("mousedown", ( event ) => __dragIcon = true, false);
    document.addEventListener("mouseup", ( event ) => {
        if(__dragIcon){
            __dragIcon = false;
            __onDragEnd(event);
        }
    }, false);

    document.addEventListener("mousemove", ( event ) => __dragIcon && __onDrag(event), false);

    child(domElement, 'logo').addEventListener("touchstart", ( event ) => __dragIcon = true);
    document.addEventListener("touchend", ( event ) => {
        if(__dragIcon){
            __dragIcon = false;
            __onDragEnd(event)
        }

    });
    document.addEventListener("touchmove", ( event ) => __dragIcon && __onDrag(event));




    return domElement;
};


/**
 * generate the VR Icons SVG
 * @param {Number} height
 * @param {string} [fill="#000000"]
 * @returns {string}
 */
export const generateVRIcon = (height, fontSize, theme)=>{
        return `
        <svg class="${cssPrefix}-svg" version="1.1" x="0px" y="0px" width="${height}px" height="${height}px" viewBox="0 0 28 28" xml:space="preserve">
            <path d="M10.1,12.7c-0.9,0-1.6,0.7-1.6,1.6c0,0.8,0.7,1.6,1.6,1.6c0.9,0,1.6-0.7,1.6-1.6
                C11.6,13.4,10.9,12.7,10.1,12.7z"/>
            <path d="M17.2,12.7c-0.9,0-1.6,0.7-1.6,1.6c0,0.8,0.7,1.6,1.6,1.6c0.9,0,1.6-0.7,1.6-1.6
                C18.8,13.4,18.1,12.7,17.2,12.7z"/>
            <path d="M14,0C6.3,0,0,6.3,0,14c0,7.7,6.3,14,14,14s14-6.3,14-14C28,6.3,21.7,0,14,0z M21.5,17.3
                c0,0.5-0.2,1-0.6,1.4c-0.4,0.4-0.9,0.6-1.4,0.6h-2.8c-0.4,0-0.7-0.1-1-0.3c-0.3-0.2-0.6-0.5-0.8-0.8l-0.8-1.5
                c-0.1-0.2-0.3-0.3-0.5-0.3l0,0l0,0l0,0c-0.2,0-0.4,0.1-0.5,0.3l-0.8,1.5c-0.2,0.3-0.4,0.6-0.8,0.8c-0.3,0.2-0.7,0.3-1,0.3H7.7
                c-0.5,0-1-0.2-1.4-0.6c-0.4-0.4-0.6-0.9-0.6-1.5v-6c0-0.5,0.2-1,0.6-1.4c0.4-0.4,0.9-0.6,1.4-0.6h11.6c0.5,0,1,0.2,1.4,0.6
                c0.4,0.4,0.6,0.9,0.6,1.4L21.5,17.3z"/>
        </svg>

        <svg class="${cssPrefix}-svg-error" version="1.1" x="0px" y="0px" width="${height-4}px" height="${height-4}px" viewBox="0 0 28 28" xml:space="preserve">
        <path d="M14,0C6.3,0,0,6.3,0,14s6.3,14,14,14s14-6.3,14-14S21.7,0,14,0z M19.4,9.5c0.5,0,1,0.1,1.4,0.5
            c0.4,0.4,0.6,0.8,0.6,1.4v6c0,0.5-0.2,1-0.6,1.4c-0.2,0.2-0.4,0.3-0.7,0.4l-3.4-3.4c0.1,0,0.2,0,0.3,0c0.9,0,1.6-0.7,1.6-1.6
            c0-0.9-0.7-1.6-1.6-1.6c-0.9,0-1.6,0.7-1.6,1.6c0,0.1,0,0.3,0,0.4l-5.3-5.1H19.4z M12.4,18.3c-0.2,0.3-0.4,0.5-0.8,0.7
            s-0.7,0.2-1,0.2H7.8c-0.5,0-1-0.2-1.4-0.5c-0.4-0.4-0.6-0.8-0.6-1.4v-6c0-0.5,0.2-1,0.5-1.3l3,3c-0.5,0.3-0.8,0.8-0.8,1.4
            c0,0.9,0.7,1.6,1.6,1.6c0.6,0,1.1-0.3,1.4-0.8l1.7,1.7L12.4,18.3z M21.3,22.5l-0.1,0.1c-0.3,0.3-0.8,0.3-1.1,0L6,8.5
            C5.7,8.2,5.7,7.7,6,7.4l0.1-0.1C6.4,7,6.8,7,7.1,7.3l14.2,14.2C21.6,21.7,21.6,22.2,21.3,22.5z"/>
        </svg>`
};


/**
 * generate the CSS string to inject
 * @param {Number} [height=50]
 * @param {Number} [fontSize=18]
 * @param {string} theme either 'light' or 'dark'
 * @returns {string}
 */
export const generateCSS = (height=50, fontSize=18, theme='light')=>{
    let primaryColor = "white";
    // let disabledColor = "white";
    let disabledColor = "rgba(255,255,255,0.6)";

    if(theme == 'dark'){
        primaryColor = "black";
        disabledColor = "rgba(0,0,0,0.5)";
    }

    let borderWidth = 2;
    let borderRadius = height / 2;
    // borderRadius = 0;

    return (`
        @font-face {
            font-family: 'Karla';
            font-style: normal;
            font-weight: 400;
            src: local('Karla'), local('Karla-Regular'), url(https://fonts.gstatic.com/s/karla/v5/31P4mP32i98D9CEnGyeX9Q.woff2) format('woff2');
            unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
        }
        @font-face {
            font-family: 'Karla';
            font-style: normal;
            font-weight: 400;
            src: local('Karla'), local('Karla-Regular'), url(https://fonts.gstatic.com/s/karla/v5/Zi_e6rBgGqv33BWF8WTq8g.woff2) format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
        }
        
        
        .${cssPrefix} {
            font-family: 'Karla', sans-serif;
        }

        button.${cssPrefix}-button {
            border: ${primaryColor} ${borderWidth}px solid;
            border-radius: ${borderRadius}px;
            box-sizing: border-box;
            background: rgba(0,0,0, 0);

            height: ${height}px;
            min-width: ${125}px;
            display: inline-block;
            position: relative;

            cursor: pointer;
            -webkit-transition: width 0.5s;
            transition: width 0.5s;
        }   

        /*
        * Logo
        */

        .${cssPrefix}-logo {
            width: ${height}px;
            height: ${height}px;
            position: absolute;
            top:0px;
            left:0px;
            width: ${height-4}px;
            height: ${height-4}px;
        }
        .${cssPrefix}-svg {
            fill: ${primaryColor};
            margin-top: -2px;
            margin-left: -2px;
        }
        .${cssPrefix}-svg-error {
            fill: ${disabledColor};
            display:none;
        }

        /*
        * Title
        */

        .${cssPrefix}-title {
            color: ${primaryColor};
            position: relative;
            font-size: ${fontSize}px;
            top: -${borderWidth}px;
            line-height: ${height - borderWidth * 2}px;
            text-align: left;
            padding-left: ${height * 1.05}px;
            padding-right: ${(borderRadius-10 < 5) ? 5 : borderRadius-10}px;
        }
        
        /*
        * Animation
        */
        
        @keyframes logo-transition-hide {
            0% {left: 0;}
            100% { left: 110%; }
        }
        
        @keyframes logo-transition-show {
            0% {left: -${height}px;}            
            100% {left: 0;}
        }
        
        @keyframes title-transition-hide {
            0% { -webkit-clip-path: inset(0px 0px 0px 20%); }
            100% {  -webkit-clip-path: inset(0px 0px 0px 120%); }
        }
        @keyframes title-transition-show {
            0% {  -webkit-clip-path: inset(0px 100% 0px 0%); }
            100% {  -webkit-clip-path: inset(0px 0% 0px 0); }
        }
        
        
        button.${cssPrefix}-button.animate {
            overflow:hidden;
        }
        
        button.${cssPrefix}-button.animate > .${cssPrefix}-title {
            animation: title-transition-hide ease 1s 1, title-transition-show ease 1s 1;
            animation-delay: 0s, 1s;                
        }     
        
        button.${cssPrefix}-button.animate > .${cssPrefix}-logo {
            animation: logo-transition-hide ease 1s 1, logo-transition-show ease 1s 1;
            animation-delay: 0s, 1s;
                
        }

        /*
        * disabled
        */

        button.${cssPrefix}-button[disabled=true] {
            border-color: ${disabledColor};
        }
        
        button.${cssPrefix}-button[disabled=true] > .${cssPrefix}-logo > .${cssPrefix}-svg {
            display:none;
        }
        
        button.${cssPrefix}-button[disabled=true] > .${cssPrefix}-logo > .${cssPrefix}-svg-error {
            display:initial;
        }
        
        button.${cssPrefix}-button[disabled=true] > .${cssPrefix}-title {
            color: ${disabledColor};
        }

    `);
};


