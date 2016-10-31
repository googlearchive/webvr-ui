
/**
* Promise returns true if there is at least one HMD device available.
 * @returns Promise<VRDisplay>
*/
export const getVRDisplay = ()=>
    new Promise((resolve, reject) => {
        if(!navigator || !navigator.getVRDisplays){
            let e = new Error("Browser not supporting WebVR");
            e.name = "WEBVR_UNSUPPORTED";
            reject(e);
            return;
        }

        const rejectNoDisplay = ()=>{
            // No displays are found.
            let e = new Error("No displays found");
            e.name = "NO_DISPLAYS";
            reject(e);
        };

        navigator.getVRDisplays().then(
            function(displays) {
                // Promise succeeds, but check if there are any displays actually.
                for (var i = 0; i < displays.length; i++) {
                    console.log(displays[i]);
                    if (displays[i].capabilities.canPresent ) {
                        resolve(displays[i]);
                        break;
                    }
                }

                rejectNoDisplay();
            },
            rejectNoDisplay);
    });


/**
 * Enter presentation mode with your set VR display
 */
export const enterVR = (display, canvas)=>
    display.requestPresent([{
        source:  canvas
    }]);


export const exitVR = (display)=>
    display.exitPresent();

