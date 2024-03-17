const createError = require('http-errors');
const express = require("express");
const router = express.Router();

const { createExhibition, ownerEditExhibitionSettings, ownerDeleteExhibition } = require('./controllers/exhibitions.js');



// Handle exhibitions
router.post("/exhibitions", createExhibition);
router.put("/exhibitions/:exhibitionId", ownerEditExhibitionSettings);
router.delete("/exhibitions/:exhibitionId", ownerDeleteExhibition);


module.exports = router;