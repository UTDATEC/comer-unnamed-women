const createError = require('http-errors');
const express = require("express");
const router = express.Router();


const { listImages, createImage, getImage, updateImage, deleteImage, assignArtistToImage, unassignArtistFromImage, assignTagToImage, unassignTagFromImage, getTags, listImagesPublic, getImagePublic, assignArtistToImages, unassignArtistFromImages, downloadImagePublic, assignTagToImages, unassignTagFromImages } = require("./controllers/images.js");
const { listArtists, createArtist, getArtist, updateArtist, deleteArtist } = require("./controllers/artists.js");
const { listTags, createTag, updateTag, deleteTag, getTag } = require("./controllers/tags.js");
const { listUsers, createUser, updateUser, deleteUser, getUser, resetUserPassword, deactivateUser, activateUser, promoteUser, demoteUser } = require("./controllers/users.js");
const { createCourse, getCourse, listCourses, deleteCourse, updateCourse, assignUserToCourse, unassignUserFromCourse, listMyCourses } = require("./controllers/courses.js");
const { changePassword, signIn, getCurrentUser } = require("./controllers/accounts.js");
const { listExhibitions, getExhibition, saveExhibition, loadExhibition, listMyExhibitions, createExhibition, listPublicExhibitions, ownerEditExhibition, adminEditExhibition, ownerDeleteExhibition, adminDeleteExhibition, loadExhibitionAdmin, loadExhibitionPublic, saveExhibitionAdmin } = require('./controllers/exhibitions.js');

// Read images
router.get("/images", listImages);
router.get("/images/:imageId", getImage)

router.get("/collection/images", listImagesPublic);
router.get("/collection/images/:imageId", getImagePublic);
router.get("/exhibitions/public", listPublicExhibitions);

router.get("/collection/images/:imageId/download", downloadImagePublic);

// Modify images
router.post("/images", createImage);
router.put("/images/:imageId", updateImage);
router.delete("/images/:imageId", deleteImage);

// Modify image/artist associations
router.put("/images/:imageId/artists/:artistId", assignArtistToImage);
router.delete("/images/:imageId/artists/:artistId", unassignArtistFromImage);

router.put("/artists/:artistId/images/assign", assignArtistToImages);
router.put("/artists/:artistId/images/unassign", unassignArtistFromImages);

// Modify image/tag associations
router.put("/images/:imageId/tags/:tagId", assignTagToImage);
router.delete("/images/:imageId/tags/:tagId", unassignTagFromImage);

router.put("/tags/:tagId/images/assign", assignTagToImages);
router.put("/tags/:tagId/images/unassign", unassignTagFromImages);

// Read artists
router.get("/artists", listArtists);
router.get("/artists/:artistId", getArtist);

// Modify artists
router.post("/artists", createArtist);
router.put("/artists/:artistId", updateArtist);
router.delete("/artists/:artistId", deleteArtist);

// Read tags
router.get("/tags", listTags);
router.get("/tags/:tagId", getTag);

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

// Modify exhibitions (admin)
router.put("/exhibitions/:exhibitionId", adminEditExhibition);
router.delete("/exhibitions/:exhibitionId", adminDeleteExhibition);



// User interactions
router.put("/account/signin", signIn);
router.put("/account/changepassword", changePassword);
router.get("/account/profile", getCurrentUser);
router.get("/account/courses", listMyCourses);
router.get("/account/exhibitions", listMyExhibitions);

router.post("/account/exhibitions", createExhibition);
router.put("/account/exhibitions/:exhibitionId", ownerEditExhibition);
router.delete("/account/exhibitions/:exhibitionId", ownerDeleteExhibition);

router.get("/account/exhibitions/:exhibitionId/load", loadExhibition);
router.get("/exhibitions/:exhibitionId/load", loadExhibitionAdmin);
router.get("/exhibitions/public/:exhibitionId/load", loadExhibitionPublic);
router.put("/account/exhibitions/:exhibitionId/save", saveExhibition);
router.put("/exhibitions/:exhibitionId/save", saveExhibitionAdmin);


// router.use(["/images", "/artists", "/tags", "/users", "/sign_up", "/change_password"], (req, res, next) => {
//     next(createError(405));
// })


module.exports = router;