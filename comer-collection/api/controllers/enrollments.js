const { User } = require("../sequelize.js");
const { manageManyToManyAssociation } = require("./associations.js");

const assignUserCourses = async (req, res, next) => {
    const { users, courses } = req.body;
    await manageManyToManyAssociation(req, res, next, User, User.associations.Courses, "assign", users, courses);
};
const unassignUserCourses = async (req, res, next) => {
    const { users, courses } = req.body;
    await manageManyToManyAssociation(req, res, next, User, User.associations.Courses, "unassign", users, courses);
};

module.exports = { assignUserCourses, unassignUserCourses };