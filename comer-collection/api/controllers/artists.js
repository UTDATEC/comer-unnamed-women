const { Artist, Image, } = require("../sequelize.js");
const { updateItem, deleteItem, listItems, createItem, getItem } = require('./items.js');



const listArtists = async (req, res, next) => {
    await listItems(req, res, next, Artist, [Image], req.params.artistId);
};

const createArtist = async (req, res, next) => {
    await createItem(req, res, next, Artist);
};

const getArtist = async (req, res, next) => {
    await getItem(req, res, next, Artist, [Image], req.params.artistId);
};

const updateArtist = async (req, res, next) => {
    await updateItem(req, res, next, Artist, req.params.artistId);
};

const deleteArtist = async (req, res, next) => {
    await deleteItem(req, res, next, Artist, req.params.artistId);
}

module.exports = { listArtists, createArtist, getArtist, updateArtist, deleteArtist }