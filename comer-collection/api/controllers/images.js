const createError = require('http-errors');
const { Image, Artist, Tag, Exhibition, sequelize } = require("../sequelize.js");
const { adminOperation } = require("../security.js");
const { convertEmptyFieldsToNullFields } = require('../helper_methods.js');
const { Op } = require('sequelize');
const https = require('https')

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
            include: [Artist, Tag, Exhibition]
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
        const image = await Image.findByPk(req.params.imageId)
        if(!image)
            throw new Error("Image metadata could not be retrieved from the database")
        else if(!image?.url)
            throw new Error("Image does not appear to have a URL");
        https.get(image.url, (imageRes) => imageRes.pipe(res)).on('error', (e) => {
            console.error(e);
        });
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
    adminOperation(req, res, next, async () => {
        try {
            const image = await Image.findByPk(req.params.imageId);
            if(image) {
                console.log(req.body.id, req.params.imageId);
                if(req.body.id && req.body.id !== req.params.imageId) {
                    throw new Error("Image id in request body does not match Image id in URL");
                }
                const imageData = convertEmptyFieldsToNullFields(req.body);
                await image.update(imageData);
                res.status(200).json({ data: imageData });
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
        const image = await Image.findByPk(req.params.imageId, {
            include: [Exhibition]
        });
        if(image) {
            if(!isImageDeletable(image.toJSON())) {
                next(createError(422, {debugMessage: "Image is not eligible for deletion."}))
            }
            else {
                await image.destroy();
                res.sendStatus(204);
            }
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
                    image.addArtist(artist);
                    res.sendStatus(204);
                } catch(e) {
                    next(createError(400, {debugMessage: e.message}));
                }
            }
            else
                next(createError(404));
    })
};




const manageArtistForImages = async(artistId, images, isAssign) => {
    const transaction = await sequelize.transaction();
    try {
        const artist = await Artist.findByPk(artistId);
        if(isAssign)
            artist.addImages(images)
        else
            artist.removeImages(images);
        await transaction.commit();
    } catch(e) {
        await transaction.rollback();
        throw new Error(e.message);
    }
}

const assignArtistToImages = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        try {
            manageArtistForImages(req.params.artistId, req.body.images, true);
            res.sendStatus(204);
        }
        catch(e) {
            next(createError(400, {debugMessage: e.message}))
        }
    })
}

const unassignArtistFromImages = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        try {
            manageArtistForImages(req.params.artistId, req.body.images, false);
            res.sendStatus(204);
        }
        catch(e) {
            next(createError(400, {debugMessage: e.message}))
        }
    })
}





const manageTagForImages = async(tagId, images, isAssign) => {
    const transaction = await sequelize.transaction();
    try {
        const tag = await Tag.findByPk(tagId);
        if(isAssign)
            tag.addImages(images)
        else
            tag.removeImages(images);
        await transaction.commit();
    } catch(e) {
        await transaction.rollback();
        throw new Error(e.message);
    }
}

const assignTagToImages = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        try {
            manageTagForImages(req.params.tagId, req.body.images, true);
            res.sendStatus(204);
        }
        catch(e) {
            next(createError(400, {debugMessage: e.message}))
        }
    })
}

const unassignTagFromImages = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        try {
            manageTagForImages(req.params.tagId, req.body.images, false);
            res.sendStatus(204);
        }
        catch(e) {
            next(createError(400, {debugMessage: e.message}))
        }
    })
}






const unassignArtistFromImage = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        const image = await Image.findByPk(req.params.imageId);
        const artist = await Artist.findByPk(req.params.artistId);
            if(image && artist) {
                try {
                    image.removeArtist(artist);
                    res.sendStatus(204);
                } catch(e) {
                    next(createError(400, {debugMessage: e.message}));
                }
            }
            else
                next(createError(404));
    })
}

const getTags = async (req, res, next) => {
    const image = await Image.findByPk(req.params.imageId, {
        include: Tag
    });
    if(image) {
        try {
            res.status(200).json({ tags: image.Tags });
        } catch(e) {
            next(createError(400, {debugMessage: e.message}));
        }
    }
    else
        next(createError(404));
}

const assignTagToImage = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        const image = await Image.findByPk(req.params.imageId);
        const tag = await Tag.findByPk(req.params.tagId);
            if(image && tag) {
                try {
                    image.addTag(tag);
                    res.sendStatus(204);
                } catch(e) {
                    next(createError(400, {debugMessage: e.message}));
                }
            }
            else
                next(createError(404));
    })
};

const unassignTagFromImage = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        const image = await Image.findByPk(req.params.imageId);
        const tag = await Tag.findByPk(req.params.tagId);
            if(image && tag) {
                try {
                    image.removeArtist(tag);
                    res.sendStatus(204);
                } catch(e) {
                    next(createError(400, {debugMessage: e.message}));
                }
            }
            else
                next(createError(404));
    })
}


module.exports = { downloadImagePublic, listImages, listImagesPublic, createImage, getImage, getImagePublic, updateImage, deleteImage, assignArtistToImage, assignArtistToImages, unassignArtistFromImages, unassignArtistFromImage, getTags, assignTagToImage, unassignTagFromImage, assignTagToImages, unassignTagFromImages }