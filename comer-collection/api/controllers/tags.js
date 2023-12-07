const createError = require('http-errors');
const { Tag, Image } = require("../sequelize.js");
const { adminOperation } = require('../security.js');
const { convertEmptyFieldsToNullFields } = require('../helper_methods.js');

const isTagDeletable = (tagJSON) => {
    return Boolean(tagJSON.Images?.length == 0);
}


const listTags = async (req, res, next) => {
    const tags = Array.from(await Tag.findAll({
        include: Image
    })).map((a) => {
        const tagJSON = a.toJSON();
        return {
            ...tagJSON, 
            is_deletable: isTagDeletable(tagJSON)
        };
    });
    res.status(200).json({ data: tags });
};

const getTag = async (req, res, next) => {
    const tag = await Tag.findByPk(req.params.tagId, {
        include: Image
    });
    if(tag) {
        const tagData = {...tag.toJSON(), is_deletable: isTagDeletable(tag.toJSON())}
        res.status(200).json({ data: tagData });
    }
    else
        next(createError(404));
};

const createTag = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        try {
            if(req.body.id)
                throw new Error("Tag id should not be included when creating a tag")
            const tagData = convertEmptyFieldsToNullFields(req.body);
            const newTag = await Tag.create(tagData);
            res.status(201).json({ data: newTag });
        } catch (e) {
            next(createError(400, {debugMessage: e.message}));
        }
    })
};

const updateTag = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        try {
            const tag = await Tag.findByPk(req.params.tagId)
            if(tag) {
                console.log(req.body.id, req.params.tagId);
                if(req.body.id && req.body.id !== req.params.tagId) {
                    throw new Error("Tag id in request body does not match Tag id in URL")
                }
                const tagData = convertEmptyFieldsToNullFields(req.body);
                await tag.update(tagData);
                res.status(200).json({ data: tagData })
            }
            else
                next(createError(404));
        }
        catch(e) {
            next(createError(400, {debugMessage: e.message}));
        }
    })
};

const deleteTag = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        const tag = await Tag.findByPk(req.params.tagId, {
            include: [Image]
        });
        if(tag) {
            if(!isTagDeletable(tag.toJSON())) {
                next(createError(422, {debugMessage: "Tag is not eligible for deletion."}))
            }
            else {
                await tag.destroy();
                res.sendStatus(204);
            }
        }
        else
            next(createError(404))
    })
};

module.exports = { getTag, listTags, createTag, updateTag, deleteTag }