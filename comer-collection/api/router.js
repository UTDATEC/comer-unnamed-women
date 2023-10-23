const createError = require('http-errors');
const express = require("express");
const router = express.Router();


const { listImages, createImage, getImage, updateImage, deleteImage, assignArtistToImage, unassignArtistFromImage } = require("./controllers/images.js");
const { listArtists, createArtist, getArtist, updateArtist, deleteArtist } = require("./controllers/artists.js");


router.get("/images", listImages);
router.post("/images", createImage);
router.get("/images/:imageId", getImage)
router.put("/images/:imageId", updateImage);
router.delete("/images/:imageId", deleteImage);
router.put("/images/:imageId/artist/:artistId", assignArtistToImage);
router.delete("/images/:imageId/artist/:artistId", unassignArtistFromImage);

router.get("/artists", listArtists);
router.post("/artists", createArtist);
router.get("/artists/:artistId", getArtist);
router.put("/artists/:artistId", updateArtist);
router.delete("/artists/:artistId", deleteArtist);


router.use(["/images", "/artists"], (req, res, next) => {
    next(createError(405));
})


module.exports = router;