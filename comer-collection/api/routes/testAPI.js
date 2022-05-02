var express = require("express");
var router = express.Router();

const db = require("../sequelize.js");
const Image = db.image;
const Op = db.Sequelize.Op;

router.get('/', function(req, res, next) {
    Image.findAll({
      where: {
        title: {
          [Op.like]: '%' + req.query.title + '%'
        },
        artist: {
          [Op.like]: '%' + req.query.artist + '%'
        },
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