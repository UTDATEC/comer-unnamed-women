import { keys_pressed } from "./Movement.js";
import { showMenu } from "./Menu.js";

export const setupEventListeners = (controls) => {
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    controls.addEventListener('unlock', showMenu);
};

function onKeyDown(event) {
    if (event.key in keys_pressed) {
        keys_pressed[event.key] = true;
    }
};

function onKeyUp(event) {
    if (event.key in keys_pressed) {
        keys_pressed[event.key] = false;
    }
}