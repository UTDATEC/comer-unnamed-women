import * as THREE from "three";

export const createBoundingBoxes = (objects) => {

    // ensure object that was sent is an array, if not look at children
    if (!Array.isArray(objects)) {
        objects = objects.children;
    }

    // create a bounding box with Three.js from these objects (walls)
    objects.forEach((object) => {
        object.BoundingBox = new THREE.Box3();
        object.BoundingBox.setFromObject(object);
    });
};