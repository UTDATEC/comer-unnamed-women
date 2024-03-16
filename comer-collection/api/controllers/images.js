const createError = require('http-errors');
const { Image, Artist, Tag, Exhibition, sequelize } = require("../sequelize.js");
const { adminOperation } = require("../security.js");
const { convertEmptyFieldsToNullFields } = require('../helper_methods.js');
const { Op } = require('sequelize');
const https = require('https');
const path = require('path');
const { deleteItem, updateItem } = require('./items.js');

const isImageDeletable = (imageJSON) => {
    return Boolean(imageJSON.Exhibitions?.length == 0);
}

const listImagesPublic = async (req, res, next) => {
    const images = await Image.findAll({
        include: [Artist, Tag]
    });
    res.status(200).json({ data: images });
};

const listImages = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        const images = Array.from(await Image.findAll({
            include: [Artist, Tag, Exhibition],
            attributes: {
                include: ['url']
            }
        })).map((i) => {
            const imageJSON = i.toJSON();
            return {
                ...imageJSON, 
                is_deletable: isImageDeletable(imageJSON)
            };
        })
        res.status(200).json({ data: images });
    })
};

const createImage = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        try {
            if(req.body.id)
                throw new Error("Image id should not be included when creating an Image");
            const imageData = convertEmptyFieldsToNullFields(req.body);
            const newImage = await Image.create(imageData);
            res.status(201).json({ data: newImage });
        } catch (e) {
            next(createError(400, {debugMessage: e.message}));
        }
    })
};

const getImagePublic = async (req, res, next) => {
    const image = await Image.findByPk(req.params.imageId, {
        include: [Artist, Tag]
    });
    if(image)
        res.status(200).json({ data: image });
    else
        next(createError(404));
};

const downloadImagePublic = async(req, res, next) => {
    try {
        const image = await Image.findByPk(req.params.imageId, {
            attributes: {
                include: ['url']
            }
        })
        if(!image)
            throw new Error("Image metadata could not be retrieved from the database")
        else if(image.url ?? image.thumbnailUrl) {
            const downloadedImage = await fetch(image.url ?? image.thumbnailUrl)
            const imageData = await downloadedImage.blob();
            const imageBuffer = await imageData.arrayBuffer();
            res.setHeader('Content-Type', 'image/png')
            res.setHeader('Cross-Origin-Resource-Policy', 'same-site')
            res.status(200).send(Buffer.from(imageBuffer));
        }
        else
            res.status(200).sendFile(path.join(__dirname, '../static', 'utd.jpg'));
    } catch(e) {
        next(createError(500, {debugMessage: e.message}))
    }
}

const getImage = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        const image = await Image.findByPk(req.params.imageId, {
            include: [Artist, Tag, Exhibition]
        });
        if(image) {
            const imageJSON = image.toJSON();
            res.status(200).json({ 
                data: {
                    ...imageJSON, 
                    is_deletable: isImageDeletable(imageJSON)
                } 
            });
        }
        else
            next(createError(404));
    })
};


const updateImage = async (req, res, next) => {
    await updateItem(req, res, next, Image, req.params.imageId);
}

const deleteImage = async (req, res, next) => {
    await deleteItem(req, res, next, Image, req.params.imageId);
}


module.exports = { downloadImagePublic, listImages, listImagesPublic, createImage, getImage, getImagePublic, updateImage, deleteImage }