const createError = require('http-errors');
const express = require("express");
const router = express.Router();


var bouncer = require("express-bouncer")(500, 900000);
bouncer.blocked = function(req, res, next, remaining) {
  next(createError(429, {debugMessage: `remaining wait period: ${remaining}`}));
}


const { downloadImagePublic } = require("./controllers/images.js");


router.get("/collection/images/:imageId/download", downloadImagePublic);


module.exports = router;