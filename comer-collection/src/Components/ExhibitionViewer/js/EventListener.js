import { keys_pressed, updateMovement } from "./Movement.js";
// import { showMenu } from "./Menu.js";

export const setupEventListeners = (controls, boundingBoxElement, clock, camera, setCameraPosition, scene, renderer) => {
    // window.addEventListener('keydown', (event) => {
    //     onKeyDown(event, clock, controls, camera, setCameraPosition, scene, renderer)
    // }, false);

    // window.addEventListener('keyup', (event) => {
    //     onKeyUp(event, clock, controls, camera, setCameraPosition, scene, renderer)
    // }, false);
    // controls.addEventListener('unlock', showMenu);
};

// note: we convert keys to lowercase because of this scenario:
/** User is pressing d to move right
 * user then presses shift (making it D) to move right
 * event listener is not listening for D when key is unpressed, continue to move right
 * 
 * converting all inputs to lowercase fixes this problem. I think this is the simplest solution
 * while allowing users to accidentally hit shift/capslock
 */

function onKeyDown(event, clock, controls, camera, setCameraPosition, scene, renderer) {

    // console.log("keydown", event)

    let normal_key;
    if (event.key == 'W' || event.key == 'A' || event.key == 'S' || event.key == 'D'){
        normal_key = event.key.toLowerCase();
    }
    else {
        normal_key = event.key;
    }
    
    if (normal_key in keys_pressed) {
        keys_pressed[normal_key] = true;
    }

    // const delta = clock.getDelta();
    // updateMovement(delta, controls, camera, setCameraPosition, scene, renderer);
};

function onKeyUp(event, clock, controls, camera, setCameraPosition, scene, renderer) {

    // console.log("keyup", event)

    let normal_key;
    if (event.key == 'W' || event.key == 'A' || event.key == 'S' || event.key == 'D'){
        normal_key = event.key.toLowerCase();
    }
    else {
        normal_key = event.key;
    }

    if (normal_key in keys_pressed) {
        keys_pressed[normal_key] = false;
    }

    // // const delta = clock.getDelta();
    // updateMovement(delta, controls, camera, setCameraPosition, scene, renderer);
}