import { Router } from "express";
const router = Router();

import { deleteUser, updateUser, createUser, listUsers, deactivateUser, activateUser, getUser, resetUserPassword, changeUserAccess } from "./controllers/users.js";
import { deleteCourse, updateCourse, createCourse, listCourses, getCourse } from "./controllers/courses.js";
import { assignUserCourses, unassignUserCourses } from "./controllers/enrollments.js";
import { listExhibitions, getExhibition, adminEditExhibitionSettings, adminDeleteExhibition, loadExhibitionAdmin, saveExhibitionAdmin } from "./controllers/exhibitions.js";



// Handle users
router.get("/users/:userId(\\d+)", getUser);
router.get("/users", listUsers);
router.post("/users", createUser);
router.put("/users/:userId(\\d+)", updateUser);
router.delete("/users/:userId(\\d+)", deleteUser);

router.put("/users/:userId(\\d+)/deactivate", deactivateUser);
router.put("/users/:userId(\\d+)/activate", activateUser);

router.put("/users/:userId(\\d+)/access", changeUserAccess);

router.put("/users/:userId(\\d+)/resetpassword", resetUserPassword);


// Handle courses
router.get("/courses", listCourses);
router.get("/courses/:courseId(\\d+)", getCourse);
router.post("/courses", createCourse);
router.put("/courses/:courseId(\\d+)", updateCourse);
router.delete("/courses/:courseId(\\d+)", deleteCourse);




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