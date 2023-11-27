import * as THREE from 'three';
import staticImages from './StaticImages';

export const setupCeiling = (scene, texture_loader, ceiling_width, ceiling_length, ceiling_height, ceiling_color, renderer, camera) => {

    const ceiling_group = new THREE.Group();
    scene.add(ceiling_group);

    const ceiling_texture_key = './wall.jpg'
    texture_loader.load(staticImages[ceiling_texture_key], (ceiling_texture) => {

        ceiling_texture.wrapS = THREE.RepeatWrapping;                   // horizontal wrap
        ceiling_texture.wrapT = THREE.RepeatWrapping;                   // vertical wrap
        ceiling_texture.repeat.set(ceiling_width, ceiling_length);      // repeat texture (width, height)
    
        // create geometry for floor (width, height)
        const plane_geometry = new THREE.PlaneGeometry(ceiling_width, ceiling_length);
    
        // create material from texture to apply to geometry
        const plane_material = new THREE.MeshPhongMaterial({
            map: ceiling_texture,
            side: THREE.DoubleSide,
            color: ceiling_color,
        });
    
        // create mesh
        const ceiling_plane = new THREE.Mesh(plane_geometry, plane_material);
    
        ceiling_plane.rotation.x = Math.PI / 2;     // make plane horizontal (radians)
        ceiling_plane.position.y = ceiling_height;  // raise ceiling 

        ceiling_group.add(ceiling_plane);

        renderer.render(scene, camera);
        
    }); 

    return ceiling_group;
};