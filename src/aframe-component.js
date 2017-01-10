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

import { EnterVRButton } from "./enter-vr-button";
// import * as manager from "./WebVRManager";
import * as State from "./states";

if(typeof AFRAME !== 'undefined' && AFRAME){
    AFRAME.registerComponent('webvr-ui', {
        dependencies: ['canvas'],

        schema: {
            enabled: {type: 'boolean', default:true},
            color: {type: 'string', default: 'white'},
            background: {type: 'string', default: 'black'},
            corners: {type: 'string', default: 'square'}
        },

        init: function () {
        },

        update: function(){
            var scene = document.querySelector('a-scene')
            scene.setAttribute("vr-mode-ui", {enabled:!this.data.enabled})

            if(this.data.enabled){
                if(this.enterVREl){ return }

                var options = {
                    color: this.data.color,
                    background: this.data.background,
                    corners: this.data.corners,
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
