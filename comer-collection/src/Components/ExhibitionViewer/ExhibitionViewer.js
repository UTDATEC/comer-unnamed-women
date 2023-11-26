import { Component, createElement, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
// import primary_json from './example2.json' // assert { type: "json" };

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
import  staticImages  from './js/StaticImages';
import { Box } from '@mui/material';

const ExhibitionViewer = ({exhibitionState: primary_json}) => {

    const [controlsEnabled, setControlsEnabled] = useState(false);
    const [menuVisible, setMenuVisible] = useState(true);
        
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const playButtonRef = useRef(null);
    const menuRef = useRef(null);

    //const [imageSrc] = useState('./images/logo.png'); // Set the default image source


    const enableControls = (controls) => {
        setControlsEnabled(true);
        controls.lock();
    }

    const disableControls = (controls) => {
        setControlsEnabled(false);
        controls.unlock();
    }
    
    
    const showMenu = () => {
        if(menuRef && menuRef.current)
            menuRef.current.style.display = 'block';
        //disableControls(controls);
    }
    
    const hideMenu = () => {
        if(menuRef && menuRef.current)
            menuRef.current.style.display = 'none';
    }


    const [cameraPosition, setCameraPosition] = useState({
        x: 0,
        y: 0,
        z: 5
    });


    const [myRenderer, setMyRenderer] = useState(null);
    const [myScene, setMyScene] = useState(null);
    const [myCamera, setMyCamera] = useState(null);
    const [myControls, setMyControls] = useState(null);
    const [myTextureLoader, setMyTextureLoader] = useState(null);

    useEffect(() => {

        const scene = new THREE.Scene();

        if(!containerRef || !containerRef.current){
            return;
        }

        let { camera, controls, renderer } = setupScene(scene, containerRef.current, cameraPosition, setCameraPosition);
        setMyRenderer(renderer);
        setMyCamera(camera);
        setMyScene(scene);
        setMyControls(controls);
        

        // controls.addEventListener('lock', hideMenu);
        // controls.addEventListener('unlock', showMenu);

        const texture_loader = new THREE.TextureLoader();
        setMyTextureLoader(texture_loader);

        // console.log(scene);
        
        return () => {
            console.log("Running cleanup");
            if(canvasRef && canvasRef.current && canvasRef.current.firstChild)
                canvasRef.current?.removeChild(canvasRef.current?.firstChild);
        }


    }, []);

    useEffect(() => {
    
        let gallery_width = primary_json.size.width_ft,       // units total in left and right directions of (0, 0, 0)
        gallery_length = primary_json.size.length_ft,     // units total in forward and back directions of (0, 0, 0)
        gallery_height = primary_json.size.height_ft -5,  // height of gallery from (0,0,0)
        gallery_depth = 5,    // depth of gallery from (0,0,0)
        wall_offset = 1 / 12; // 1 inch (1/12 of a unit) so art is 1 inch off the wall for frames
    
        
        // checking if JSON was read correctly
        // console.log("Gallery Height Total: ", gallery_height + gallery_depth, "Gallery Width: ", gallery_width, "Gallery Length: ", gallery_length);
    
    
        if(myScene) {
            
            // create gallery bounds
            const walls = setupWalls(myScene, myTextureLoader, 
                gallery_width, gallery_length, gallery_height, gallery_depth, primary_json.appearance.main_wall_color, primary_json.appearance.side_wall_color);
        
            const floor = setupFloor(myScene, myTextureLoader, 
                gallery_width, gallery_length, gallery_depth, 
                primary_json.appearance.floor_color, primary_json.appearance.floor_texture);
            
            const ceiling = setupCeiling(myScene, myTextureLoader, 
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
        
            // console.log("photo_1:", photos_on_1, "photo_2:", photos_on_2, "photo_3:", photos_on_3, "photo_4:", photos_on_4);
        
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
            const art = createArt(myTextureLoader, 
            photos_on_1, photos_on_2, photos_on_3, photos_on_4, 
            gallery_width, gallery_length, gallery_height, wall_offset, 
            ambient_light_intensity, myScene);
        
            const ambient_light = createAmbientLight(primary_json.appearance.ambient_light_color, ambient_light_intensity);
            myScene.add(ambient_light);
        
    
    
            
            createBoundingBoxes(walls);
        
            addObjectsToScene(myScene, art);
        
        
            setupRendering(myScene, myCamera, myRenderer, art, myControls, walls, gallery_width, gallery_length, controlsEnabled, setCameraPosition, containerRef.current);
            myRenderer.render(myScene, myCamera);
        
            canvasRef.current.appendChild(myRenderer.domElement);
        
            // playButtonRef.current.addEventListener('click', () => {
            //     enableControls(controls);
            //     hideMenu();
            // });
    
            if(canvasRef && canvasRef.current) {
                canvasRef.current.addEventListener('click', () => {
                    enableControls(myControls);
                    hideMenu();
                })
            }
    
            console.log("myControls", myControls);
            console.log("myCamera", myCamera);
            // console.log("controls", controls);
    
            myRenderer?.render(myScene, myCamera);
            // console.log("myRenderer", myRenderer);
            // console.log("myScene", myScene);
            // console.log("myCamera", myCamera);
            console.log("exhibition data changed");

            return () => {
                console.log("myScene", myScene);
                myScene.children = [];
            }
        }
    }, [primary_json])


    useEffect(() => {
        console.log("Camera updated", cameraPosition);
        if(cameraPosition.z != 5)
            setCameraPosition({...cameraPosition, z: 5})
        
        // if(cameraPosition.x < -gallery_length / 2)
        //     setCameraPosition({...cameraPosition, x: -gallery_length / 2})
        // else if(cameraPosition.x > gallery_length / 2)
        //     setCameraPosition({...cameraPosition, x: gallery_length / 2})
        
    }, [cameraPosition]);

        
    const selectedImageKey = './logo.png'; // Replace this with the desired key
    const selectedImageSrc = staticImages[selectedImageKey];

    return (
        <Box width="100%" height="100%" ref={containerRef}>
        <div className="background_menu">
            <div id="menu" ref={menuRef}>
                <div id="image_container">
                    <img src={selectedImageSrc}/>
                </div>

                <div id="content">
                    <h1>{primary_json.main.exhibition_name}</h1>
                    <div id="content_centered">
                        <p>Curated by {primary_json.main.curator}</p>
                        <p>Photos in this exhibition are from The University of Texas at Dallas' Comer Collection</p>
                        
                    </div>

                    <div>
                        <p><b>Welcome to {primary_json.main.curator}'s {primary_json.main.exhibition_name}</b></p>
                        <br></br>
                        <p>Controls are temporarily paused while you're in this menu.</p>
                        <ul>
                            <li>To begin the exhibition and enable controls, click 'Enter Exhibition' below.</li>
                            <li>This menu will reappear whenever you press 'Escape.'</li>
                            <li>Explore the gallery using the 'W A S D' or arrow keys on your keyboard.</li>
                            <li>Take a look around and turn by using your mouse or mousepad.</li>
                            <li>Left click near an artwork to be positioned in front of the piece.</li>
                        </ul>
                    </div>

                    <div id="play_button" ref={playButtonRef}>
                        <p>Enter Exhibition</p>
                    </div>
                </div>
            </div>
        </div>

        <div id="exhibition-canvas" ref={canvasRef}>

        </div>


        <div id="art-info"></div>

        </Box>
    )
}

export default ExhibitionViewer;