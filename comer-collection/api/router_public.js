const createError = require('http-errors');
const express = require("express");
const router = express.Router();

const { listArtists, getArtist } = require("./controllers/artists.js");


// Read artists
router.get("/artists", listArtists);
router.get("/artists/:artistId", getArtist);


module.exports = router;