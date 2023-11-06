import * as THREE from 'three';
import { controls_enabled } from './Menu';

// initialize as false so the player is not moving
export const keys_pressed = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false,
    W: false, 
    A: false,
    S: false,
    D: false
};

// update movement according to key pressed
export const updateMovement = (delta, controls, camera, walls) => {

    // if this is false, movement is disabled, return early
    if (!controls_enabled) {
        return;
    }

    const move_speed = 5 * delta;
    const previous_position = camera.position.clone();

    if (keys_pressed.ArrowDown || keys_pressed.s || keys_pressed.S) {
        controls.moveForward(-move_speed);
    }

    if (keys_pressed.ArrowUp || keys_pressed.w || keys_pressed.W) {
        controls.moveForward(move_speed);
    }

    if (keys_pressed.ArrowLeft || keys_pressed.a || keys_pressed.A) {
        controls.moveRight(-move_speed);
    }

    if (keys_pressed.ArrowRight || keys_pressed.d || keys_pressed.D) {
        controls.moveRight(move_speed);
    }

    // if this returns true, this means that there was a collision and camera should move back to original position
    if (checkCollision(camera, walls)) {
        camera.position.copy(previous_position);
    }
};

export const checkCollision = (camera, walls) => {

    const player_bounding_box = new THREE.Box3();       // player bounding box
    const camera_world_position = new THREE.Vector3();  // vector for position of bounding box
    camera.getWorldPosition(camera_world_position);     // set camera position to vector
    
    // give player bounding box dimensions
    player_bounding_box.setFromCenterAndSize(
        camera_world_position,
        new THREE.Vector3(1, 1, 1),
    );

    // check if there is a collision with any wall, return true if there is
    // note we do not check for ceiling or floor because the camera should not be able to move in the y direction
    for (let i = 0; i < walls.children.length; i++) {
        const wall = walls.children[i];
        if (player_bounding_box.intersectsBox(wall.BoundingBox)) {
            return true;
        }
    }

    // no collision, return false
    return false;
};