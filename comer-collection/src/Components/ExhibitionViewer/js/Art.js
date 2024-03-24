import * as THREE from "three";

import { createFrame } from "./Frames.js";
import { createMatte } from "./Matte.js";
import { createSpotlight } from "./Lighting.js";

export function generateArtData(primary_json, globalImageCatalog) {

    const art_data = [];

    // copy all the data from json
    primary_json.images.forEach((image) => {

        const catalogEntry = globalImageCatalog.find((i) => i.id == image.image_id);
        if(!catalogEntry)
            return;

        const item = {

            image_id: image.image_id,

            img_src: `${process.env.REACT_APP_API_HOST}/api/public/images/${image.image_id}/download` ?? "/images/image_coming_soon.png",

            position: {
                custom_x: image.position.custom_x,
                custom_y: image.position.custom_y,
                custom_position: image.position.custom_position
            },

            size: {
                width: parseFloat(catalogEntry.width),
                height: parseFloat(catalogEntry.height)
            },

            matte: {
                color: image.matte.color,
                weighted: image.matte.weighted,
                weighted_value: image.matte.weighted_value
            },

            frame: {
                custom: image.frame.custom,
                width: image.frame.width, 
                height: image.frame.height,
                color: image.frame.color
            },

            light: {
                intensity: image.light.intensity,
                color: image.light.color
            },

            metadata: {
                title: image.metadata.title,
                artist: image.metadata.artist,
                description: image.metadata.description,
                year: image.metadata.year,
                medium: image.metadata.medium,
                additional_information: image.metadata.additional_information,
                direction: image.metadata.direction
            }
        };

        // add item to array of data
        art_data.push(item);
    });

    // return art data
    return art_data;
}



export function createArt(texture_loader, photos_on_1, photos_on_2, photos_on_3, photos_on_4, 
    gallery_width, gallery_length, gallery_height, wall_offset, 
    ambient_light_intensity, scene, renderer, camera, primary_json, globalImageCatalog) {
    

    const artPositionsByImageId = {};

    // create a place to store all of the art in gallery
    const all_arts_group = new THREE.Group();
    scene.add(all_arts_group);

    // counters for placing photos in default positions
    let photos_placed_1 = 1, 
        photos_placed_2 = 1,
        photos_placed_3 = 1,
        photos_placed_4 = 1;

    // get art data
    const art_data = generateArtData(primary_json, globalImageCatalog);

    // hard coded because hex color math does not work with variables
    // we can just assume that they should be black
    // possibly work on in the future (this will be a permanent solution)
    const primary_frame_color = 0x444444;
    const secondary_frame_color = 0x000000;

    // create a height just under ceiling to place lights
    const gallery_height_offset = gallery_height - (1 / 12);
    
    // create mesh from images, place them, rotate them
    art_data.forEach((data) => {

        // grab the texture and apply that texture to a material (lambert has lighting effects applied to it)
        texture_loader.load(data.img_src, (texture) => {

            const material = new THREE.MeshLambertMaterial({ map: texture }); // map texture to a material
    
            // convert material into mesh with proper dimensions
            const art = new THREE.Mesh(
                new THREE.PlaneGeometry((data.size.width / 12), (data.size.height / 12)),
                material
            );

    
            // if frame color is null, give it the default color
            if (data.frame.color == null) {
                data.frame.color = primary_frame_color;
            }
    
            // create frame
            let frame = new THREE.Object3D;
    
            // if there is something wrong/there is no value, use a default generation method
            if (data.frame.width == 0 || data.frame.width == null ||
                data.frame.height == 0 || data.frame.height == null) {
    
                // data.border.frame == false means there is no custom frame
                if (data.frame.custom == false) {
    
                    // 20x16 frame will fit, update values for positional math
                    if (data.size.width < 20 && data.size.height < 16) {
                        // console.log("Photo had no default frame size and fits 20x16");
    
                        // create 20x16
                        frame = createFrame(20, 16, 
                            data.frame.color, secondary_frame_color);
    
                        // update values to be in line with default frame
                        data.frame.width = 20;
                        data.frame.height = 16;
                    }
        
                    // 16x20 frame will fit, update values for positional math
                    else if (data.size.width < 16 && data.size.height < 20 ) {
                        // console.log("Photo had no default frame size and fits 16x20");
    
                        // create 16x20
                        frame = createFrame(16, 20, 
                            data.frame.color, secondary_frame_color);
    
                        // update values to be in line with default frame
                        data.frame.width = 16;
                        data.frame.height = 20;
                    }
        
                    // 36x24 frame will fit, update values for positional math
                    else if (data.size.width < 36 && data.size.height < 24) {
                        // console.log("Photo had no default frame size and fits 36x24");
    
                        // create 36x24
                        frame = createFrame(36, 24, 
                            data.frame.color, secondary_frame_color);
    
                        // update values to be in line with default frame
                        data.frame.width = 36;
                        data.frame.height = 24;
                    }
    
                    // 24x36 frame will fit, update values for positional math
                    else if (data.size.width < 24 && data.size.height < 36) {
                        // console.log("Photo had no default frame size and fits 24x36");
    
                        // create 24x36
                        frame = createFrame(24, 36, 
                            data.frame.color, secondary_frame_color);
    
                        // update values to be in line with default frame
                        data.frame.width = 24;
                        data.frame.height = 36;
                    }
    
                    // there is no custom frame and no default fits, create large custom frame
                    // update values for positional math
                    else {
                        // console.log("Photo had no default frame size and exceeds normal size bounds");
    
                        // create larger frame
                        frame = createFrame(data.size.width + 3, data.size.height + 3, 
                            data.frame.color, secondary_frame_color);
    
                        // update values to be in line with larger frame
                        data.frame.width = data.size.width + 3;
                        data.frame.height = data.size.height + 3;
                    }
                }
    
                // theoretically, this should never happen
                // it 'has' a custom frame, but one of the values was null or zero
                else if (data.frame.custom == true) {
                    // console.log("Photo frame is in a nonexsitent state, yet this value is true. Creating frame anyways");
    
                    // create a value to make a frame with where there is a 0 or null value
                    if (data.frame.width == 0 || data.frame.width == null) {
                        data.frame.width = data.size.width + 3;
                    }
                    if (data.frame.height == 0 || data.frame.height == null) {
                        data.frame.height = data.size.height + 3;
                    }
    
                    // create frame
                    frame = createFrame(data.frame.width, data.frame.height, 
                        data.frame.color, secondary_frame_color);
                } 
            }
    
            // there is a custom frame, use directly from json
            else if (data.frame.custom == true) {
                // console.log("Photo had a frame assigned in .json file")
    
                // create frame with the custom values
                frame = createFrame(data.frame.width, data.frame.height, 
                    data.frame.color, secondary_frame_color);
            }
    
            // catch statement, in case the json had incorrect type/value
            // also theoretically impossible to happen
            else {
                // console.log("Frame did not follow normal conventions. Attempting to create frame using stored values");
    
                // attempt to create one from values in json
                try {
                    frame = createFrame(data.frame.width, data.frame.height, 
                        data.frame.color, secondary_frame_color);
                }
    
                // if there was an error, create a 40x40 frame with basic values and hope that works for that photo
                catch(error) {
                    // console.log("Error found, creating large frame.");
                    frame = createFrame(40, 40, 
                        primary_frame_color, secondary_frame_color);
                }
            }
    
            // create the matte 
            // need code to set a regular matte color when value is null
            const matte = createMatte(data.frame.width, data.frame.height, data.matte.color);
    
            // create a group for photo, matte, and frame
            let art_group = new THREE.Group();
    
            // add photo, matte, and frame to the group
            art_group.add(art);
            art_group.add(frame);
            art_group.add(matte);
            
            // front wall art placement
            if (data.metadata.direction == 1) {
    
                // custom position check
                if (data.position.custom_position == true) {
                    art_group.position.set(data.position.custom_x,  // set x
                        data.position.custom_y,                     // set y
                        -((gallery_length / 2) - wall_offset));     // set z - z does not change, this is distance from wall
                }
    
                // default position
                else {
                    art_group.position.set(
                        (photos_placed_1 / (photos_on_1 + 1)) * gallery_width - (gallery_width / 2),    // set each photo on the wall to be evenly spaced from photographic midpoint
                        0,                                                                              // set y - set at eyelevel
                        -((gallery_length / 2) - wall_offset));                                         // set z - z does not change, this is distance from wall
    
                }
    
                photos_placed_1++; // add one to counter, even if this photo is using a custom position, this is required for defaults
            }
    
            // right wall art placement
            else if (data.metadata.direction == 2) {
    
                // custom position check
                if (data.position.custom_position == true) {
                    art_group.position.set(((gallery_width / 2) - wall_offset), // set x - x does not change, this is distance from wall
                        data.position.custom_y,                  // set y
                        data.position.custom_x);                 // set z (left right adjustment)
                }
    
                // default position
                else {
                    art_group.position.set(
                        ((gallery_width / 2) - wall_offset),                                            // set x - x does not change, this is distance from wall
                        0,                                                                              // set y - set at eyelevel
                        (photos_placed_2 / (photos_on_2 + 1)) * gallery_length - (gallery_length / 2)); // set z - sets each photo evenly spaced from by photographic midpoint
                }
    
                photos_placed_2++; // add one to counter, even if this photo is using custom position, it is required for defaults
                art_group.rotation.y = -Math.PI / 2; // rotate 90 degrees in radians
            }
    
            // back wall art placement
            else if (data.metadata.direction == 3) {
    
                // custom position check
                if (data.position.custom_position == true) {
                    art_group.position.set(-data.position.custom_x, // set x
                        data.position.custom_y,                     // set y
                        ((gallery_length / 2) - wall_offset));      // set z - z does not change, this is distance from wall
                }
    
                // default position
                else {
                    art_group.position.set(
                        -((photos_placed_3 / (photos_on_3 + 1)) * gallery_width - (gallery_width / 2)), // set x - x does not change, this is distance from wall
                        0,                                                                              // set y - set at eyelevel
                        ((gallery_length / 2) - wall_offset));                                          // set z - sets each photo evenly spaced from by photographic midpoint
                }
    
                photos_placed_3++; // add one to counter, even if this photo is using custom position, it is required for defaults
                art_group.rotation.y = Math.PI; // rotate 180 degrees in radians
            }
    
            // left wall art placement
            else if (data.metadata.direction == 4) {
    
                // custom position check
                if (data.position.custom_position == true) {
                    art_group.position.set(-((gallery_width / 2) - wall_offset), // set x - x does not change, this is distance from wall
                        data.position.custom_y,                                     // set y
                        -data.position.custom_x);                                    // set z
                }
    
                // default position
                else {
                    art_group.position.set(-((gallery_width / 2) - wall_offset),                        // set x - x does not change, this is distance from wall
                        0,                                                                                  // set y - set at eyelevel
                        -((photos_placed_4 / (photos_on_4 + 1)) * gallery_length - (gallery_length / 2)));  // set z - sets each photo evenly spaced from by photographic midpoint
                }
    
                photos_placed_4++; // add one to counter, even if this photo is using custom position, it is required for defaults
                art_group.rotation.y = Math.PI / 2; // rotate 90 degrees in radians 
            }
    
            // important information for other functionalities
            art_group.user_data = {
                image_id: data.image_id,
                type: "photograph",
                info: data.metadata,
                width: data.size.width,
                height: data.size.height
            };

            artPositionsByImageId[data.image_id] = art_group.position;
    
            // adjust each item to fix texture fighting
            art.position.set(0, 0, -(1 / 96));
            frame.position.set(0, -((data.frame.height + 1) / 2) / 12, 0);
            matte.position.set(0, 0, -(1 / 48));
    
            // move the art if the curator designated they wanted a weighted matte
            if (data.matte.weighted == true) {
                art.position.set(0, ((data.frame.height / 12) - (data.size.height / 12)) / 4, 0);
    
                // if there has been an adjustment to the weight, make the adjustment
                if (data.matte.weighted_value != 0) {
                    art.position.set(0, data.matte.weighted_value / 12, 0);
                }
            }
    
            // if intensity does not fit any of the requirements, make it one above the ambient lighting
            if (data.light.intensity <= 0 || 
                data.light.intensity == null || 
                data.light.intensity < ambient_light_intensity) {
                
                data.light.intensity = ambient_light_intensity + 1;
            }
    
            // default to white if it is null
            if (data.light.color == null) {
                data.light.coolor = 0xffffff;
            }
    
            // create spotlight
            let spotlight = createSpotlight(data.light.intensity, data.light.color, art_group.position, gallery_height_offset, scene, data.metadata.direction);
    
            // add art to the group
            all_arts_group.add(art_group);
            // scene.add(spotlight);
            all_arts_group.add(spotlight);

            renderer.render(scene, camera);

        }, null, () => {
            console.log("error placing image", data);

        }); // convert image into texture
    });

    if(primary_json.images == 0)
        renderer.render(scene, camera);

    return {all_arts_group, artPositionsByImageId};
}