import { Router } from "express";
const router = Router();

import { listArtists, getArtist } from "./controllers/artists.js";
import { listTags, getTag } from "./controllers/tags.js";
import { listImagesPublic, getImagePublic, downloadImagePublic } from "./controllers/images.js";
import { listPublicExhibitions, loadExhibitionPublic } from "./controllers/exhibitions.js";
import { signIn } from "./controllers/users.js";


// Authentication
router.put("/signin", signIn);


// Read images
router.get("/images", listImagesPublic);
router.get("/images/:imageId", getImagePublic);
// Download images
router.get("/images/:imageId/download", downloadImagePublic);


// Read artists
router.get("/artists", listArtists);
router.get("/artists/:artistId", getArtist);


// Read tags
router.get("/tags", listTags);
router.get("/tags/:tagId", getTag);


// Read exhibitions
router.get("/exhibitions", listPublicExhibitions);
router.get("/exhibitions/:exhibitionId/load", loadExhibitionPublic);


export default router;