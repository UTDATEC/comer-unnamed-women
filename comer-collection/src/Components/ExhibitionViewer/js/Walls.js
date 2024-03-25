import * as THREE from "three";
import { createBoundingBoxes } from "./BoundingBox.js";

export const setupMainWalls = (scene, texture_loader, wall_width, wall_length, gallery_height, gallery_depth, main_color) => {

    return new Promise((resolve, reject) => {

        try {

            // clean up any existing main walls
            scene.children = scene.children.filter((c) => c.name != "group_main_walls");
            // create a group for walls for bounding box and adding to scene
            let wall_group = new THREE.Group();
            wall_group.name = "group_main_walls";
            scene.add(wall_group);
        
            // determine wall height
            let wall_height = gallery_height + gallery_depth;
        
            // walls need an amount >0 thickness to be visible
            let wall_thick = 0.001;
        
            // gallery is set up to be a rectangle in any form
            // we create parallel sides at a time so they can use the same loaded texture with correct wrapping specification
        
            // front and back wall texture set up
            texture_loader.load("/images/textures/wall.jpg", (wall_texture_frontback) => {
        
                wall_texture_frontback.wrapS = THREE.RepeatWrapping; // horizontal wrap
                wall_texture_frontback.wrapT = THREE.RepeatWrapping; // vertical wrap
                wall_texture_frontback.repeat.set(wall_width, wall_height); // repeat texture (width, height)
            
                // front and back wall construction
                const front_wall = new THREE.Mesh(
                    new THREE.BoxGeometry(wall_width, wall_height, wall_thick),
                    new THREE.MeshLambertMaterial({
                        map: wall_texture_frontback,
                        color: main_color,
                    }),
                );
            
                const back_wall = new THREE.Mesh(
                    new THREE.BoxGeometry(wall_width, wall_height, wall_thick),
                    new THREE.MeshLambertMaterial({
                        map: wall_texture_frontback,
                        color: main_color,
                    }),
                );
            
                // adjust walls to be in proper places according to adjacent sides
                let wall_position_adjustment_frontback = wall_length / 2;
            
                // adjust positions 
                front_wall.position.z = -wall_position_adjustment_frontback;
                back_wall.position.z = wall_position_adjustment_frontback;
            
                // adjust walls to be flush with floor and ceiling
                wall_group.position.set(0, (gallery_height - gallery_depth) / 2, 0);
            
                // add walls to the group
                wall_group.add(front_wall, back_wall);
                createBoundingBoxes(wall_group);
        
                // return walls so that BoundingBox.js can use them
                resolve(wall_group);
                
            });
        
        } catch(e) {
            reject();
        }

    });



};


export const setupSideWalls = (scene, texture_loader, wall_width, wall_length, gallery_height, gallery_depth, side_color) => {

    return new Promise((resolve, reject) => {

        try {
            // clean up any existing side walls
            scene.children = scene.children.filter((c) => c.name != "group_side_walls");
            // create a group for walls for bounding box and adding to scene
            let wall_group = new THREE.Group();
            wall_group.name = "group_side_walls";
            scene.add(wall_group); 
        
            // determine wall height
            let wall_height = gallery_height + gallery_depth;
        
            // walls need an amount >0 thickness to be visible
            let wall_thick = 0.001;
        
            // gallery is set up to be a rectangle in any form
            // we create parallel sides at a time so they can use the same loaded texture with correct wrapping specification
        
            // left and right wall texture set up
            texture_loader.load("/images/textures/wall.jpg", (wall_texture_leftright) => {
        
                wall_texture_leftright.wrapS = THREE.RepeatWrapping; // horizontal wrap
                wall_texture_leftright.wrapT = THREE.RepeatWrapping; // vertical wrap
                wall_texture_leftright.repeat.set(wall_length, wall_height); // repeat texture (width, height)
            
                // left and right wall construction
                const left_wall = new THREE.Mesh(
                    new THREE.BoxGeometry(wall_length, wall_height, wall_thick),
                    new THREE.MeshLambertMaterial({
                        map: wall_texture_leftright,
                        color: side_color,
                    }),
                );
            
                const right_wall = new THREE.Mesh(
                    new THREE.BoxGeometry(wall_length, wall_height, wall_thick),
                    new THREE.MeshLambertMaterial({
                        map: wall_texture_leftright,
                        color: side_color,
                    }),
                );
            
                // adjust walls to be in proper places according to adjacent sides
                let wall_position_adjustment_leftright = wall_width / 2;
            
                // adjust positions 
                left_wall.position.x = -wall_position_adjustment_leftright;
                right_wall.position.x = wall_position_adjustment_leftright;
            
                // rotate left right walls in radians
                let wall_rotation_adjustment = Math.PI / 2;
            
                left_wall.rotation.y = wall_rotation_adjustment;
                right_wall.rotation.y = wall_rotation_adjustment;
            
                // adjust walls to be flush with floor and ceiling
                wall_group.position.set(0, (gallery_height - gallery_depth) / 2, 0);
            
                // add walls to the group
                wall_group.add(left_wall, right_wall);
        
                createBoundingBoxes(wall_group);
                // return walls so that BoundingBox.js can use them
                resolve(wall_group);
            });
        }

        catch(e) {
            reject(e);
        }

    
    });

};

