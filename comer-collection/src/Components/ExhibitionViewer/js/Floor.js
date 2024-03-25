import * as THREE from "three";
import { createBoundingBoxes } from "./BoundingBox.js";

export const setupFloor = (scene, texture_loader, floor_width, floor_length, floor_depth, floor_color, floor_texture_name) => {
    
    return new Promise((resolve, reject) => {

        try {
            // clean up any existing floor
            scene.children = scene.children.filter((c) => c.name != "group_floor");

            let floor_group = new THREE.Group();
            floor_group.name = "group_floor";
            scene.add(floor_group); 
        
        
            texture_loader.load(`/images/textures/${floor_texture_name}`, (floor_texture) => {
        
                floor_texture.wrapS = THREE.RepeatWrapping;                     // horizontal wrap
                floor_texture.wrapT = THREE.RepeatWrapping;                     // vertical wrap
                floor_texture.repeat.set(floor_width / 4, floor_length / 4);    // repeat texture (width, height)
            
                // create geometry for floor (width, height)
                const plane_geometry = new THREE.PlaneGeometry(floor_width, floor_length); 
            
                // create material from texture to apply to geometry
                const plane_material = new THREE.MeshPhongMaterial({
                    map: floor_texture,
                    side: THREE.DoubleSide,
                    color: floor_color,
                });
            
                // create mesh
                const floor_plane = new THREE.Mesh(plane_geometry, plane_material);
            
                floor_plane.rotation.x = Math.PI / 2;   // make plane horizontal (radians)
                floor_plane.position.y = -floor_depth;  // lower floor so eye level can stay at 0
            
                floor_group.add(floor_plane);
                createBoundingBoxes(floor_group);
        
                resolve(floor_group);
        
            }); 
            

        } catch(e) {
            reject(e);
        }

    });
    
};