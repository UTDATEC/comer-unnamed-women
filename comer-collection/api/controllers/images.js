import createError from "http-errors";
import db from "../sequelize.js";
const { Image, Artist, Tag, Exhibition } = db;
import { join } from "path";
import { deleteItem, updateItem, listItems, getItem, createItem } from "./items.js";
// const errorImage = require("../../public/images/image_coming_soon.jpg");
import imageType from "image-type";


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
        if (image?.url ?? image?.thumbnailUrl) {
            const downloadedImage = await fetch(image.url ?? image.thumbnailUrl);
            const imageData = await downloadedImage.blob();
            const imageBuffer = await imageData.arrayBuffer();
            const type = await imageType(imageBuffer);
            console.log(type);
            res.setHeader("Content-Type", "image/png");
            res.setHeader("Cross-Origin-Resource-Policy", "same-site");
            res.status(200).send(Buffer.from(imageBuffer));
        }
        else {
            res.setHeader("Content-Type", "image/png");
            res.setHeader("Cross-Origin-Resource-Policy", "same-site");
            res.status(200).sendFile(join(__dirname, "../../public/images", "image_coming_soon.jpg"));
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


export { downloadImagePublic, listImages, listImagesPublic, createImage, getImage, getImagePublic, updateImage, deleteImage };