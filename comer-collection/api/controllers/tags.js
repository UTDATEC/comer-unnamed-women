const createError = require('http-errors');
const { Tag } = require("../sequelize.js")

const listTags = async (req, res, next) => {
    const tags = await Tag.findAll();
    res.status(200).json({ data: tags });
};

const createTag = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        try {
            if(req.body.id)
                throw new Error("Tag id should not be included when creating a tag")
            const newTag = await Tag.create(req.body);
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
                    throw new Error("Tag id in request body does not match Artist id in URL")
                }
                tag.set(req.body);
                await tag.save();
                res.status(200).json({ data: tag })
            }
            else
                next(createError(404));
        }
        catch(e) {
            next(createError(400, {debugMessage: e.message}))
        }
    })
}
// Admin only
// Create tag
// Update tag
// Delete tag