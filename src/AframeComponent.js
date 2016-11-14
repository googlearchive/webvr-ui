import {webvrui} from './index';

AFRAME.registerSystem('webvr-ui', {
    schema: {
        // apiKey: {type: 'string'},
        // authDomain: {type: 'string'},
        // channel: {type: 'string'},
        // databaseURL: {type: 'string'},
        // interval: {type: 'number'},
        // storageBucket: {type: 'string'}
    },

    init: function () {
        var scene = document.querySelector('a-scene') 
        scene.setAttribute("vr-mode-ui", {enabled:false})
        console.log(scene.enterVR) 

    },
     

     update: function(){
        if(this.enterVREl){ return }

        var options = {
            onRequestStateChange: function(state){
                if(state == webvrui.State.PRESENTING){
                    scene.enterVR();
                } else {
                    scene.exitVR();
                }
                return false;
            }
        };



        var enterVR = this.enterVR = new webvrui.EnterVRButton(scene.canvas, options)
        .on("enter", function(){ console.log("enter 360") })
        .on("exit", function(){
            console.log("exit 360");
            camera.quaternion.set(0,0,0,1);
            camera.position.set(0,controls.userHeight,0)
        });

        this.enterVREl = enterVR.domElement;

        document.body.appendChild(enterVR.domElement);

        enterVR.domElement.style.position = "absolute";
        enterVR.domElement.style.bottom = "10px";

        enterVR.domElement.style.left = "50%";
        enterVR.domElement.style.transform = "translate(-50%, -50%)";
        enterVR.domElement.style.textAlign = "center";
     },

     remove: function(){
        if (this.enterVREl) {
            this.enterVREl.parentNode.removeChild(this.enterVREl);
            this.enterVR.remove();
        }         
     }
});