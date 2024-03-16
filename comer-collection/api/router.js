const createError = require('http-errors');
const express = require("express");
const router = express.Router();


var bouncer = require("express-bouncer")(500, 900000);
bouncer.blocked = function(req, res, next, remaining) {
  next(createError(429, {debugMessage: `remaining wait period: ${remaining}`}));
}


const { listImages, createImage, getImage, assignArtistToImage, unassignArtistFromImage, assignTagToImage, unassignTagFromImage, listImagesPublic, getImagePublic, assignArtistToImages, unassignArtistFromImages, downloadImagePublic, assignTagToImages, unassignTagFromImages } = require("./controllers/images.js");
const { assignUserToCourse, unassignUserFromCourse, listMyCourses } = require("./controllers/courses.js");
const { changePassword, signIn } = require("./controllers/accounts.js");
const { listExhibitions, getExhibition, saveExhibition, loadExhibition, listMyExhibitions, createExhibition, listPublicExhibitions, ownerEditExhibition, adminEditExhibition, ownerDeleteExhibition, adminDeleteExhibition, loadExhibitionAdmin, loadExhibitionPublic, saveExhibitionAdmin } = require('./controllers/exhibitions.js');

// Read images
router.get("/images", listImages);
router.get("/images/:imageId", getImage)

router.get("/collection/images", listImagesPublic);
router.get("/collection/images/:imageId", getImagePublic);
router.get("/exhibitions/public", listPublicExhibitions);

router.get("/collection/images/:imageId/download", downloadImagePublic);

// Modify images
router.post("/images", createImage);

// Modify image/artist associations
router.put("/images/:imageId/artists/:artistId", assignArtistToImage);
router.delete("/images/:imageId/artists/:artistId", unassignArtistFromImage);

router.put("/artists/:artistId/images/assign", assignArtistToImages);
router.put("/artists/:artistId/images/unassign", unassignArtistFromImages);


// Modify user/course associations
router.put("/courses/:courseId/users/:userId", assignUserToCourse);
router.delete("/courses/:courseId/users/:userId", unassignUserFromCourse);


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
// router.get("/account/profile", getCurrentUser);
router.get("/account/courses", listMyCourses);
router.get("/account/exhibitions", listMyExhibitions);

router.post("/account/exhibitions", createExhibition);
router.put("/account/exhibitions/:exhibitionId", ownerEditExhibition);
router.delete("/account/exhibitions/:exhibitionId", ownerDeleteExhibition);

router.get("/account/exhibitions/:exhibitionId/load", loadExhibition);
router.get("/exhibitions/:exhibitionId/load", loadExhibitionAdmin);
router.get("/exhibitions/public/:exhibitionId/load", loadExhibitionPublic);
router.put("/account/exhibitions/:exhibitionId/save", saveExhibition);
router.put("/exhibitions/:exhibitionId/save", saveExhibitionAdmin);


module.exports = router;