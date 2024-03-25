import { PlaneGeometry } from "three/src/geometries/PlaneGeometry.js";
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial.js";
import { DoubleSide } from "three/src/constants.js";
import { Mesh } from "three/src/objects/Mesh.js";

export function createMatte(matte_width, matte_height, matte_color) {

    // create matte
    const matte = new Mesh(
        new PlaneGeometry(matte_width / 12, matte_height / 12),
        new MeshLambertMaterial({ color: matte_color, 
            side: DoubleSide,
        }),
    );

    return matte;
}