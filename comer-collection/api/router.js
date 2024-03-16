const createError = require('http-errors');
const express = require("express");
const router = express.Router();


var bouncer = require("express-bouncer")(500, 900000);
bouncer.blocked = function(req, res, next, remaining) {
  next(createError(429, {debugMessage: `remaining wait period: ${remaining}`}));
}


const { listImagesPublic, getImagePublic, downloadImagePublic } = require("./controllers/images.js");
const { listMyCourses } = require("./controllers/courses.js");
const { changePassword, signIn } = require("./controllers/accounts.js");
const { listExhibitions, getExhibition, saveExhibition, loadExhibition, listMyExhibitions, createExhibition, listPublicExhibitions, ownerEditExhibition, adminEditExhibition, ownerDeleteExhibition, adminDeleteExhibition, loadExhibitionAdmin, loadExhibitionPublic, saveExhibitionAdmin } = require('./controllers/exhibitions.js');

// Read images

router.get("/collection/images", listImagesPublic);
router.get("/collection/images/:imageId", getImagePublic);
router.get("/exhibitions/public", listPublicExhibitions);

router.get("/collection/images/:imageId/download", downloadImagePublic);


// Read exhibitions (admin)
router.get("/exhibitions", listExhibitions)
router.get("/exhibitions/:exhibitionId", getExhibition)

// Modify exhibitions (admin)
router.put("/exhibitions/:exhibitionId", adminEditExhibition);
router.delete("/exhibitions/:exhibitionId", adminDeleteExhibition);



// User interactions
router.put("/account/signin", bouncer.block, (req, res, next) => {
    signIn(req, res, next).then((success) => {
        if(success) {
            bouncer.reset(req);
        }
    });
});
router.put("/account/changepassword", changePassword);

router.post("/account/exhibitions", createExhibition);
router.put("/account/exhibitions/:exhibitionId", ownerEditExhibition);
router.delete("/account/exhibitions/:exhibitionId", ownerDeleteExhibition);

router.get("/account/exhibitions/:exhibitionId/load", loadExhibition);
router.get("/exhibitions/:exhibitionId/load", loadExhibitionAdmin);
router.get("/exhibitions/public/:exhibitionId/load", loadExhibitionPublic);
router.put("/account/exhibitions/:exhibitionId/save", saveExhibition);
router.put("/exhibitions/:exhibitionId/save", saveExhibitionAdmin);


module.exports = router;