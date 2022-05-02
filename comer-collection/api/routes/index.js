var express = require("express");
var router = express.Router();

const db = require("../sequelize.js");
const Tutorial = db.image;

router.post('/post', function(req, res, next) {

  // Create a Tutorial
  const tutorial = {
    title: req.body.title,
    description: req.body.artist,
    data: req.body.data
  };

  // Save Tutorial in the database
  Tutorial.create(tutorial)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
});

  // this.post("/api/post", (schema, request) => {
  //   let attrs = JSON.parse(request.requestBody)
  //   console.log(attrs)
  // })

module.exports = router;