const createError = require('http-errors');
const express = require("express");
const router = express.Router();

const { listArtists, createArtist, updateArtist, deleteArtist, getArtist } = require('./controllers/artists.js');
const { deleteUser, updateUser, createUser, listUsers, deactivateUser, activateUser, promoteUser, demoteUser, getUser, resetUserPassword } = require('./controllers/users.js');
const { deleteCourse, updateCourse, createCourse, listCourses, getCourse } = require('./controllers/courses.js');
const { deleteImage, updateImage } = require('./controllers/images.js');
const { deleteTag, listTags, getTag, createTag, updateTag } = require('./controllers/tags.js');


// Handle artists
router.get("/artists", listArtists);
router.get("/artists/:artistId", getArtist);
router.post("/artists", createArtist);
router.put("/artists/:artistId", updateArtist);
router.delete("/artists/:artistId", deleteArtist);


// Handle users
router.get("/users/:userId", getUser);
router.get("/users", listUsers);
router.post("/users", createUser);
router.put("/users/:userId", updateUser);
router.delete("/users/:userId", deleteUser);

router.put("/users/:userId/deactivate", deactivateUser);
router.put("/users/:userId/activate", activateUser);

router.put("/users/:userId/promote", promoteUser);
router.put("/users/:userId/demote", demoteUser);

router.put("/users/:userId/resetpassword", resetUserPassword);


// Handle courses
router.get("/courses", listCourses);
router.get("/courses/:courseId", getCourse);
router.post("/courses", createCourse);
router.put("/courses/:courseId", updateCourse);
router.delete("/courses/:courseId", deleteCourse);


// Handle images
router.put("/images/:imageId", updateImage);
router.delete("/images/:imageId", deleteImage);


// Handle tags
router.get("/tags", listTags);
router.get("/tags/:tagId", getTag);
router.post("/tags", createTag);
router.put("/tags/:tagId", updateTag);
router.delete("/tags/:tagId", deleteTag);


module.exports = router;