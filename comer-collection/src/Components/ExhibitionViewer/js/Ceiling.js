import { Group } from "three/src/objects/Group.js";
import { RepeatWrapping, DoubleSide } from "three/src/constants.js";
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry.js";
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial.js";
import { Mesh } from "three/src/objects/Mesh.js";

import { createBoundingBoxes } from "./BoundingBox.js";

export const setupCeiling = (scene, texture_loader, ceiling_width, ceiling_length, ceiling_height, ceiling_color) => {

    return new Promise((resolve, reject) => {

        try {
            // clean up any existing floor
            scene.children = scene.children.filter((c) => c.name != "group_ceiling");

            const ceiling_group = new Group();
            ceiling_group.name = "group_ceiling";
            scene.add(ceiling_group);
        
            texture_loader.load("/images/textures/wall.jpg", (ceiling_texture) => {
        
                ceiling_texture.wrapS = RepeatWrapping;                   // horizontal wrap
                ceiling_texture.wrapT = RepeatWrapping;                   // vertical wrap
                ceiling_texture.repeat.set(ceiling_width, ceiling_length);      // repeat texture (width, height)
            
                // create geometry for floor (width, height)
                const plane_geometry = new PlaneGeometry(ceiling_width, ceiling_length);
            
                // create material from texture to apply to geometry
                const plane_material = new MeshPhongMaterial({
                    map: ceiling_texture,
                    side: DoubleSide,
                    color: ceiling_color,
                });
            
                // create mesh
                const ceiling_plane = new Mesh(plane_geometry, plane_material);
            
                ceiling_plane.rotation.x = Math.PI / 2;     // make plane horizontal (radians)
                ceiling_plane.position.y = ceiling_height;  // raise ceiling 
        
                ceiling_group.add(ceiling_plane);
                createBoundingBoxes(ceiling_group);
        
                resolve(ceiling_group);
                
            }); 
        
        } catch(e) {
            reject(e);
        }
        
    });
};