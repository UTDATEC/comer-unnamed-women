import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { setupMainWalls, setupSideWalls } from './js/Walls';
import { setupFloor } from './js/Floor';
import { setupCeiling } from './js/Ceiling';
import { createArt } from './js/Art';
import { createBoundingBoxes } from './js/BoundingBox';
import staticImages from './js/StaticImages';
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, Divider, Fab, Paper, Stack, Typography } from '@mui/material';
import { PointerLockControls } from 'three-stdlib';
import { EditIcon, VisibilityIcon } from '../IconImports';
import { useTheme } from '@emotion/react';



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


    const [keysPressed, setKeysPressed] = useState({
        arrowup: false,
        arrowdown: false,
        arrowleft: false,
        arrowright: false,
        w: false,
        a: false,
        s: false,
        d: false,
    });


    const [myRenderer, setMyRenderer] = useState(null);
    const [myScene, setMyScene] = useState(null);
    const [myCamera, setMyCamera] = useState(null);
    const [myControls, setMyControls] = useState(null);
    const [myTextureLoader, setMyTextureLoader] = useState(null);
    const [myClock, setMyClock] = useState(null);
    const [myArtPositionsByImageId, setMyArtPositionsByImageId] = useState(null);
    const [infoMenuImageId, setInfoMenuImageId] = useState(null);

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

    const handleKeydown = (e) => {
        const keyPressed = e.key.toLowerCase();
        if(keyPressed in keysPressed) {
            setKeysPressed({...keysPressed, [keyPressed]: true})
        }
    }

    const handleKeyup = (e) => {
        const keyPressed = e.key.toLowerCase();
        if(keyPressed in keysPressed) {
            setKeysPressed({...keysPressed, [keyPressed]: false})
        }
    }


    useEffect(() => {

        if(exhibitionIsLoaded) {

            const scene = new THREE.Scene();
    
            if(!containerRef || !containerRef.current){
                return;
            }
    
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
            camera.position.set(0, 0, primary_json.size.length_ft / 4);
            camera.updateProjectionMatrix();
        
            // enable antialiasing
            let renderer = new THREE.WebGLRenderer({
                antialias: true
            });
        
            // set initial canvas size
            renderer.setSize(canvas_width, canvas_height);
            
        
            // render options
        
            renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
        
            // add mouse controls
            let controls = new PointerLockControls(camera, renderer.domElement);
            scene.add(controls.getObject());
        
            // resize window when window is resized
            window.addEventListener('resize', handleWindowResize);
            
            const clock = new THREE.Clock();
            clock.getDelta();


            setMyRenderer(renderer);
            setMyCamera(camera);
            setMyScene(scene);
            setMyControls(controls);
            setMyClock(clock);

    
            controls.addEventListener('unlock', restoreMenu);

            window.addEventListener('keydown', handleKeydown);
            window.addEventListener('keyup', handleKeyup);
    
            const texture_loader = new THREE.TextureLoader();
            setMyTextureLoader(texture_loader);
    
    
            return () => {
                controls.removeEventListener('unlock', restoreMenu);
                window.removeEventListener('keydown', handleKeydown);
                window.removeEventListener('keyup', handleKeyup);
                setMyRenderer(null);
                setMyCamera(null);
                setMyScene(null);
                setMyControls(null);  
    
            }
            
        }


    }, [exhibitionIsLoaded]);


    // Manage movement based on key presses
    // and constrain camera position to exhibition boundaries
    useEffect(() => {
        const distance_threshold = 5;

        // manage camera movement
        if(myControls?.isLocked) {
            const factor = 5;
            let delta = myClock.getDelta();
            let speed;
            if(delta > 0.05) {
                delta = myClock.getDelta();
                speed = 0.05
            } else {
                speed = delta;
            }
            switch (true) {
                case keysPressed.d:
                case keysPressed.arrowright:
                    myControls.moveRight(factor * speed);
                    break;
                case keysPressed.a:
                case keysPressed.arrowleft:
                    myControls.moveRight(-factor * speed);
                    break;
                case keysPressed.w:
                case keysPressed.arrowup:
                    myControls.moveForward(factor * speed);
                    break;
                case keysPressed.s:
                case keysPressed.arrowdown:
                    myControls.moveForward(-factor * speed);
                    break;
                default:
                    break;
            }
        }

        // manage camera constraints
        const minDistanceFromWalls = 1;
        const minZ = -primary_json.size.length_ft / 2 + minDistanceFromWalls;
        const maxZ = primary_json.size.length_ft / 2 - minDistanceFromWalls;
        const minX = -primary_json.size.width_ft / 2 + minDistanceFromWalls;
        const maxX = primary_json.size.width_ft / 2 - minDistanceFromWalls;
        if(myCamera && myRenderer) {
            switch (true) {
                case myCamera.position.z < minZ:
                    myCamera.position.z = minZ;
                    break;
                case myCamera.position.z > maxZ:
                    myCamera.position.z = maxZ;
                    break;
                default:
                    break;
            }
            switch (true) {
                case myCamera.position.x < minX:
                    myCamera.position.x = minX;
                    break;
                case myCamera.position.x > maxX:
                    myCamera.position.x = maxX;
                    break;
                default:
                    break;
            }
            myCamera.updateProjectionMatrix();
            myRenderer.render(myScene, myCamera);
        }

        // manage art info display
        let closeImage = null;
        for(const [image_id, image_position] of Object.entries(myArtPositionsByImageId ?? {})) {
            const distance_to_art = myCamera.position.distanceTo(image_position);
            if(distance_to_art < distance_threshold) {
                closeImage = image_id;
            }
        }
        setInfoMenuImageId(closeImage)


    }, [keysPressed, myCamera?.position.x, myCamera?.position.z, primary_json.size, primary_json.images]);



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
        myRenderer.render(myScene, myCamera);
    };


    // set up event handlers for camera rotation
    useEffect(() => {
    
        if(canvasRef.current && myScene) {
            
            canvasRef.current.appendChild(myRenderer.domElement);
            canvasRef.current.addEventListener('click', () => {
                myControls.lock();
            })
            myControls.addEventListener('change', handleControlsChange);

            return () => {
                myControls.removeEventListener('change', handleControlsChange);
                if(canvasRef.current)
                    canvasRef.current.removeChild(myRenderer.domElement);
            } 
        }
    }, [myControls, myScene, myRenderer]) 


    useEffect(() => {

        if(myScene) {

                
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
            const {all_arts_group, artPositionsByImageId} = createArt(myTextureLoader, 
            photos_on_1, photos_on_2, photos_on_3, photos_on_4, 
            primary_json.size.width_ft, primary_json.size.length_ft, primary_json.size.height_ft, 1/12, 
            getAmbientLightIntensity(primary_json.appearance.moodiness), myScene, myRenderer, myCamera, primary_json, globalImageCatalog);
        
            setMyArtPositionsByImageId(artPositionsByImageId);
        
            // setupRendering(myScene, myCamera, myRenderer, all_arts_group.children, myControls, primary_json.size.width_ft, primary_json.size.length_ft);



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
                primary_json.size.width_ft, primary_json.size.length_ft, primary_json.size.height_ft, 5, primary_json.appearance.main_wall_color, myRenderer, myCamera, true);

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
                primary_json.size.width_ft, primary_json.size.length_ft, primary_json.size.height_ft, 5, primary_json.appearance.side_wall_color, myRenderer, myCamera, true);
    
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
                primary_json.appearance.floor_color, primary_json.appearance.floor_texture, myRenderer, myCamera, true);
            
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
                primary_json.appearance.ceiling_color, myRenderer, myCamera, true);
            
            return () => {
                myScene.remove(ceiling);
            }
        }
    }, [myCamera, myControls, myScene, myTextureLoader, myRenderer,
        primary_json.appearance.ceiling_color,
        primary_json.size
    ])



    useEffect(() => {
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
            <ArtInfoPopup {...{globalImageCatalog}} exhibitionState={primary_json} image_id={infoMenuImageId} />
            
        </Box>
    )
}


const ArtInfoPopup = ({globalImageCatalog, image_id, exhibitionState}) => {
    const infoFromCatalog = globalImageCatalog.find((i) => i.id == image_id);
    const infoFromExhibition = exhibitionState.images.find((i) => i.image_id == image_id);
    return (
        <Card raised={true} component={Paper} sx={{
            position: "absolute", 
            top: 10, left: 10, 
            width: "calc(30vw - 90px)",
            opacity: 0.8,
            visibility: image_id ? "" : "hidden"
        }}>
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="h5">{infoFromCatalog?.title}</Typography>
                    {infoFromCatalog?.Artists.length > 0 && (
                        <Stack>
                            {infoFromCatalog?.Artists.map((a) => (
                                <Typography key={a.id}>{a.safe_display_name}</Typography>
                            ))}
                        </Stack>
                    )}
                    {(infoFromCatalog?.year) && (
                        <>
                            <Divider />
                            <Typography>{infoFromCatalog?.year}</Typography>
                        </>
                    )}
                    {(infoFromExhibition?.metadata.description) && (
                        <>
                            <Divider />
                            <Typography>{infoFromExhibition?.metadata.description}</Typography>
                        </>
                    )}
                    {(infoFromExhibition?.metadata.additional_information) && (
                        <>
                            <Divider />
                            <Typography>{infoFromExhibition?.metadata.additional_information}</Typography>
                        </>
                    )}
                </Stack>
            </CardContent>
        </Card>
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
                    <img src="/images/logo_square_orange.png" style={{maxWidth: "200px"}}/>
                    <Typography variant="h4">{exhibitionMetadata.title}</Typography>
                    {exhibitionMetadata.curator && (
                        <Typography variant="h5">Curated by {exhibitionMetadata.curator}</Typography>
                    )}
                        
                    <Stack sx={{opacity: 0.5}} alignItems="center">
                        <Typography>Controls are paused while you're in this menu.</Typography>
                        <Typography>This menu will reappear whenever you press 'Escape.'</Typography>
                        <Typography>Explore the gallery using the 'W A S D' or arrow keys on your keyboard.</Typography>
                        <Typography>Take a look around and turn by using your mouse or mousepad.</Typography>
                    </Stack>
                    <Button variant="contained" color="grey" size="large" id="play_button" 
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