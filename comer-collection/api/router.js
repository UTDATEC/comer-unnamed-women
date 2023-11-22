const createError = require('http-errors');
const express = require("express");
const router = express.Router();


const { listImages, createImage, getImage, updateImage, deleteImage, assignArtistToImage, unassignArtistFromImage, assignTagToImage, unassignTagFromImage, getTags } = require("./controllers/images.js");
const { listArtists, createArtist, getArtist, updateArtist, deleteArtist } = require("./controllers/artists.js");
const { listTags, createTag, updateTag, deleteTag } = require("./controllers/tags.js");
const { listUsers, createUser, updateUser, deleteUser, getUser, resetUserPassword, deactivateUser, activateUser, promoteUser, demoteUser } = require("./controllers/users.js");
const { createCourse, getCourse, listCourses, deleteCourse, updateCourse, assignUserToCourse, unassignUserFromCourse } = require("./controllers/courses.js");
const { changePassword, signIn, getCurrentUser } = require("./controllers/accounts.js");
const { listExhibitions, getExhibition, deleteExhibition, saveExhibition, loadExhibition } = require('./controllers/exhibitions.js');

// Read images
router.get("/images", listImages);
router.get("/images/:imageId", getImage)

// Modify images
router.post("/images", createImage);
router.put("/images/:imageId", updateImage);
router.delete("/images/:imageId", deleteImage);

// Modify image/artist associations
router.put("/images/:imageId/artists/:artistId", assignArtistToImage);
router.delete("/images/:imageId/artists/:artistId", unassignArtistFromImage);

// Modify image/tag associations
router.put("/images/:imageId/tags/:tagId", assignTagToImage);
router.delete("/images/:imageId/tags/:tagId", unassignTagFromImage);

// Read artists
router.get("/artists", listArtists);
router.get("/artists/:artistId", getArtist);

// Modify artists
router.post("/artists", createArtist);
router.put("/artists/:artistId", updateArtist);
router.delete("/artists/:artistId", deleteArtist);

// Read tags
router.get("/tags", listTags);

// Modify tags
router.post("/tags", createTag);
router.put("/tags/:tagId", updateTag)
router.delete("/tags/:tagId", deleteTag)

// Read users (admin)
router.get("/users", listUsers);
router.get("/users/:userId", getUser);

// Modify users
router.post("/users", createUser);
router.put("/users/:userId", updateUser);
router.put("/users/:userId/deactivate", deactivateUser);
router.put("/users/:userId/promote", promoteUser);
router.put("/users/:userId/demote", demoteUser);
router.put("/users/:userId/activate", activateUser);
router.delete("/users/:userId", deleteUser);
router.put("/users/:userId/resetpassword", resetUserPassword);

// Read courses
router.get("/courses", listCourses);
router.get("/courses/:courseId", getCourse);

// Modify courses
router.post("/courses", createCourse);
router.put("/courses/:courseId", updateCourse);
router.delete("/courses/:courseId", deleteCourse);

// Modify user/course associations
router.put("/courses/:courseId/users/:userId", assignUserToCourse);
router.delete("/courses/:courseId/users/:userId", unassignUserFromCourse);


// Read exhibitions (admin)
router.get("/exhibitions", listExhibitions)
router.get("/exhibitions/:exhibitionId", getExhibition)
router.put("/exhibitions", saveExhibition)
router.get("/exhibitions/:exhibitionId/load", loadExhibition)

// Modify exhibitions (admin)
router.delete("/exhibitions/:exhibitionId", deleteExhibition)



// User interactions
router.put("/account/signin", signIn);
router.put("/account/changepassword", changePassword);
router.get("/account/profile", getCurrentUser);



// router.use(["/images", "/artists", "/tags", "/users", "/sign_up", "/change_password"], (req, res, next) => {
//     next(createError(405));
// })


module.exports = router;