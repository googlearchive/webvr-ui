export class WebVRManager {
    constructor(canvasDom){
        this.domElement = canvasDom;
        //
        //
        // // Bind to fullscreen events.
        // document.addEventListener('webkitfullscreenchange',
        //     this.onFullscreenChange_.bind(this));
        // document.addEventListener('mozfullscreenchange',
        //     this.onFullscreenChange_.bind(this));
        // document.addEventListener('msfullscreenchange',
        //     this.onFullscreenChange_.bind(this));
        //
        // // Bind to VR* specific events.
        // window.addEventListener('vrdisplaydeviceparamschange',
        //     this.onVRDisplayPresentChange_.bind(this));
    }


    /**
     * Promise returns true if there is at least one HMD device available.
     */
    getPresentableDevice(displayType = VRDisplay) {
        return new Promise((resolve, reject) => {
            if(!navigator || !navigator.getVRDisplays){
                let e = new Error("Browser not supporting WebVR");
                e.name = 'WEBVR_UNSUPPORTED';
                reject(e);
                return;
            }

            navigator.getVRDisplays().then(function(displays) {
                // Promise succeeds, but check if there are any displays actually.
                for (var i = 0; i < displays.length; i++) {
                    console.log(displays[i]);
                    if (displays[i] instanceof displayType && displays[i].capabilities.canPresent ) {
                        resolve(displays[i]);
                        break;
                    }
                }

                let e = new Error("No displays found");
                e.name = 'NO_DISPLAYS';
                reject(e);
            }, function() {
                // No displays are found.
                let e = new Error("No displays found");
                e.name = 'NO_DISPLAYS';
                reject(e);
            });
        });
    };

    enterVr(hmd){
        this.presentingHmd = hmd;
        hmd.requestPresent([{
            source:  this.domElement
        }]);
    }

    exitVr(){
        if(this.presentingHmd){
            this.presentingHmd.exitPresent();
            delete this.presentingHmd;
        }
    }

    isPresenting(){
        return this.presentingHmd && this.presentingHmd.isPresenting;
    }

    onVRDisplayPresentChange(func){
        window.addEventListener('vrdisplaypresentchange',
            func.bind(this));
    }

}
