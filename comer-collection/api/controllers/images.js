const createError = require("http-errors");
const { Image, Artist, Tag, Exhibition } = require("../sequelize.js");
const path = require("path");
const { deleteItem, updateItem, listItems, getItem, createItem } = require("./items.js");
// const errorImage = require("../../public/images/image_coming_soon.jpg");


const listImagesPublic = async (req, res, next) => {
    await listItems(req, res, next, Image, [
        Artist, Tag
    ]);
};

const listImages = async (req, res, next) => {
    await listItems(req, res, next, Image.scope("admin"), [
        Artist, Tag, Exhibition
    ]);
};

const createImage = async (req, res, next) => {
    await createItem(req, res, next, Image);
};

const getImagePublic = async (req, res, next) => {
    await getItem(req, res, next, Image, [
        Artist, Tag
    ], req.params.imageId);
};

const downloadImagePublic = async (req, res, next) => {
    try {
        const image = await Image.findByPk(req.params.imageId, {
            attributes: {
                include: ["url", "thumbnailUrl"]
            }
        });
        if (!image)
            throw new Error("Image metadata could not be retrieved from the database");
        else if (image.url ?? image.thumbnailUrl) {
            const downloadedImage = await fetch(image.url ?? image.thumbnailUrl);
            const imageData = await downloadedImage.blob();
            const imageBuffer = await imageData.arrayBuffer();
            res.setHeader("Content-Type", "image/png");
            res.setHeader("Cross-Origin-Resource-Policy", "same-site");
            res.status(200).send(Buffer.from(imageBuffer));
        }
        else {
            res.setHeader("Content-Type", "image/png");
            res.setHeader("Cross-Origin-Resource-Policy", "same-site");
            res.status(200).sendFile(path.join(__dirname, "../../public/images", "image_coming_soon.jpg"));
        }
    } catch (e) {
        next(createError(500, { debugMessage: e.message }));
    }
};

const getImage = async (req, res, next) => {
    await getItem(req, res, next, Image.scope("admin"), [
        Artist, Tag, Exhibition
    ], req.params.imageId);
};


const updateImage = async (req, res, next) => {
    await updateItem(req, res, next, Image, req.params.imageId);
};

const deleteImage = async (req, res, next) => {
    await deleteItem(req, res, next, Image, req.params.imageId);
};


module.exports = { downloadImagePublic, listImages, listImagesPublic, createImage, getImage, getImagePublic, updateImage, deleteImage };