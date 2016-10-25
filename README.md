# WebVR UI

A javascript library allowing easily to create the UI around a WebVR site. The main feature is the *Enter VR* Button that automatically will detect the support on in the browser and show correct messages to the user. 

The library also supports adding a *Enter 360* that allows entering a mode where on desktop you can use the mouse to drag around, and on mobile rotate the camera based on the gyroscope without rendering in stereoscopic mode (also known as *Magic Window*) 

## Library Usage
Get the library either by cloning or downloading it (will come to npm). 

Include the transpiled library in a script tag

```html
<script src="/webvr-ui/build/webvr-ui.js"></script>
```

or include it in your ES2015 code 

```javascript
import webvrui from 'webvr-ui';
```

The constructor for the button needs the dom element of the WebGL canvas.To use it together with the `THREE.WebGLRenderer`, do something like this

```javascript
var renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);

var options = {}
var enterVR = new webvrui.EnterVRButton(renderer.domElement, options);
document.body.appendChild(enterVR.domElement);

var enter360 = new webvrui.Enter360Button(renderer.domElement, options);
document.body.appendChild(enter360.domElement);
```

Options
**TBD**

## Run Example
View example here: [halfdanj.github.io/webvr-ui/examples](http://halfdanj.github.io/webvr-ui/examples)

To run the example, install dependencies 

```
npm install
```

and start the watcher and server

```
npm start
```

