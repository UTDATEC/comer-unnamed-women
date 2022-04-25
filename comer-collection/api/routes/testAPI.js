var express = require("express");
var router = express.Router();

const db = require("../sequelize.js");
const Tutorial = db.tutorials;
//const Op = db.Sequelize.Op;

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

// router.get("/", function(req, res, next) {
//     res.send("API WORKING");
// });

router.get('/', function(req, res, next) {
    // const title = req.query.title;
    // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    console.log("get Works");
    //res.send("Hello1");
    Tutorial.findAll()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      });
  });

module.exports = router;