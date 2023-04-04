var express = require("express");
var router = express.Router();

const db = require("../sequelize.js");
const Image = db.image;
const Op = db.Sequelize.Op;


// Search: uses all query parameter strings to find if the column has that string ANYWHERE in it
router.get('/', function(req, res, next) {
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