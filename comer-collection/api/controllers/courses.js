const createError = require('http-errors');
const { User, Course } = require("../sequelize.js");
const { adminOperation, userOperation } = require("../security.js");


const listCourses = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        const courses = await Course.findAll({
            include: [User]
        });
        res.status(200).json({ data: courses });
    })
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
    adminOperation(req, res, next, async () => {
        try {
            if(req.body.id)
                throw new Error("Course id should not be included when creating an Course");
            const newCourse = await Course.create(req.body);
            res.status(201).json({ data: newCourse });
        } catch (e) {
            next(createError(400, {debugMessage: e.message}));
        }
    })
};

const getCourse = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        const course = await Course.findByPk(req.params.courseId, {
            include: [User]
        });
        if(course)
            res.status(200).json({ data: course });
        else
            next(createError(404));
    })
};

const updateCourse = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        try {
            const course = await Course.findByPk(req.params.courseId);
            if(course) {
                console.log(req.body.id, req.params.courseId);
                if(req.body.id && req.body.id !== req.params.courseId) {
                    throw new Error("Course id in request body does not match Image id in URL");
                }
                course.set(req.body)
                await course.save();
                res.status(200).json({ data: course });
            }
            else
                next(createError(404));
        }
        catch(e) {
            next(createError(400, {debugMessage: e.message}));
        }
    })
};

const deleteCourse = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        const course = await Course.findByPk(req.params.courseId);
            if(course) {
                await course.destroy();
                res.sendStatus(204);
            }
            else
                next(createError(404));
    })
};

const assignUserToCourse = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        const course = await Course.findByPk(req.params.courseId);
        const user = await User.findByPk(req.params.userId);
            if(course && user) {
                try {
                    await course.addUser(user);
                    res.sendStatus(204);
                } catch(e) {
                    next(createError(400, {debugMessage: e.message}));
                }
            }
            else
                next(createError(404));
    })
};

const unassignUserFromCourse = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        const course = await Course.findByPk(req.params.courseId);
        const user = await User.findByPk(req.params.userId);
            if(course && user) {
                try {
                    await course.removeUser(user);
                    res.sendStatus(204);
                } catch(e) {
                    next(createError(400, {debugMessage: e.message}));
                }
            }
            else
                next(createError(404));
    })
}

module.exports = { createCourse, getCourse, listCourses, listMyCourses, deleteCourse, updateCourse, assignUserToCourse, unassignUserFromCourse }