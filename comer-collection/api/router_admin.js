const createError = require('http-errors');
const express = require("express");
const router = express.Router();

const { listArtists, createArtist, updateArtist, deleteArtist, getArtist } = require('./controllers/artists.js');
const { deleteUser, updateUser, createUser, listUsers, deactivateUser, activateUser, promoteUser, demoteUser, getUser, resetUserPassword } = require('./controllers/users.js');
const { deleteCourse, updateCourse, createCourse, listCourses, getCourse } = require('./controllers/courses.js');
const { deleteImage, updateImage, listImages, getImage, createImage } = require('./controllers/images.js');
const { deleteTag, listTags, getTag, createTag, updateTag } = require('./controllers/tags.js');
const { assignImageTags, unassignImageTags } = require('./controllers/imagetags.js');
const { assignImageArtists, unassignImageArtists } = require('./controllers/imageartists.js');
const { assignUserCourses, unassignUserCourses } = require('./controllers/enrollments.js');
const { listExhibitions, getExhibition, adminEditExhibitionSettings, adminDeleteExhibition, loadExhibitionAdmin } = require('./controllers/exhibitions.js');


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
router.get("/images", listImages);
router.get("/images/:imageId", getImage)
router.post("/images", createImage);
router.put("/images/:imageId", updateImage);
router.delete("/images/:imageId", deleteImage);


// Handle tags
router.get("/tags", listTags);
router.get("/tags/:tagId", getTag);
router.post("/tags", createTag);
router.put("/tags/:tagId", updateTag);
router.delete("/tags/:tagId", deleteTag);


// Handle image/tag assignments
router.put("/imagetags/assign", assignImageTags);
router.put("/imagetags/unassign", unassignImageTags);


// Handle image/artist assignments
router.put("/imageartists/assign", assignImageArtists);
router.put("/imageartists/unassign", unassignImageArtists);


// Handle user/course assignments
router.put("/enrollments/assign", assignUserCourses);
router.put("/enrollments/unassign", unassignUserCourses);


// Handle exhibitions
router.get("/exhibitions", listExhibitions)
router.get("/exhibitions/:exhibitionId", getExhibition)
router.put("/exhibitions/:exhibitionId", adminEditExhibitionSettings);
router.delete("/exhibitions/:exhibitionId", adminDeleteExhibition);

router.get("/exhibitions/:exhibitionId/load", loadExhibitionAdmin);



module.exports = router;