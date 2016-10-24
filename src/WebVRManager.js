export class WebVRManager {
    constructor(canvasDom){
        this.domElement = canvasDom;
    }


    /**
     * Promise returns true if there is at least one HMD device available.
     */
    getPresentableDevice(type = VRDisplay) {
        return new Promise((resolve, reject) => {
            if(!navigator || !navigator.getVRDisplays){

                let e = new Error("Browser not supporting WebVR")
                e.name = 'WEBVR_UNSUPPORTED';
                reject(e);
                return;
            }

            navigator.getVRDisplays().then(function(displays) {
                // Promise succeeds, but check if there are any displays actually.
                for (var i = 0; i < displays.length; i++) {
                    console.log(displays[i]);
                    if (displays[i] instanceof type && displays[i].capabilities.canPresent) {
                        resolve(displays[i]);
                        break;
                    }
                }

                let e = new Error("No displays found")
                e.name = 'NO_DISPLAYS';
                reject(e);
            }, function() {
                // No displays are found.
                let e = new Error("No displays found")
                e.name = 'NO_DISPLAYS';
                reject(e);
            });
        });
    };

    enterVr(hmd){
        hmd.requestPresent([{
            source:  this.domElement
        }]);
    }

}
