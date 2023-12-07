import * as THREE from "three";

export function createAmbientLight(color, intensity) {
    const ambient_light = new THREE.AmbientLight(color, intensity);
    return ambient_light;
}


export function createSpotlight(intensity, color, art_position, gallery_height, scene, direction) {
    const spotlight = new THREE.SpotLight(color, intensity);
    
    // set the light 5 feet away from the art
    const light_offset = 5; // modify this if you want to change how far lights are away from the photos
    if (direction == 1) {
        spotlight.position.set(art_position.x, gallery_height, art_position.z + light_offset);
    }
    else if (direction == 2) {
        spotlight.position.set(art_position.x - light_offset, gallery_height, art_position.z);
    }
    else if (direction == 3) {
        spotlight.position.set(art_position.x, gallery_height, art_position.z - light_offset);
    }
    else if (direction == 4) {
        spotlight.position.set(art_position.x + light_offset, gallery_height, art_position.z);
    }

    // set target position to art
    spotlight.target.position.set(art_position.x, art_position.y, art_position.z);
    
    spotlight.angle = Math.PI / 8;  // value effects 'wideness' of light
    spotlight.penumbra = 0.8;       // hardness of light edges, looks better on higher end [0,1]
    spotlight.decay = 0.22;         // this is a good value for light_offset = 5, would need to change if that changes

    // pythag theorem, but we can approximate since it just needs to reach the wall, going over doesn't effect too much
    spotlight.distance = light_offset * gallery_height;  

    // add light and target
    scene.add(spotlight);
    scene.add(spotlight.target);

    return spotlight;
}
