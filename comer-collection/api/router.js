const createError = require('http-errors');
const express = require("express");
const router = express.Router();


var bouncer = require("express-bouncer")(500, 900000);
bouncer.blocked = function(req, res, next, remaining) {
  next(createError(429, {debugMessage: `remaining wait period: ${remaining}`}));
}


const { downloadImagePublic } = require("./controllers/images.js");
const { changePassword, signIn } = require("./controllers/accounts.js");
const { saveExhibition, loadExhibition, adminEditExhibition, adminDeleteExhibition, loadExhibitionAdmin, loadExhibitionPublic, saveExhibitionAdmin } = require('./controllers/exhibitions.js');



router.get("/collection/images/:imageId/download", downloadImagePublic);


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


router.get("/account/exhibitions/:exhibitionId/load", loadExhibition);
router.get("/exhibitions/:exhibitionId/load", loadExhibitionAdmin);
router.get("/exhibitions/public/:exhibitionId/load", loadExhibitionPublic);
router.put("/account/exhibitions/:exhibitionId/save", saveExhibition);
router.put("/exhibitions/:exhibitionId/save", saveExhibitionAdmin);


module.exports = router;