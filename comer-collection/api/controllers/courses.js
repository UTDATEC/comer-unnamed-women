const createError = require('http-errors');
const { User, Course } = require("../sequelize.js");
const { adminOperation, userOperation } = require("../security.js");
const { deleteItem, updateItem, createItem, listItems, getItem } = require('./items.js');


const listCourses = async (req, res, next) => {
    await listItems(req, res, next, Course, [User], {});
};

const listMyCourses = async (req, res, next) => {
    userOperation(req, res, next, async(user_id) => {
        const user = await User.findByPk(user_id);
        const myCourses = await user.getCourses();
        if(user) {
            try {
                res.status(200).json({ data: myCourses });
            } catch(e) {
                next(createError(400, {debugMessage: e.message}));
            }
        }
        else
            next(createError(404));
    })
}

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


module.exports = { createCourse, getCourse, listCourses, listMyCourses, deleteCourse, updateCourse }