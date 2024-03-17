const createError = require('http-errors');
const express = require("express");
const router = express.Router();

const { createExhibition, ownerEditExhibitionSettings, ownerDeleteExhibition, loadExhibitionOwner, saveExhibitionOwner } = require('./controllers/exhibitions.js');



// Handle exhibitions
router.post("/exhibitions", createExhibition);
router.put("/exhibitions/:exhibitionId", ownerEditExhibitionSettings);
router.delete("/exhibitions/:exhibitionId", ownerDeleteExhibition);
router.get("/exhibitions/:exhibitionId/load", loadExhibitionOwner);
router.put("/exhibitions/:exhibitionId/save", saveExhibitionOwner);


module.exports = router;