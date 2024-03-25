import { Box3 } from "three/src/math/Box3.js";

export const createBoundingBoxes = (objects) => {

    // ensure object that was sent is an array, if not look at children
    if (!Array.isArray(objects)) {
        objects = objects.children;
    }

    // create a bounding box with Three.js from these objects (walls)
    objects.forEach((object) => {
        object.BoundingBox = new Box3();
        object.BoundingBox.setFromObject(object);
    });
};