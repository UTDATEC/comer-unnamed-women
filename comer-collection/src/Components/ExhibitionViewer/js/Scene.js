import * as THREE from 'three';
import {PointerLockControls} from 'three-stdlib';

// variables for scene set up
export const scene = new THREE.Scene();
let camera, controls, renderer;

// variables for aspect ratio updates
let window_height = window.innerHeight, window_width = window.innerWidth;

export const setupScene = () =>  {

    // camera set up
    camera = new THREE.PerspectiveCamera(
        60, // field of view: 60-90 is normal for viewing on a monitor
        window_width / window_height, // aspect ratio: assumption that ar should be the current window size
        0.1,  // near setting for camera frustum
        1000 // far setting for camera frustum
    );

    scene.add(camera);

    // set camera slighly back from middle of gallery
    camera.position.set(0, 0, 5);

    // enable antialiasing
    renderer = new THREE.WebGLRenderer({
        antialias: true,
    });

    // set initial window size
    renderer.setSize(window_width, window_height);
    document.body.appendChild(renderer.domElement);

    // render options

    // it says .outputEncoding is deprecated, but it is still usable! 
    // It is very important to keep this in as the colors of the scene will look very unsaturated/grayed without it. 
    // console will say use .outputColorSpace instead, but this does not work and will unsaturate the scene
    renderer.outputEncoding = THREE.SRGBColorSpace;

    // add mouse controls
    controls = new PointerLockControls(camera, renderer.domElement);
    scene.add(controls.getObject());

    // resize window when window is resized
    window.addEventListener('resize', function() {
        window_width = window.innerWidth;
        window_height = window.innerHeight;
        camera.aspect = window_width / window_height;
        camera.updateProjectionMatrix();
        renderer.setSize(window_width, window_height);
    });

    return { camera, controls, renderer };
};

// animate scene
export const animate = () => {
    requestAnimationFrame(() => animate());
    renderer.render(scene, camera);
};

// add object an object to scene, helper function for adding artwork
export const addObjectsToScene = (scene, objects) => {
    objects.forEach((object) => {
        scene.add(object);
    });
};
