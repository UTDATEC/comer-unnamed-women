import db from "../sequelize.js";
const { Image } = db;
import { manageManyToManyAssociation } from "./associations.js";

const assignImageTags = async (req, res, next) => {
    const { images, tags } = req.body;
    await manageManyToManyAssociation(req, res, next, Image, Image.associations.Tags, "assign", images, tags);
};
const unassignImageTags = async (req, res, next) => {
    const { images, tags } = req.body;
    await manageManyToManyAssociation(req, res, next, Image, Image.associations.Tags, "unassign", images, tags);
};

export { assignImageTags, unassignImageTags };