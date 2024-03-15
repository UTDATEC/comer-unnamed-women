const createError = require('http-errors');
const { Artist, Image } = require("../sequelize.js");
const { adminOperation } = require("../security.js");
const { convertEmptyFieldsToNullFields } = require('../helper_methods.js');



const isArtistDeletable = (artistJSON) => {
    return Boolean(artistJSON.Images?.length == 0);
}


const listArtists = async (req, res) => {
    const artists = Array.from(await Artist.findAll({
        include: Image
    })).map((a) => {
        const artistJSON = a.toJSON();
        return {
            ...artistJSON, 
            is_deletable: isArtistDeletable(artistJSON)
        };
    });
    res.status(200).json({ data: artists });
};

const createArtist = async (req, res, next) => {
    if(req.body.id)
        throw new Error("Artist id should not be included when creating an Artist");
    const artistData = convertEmptyFieldsToNullFields(req.body);
    const newArtist = await Artist.create(artistData);
    res.status(201).json({ data: newArtist });
};

const getArtist = async (req, res, next) => {
    const artist = await Artist.findByPk(req.params.artistId, {
        include: Image
    });
    if(artist) {
        const artistData = {...artist.toJSON(), is_deletable: isArtistDeletable(artist.toJSON())}
        res.status(200).json({ data: artistData });
    }
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
                const artistData = convertEmptyFieldsToNullFields(req.body);
                await artist.update(artistData);
                res.status(200).json({ data: artistData });
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
        const artist = await Artist.findByPk(req.params.artistId, {
            include: [Image]
        });
        if(artist) {
            if(!isArtistDeletable(artist.toJSON())) {
                next(createError(422, {debugMessage: "Artist is not eligible for deletion."}))
            }
            else {
                await artist.destroy();
                res.sendStatus(204);
            }
        }
        else
            next(createError(404));
    })
};

module.exports = { listArtists, createArtist, getArtist, updateArtist, deleteArtist }