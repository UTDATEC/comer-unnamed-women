const createError = require('http-errors');
const express = require("express");
const router = express.Router();

const { listArtists, createArtist } = require('./controllers/artists.js');


// Read artists
router.get("/artists", listArtists);
router.post("/artists", createArtist);


module.exports = router;