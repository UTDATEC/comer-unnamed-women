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

// const deleteImage = async (req, res, next) => {
//     adminOperation(req, res, next, async () => {
//         const image = await Image.findByPk(req.params.imageId, {
//             include: [Exhibition]
//         });
//         if(image) {
//             if(!isImageDeletable(image.toJSON())) {
//                 next(createError(422, {debugMessage: "Image is not eligible for deletion."}))
//             }
//             else {
//                 await image.destroy();
//                 res.sendStatus(204);
//             }
//         }
//         else
//             next(createError(404));
//     })
// };

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
    const t = await sequelize.transaction();
    try {
        const artist = await Artist.findByPk(artistId);
        if(isAssign)
            await artist.addImages(images, {transaction: t})
        else
            await artist.removeImages(images, {transaction: t});
        await t.commit();
    } catch(e) {
        await t.rollback();
        throw new Error(e.message);
    }
}

const assignArtistToImages = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        try {
            await manageArtistForImages(req.params.artistId, req.body.images, true);
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
            await manageArtistForImages(req.params.artistId, req.body.images, false);
            res.sendStatus(204);
        }
        catch(e) {
            next(createError(400, {debugMessage: e.message}))
        }
    })
}





const manageTagForImages = async(tagId, images, isAssign) => {
    const t = await sequelize.transaction();
    try {
        const tag = await Tag.findByPk(tagId, { transaction: t });
        if(isAssign)
            await tag.addImages(images, { transaction: t })
        else
            await tag.removeImages(images, { transaction: t });
        await t.commit();
    } catch(e) {
        await t.rollback();
        throw new Error(e.message);
    }
}

const assignTagToImages = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        try {
            await manageTagForImages(req.params.tagId, req.body.images, true);
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
            await manageTagForImages(req.params.tagId, req.body.images, false);
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
                    await image.removeArtist(artist);
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
                    await image.addTag(tag);
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
                    await image.removeTag(tag);
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