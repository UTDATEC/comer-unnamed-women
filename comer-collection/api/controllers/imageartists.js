import db from "../sequelize.js";
const { Image } = db;
import { manageManyToManyAssociation } from "./associations.js";

const assignImageArtists = async (req, res, next) => {
    const { images, artists } = req.body;
    await manageManyToManyAssociation(req, res, next, Image, Image.associations.Artists, "assign", images, artists);
};
const unassignImageArtists = async (req, res, next) => {
    const { images, artists } = req.body;
    await manageManyToManyAssociation(req, res, next, Image, Image.associations.Artists, "unassign", images, artists);
};

export { assignImageArtists, unassignImageArtists };