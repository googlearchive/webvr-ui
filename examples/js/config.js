window.config = {
    //
    // Functions to get and url parameters
    //

    getParameterByName: function(paramName, url) {
        if (!url) {
            url = window.location.href;
        }
        paramName = paramName.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + paramName + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },


    setParameterByName: function(paramName, paramValue)
    {
        var url = window.location.href;
        var hash = location.hash;
        url = url.replace(hash, '');
        if (url.indexOf(paramName + "=") >= 0)
        {
            var prefix = url.substring(0, url.indexOf(paramName));
            var suffix = url.substring(url.indexOf(paramName));
            suffix = suffix.substring(suffix.indexOf("=") + 1);
            suffix = (suffix.indexOf("&") >= 0) ? suffix.substring(suffix.indexOf("&")) : "";
            url = prefix + paramName + "=" + paramValue + suffix;
        }
        else
        {
            if (url.indexOf("?") < 0)
                url += "?" + paramName + "=" + paramValue;
            else
                url += "&" + paramName + "=" + paramValue;
        }
        window.location.href = url + hash;
    },

    toggleForceEnableVr: function(value){
        config.setParameterByName('force_enable_vr', value);
    } 

}


document.addEventListener("DOMContentLoaded", function(){
//     <div id="config">
//     <p>WebVR-Polyfill Config</p>
//     <input type="checkbox" id="force_enable_vr" onchange="toggleForceEnableVr(this.checked)">
//     <label for="force_enable_vr" title="Force VR on browsers without headset">Force enable VR</label>
// </div>

    var configElm = document.createElement("div")
    configElm.setAttribute("id", "config");

    configElm.style.padding = "10px";
    configElm.style.borderRadius = "10px";
    console.log(configElm.style.position)
    configElm.style.position = "fixed";
    configElm.style.right = "10px";
    configElm.style.top = "10px";
    configElm.style.zIndex = 2;
    configElm.style.borderWidth = "1px";
    configElm.style.borderStyle = "solid";
    configElm.style.borderColor = "white";
    configElm.style.backgroundColor = "rgba(0,0,0,0.5)";
    

    var titleElm = document.createElement("p")
    titleElm.innerText = "WebVR-Polyfill Config";
    configElm.appendChild(titleElm);

    var force_enable_vr = document.createElement("input")
    force_enable_vr.setAttribute("type","checkbox")
    force_enable_vr.setAttribute("id","force_enable_vr")
    force_enable_vr.addEventListener("change",function(){window.config.toggleForceEnableVr(this.checked)  })
    configElm.appendChild(force_enable_vr)

    if (WebVRConfig.FORCE_ENABLE_VR) {
        force_enable_vr.checked = WebVRConfig.FORCE_ENABLE_VR
    }

    var force_enable_vr_label = document.createElement("label")
    force_enable_vr_label.setAttribute("title","Force VR on browsers without headset")
    force_enable_vr_label.innerText = "Force enable VR";
    force_enable_vr_label.setAttribute("for","force_enable_vr")
    configElm.appendChild(force_enable_vr_label)

    document.body.appendChild(configElm);


    // Config
    WebVRConfig.FORCE_ENABLE_VR = config.getParameterByName('force_enable_vr') == 'true' || false
    
    

    
})
 