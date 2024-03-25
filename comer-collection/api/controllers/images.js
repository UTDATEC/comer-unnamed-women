import createError from "http-errors";
import db from "../sequelize.js";
import { join } from "path";
import { deleteItem, updateItem, listItems, getItem, createItem } from "./items.js";
const { Image, Artist, Tag, Exhibition } = db;
// const errorImage = require("../../public/images/image_coming_soon.jpg");
import imageType from "image-type";
import path from "path";
import url from "url";


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
        try {
            if(!image?.url && !image?.thumbnailUrl) {
                throw "No URL";
            }
            const downloadedImage = await fetch(image.url ?? image.thumbnailUrl);
            const imageData = await downloadedImage.blob();
            const imageBuffer = await imageData.arrayBuffer();
            const type = await imageType(imageBuffer);
            if(type && type.mime.startsWith("image/")) {
                res.setHeader("Content-Type", type.mime);
                res.setHeader("Cross-Origin-Resource-Policy", "same-site");
                res.status(200).send(Buffer.from(imageBuffer));
            } else {
                throw "Not an image";
            }
        } catch(e) {
            res.setHeader("Content-Type", "image/jpg");
            res.setHeader("Cross-Origin-Resource-Policy", "same-site");
            res.status(200).sendFile(join(path.dirname(url.fileURLToPath(import.meta.url)), "../../public/images", "image_coming_soon.jpg"));
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