var express = require("express");
var router = express.Router();

const db = require("../sequelize.js");
const Tutorial = db.tutorials;
//const Op = db.Sequelize.Op;

// const Sequelize = require('sequelize');
// const sequelize = new Sequelize({
//     HOST: "127.0.0.1",
//     USER: "root",
//     PASSWORD: "monktamm123",
//     DB: "Comer",
//     dialect: "mysql",
//     operatorsAliases: false,
// });

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

router.post('/post', function(req, res, next) {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Tutorial
  const tutorial = {
    title: req.body.title,
    description: req.body.artist,
    published: true
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