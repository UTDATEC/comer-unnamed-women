const createError = require('http-errors');
const { Image, Artist } = require("../sequelize.js");
const { adminOperation } = require("../security.js");


const listImages = async (req, res, next) => {
    const images = await Image.findAll({
        include: Artist
    });
    res.status(200).json({ data: images });
};

const createImage = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        try {
            if(req.body.id)
                throw new Error("Image id should not be included when creating an Image");
            const newImage = await Image.create(req.body);
            res.status(201).json({ data: newImage });
        } catch (e) {
            next(createError(400, {debugMessage: e.message}));
        }
    })
};

const getImage = async (req, res, next) => {
    const image = await Image.findByPk(req.params.imageId, {
        include: Artist
    });
    if(image)
        res.status(200).json({ data: image });
    else
        next(createError(404));
};

const updateImage = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        try {
            const image = await Image.findByPk(req.params.imageId);
            if(image) {
                console.log(req.body.id, req.params.imageId);
                if(req.body.id && req.body.id !== req.params.imageId) {
                    throw new Error("Image id in request body does not match Image id in URL");
                }
                image.set(req.body)
                await image.save();
                res.status(200).json({ data: image });
            }
            else
                next(createError(404));
        }
        catch(e) {
            next(createError(400, {debugMessage: e.message}));
        }
    })
};

const deleteImage = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        const image = await Image.findByPk(req.params.imageId);
            if(image) {
                await image.destroy();
                res.sendStatus(204);
            }
            else
                next(createError(404));
    })
};

const assignArtistToImage = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        const image = await Image.findByPk(req.params.imageId);
        const artist = await Artist.findByPk(req.params.artistId);
        if(image && artist) {
            try {
                image.addArtist(artist)
                res.status(200).json({ data: image });
            } catch(e) {
                next(createError(400, {debugMessage: e.message}));
            }
        }
        else
            next(createError(404));
    })
}

module.exports = { listImages, createImage, getImage, updateImage, deleteImage, assignArtistToImage }