import { PlaneGeometry } from "three/src/geometries/PlaneGeometry.js";
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial.js";
import { Mesh } from "three/src/objects/Mesh.js";
import { Group } from "three/src/objects/Group.js";
import { DoubleSide } from "three/src/constants.js";


export function createFrame(frame_width, frame_height, frame_color, frame_secondary){
    
    // create frame as a group so that we can add all the planes as one 'object' that
    // is appended to the art in Art.js
    let frame_group = new Group();

    // possibly remove, makes frames slighly larger to accommodate
    frame_width = frame_width + 2;
    frame_height = frame_height + 2;

    /** note: there are a lot of position adjustments in this file.
     *  The important thing to know about these, are that they are based on the fact
     *  that a frame is created at (0, 0, 0). The frames are moved to their proper
     *  position and rotation in the Art.js file, so it is preferred that you keep
     *  all the math here the same, and alter any minute adjustments in that file.
     * 
     *  Everything is divided by 12 as we are using a conversion of 1 unit in Three.js
     *  as 12 inches or 1 foot, and we are dealing with inch sizes for photos and their frames.
     *  Some things are adjusted by half of an inch (0.5 / 12) because Three.js is using
     *  the midpoints for positioning, and the frames are 1 inch thick in terms of 
     *  both depth and thickness of the frame. 
     */

    // all front facing panels of frame
    const front_bottom = new Mesh(
        new PlaneGeometry(frame_width / 12, 1 / 12),
        new MeshLambertMaterial({ color: frame_color,
            side: DoubleSide}),
    );

    const front_top = new Mesh(
        new PlaneGeometry(frame_width / 12, 1 / 12),
        new MeshLambertMaterial({ color: frame_color, 
            side: DoubleSide}),
    );

    front_top.position.set(0, (frame_height - 1) / 12, 0);

    const front_left = new Mesh(
        new PlaneGeometry(1 / 12, (frame_height - 2) / 12),
        new MeshLambertMaterial({ color: frame_color,
            side: DoubleSide}),
    );

    front_left.position.set((-(frame_width - 1) / 2) / 12,
        ((frame_height - 1) / 2) / 12);

    const front_right = new Mesh(
        new PlaneGeometry(1 / 12, (frame_height - 2) / 12),
        new MeshLambertMaterial({ color: frame_color,
            side: DoubleSide}),
    );

    front_right.position.set(((frame_width - 1) / 2) / 12, 
        ((frame_height - 1) / 2) / 12);

    // all outer facing panels of frame
    const outer_right = new Mesh(
        new PlaneGeometry(1 / 12, frame_height / 12),
        new MeshLambertMaterial({ color: frame_secondary,
            side: DoubleSide}),
    );

    outer_right.position.set((frame_width / 2) / 12, 
        ((frame_height - 1) / 2) / 12, 
        -0.5 / 12);
    outer_right.rotation.y = -Math.PI / 2;

    const outer_left = new Mesh(
        new PlaneGeometry(1 / 12, frame_height / 12),
        new MeshLambertMaterial({ color: frame_secondary, 
            side: DoubleSide}),
    );

    outer_left.position.set(-(frame_width / 2) / 12, 
        ((frame_height - 1) / 2) / 12,
        -0.5 / 12);
    outer_left.rotation.y = -Math.PI / 2;

    const outer_bottom = new Mesh(
        new PlaneGeometry(frame_width / 12, 1 / 12),
        new MeshLambertMaterial({ color: frame_secondary, 
            side: DoubleSide}),
    );

    outer_bottom.position.set(0, -0.5 / 12, -0.5 / 12);
    outer_bottom.rotation.x = Math.PI / 2;

    const outer_top = new Mesh(
        new PlaneGeometry(frame_width / 12, 1 / 12),
        new MeshLambertMaterial({ color: frame_secondary, 
            side: DoubleSide}),
    );

    outer_top.position.set(0, (frame_height - 0.5) / 12, -0.5 / 12);
    outer_top.rotation.x = Math.PI / 2;

    // inner facing panels (the small areas on the inside of frames)
    // they are 1/4 of an inch which covers any problem of being able to see through the frames
    const inner_bottom = new Mesh(
        new PlaneGeometry((frame_width - 2) / 12, 1 / 48),
        new MeshLambertMaterial({ color: frame_secondary,
            side: DoubleSide}),
    );

    inner_bottom.position.set(0, 0.5 / 12, -1 / 96);
    inner_bottom.rotation.x = Math.PI / 2;

    const inner_top = new Mesh(
        new PlaneGeometry((frame_width - 2) / 12, 1 / 48),
        new MeshLambertMaterial({ color: frame_secondary,
            side: DoubleSide}), 
    );

    inner_top.position.set(0, (frame_height - 1.5) / 12, -1 / 96);
    inner_top.rotation.x = Math.PI / 2;

    const inner_right = new Mesh(
        new PlaneGeometry((frame_height - 2) / 12, 1 / 48),
        new MeshLambertMaterial({ color: frame_secondary,
            side: DoubleSide}),
    );

    inner_right.position.set(((frame_width - 2) / 2) / 12, ((frame_height - 1) / 2) / 12, -1 / 96);
    inner_right.rotation.x = Math.PI / 2;
    inner_right.rotation.y = Math.PI / 2;

    const inner_left = new Mesh(
        new PlaneGeometry((frame_height - 2) / 12, 1 / 48),
        new MeshLambertMaterial({ color: frame_secondary,
            side: DoubleSide}),
    );

    inner_left.position.set(-((frame_width - 2) / 2) / 12, ((frame_height - 1) / 2) / 12, -1 / 96);
    inner_left.rotation.x = Math.PI / 2;
    inner_left.rotation.y = Math.PI / 2;

    // add all parts to the group
    frame_group.add(front_bottom, outer_bottom, inner_bottom, 
        front_top, outer_top, inner_top,
        front_left, outer_left, inner_left,
        front_right, outer_right, inner_right);

    // this might work for when there is a custom position, but will have to check in the future
    //frame_group.position.set(0, -((frame_height - 1) / 2) / 12, 0);

    // return group as a finished frame
    return frame_group;
}