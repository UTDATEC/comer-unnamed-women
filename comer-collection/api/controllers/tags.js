const createError = require('http-errors');
const { Tag } = require("../sequelize.js")

const listTags = async (req, res, next) => {
    const tags = await Tag.findAll();
    res.status(200).json({ data: tags });
};

const createTag = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        const tag = await Tag.findByPk(req.params.tagId)
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
            
        }
    })
}
// Admin only
// Create tag
// Update tag
// Delete tag