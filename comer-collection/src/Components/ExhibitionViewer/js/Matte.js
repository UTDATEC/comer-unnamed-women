import * as THREE from "three";

export function createMatte(matte_width, matte_height, matte_color) {

    // create matte
    const matte = new THREE.Mesh(
        new THREE.PlaneGeometry(matte_width / 12, matte_height / 12),
        new THREE.MeshLambertMaterial({ color: matte_color, 
            side: THREE.DoubleSide,
        }),
    );

    return matte;
}