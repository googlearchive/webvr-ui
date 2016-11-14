import { EnterVRButton } from "./EnterVRButton";
// import * as manager from "./WebVRManager";
import * as State from "./states";

if(AFRAME){
    AFRAME.registerComponent('webvr-ui', {
        dependencies: ['canvas'],

        schema: {
            enabled: {type: 'boolean', default:true}
        },

        init: function () {
        },
        
        update: function(){     
            var scene = document.querySelector('a-scene') 
            scene.setAttribute("vr-mode-ui", {enabled:!this.data.enabled})
            
            if(this.data.enabled){
                if(this.enterVREl){ return }
        
                var options = {
                    onRequestStateChange: function(state){
                        if(state == State.PRESENTING){
                            scene.enterVR();
                        } else {
                            scene.exitVR();
                        }
                        return false;
                    }
                };



                var enterVR = this.enterVR = new EnterVRButton(scene.canvas, options)

                this.enterVREl = enterVR.domElement;

                document.body.appendChild(enterVR.domElement);

                enterVR.domElement.style.position = "absolute";
                enterVR.domElement.style.bottom = "10px";

                enterVR.domElement.style.left = "50%";
                enterVR.domElement.style.transform = "translate(-50%, -50%)";
                enterVR.domElement.style.textAlign = "center";

            } else {
                if (this.enterVREl) {
                    this.enterVREl.parentNode.removeChild(this.enterVREl);
                    this.enterVR.remove();
                }    
            } 
        },

        remove: function(){
            if (this.enterVREl) {
                this.enterVREl.parentNode.removeChild(this.enterVREl);
                this.enterVR.remove();
            }         
        }
    });
}