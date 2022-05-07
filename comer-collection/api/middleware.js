
// This file allows the sent images to be stored into the specified file path
const multer = require("multer");

// Might not need to limit to this, may have different files
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/public/images');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-comer-${file.originalname}`);
  },
});
var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;