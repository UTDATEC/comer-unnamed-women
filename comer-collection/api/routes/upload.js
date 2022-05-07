var express = require("express");
var router = express.Router();

const db = require("../sequelize.js");
const Image = db.image;
const upload = require("../middleware.js");

const uploadFiles = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }
    // Creates new SQL row with data passed in from post request
    Image.create({
      title: req.body.title,
      artist: req.body.artist,
      tags: req.body.tags,
      inscriptions: req.body.inscriptions,
      medium: req.body.medium,
      dimensions: req.body.dimensions,
      accessionNumber: req.body.accessionNumber,
      copyright: req.body.copyright,
      subject: req.body.subject,
      collectionLocation: req.body.collectionLocation,
      dateCreated: req.body.dateCreated,
      fileName: req.file.filename,
    }).then((image) => {
      return res.send(`File has been uploaded.`);
    });
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload images: ${error}`);
  }
};

// Use multer middleware to save file in file system
router.post('/', upload.single("file"), uploadFiles);


module.exports = router;