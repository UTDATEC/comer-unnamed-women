const createError = require('http-errors');
const express = require("express");
const router = express.Router();

// const { listArtists, getArtist } = require("./controllers/artists.js");
const { getCurrentUser } = require("./controllers/accounts.js");


// // Read artists
// router.get("/artists", listArtists);
// router.get("/artists/:artistId", getArtist);


// Get current user
router.get("/profile", getCurrentUser);


module.exports = router;