import db from "../sequelize.js";
const { Tag, Image } = db;
import { deleteItem, updateItem, createItem, getItem, listItems } from "./items.js";



const listTags = async (req, res, next) => {
    await listItems(req, res, next, Tag, [Image], {});
};

const getTag = async (req, res, next) => {
    await getItem(req, res, next, Tag, [Image], req.params.tagId);
};

const createTag = async (req, res, next) => {
    await createItem(req, res, next, Tag);
};

const updateTag = async (req, res, next) => {
    await updateItem(req, res, next, Tag, req.params.tagId);
};

const deleteTag = async (req, res, next) => {
    await deleteItem(req, res, next, Tag, req.params.tagId);
};

export { getTag, listTags, createTag, updateTag, deleteTag };