import * as THREE from 'three';
//import primary_json from '../example.json' assert { type: "json" };
import { displayArtInfo, hideArtInfo } from './ArtInfo.js';
import { updateMovement } from './Movement.js';

export const setupRendering = (
    scene, 
    camera,
    renderer,
    art,
    controls,
    walls,
    gallery_width,
    gallery_length
) => {

    // create clock for accurate and fluid movement
    const clock = new THREE.Clock();

    // this value can be adjusted as wanted, I kind of just went with some math and it worked out
    const distance_threshold = Math.sqrt((gallery_width + gallery_length) / 4);

    // boolean to enable/disable quick viewing position
    let art_displayed = false;

    // main render function, allows the scene to keep updating as player moves
    let render = function () {

        // get delta for accurate movement
        const delta = clock.getDelta();
        
        // update position as player moves
        updateMovement(delta, controls, camera, walls);

        // variable for the current art to have display for
        let art_to_show;
        
        // check each art
        art.forEach((art) => {
            
            // get distance from camera to art
            const distance_to_art = camera.position.distanceTo(art.position);

            // if distance is within threshold
            if (distance_to_art < distance_threshold) {

                // update art to show
                art_to_show = art;

                // on click, move to quick viewing position
                document.addEventListener('mousedown', function() {

                    // only allow teleportation if camera is within art display distance
                    if (art_displayed == true) {

                        // photos on wall 1
                        if (art.user_data.info.direction == 1) {
                            camera.position.set(art.position.x, 
                                0, 
                                // move to standard position with small adjustment to account for height of the photo
                                art.position.z + distance_threshold - (1 / (art.user_data.height / 12)));  
                            camera.rotation.set(0, 0, 0); // adjust rotation to be perpedicular with wall 1
                        }

                        // photos on wall 2
                        else if (art.user_data.info.direction == 2) {
                            camera.position.set(art.position.x - distance_threshold + (1 / (art.user_data.height /12)),
                                0,
                                art.position.z);
                            camera.rotation.set(0, -Math.PI / 2, 0);
                        }

                        // photos on wall 3
                        else if (art.user_data.info.direction == 3) {
                            camera.position.set(art.position.x,
                                0,
                                art.position.z - distance_threshold + (1 / (art.user_data.height / 12)));
                                camera.rotation.set(0, Math.PI, 0);
                        }

                        // photos on wall 4
                        else if (art.user_data.info.direction == 4) {
                            camera.position.set(art.position.x + distance_threshold - (1 / (art.user_data.height / 12)), 
                                0,
                                art.position.z);
                                camera.rotation.set(0, Math.PI / 2, 0);
                        }

                    }

                    
                });
            }
        });

        // show art display
        if (art_to_show) {
            displayArtInfo(art_to_show.user_data.info);
            art_displayed = true;
        }

        // hide art display
        else {
            hideArtInfo();
            art_displayed = false;
        }

        renderer.render(scene, camera);     // recursive loop to continue rendering
        requestAnimationFrame(render);
    };

    render();
};