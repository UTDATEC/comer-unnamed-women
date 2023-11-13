import { Component, createElement, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import primary_json from './example2.json' // assert { type: "json" };

// import { scene, setupScene,	 addObjectsToScene } from './Scene.js';
import { addObjectsToScene, setupScene } from './js/Scene';

import './css/style.css'
import { setupWalls } from './js/Walls';
import { setupFloor } from './js/Floor';
import { setupCeiling } from './js/Ceiling';
import { createArt } from './js/Art';
import { createAmbientLight } from './js/Lighting';
import { createBoundingBoxes } from './js/BoundingBox';
import { setupEventListeners } from './js/EventListener';
import { setupRendering } from './js/Render';

const ExhibitionViewer = (props) => {

    const [controlsEnabled, setControlsEnabled] = useState(false);
    const [menuVisible, setMenuVisible] = useState(true);
        

    const containerRef = useRef(null);
    const playButtonRef = useRef(null);
    const menuRef = useRef(null);



    const enableControls = (controls) => {
        setControlsEnabled(true);
        controls.lock();
    }

    const disableControls = (controls) => {
        setControlsEnabled(false);
        controls.unlock();
    }
    
    
    const showMenu = () => {
        menuRef.current.style.display = 'block';
        //disableControls(controls);
    }
    
    const hideMenu = () => {
        menuRef.current.style.display = 'none';
    }
    
        

    useEffect(() => {
        
        const scene = new THREE.Scene();
        let { camera, controls, renderer } = setupScene(scene);
        
        console.log(scene);
        
        const texture_loader = new THREE.TextureLoader();
    
        let gallery_width = primary_json.size.width_ft,       // units total in left and right directions of (0, 0, 0)
        gallery_length = primary_json.size.length_ft,     // units total in forward and back directions of (0, 0, 0)
        gallery_height = primary_json.size.height_ft -5,  // height of gallery from (0,0,0)
        gallery_depth = 5,    // depth of gallery from (0,0,0)
        wall_offset = 1 / 12; // 1 inch (1/12 of a unit) so art is 1 inch off the wall for frames
    
        
        // checking if JSON was read correctly
        console.log("Gallery Height Total: ", gallery_height + gallery_depth,
        "Gallery Width: ", gallery_width,
        "Gallery Length: ", gallery_length);
    
    
        // create gallery bounds
        const walls = setupWalls(scene, texture_loader, 
            gallery_width, gallery_length, gallery_height, gallery_depth, primary_json.appearance.main_wall_color, primary_json.appearance.side_wall_color);
    
        const floor = setupFloor(scene, texture_loader, 
            gallery_width, gallery_length, gallery_depth, 
            primary_json.appearance.floor_color, primary_json.appearance.floor_texture);
        
        const ceiling = setupCeiling(scene, texture_loader, 
            gallery_width, gallery_length, gallery_height, 
            primary_json.appearance.ceiling_color);
    
            
        let photos_on_1 = 0,
        photos_on_2 = 0,
        photos_on_3 = 0,
        photos_on_4 = 0;
    
        // count photos on walls
        primary_json.images.forEach((image) => {
        if (image.metadata.direction == 1) { photos_on_1++; }
        else if (image.metadata.direction == 2) { photos_on_2++; }
        else if (image.metadata.direction == 3) { photos_on_3++; }
        else if (image.metadata.direction == 4) { photos_on_4++; }
        })
    
        console.log("photo_1:", photos_on_1, 
                "photo_2:", photos_on_2,
                "photo_3:", photos_on_3,
                "photo_4:", photos_on_4);
    
        // turn string value of brightness into a value we can use for brightness
        let ambient_light_intensity;
    
        if (primary_json.appearance.moodiness == "dark") {
        ambient_light_intensity = 0.5;
        } 
        else if (primary_json.appearance.moodiness == "moody dark") {
        ambient_light_intensity = 1.5;
        }
        else if (primary_json.appearance.moodiness == "moody bright") {
        ambient_light_intensity = 2.5;
        }
        else if (primary_json.appearance.moodiness == "bright") {
        ambient_light_intensity = 3.5;
        }
    
        // kind of a last minute add, but scene needs to be here for lighting, even though
        // art is not added to the scene here
        // ambient_light_intensity is added for safety in light creation
        const art = createArt(texture_loader, 
        photos_on_1, photos_on_2, photos_on_3, photos_on_4, 
        gallery_width, gallery_length, gallery_height, wall_offset, 
        ambient_light_intensity, scene);
    
        const ambient_light = createAmbientLight(primary_json.appearance.ambient_light_color, ambient_light_intensity);
        scene.add(ambient_light);
    


        setupEventListeners(controls);
        controls.addEventListener('lock', hideMenu);
        controls.addEventListener('unlock', showMenu);

        
        createBoundingBoxes(walls);
    
        addObjectsToScene(scene, art);
    
    
        setupRendering(scene, camera, renderer, art, controls, walls, gallery_width, gallery_length, controlsEnabled);
    
        containerRef.current.appendChild(renderer.domElement);
    
        playButtonRef.current.addEventListener('click', () => {
            enableControls(controls);
            hideMenu();
        });

        console.log("controls", controls);

        return () => {
            console.log("Running cleanup");
            containerRef.current?.removeChild(containerRef.current.firstChild);
        }

    }, []);
        
    return (
        <>
        <div className="background_menu">
            <div id="menu" ref={menuRef}>
                <div id="image_container">
                    <img src="./images/wall.jpg" alt="Menu Picture" />
                </div>

                <div id="content">
                    <h1>Art Gallery</h1>
                    <div>
                        <p>Curated by STUDENT NAME</p>
                        <p>Interactive 3D Gallery of the GALLERY NAME</p>
                        
                    </div>

                    <div>
                        <p>Instructions</p>
                        <p>Use Arrow Keys or WASD to Move</p>
                        <p>Look with mouse</p>
                    </div>

                    <div id="play_button" ref={playButtonRef}>
                        <p>Enter Gallery</p>
                    </div>
                    <div id="copyright_info">
                        <p>Made with Three.js and Vite</p>
                    </div>
                </div>
            </div>
        </div>

        <div ref={containerRef}>

        </div>


        <div id="painting-info"></div>

        </>
    )
}

export default ExhibitionViewer;