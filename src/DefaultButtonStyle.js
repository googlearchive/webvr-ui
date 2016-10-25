export class WebVRButtonStyle {
    static generateCss(prefix, height = 50, fontSize = 18){
        let borderWidth = 2;
        let borderRadius = height / 2;
        // borderRadius = 0;

        let errorColor = 'rgba(255,255,255,0.4)';

        let css = `


    button.${prefix}-button {
        border: white ${borderWidth}px solid;
        border-radius: ${borderRadius}px;
        box-sizing: border-box;
        background: rgba(0,0,0, 0);

        height: ${height}px;
        min-width: ${125}px;
        display: inline-block;
        position: relative;
        
        margin-top: 8px;

        font-family: 'Karla', sans-serif;
        cursor: pointer;

         -webkit-transition: width 0.5s;
        transition: width 0.5s;
    }

    /*
    * Logo
    */

    .${prefix}-logo {
        width: ${height}px;
        height: ${height}px;
        border-radius: ${borderRadius}px;
        background-color: white;
        position: absolute;
        top:-${borderWidth}px;
        left:-${borderWidth}px;
    }
    .${prefix}-logo > svg {
        margin-top: ${(height - fontSize) / 2}px;
    }


    /*
    * Title
    */

    .${prefix}-title {
        color: white;
        position: relative;
        font-size: ${fontSize}px;
        top: -${borderWidth}px;
        line-height: ${height - borderWidth * 2}px;
        text-align: left;
        padding-left: ${height * 1.05}px;
        padding-right: ${(borderRadius-10 < 5) ? 5 : borderRadius-10}px;
    }

    /*
    * Description
    */

    .${prefix}-description{
        font-size: 13px;
        margin-top: 5px;
        margin-bottom: 10px;
        
    }

   .${prefix}-description, a {
        color: white
    }

    /*
    * Error
    */

    button.${prefix}-button[data-error=true] {
        border-color: ${errorColor};
    }
    button.${prefix}-button[data-error=true] > .${prefix}-logo {
        background-color: ${errorColor};
    }
    button.${prefix}-button[data-error=true] > .${prefix}-title {
        color: ${errorColor};
    }

    `;

        var style = document.createElement('style');
        style.innerHTML = css;
        return style;
    }


}
