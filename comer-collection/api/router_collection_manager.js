import { Router } from "express";
const router = Router();

import { listArtists, createArtist, updateArtist, deleteArtist, getArtist } from "./controllers/artists.js";
import { deleteImage, updateImage, listImages, getImage, createImage } from "./controllers/images.js";
import { deleteTag, listTags, getTag, createTag, updateTag } from "./controllers/tags.js";
import { assignImageTags, unassignImageTags } from "./controllers/imagetags.js";
import { assignImageArtists, unassignImageArtists } from "./controllers/imageartists.js";


// Handle artists
router.get("/artists", listArtists);
router.get("/artists/:artistId(\\d+)", getArtist);
router.post("/artists", createArtist);
router.put("/artists/:artistId(\\d+)", updateArtist);
router.delete("/artists/:artistId(\\d+)", deleteArtist);


// Handle images
router.get("/images", listImages);
router.get("/images/:imageId(\\d+)", getImage);
router.post("/images", createImage);
router.put("/images/:imageId(\\d+)", updateImage);
router.delete("/images/:imageId(\\d+)", deleteImage);


// Handle tags
router.get("/tags", listTags);
router.get("/tags/:tagId(\\d+)", getTag);
router.post("/tags", createTag);
router.put("/tags/:tagId(\\d+)", updateTag);
router.delete("/tags/:tagId(\\d+)", deleteTag);


// Handle image/tag assignments
router.put("/imagetags/assign", assignImageTags);
router.put("/imagetags/unassign", unassignImageTags);


// Handle image/artist assignments
router.put("/imageartists/assign", assignImageArtists);
router.put("/imageartists/unassign", unassignImageArtists);



export default router;