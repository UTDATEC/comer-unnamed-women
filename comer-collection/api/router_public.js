const createError = require('http-errors');
const express = require("express");
const router = express.Router();

const { listArtists, getArtist } = require("./controllers/artists.js");
const { listTags, getTag } = require('./controllers/tags.js');


// Read artists
router.get("/artists", listArtists);
router.get("/artists/:artistId", getArtist);


// Read tags
router.get("/tags", listTags);
router.get("/tags/:tagId", getTag);


module.exports = router;