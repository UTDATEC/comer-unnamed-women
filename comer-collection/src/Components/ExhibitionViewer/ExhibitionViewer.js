import { Component, createElement, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
// import primary_json from './example2.json' // assert { type: "json" };

// import { scene, setupScene,	 addObjectsToScene } from './Scene.js';
// import { addObjectsToScene, setupScene } from './js/Scene';

import { setupMainWalls, setupSideWalls, setupWalls } from './js/Walls';
import { setupFloor } from './js/Floor';
import { setupCeiling } from './js/Ceiling';
import { createArt } from './js/Art';
import { createAmbientLight } from './js/Lighting';
import { createBoundingBoxes } from './js/BoundingBox';
import { setupEventListeners } from './js/EventListener';
import { setupRendering } from './js/Render';
import  staticImages  from './js/StaticImages';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, Menu, Stack, Typography } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit"
import {PointerLockControls} from 'three-stdlib';
import VisibilityIcon from '@mui/icons-material/Visibility';



const getAmbientLightIntensity = (moodiness) => {
    switch (moodiness) {
        case "dark":
            return 0.5;
        case "moody dark":
            return 1.5;
        case "moody bright":
            return 2.5;
        case "bright":
            return 3.5;
        default:
            return 1.5;
    }

}

const get_canvas_dimensions = (boundingBoxElement) => {
    if(boundingBoxElement) {
        const { height: canvas_height, width: canvas_width } = boundingBoxElement?.getBoundingClientRect();
        return [canvas_height, canvas_width];
    }
    return [0, 0];
}


const ExhibitionViewer = ({exhibitionState: primary_json, exhibitionMetadata, exhibitionIsLoaded, exhibitionIsEditable, globalImageCatalog, editModeActive, setEditModeActive}) => {

        
    const containerRef = useRef(null);
    const canvasRef = useRef(null);


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

    const [canvasDimensions, setCanvasDimensions] = useState({
        width: null,
        height: null
    })


    const [dialogIsOpen, setDialogIsOpen] = useState(true);

    const restoreMenu = () => {
        setDialogIsOpen(true);
    }

    const handleWindowResize = () => {
        if(containerRef.current) {
            const [canvas_height, canvas_width] = get_canvas_dimensions(containerRef.current);
            setCanvasDimensions({
                width: canvas_width,
                height: canvas_height
            })
        }
    }

    useEffect(() => {

        if(exhibitionIsLoaded) {

            const scene = new THREE.Scene();
    
            if(!containerRef || !containerRef.current){
                return;
            }
    
            // let { camera, controls, renderer } = setupScene(scene, containerRef.current);

            let [canvas_height, canvas_width] = get_canvas_dimensions(containerRef.current);
    
            // camera set up
            let camera = new THREE.PerspectiveCamera(
                60, // field of view: 60-90 is normal for viewing on a monitor
                canvas_width / canvas_height, // aspect ratio: assumption that ar should be the current window size
                0.1,  // near setting for camera frustum
                1000 // far setting for camera frustum
            );
        
            scene.add(camera);
        
            // set camera slighly back from middle of gallery
            camera.position.set(0, 0, 5);
        
            // enable antialiasing
            let renderer = new THREE.WebGLRenderer({
                antialias: true
            });
        
            // set initial canvas size
            renderer.setSize(canvas_width, canvas_height);
            
        
            // render options
        
            // it says .outputEncoding is deprecated, but it is still usable! 
            // It is very important to keep this in as the colors of the scene will look very unsaturated/grayed without it. 
            // console will say use .outputColorSpace instead, but this does not work and will unsaturate the scene
            renderer.outputEncoding = THREE.SRGBColorSpace;
        
            // add mouse controls
            let controls = new PointerLockControls(camera, renderer.domElement);
            scene.add(controls.getObject());
        
            // resize window when window is resized
            window.addEventListener('resize', handleWindowResize);


            setMyRenderer(renderer);
            setMyCamera(camera);
            setMyScene(scene);
            setMyControls(controls);
            
    
            controls.addEventListener('unlock', restoreMenu);
    
            const texture_loader = new THREE.TextureLoader();
            setMyTextureLoader(texture_loader);
    
    
            return () => {
                console.log("Running cleanup"); 
                controls.removeEventListener('unlock', restoreMenu);
                setMyRenderer(null);
                setMyCamera(null);
                setMyScene(null);
                setMyControls(null);  
    
            }
            
        }


    }, [exhibitionIsLoaded]);



    useEffect(() => {
        handleWindowResize();
    }, [editModeActive])



    useEffect(() => {
        if(myCamera && myRenderer) {
            myCamera.aspect = canvasDimensions.width / canvasDimensions.height;
            myCamera.updateProjectionMatrix();
            myRenderer.setSize(canvasDimensions.width, canvasDimensions.height);
            myRenderer.render(myScene, myCamera);
        }
    }, [canvasDimensions])


    // function to re-render scene when camera is rotated
    const handleControlsChange = () => {
                
        // get delta for accurate movement
        // const delta = clock.getDelta();
        
        // update position as player moves
        // updateMovement(delta, controls, camera, walls, setCameraPosition);

        myRenderer.render(myScene, myCamera);

    };

    const logKeyEvent = (e) => {
        console.log(e)
    }

    // set up event handlers for camera rotation
    useEffect(() => {
    
        if(canvasRef.current && myScene) {
            
            canvasRef.current.appendChild(myRenderer.domElement);
            canvasRef.current.addEventListener('click', () => {
                myControls.lock();
            })
            myControls.addEventListener('change', handleControlsChange);

            return () => {
                console.log("myScene", myScene);
                myControls.removeEventListener('change', handleControlsChange);
                if(canvasRef.current)
                    canvasRef.current.removeChild(myRenderer.domElement);
            } 
        }
    }, [myControls, myScene, myRenderer]) 


    useEffect(() => {

        if(myScene) {

            console.log("Images updated")
                
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
        
        
            // kind of a last minute add, but scene needs to be here for lighting, even though
            // art is not added to the scene here
            // ambient_light_intensity is added for safety in light creation
            const all_arts_group = createArt(myTextureLoader, 
            photos_on_1, photos_on_2, photos_on_3, photos_on_4, 
            primary_json.size.width_ft, primary_json.size.length_ft, primary_json.size.height_ft, 1/12, 
            getAmbientLightIntensity(primary_json.appearance.moodiness), myScene, myRenderer, myCamera, primary_json, globalImageCatalog);
        
        
        
            setupRendering(myScene, myCamera, myRenderer, all_arts_group.children, myControls, primary_json.size.width_ft, primary_json.size.length_ft);



            return () => {
                myScene.remove(all_arts_group);
            }
        
        }

    }, [myCamera, myControls, myScene, myTextureLoader, myRenderer,
        primary_json.images,
        primary_json.size
    ])



    // Update main wall color
    useEffect(() => {
        if(myScene) { 
            const mainWalls = setupMainWalls(myScene, myTextureLoader, 
                primary_json.size.width_ft, primary_json.size.length_ft, primary_json.size.height_ft, 5, primary_json.appearance.main_wall_color, myRenderer, myCamera);

            createBoundingBoxes(mainWalls);

            return () => {
                myScene.remove(mainWalls);
            }
        }
    }, [myCamera, myControls, myScene, myTextureLoader, myRenderer,
        primary_json.appearance.main_wall_color,
        primary_json.size
    ])

    // Update side wall color
    useEffect(() => {
        if(myScene) { 
            const sideWalls = setupSideWalls(myScene, myTextureLoader, 
                primary_json.size.width_ft, primary_json.size.length_ft, primary_json.size.height_ft, 5, primary_json.appearance.side_wall_color, myRenderer, myCamera);
    
            createBoundingBoxes(sideWalls);

            return () => {
                myScene.remove(sideWalls);
            }
        }
    }, [myCamera, myControls, myScene, myTextureLoader, myRenderer,
        primary_json.appearance.side_wall_color,
        primary_json.size
    ])

    // Update floor
    useEffect(() => {
        if(myScene) {
            const floor = setupFloor(myScene, myTextureLoader, 
                primary_json.size.width_ft, primary_json.size.length_ft, 5, 
                primary_json.appearance.floor_color, primary_json.appearance.floor_texture, myRenderer, myCamera);
            
            return () => {
                myScene.remove(floor);
            }
        }
    }, [myCamera, myControls, myScene, myTextureLoader, myRenderer,
        primary_json.appearance.floor_color,
        primary_json.appearance.floor_texture,
        primary_json.size
    ])

    // Update ceiling
    useEffect(() => {
        if(myScene) {
            const ceiling = setupCeiling(myScene, myTextureLoader, 
                primary_json.size.width_ft, primary_json.size.length_ft, primary_json.size.height_ft, 
                primary_json.appearance.ceiling_color, myRenderer, myCamera);
            
            return () => {
                myScene.remove(ceiling);
            }
        }
    }, [myCamera, myControls, myScene, myTextureLoader, myRenderer,
        primary_json.appearance.ceiling_color,
        primary_json.size
    ])



    useEffect(() => {
        console.log("Ambient light updated", primary_json.appearance.moodiness, getAmbientLightIntensity(primary_json.appearance.moodiness));
        if(myScene) {
            const ambient_light = new THREE.AmbientLight(primary_json.appearance.ambient_light_color, getAmbientLightIntensity(primary_json.appearance.moodiness));
            myScene.add(ambient_light); 
            myRenderer.render(myScene, myCamera);

            return () => {
                myScene.remove(ambient_light); 
            }
            
        }
    }, [myCamera, myControls, myScene, myTextureLoader, myRenderer,
        primary_json.appearance.ambient_light_color, primary_json.appearance.moodiness])




    return (
        <Box width="100%" height="calc(100vh - 64px)" ref={containerRef} sx={{position: "relative"}}>
            <div id="exhibition-canvas" ref={canvasRef}>
            </div>
            {exhibitionIsEditable && (
                <Fab variant="extended" color="primary" sx={{position: "absolute", right: 20, bottom: 20, zIndex: 1500}}
                onClick={() => {
                    if(editModeActive) {
                        setEditModeActive(false);
                    }
                    else {
                        setEditModeActive(true);
                    }
                }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        {editModeActive && (
                            <VisibilityIcon fontSize="large" />
                        ) || !editModeActive && (
                            <EditIcon fontSize="large" />
                        )}
                        <Typography variant="h6">
                            {editModeActive ? "Preview" : "Edit"}
                        </Typography>
                    </Stack>
                </Fab>
            )}
            {!editModeActive && (<ExhibitionIntro {...{dialogIsOpen, setDialogIsOpen}} controls={myControls} {...{exhibitionMetadata}} />)}
            <div id="art-info"></div>
            
        </Box>
    )
}


const ExhibitionIntro = ({exhibitionMetadata, controls, dialogIsOpen, setDialogIsOpen}) => {
        
    const selectedImageKey = './logo.png'; // Replace this with the desired key
    const selectedImageSrc = staticImages[selectedImageKey];

    return (
        <Dialog open={dialogIsOpen} className="background_menu" fullWidth maxWidth="md"
            hideBackdrop disablePortal
            sx={{position: "absolute"}}>
            <DialogContent>
                <Stack alignItems="center" spacing={2}>
                    <img src={selectedImageSrc} style={{maxWidth: "200px"}}/>
                    <Typography variant="h4">{exhibitionMetadata.title}</Typography>
                    {exhibitionMetadata.curator && (
                        <Typography variant="h5">Curated by {exhibitionMetadata.curator}</Typography>
                    )}
                    {/* <Typography>Photos in this exhibition are from The University of Texas at Dallas' Comer Collection</Typography> */}
                        
                    <Stack sx={{opacity: 0.5}} alignItems="center">
                        <Typography>Controls are paused while you're in this menu.</Typography>
                        <Typography>This menu will reappear whenever you press 'Escape.'</Typography>
                        <Typography>Explore the gallery using the 'W A S D' or arrow keys on your keyboard.</Typography>
                        <Typography>Take a look around and turn by using your mouse or mousepad.</Typography>
                        <Typography>Left click near an artwork to be positioned in front of the piece.</Typography>
                    </Stack>
                    <Button variant="contained" color="primary" size="large" id="play_button" 
                        onClick={() => {
                            setDialogIsOpen(false);
                            controls.lock();
                        }}
                    >
                        <Typography variant="h6">Enter Exhibition</Typography>
                    </Button>
                </Stack>

                <div>
                </div>

            </DialogContent>
            <DialogActions>

            </DialogActions>
        </Dialog>
    )
}

export default ExhibitionViewer;