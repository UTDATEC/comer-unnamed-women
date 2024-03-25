import db from "../sequelize.js";
const { User, Course } = db;
import { deleteItem, updateItem, createItem, listItems, getItem } from "./items.js";


const listCourses = async (req, res, next) => {
    await listItems(req, res, next, Course, [User], {});
};

const createCourse = async (req, res, next) => {
    await createItem(req, res, next, Course);
};

const getCourse = async (req, res, next) => {
    await getItem(req, res, next, Course, [User], req.params.courseId);
};

const updateCourse = async (req, res, next) => {
    await updateItem(req, res, next, Course, req.params.courseId);
};

const deleteCourse = async (req, res, next) => {
    await deleteItem(req, res, next, Course, req.params.courseId);
};


export { createCourse, getCourse, listCourses, deleteCourse, updateCourse };