import { Router } from "express";
const router = Router();

import { listArtists, createArtist, updateArtist, deleteArtist, getArtist } from "./controllers/artists.js";
import { deleteUser, updateUser, createUser, listUsers, deactivateUser, activateUser, promoteUser, demoteUser, getUser, resetUserPassword } from "./controllers/users.js";
import { deleteCourse, updateCourse, createCourse, listCourses, getCourse } from "./controllers/courses.js";
import { deleteImage, updateImage, listImages, getImage, createImage } from "./controllers/images.js";
import { deleteTag, listTags, getTag, createTag, updateTag } from "./controllers/tags.js";
import { assignImageTags, unassignImageTags } from "./controllers/imagetags.js";
import { assignImageArtists, unassignImageArtists } from "./controllers/imageartists.js";
import { assignUserCourses, unassignUserCourses } from "./controllers/enrollments.js";
import { listExhibitions, getExhibition, adminEditExhibitionSettings, adminDeleteExhibition, loadExhibitionAdmin, saveExhibitionAdmin } from "./controllers/exhibitions.js";


// Handle artists
router.get("/artists", listArtists);
router.get("/artists/:artistId(\\d+)", getArtist);
router.post("/artists", createArtist);
router.put("/artists/:artistId(\\d+)", updateArtist);
router.delete("/artists/:artistId(\\d+)", deleteArtist);


// Handle users
router.get("/users/:userId(\\d+)", getUser);
router.get("/users", listUsers);
router.post("/users", createUser);
router.put("/users/:userId(\\d+)", updateUser);
router.delete("/users/:userId(\\d+)", deleteUser);

router.put("/users/:userId(\\d+)/deactivate", deactivateUser);
router.put("/users/:userId(\\d+)/activate", activateUser);

router.put("/users/:userId(\\d+)/promote", promoteUser);
router.put("/users/:userId(\\d+)/demote", demoteUser);

router.put("/users/:userId(\\d+)/resetpassword", resetUserPassword);


// Handle courses
router.get("/courses", listCourses);
router.get("/courses/:courseId(\\d+)", getCourse);
router.post("/courses", createCourse);
router.put("/courses/:courseId(\\d+)", updateCourse);
router.delete("/courses/:courseId(\\d+)", deleteCourse);


// Handle images
router.get("/images", listImages);
router.get("/images/:imageId(\\d+)", getImage);
router.post("/images", createImage);
router.put("/images/:imageId(\\d+)", updateImage);
router.delete("/images/:imageId(\\d+)", deleteImage);


// Handle tags
router.get("/tags", listTags);
router.get("/tags/:tagId(\\d+)", getTag);
router.post("/tags", createTag);
router.put("/tags/:tagId(\\d+)", updateTag);
router.delete("/tags/:tagId(\\d+)", deleteTag);


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
router.get("/exhibitions", listExhibitions);
router.get("/exhibitions/:exhibitionId(\\d+)", getExhibition);
router.put("/exhibitions/:exhibitionId(\\d+)", adminEditExhibitionSettings);
router.delete("/exhibitions/:exhibitionId(\\d+)", adminDeleteExhibition);

router.get("/exhibitions/:exhibitionId(\\d+)/load", loadExhibitionAdmin);
router.put("/exhibitions/:exhibitionId(\\d+)/save", saveExhibitionAdmin);



export default router;