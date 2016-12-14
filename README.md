# WebVR UI

A javascript library allowing easily to create the Enter VR button a WebVR site. It will automatically detect the support in the browser and show correct messages to the user.

The library also supports adding a *Enter 360* link that allows entering a mode where on desktop you can use the mouse to drag around, and on mobile rotate the camera based on the gyroscope without rendering in stereoscopic mode (also known as *Magic Window*)

Note: This is not an official Google product.

### Examples
- [Basic Usage](http://halfdanj.github.io/webvr-ui/examples/basic.html) Shows how to simply add a button with the default styling to a site using three.js ([source](/examples/basic.html))
- [A-Frame Usage](http://halfdanj.github.io/webvr-ui/examples/aframe.html) Shows how to use the library with [A-Frame](https://aframe.io) ([source](/examples/aframe.html))


## Library Usage
### Include WebVR UI
Get the library either by cloning or downloading it (will come to npm). 

Include the ES5 transpiled library in a script tag

```html
<script src="/webvr-ui/build/webvr-ui.js"></script>
```

or include it in your ES2015 code 

```javascript
import webvrui from 'webvr-ui';
```

The constructor for the button needs the dom element of the WebGL canvas. To use it together with the `THREE.WebGLRenderer`, do something like this

```javascript
var renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);

var options = {}
var enterVR = new webvrui.EnterVRButton(renderer.domElement, options);
document.body.appendChild(enterVR.domElement);
```

**Options**

- `height`: Height in pixels of the button. *Default 45* 
- `injectCSS`: Set to false to disable CSS injection of button style. *Default `true`*
- `onRequestStateChange`: A function called before state is changed, use to intercept entering or exiting VR for example. Return `true` to continue with default behaviour, or `false` to stop the default behaviour.    

### A-Frame
To use the button in [A-Frame](https://aframe.io/), include the library as above, and add `webvr-ui` to the scene.

```html
<a-scene webvr-ui>
    ...
</a-scene>
``` 

This will disable the default UI and add a *Enter VR* button to the document DOM.  

## Run Example
To run the example, install dependencies 

```
npm install
```

and start the watcher and server

```
npm start
```

## Build
To build the transpiled es5 version of the library, run 

```
npm install
npm run build
```

and the library will be build to `build/webvr-ui.js`