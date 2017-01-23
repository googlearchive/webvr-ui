# WebVR UI
A javascript library allowing easily to create the Enter VR button a [WebVR](https://webvr.info) site. It will automatically detect the support in the browser and show correct messages to the user. The intention for the library is to create an easy way to make a button solving as many of the common use cases of WebVR as possible, and show some best practices for how to work with WebVR.

The library also supports adding a *Enter Fullscreen* link that allows entering a mode where on desktop you can use the mouse to drag around, and on mobile rotate the camera based on the gyroscope without rendering in stereoscopic mode (also known as *Magic Window*)

### Examples
- [Basic usage](http://halfdanj.github.io/webvr-ui/examples/basic.html) Shows how to simply add a button with the default styling to a site using three.js ([source](/examples/basic.html))
- [A-Frame usage](http://halfdanj.github.io/webvr-ui/examples/aframe.html) Shows how to use the library with [A-Frame](https://aframe.io) ([source](/examples/aframe.html))
- [Styling options](http://halfdanj.github.io/webvr-ui/examples/styling.html) Shows how customize the styling through options ([source](/examples/styling.html))
- [Custom DOM](http://halfdanj.github.io/webvr-ui/examples/customDom.html) Shows how to use the library with a custom DOM for the button [A-Frame](https://aframe.io) ([source](/examples/customDom.html))


## Library Usage
### Include WebVR UI
Get the library either by cloning or downloading it (will come to npm).

Include the ES5 transpiled library in a script tag

```html
<script src="/webvr-ui/build/webvr-ui.min.js"></script>
```

or include it in your ES2015 code

```javascript
import webvrui from 'webvr-ui';
```

The constructor for the button needs the dom element of the WebGL canvas. To use it together with the `THREE.WebGLRenderer`, do something like this

```javascript
var renderer = new THREE.WebGLRenderer();

var options = {}
var enterVR = new webvrui.EnterVRButton(renderer.domElement, options);
document.body.appendChild(enterVR.domElement);
```

### A-Frame
To use the button in [A-Frame](https://aframe.io/), include the library as above, and add `webvr-ui` to the scene.

```html
<a-scene webvr-ui>
    ...
</a-scene>
```

This will disable the default UI and add a *Enter VR* button to the document DOM. All the styling and text options bellow are also available.    


### Options
These are the supported options in `EnterVRButton`. All options are optional. 

**Styling**

- `color`: Set the text and icon color *(default: `rgb(80,168,252)`)*
- `background`: Set the background color, set to `false` for no background *(default: `false`)*
- `corners`: Choose the corner radius. Can either be `'square'` or  `'round'` or a number representing pixel radius *(default: `'square'`)*
- `disabledOpacity`: The opacity of the button when disabled *(default: `0.5`)*

**Text**

- `textEnterVRTitle`: The text in the button prompting to begin presenting *(default: `'ENTER VR'`)*
- `textExitVRTitle`: The text in the button prompting to begin presenting *(default: `'EXIT VR'`)*
- `textVRNotFoundTitle`: The text in the button when there is no VR headset found *(default: `'VR NOT FOUND'`)*

**Events and callback**

- `beforeEnter()`: Callback function called right before entering VR. Should return a promise, giving opportunity to for example custom messaging.
- `beforeExit()`: Callback function called right before exiting VR. Should return a promise, giving opportunity to for example update UI.
- `onRequestStateChange(state)`: A function called before state is changed, use to intercept entering or exiting VR for example. Return `true` to continue with default behaviour, or `false` to stop the default behaviour.
- `enter`: Event called when user enters VR
- `exit`: Event called when user exits VR
- `error`: Event called when an error occurs
- `hide`: Event called when button is hidden 
- `show`: Event called when button is shown

**Advanced**

- `domElement`: Provide a DOM element to use instead of default build in DOM. See [Custom DOM example](http://halfdanj.github.io/webvr-ui/examples/customDom.html) for more details how to use.
- `injectCSS`: Set to false to disable CSS injection of button style *(default: `true`)*

### Functions
These are some of the functions that can be called on the EnterVRButton

- `setTitle(title)`: Change the text in the button.
- `setTooltip(tooltip)`: Change the hover tooltip of the button.
- `show()` / `hide()`: Change the visibility of the button.
- `disable()` / `enable()`: Change the disabled state of the button.
- `getVRDisplay()`: Returns a promise retuning the VRDisplay associated to the button.
- `isPresenting()`: Returns `true` if the canvas associated to the button is presenting in fullscreen or VR mode. 
- `requestEnterVR()`: Requests to start presenting. Must be called from a user action ([read more](https://w3c.github.io/webvr/#dom-vrdisplay-requestpresent))
- `requestEnterFullscreen()`: Requests to enter fullscreen mode if its supported in the browser. 
- `requestExit()`: Request exiting presentation mode. 

## Development
To run the example, install dependencies

```
npm install
```

and start the watcher and server (available on [localhost:3000/examples/basic.html](http://localhost:3000/examples/basic.html))

```
npm start
```

To build the transpiled es5 version of the library, run

```
npm run build
```

and the library will be build to `build/webvr-ui.js`
