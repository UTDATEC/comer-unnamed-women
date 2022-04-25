var express = require("express");
var router = express.Router();
const fs = require("fs");

const db = require("../sequelize.js");
const Image = db.tutorials;
const upload = require("../middleware.js");

const uploadFiles = async (req, res) => {
  console.log("121")
  try {
    console.log(req.body.file);
    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }
    console.log("almost at create!")
    Image.create({
      title: req.body.title,
      description: req.body.artist,
      // This should be called name not path
      path: req.file.filename,
      // data: fs.readFileSync(
      //   __dirname + '/public/images' + req.file.filename
      // ),
    }).then((image) => {
      console.log(image)
      // fs.writeFileSync(
      //   "/Users/jordantamm/Desktop/Node/comer-unnamed-women/comer-collection/resources/tmp/" + image.name,
      //   image.data
      // );
      return res.send(`File has been uploaded.`);
    });
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload images: ${error}`);
  }
};


router.post('/', upload.single("file"), uploadFiles);

// router.post('/', function(req, res, next) {
//   console.log(req.file)
// });


// router.post('/', upload.single('file'), (req, res, next) => {
// console.log()

//   const url = req.protocol + '://' + req.get('host')
//   const user = new User({
//       _id: new mongoose.Types.ObjectId(),
//       name: req.body.name,
//       profileImg: url + '/public/' + req.file.filename
//   });
//   user.save().then(result => {
//       res.status(201).json({
//           message: "User registered successfully!",
//           userCreated: {
//               _id: result._id,
//               profileImg: result.profileImg
//           }
//       })
//   }).catch(err => {
//       console.log(err),
//           res.status(500).json({
//               error: err
//           });
//   })
// })

module.exports = router;