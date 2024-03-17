const createError = require('http-errors');
const express = require("express");
const router = express.Router();

const { listArtists, getArtist } = require("./controllers/artists.js");
const { listTags, getTag } = require('./controllers/tags.js');
const { listImagesPublic, getImagePublic } = require('./controllers/images.js');
const { listPublicExhibitions, loadExhibitionPublic } = require('./controllers/exhibitions.js');
const { signIn } = require('./controllers/users.js');


// Authentication
router.put("/signin", signIn)


// Read images
router.get("/images", listImagesPublic);
router.get("/images/:imageId", getImagePublic);


// Read artists
router.get("/artists", listArtists);
router.get("/artists/:artistId", getArtist);


// Read tags
router.get("/tags", listTags);
router.get("/tags/:tagId", getTag);


// Read exhibitions
router.get("/exhibitions", listPublicExhibitions);
router.get("/exhibitions/:exhibitionId/load", loadExhibitionPublic);


module.exports = router;