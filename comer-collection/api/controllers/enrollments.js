import db from "../sequelize.js";
const { User } = db;
import { manageManyToManyAssociation } from "./associations.js";

const assignUserCourses = async (req, res, next) => {
    const { users, courses } = req.body;
    await manageManyToManyAssociation(req, res, next, User, User.associations.Courses, "assign", users, courses);
};
const unassignUserCourses = async (req, res, next) => {
    const { users, courses } = req.body;
    await manageManyToManyAssociation(req, res, next, User, User.associations.Courses, "unassign", users, courses);
};

export { assignUserCourses, unassignUserCourses };