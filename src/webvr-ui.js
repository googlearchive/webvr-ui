import WebVRManager from "./WebVRManager";
import * as State from "./states";
import { EnterVRButton } from "./EnterVRButton";
import  "./AframeComponent";

export var webvrui = 
{
    EnterVRButton,
    State,
    WebVRManager
};

window.webvrui = webvrui;