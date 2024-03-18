const { Image } = require("../sequelize.js");
const { manageManyToManyAssociation } = require("./associations.js");

const assignImageArtists = async (req, res, next) => {
    const { images, artists } = req.body;
    await manageManyToManyAssociation(req, res, next, Image, Image.associations.Artists, "assign", images, artists);
};
const unassignImageArtists = async (req, res, next) => {
    const { images, artists } = req.body;
    await manageManyToManyAssociation(req, res, next, Image, Image.associations.Artists, "unassign", images, artists);
};

module.exports = { assignImageArtists, unassignImageArtists };