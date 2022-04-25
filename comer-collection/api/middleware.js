const multer = require("multer");


console.log("upload middleware")

// Might not need, may have different files
const imageFilter = (req, file, cb) => {
  console.log(file)
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/public/images');
    //cb(null, "/Users/jordantamm/Desktop/Node/comer-unnamed-women/comer-collection/api/public/images");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-comer-${file.originalname}`);
  },
});
var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;