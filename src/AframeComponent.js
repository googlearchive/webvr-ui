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
        
        var options = {}
        var enterVR = new webvrui.EnterVRButton(scene.canvas, options);
        document.body.appendChild(enterVR.domElement);

        enterVR.domElement.style.position = "absolute";
        enterVR.domElement.style.bottom = "10px";

        enterVR.domElement.style.left = "50%";
        enterVR.domElement.style.transform = "translate(-50%, -50%)"
        enterVR.domElement.style.textAlign = "center";

    }
});