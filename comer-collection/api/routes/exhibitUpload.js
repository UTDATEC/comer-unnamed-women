// Abigail Thomas 04/05/2023

var express = require("express");
const {connection} = require("mongoose");
const {sequelize} = require("../sequelize.js");
var router = express.Router();
const getExhibitById = require('../controllers/exhibitController.js').getExhibitById

const db = require("../sequelize.js");
const exhibit = db.exhibit;
const Op = db.Sequelize.Op;

router.get("/", (req,res) =>
{
    res.json({message: "Comer Collection app started."});
});

router.get("/:creator_user_id", getExhibitById)

module.exports = router;