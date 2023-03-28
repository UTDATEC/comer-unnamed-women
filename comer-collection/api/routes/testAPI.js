var express = require("express");
const { connection } = require("mongoose");
const { sequelize } = require("../sequelize.js");
var router = express.Router();
const getImageById = require('../controllers/controller.js').getImageById

const db = require("../sequelize.js");
const Image = db.image;
const Op = db.Sequelize.Op;

// simple route
router.get("/", (req, res) => {
  res.json({ message: "Welcome to comer collection application." });
});

// simple route
router.get("/:id", getImageById)

// Search: uses all query parameter strings to find if the column has that string ANYWHERE in it
router.get('/searchBy', function(req, res, next) {
    Image.findAll({
      where: {
        title: {
          [Op.like]: '%' + req.query.title + '%'
        },
        artist: {
          [Op.like]: '%' + req.query.artist + '%'
        },
        tags: {
          [Op.like]: '%' + req.query.tags + '%'
        },
        medium: {
          [Op.like]: '%' + req.query.medium + '%'
        },
        inscriptions: {
          [Op.like]: '%' + req.query.inscriptions + '%'
        },
        dateCreated: {
          [Op.like]: '%' + req.query.dateCreated + '%'
        },
        dimensions: {
          [Op.like]: '%' + req.query.dimensions + '%'
        },
        copyright: {
          [Op.like]: '%' + req.query.copyright + '%'
        },
        collectionLocation: {
          [Op.like]: '%' + req.query.collectionLocation + '%'
        },
        accessionNumber: {
          [Op.like]: '%' + req.query.accessionNumber + '%'
        },
        subject: {
          [Op.like]: '%' + req.query.subject + '%'
        }
      }
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving images."
        });
      });
  });

module.exports = router;