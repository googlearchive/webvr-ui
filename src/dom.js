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

/**
 * @private
 * generate the innerHTML for the button
 * @param {Number} fontSize
 * @returns {string}
 */
const generateInnerHTML = (fontSize, theme)=>{
    const svgString = generateVRIcon(fontSize, (theme == 'dark') ? 'white' : 'black');

    return `<button class="${cssPrefix}-button">
          <div class="${cssPrefix}-title"></div>
          <div class="${cssPrefix}-logo">${svgString}</div>
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
 * @returns {HTMLElement}
 */
export const createView = (height, injectCSSStyles=true, theme='light')=>{
    const fontSize = height / 2.5;
    if(injectCSSStyles){
        injectCSS(generateCSS(height, fontSize, theme));
    }

    const el = document.createElement("div");
    el.innerHTML = generateInnerHTML(fontSize, theme);
    return el.firstChild;
};


/**
 * generate the VR Icons SVG
 * @param {Number} height
 * @param {string} [fill="#000000"]
 * @returns {string}
 */
export const generateVRIcon = (height, fill="#000000")=>{
    let aspect = 28/18;
    return `
        <svg class="${cssPrefix}-svg" version="1.1" x="0px" y="0px" width="${aspect*height}px" height="${height}px" viewBox="0 0 28 18" xml:space="preserve">
            <path fill="${fill}" d="M26.8,1.1C26.1,0.4,25.1,0,24.2,0H3.4c-1,0-1.7,0.4-2.4,1.1C0.3,1.7,0,2.7,0,3.6v10.7
            c0,1,0.3,1.9,0.9,2.6C1.6,17.6,2.4,18,3.4,18h5c0.7,0,1.3-0.2,1.8-0.5c0.6-0.3,1-0.8,1.3-1.4l1.5-2.6C13.2,13.1,13,13,14,13v0h-0.2
            h0c0.3,0,0.7,0.1,0.8,0.5l1.4,2.6c0.3,0.6,0.8,1.1,1.3,1.4c0.6,0.3,1.2,0.5,1.8,0.5h5c1,0,2-0.4,2.7-1.1c0.7-0.7,1.2-1.6,1.2-2.6
            V3.6C28,2.7,27.5,1.7,26.8,1.1z M7.4,11.8c-1.6,0-2.8-1.3-2.8-2.8c0-1.6,1.3-2.8,2.8-2.8c1.6,0,2.8,1.3,2.8,2.8
            C10.2,10.5,8.9,11.8,7.4,11.8z M20.1,11.8c-1.6,0-2.8-1.3-2.8-2.8c0-1.6,1.3-2.8,2.8-2.8C21.7,6.2,23,7.4,23,9
            C23,10.5,21.7,11.8,20.1,11.8z"/>
        </svg>
        <svg class="${cssPrefix}-svg-error" x="0px" y="0px" width="${aspect*height}px" height="${aspect*height}px" viewBox="0 0 28 28" xml:space="preserve">
            <path fill="${fill}" d="M17.6,13.4c0-0.2-0.1-0.4-0.1-0.6c0-1.6,1.3-2.8,2.8-2.8s2.8,1.3,2.8,2.8s-1.3,2.8-2.8,2.8
            c-0.2,0-0.4,0-0.6-0.1l5.9,5.9c0.5-0.2,0.9-0.4,1.3-0.8c0.7-0.7,1.1-1.6,1.1-2.5V7.4c0-1-0.4-1.9-1.1-2.5c-0.7-0.7-1.6-1-2.5-1H8.1
            L17.6,13.4z"/>
            <path fill="${fill}" d="M10.1,14.2c-0.5,0.9-1.4,1.4-2.4,1.4c-1.6,0-2.8-1.3-2.8-2.8c0-1.1,0.6-2,1.4-2.5L0.9,5.1
            C0.3,5.7,0,6.6,0,7.5v10.7c0,1,0.4,1.8,1.1,2.5c0.7,0.7,1.6,1,2.5,1h5c0.7,0,1.3-0.1,1.8-0.5c0.6-0.3,1-0.8,1.3-1.4l1.3-2.6
            L10.1,14.2z"/>
            <path fill="${fill}" d="M25.5,27.5l-25-25C-0.1,2-0.1,1,0.5,0.4l0,0C1-0.1,2-0.1,2.6,0.4l25,25c0.6,0.6,0.6,1.5,0,2.1l0,0
            C27,28.1,26,28.1,25.5,27.5z"/>
        </svg>

`;
};


/**
 * generate the CSS string to inject
 * @param {Number} [height=50]
 * @param {Number} [fontSize=18]
 * @param {string} [disabledColor="rgba(255,255,255,0.4)"]
 * @returns {string}
 */
export const generateCSS = (height=50, fontSize=18, theme='light')=>{
    let primaryColor = "white";
    let disabledColor = "rgba(255,255,255,0.5)";

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
            border-radius: ${borderRadius}px;
            background-color: ${primaryColor};
            position: absolute;
            top:-${borderWidth}px;
            left:-${borderWidth}px;
        }
        .${cssPrefix}-svg {
            margin-top: ${(height - fontSize) / 2}px;
        }
        .${cssPrefix}-svg-error {
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
        * disabled
        */

        button.${cssPrefix}-button[disabled=true] {
            border-color: ${disabledColor};
        }
        button.${cssPrefix}-button[disabled=true] > .${cssPrefix}-logo {
            background-color: ${disabledColor};
            background-color: ${disabledColor};
            top:0;
            left:0;
            width: ${height-4}px;
            height: ${height-4}px;
        }
        button.${cssPrefix}-button[disabled=true] > .${cssPrefix}-logo > .${cssPrefix}-svg {
            display:none;
        }
        button.${cssPrefix}-button[disabled=true] > .${cssPrefix}-logo > .${cssPrefix}-svg-error {
            display:initial;
            margin-top: ${(height - 28/18 * fontSize) / 2 - 2}px;
            margin-left: -2px;
        }
        
        button.${cssPrefix}-button[disabled=true] > .${cssPrefix}-title {
            color: ${disabledColor};
        }

    `);
};
