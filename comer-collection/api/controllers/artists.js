const createError = require('http-errors');
const { Artist, Image } = require("../sequelize.js");
const { adminOperation } = require("../security.js");

const listArtists = async (req, res) => {
    const artists = await Artist.findAll({
        include: Image
    });
    res.status(200).json({ data: artists });
};

const createArtist = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        try {
            if(req.body.id)
                throw new Error("Artist id should not be included when creating an Artist");
            const newArtist = await Artist.create(req.body);
            res.status(201).json({ data: newArtist });
        } catch (e) {
            next(createError(400, {debugMessage: e.message}));
        }
    })
};

const getArtist = async (req, res, next) => {
    const artist = await Artist.findByPk(req.params.artistId, {
        include: Image
    });
    if(artist)
        res.status(200).json({ data: artist });
    else
        next(createError(404));
};

const updateArtist = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        try {
            const artist = await Artist.findByPk(req.params.artistId);
            if(artist) {
                console.log(req.body.id, req.params.artistId);
                if(req.body.id && req.body.id !== req.params.artistId) {
                    throw new Error("Artist id in request body does not match Artist id in URL");
                }
                artist.set(req.body)
                await artist.save();
                res.status(200).json({ data: artist });
            }
            else
                next(createError(404));
        }
        catch(e) {
            next(createError(400, {debugMessage: e.message}));
        }
    })
};

const deleteArtist = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        const artist = await Artist.findByPk(req.params.artistId);
            if(artist) {
                await artist.destroy();
                res.sendStatus(204);
            }
            else
                next(createError(404));
    })
};

module.exports = { listArtists, createArtist, getArtist, updateArtist, deleteArtist }