import { Router } from "express";
const router = Router();

import { createExhibition, ownerEditExhibitionSettings, ownerDeleteExhibition, loadExhibitionOwner, saveExhibitionOwner } from "./controllers/exhibitions.js";



// Handle exhibitions
router.post("/exhibitions", createExhibition);
router.put("/exhibitions/:exhibitionId", ownerEditExhibitionSettings);
router.delete("/exhibitions/:exhibitionId", ownerDeleteExhibition);
router.get("/exhibitions/:exhibitionId/load", loadExhibitionOwner);
router.put("/exhibitions/:exhibitionId/save", saveExhibitionOwner);


export default router;