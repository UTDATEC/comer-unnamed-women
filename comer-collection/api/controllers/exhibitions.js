const createError = require('http-errors');
const { User, Course, Exhibition } = require("../sequelize.js");
const { adminOperation, userOperation } = require('../security.js');
const { canUserCreateExhibition } = require('./users.js');
const { convertEmptyFieldsToNullFields } = require('../helper_methods.js');
const { Op } = require('sequelize');


const listExhibitions = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        try {
            const exhibitions = await Exhibition.findAll({
                include: [User]
            })
            res.status(200).json({data: exhibitions})
        } catch(e) {
            next(createError(500), {debugMessage: e.message});
        }
    });
}

const listMyExhibitions = async (req, res, next) => {
    userOperation(req, res, next, async(user_id) => {
        const user = await User.findByPk(user_id);
        const myExhibitions = await user.getExhibitions();
        if(user) {
            try {
                res.status(200).json({ data: myExhibitions });
            } catch(e) {
                next(createError(400, {debugMessage: e.message}));
            }
        }
        else
            next(createError(404));
    })
}

const listPublicExhibitions = async (req, res, next) => {
    try {
        const publicExhibitions = Array.from(await Exhibition.findAll({
            where: {
                [Op.or]: [
                    {privacy: "PUBLIC"},
                    {privacy: "PUBLIC_ANONYMOUS"}
                ]
            }
        }));
        const response = [];
        for(const ex of publicExhibitions) {
            const {id, title, date_created, date_modified} = ex.toJSON();
            const exhibitionItem = {
                id: ex.id,
                title: ex.title,
                date_created: ex.date_created,
                date_modified: ex.date_modified
            }
            if(ex.privacy == "PUBLIC") {
                const owner = await ex.getUser();
                exhibitionItem.curator = owner.full_name;
            }
            response.push(exhibitionItem);
        }
        res.status(200).json({data: response});
    } catch(e) {
        next(createError(500, {debugMessage: e.message}));
    }
}

const createExhibition = async (req, res, next) => {
    userOperation(req, res, next, async(user_id) => {
        try {
            const user = await User.findByPk(user_id, {
                include: [Course]
            });
            if(req.body.id)
                throw new Error("Image id should not be included when creating an Image");
            else if(!canUserCreateExhibition(user.toJSON())) {
                console.log(user.toJSON(), canUserCreateExhibition(user.toJSON()));
                next(createError(403, {debugMessage: "User is not eligible to create an exhibition."}))
            } else {
                const exhibitionFields = convertEmptyFieldsToNullFields(req.body);
                const now = Date.now()
                const newExhibition = await Exhibition.create({
                    title: exhibitionFields.title,
                    privacy: exhibitionFields.privacy,
                    date_created: now,
                    date_modified: now
                })
                newExhibition.setUser(user);
                res.status(201).json({ data: newExhibition });
            }
        } catch (e) {
            next(createError(400, {debugMessage: e.message}));
        }
    })
}

const getExhibition = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        try {
            const exhibition = await Exhibition.findByPk(req.params.exhibitionId, {
                include: [User]
            })
            if(!exhibition)
                next(createError(404));
            else
                res.status(200).json({data: exhibition})

        } catch(e) {
            next(createError(500), {debugMessage: e.message});
        }
    });
}

const ownerEditExhibition = async (req, res, next) => {
    userOperation(req, res, next, async(user_id) => {
        try {
            const exhibition = await Exhibition.findByPk(req.params.exhibitionId, {
                include: [User]
            })
            if(exhibition.User.id != user_id) {
                next(createError(403, {debugMessage: "User is not the owner of this exhibition."}))
            } else {
                const exhibitionFields = convertEmptyFieldsToNullFields(req.body);
                const now = Date.now()
                const updatedExhibition = await exhibition.update({
                    title: exhibitionFields.title,
                    privacy: exhibitionFields.privacy
                })
                res.status(200).json({ data: updatedExhibition });
            }
        } catch (e) {
            next(createError(400, {debugMessage: e.message}));
        }
    })
}

const ownerDeleteExhibition = async (req, res, next) => {
    userOperation(req, res, next, async(user_id) => {
        try {
            const exhibition = await Exhibition.findByPk(req.params.exhibitionId, {
                include: [User]
            })
            if(exhibition.User.id != user_id) {
                next(createError(403, {debugMessage: "User is not the owner of this exhibition."}))
            } else {
                await exhibition.destroy();
                res.sendStatus(204);
            }
        } catch (e) {
            next(createError(400, {debugMessage: e.message}));
        }
    })
}


const adminEditExhibition = async (req, res, next) => {
    adminOperation(req, res, next, async() => {
        try {
            const exhibition = await Exhibition.findByPk(req.params.exhibitionId)
            const exhibitionFields = convertEmptyFieldsToNullFields(req.body);
            const now = Date.now()
            const updatedExhibition = await exhibition.update({
                title: exhibitionFields.title,
                privacy: exhibitionFields.privacy
            })
            res.status(200).json({ data: updatedExhibition });
        } catch (e) {
            next(createError(400, {debugMessage: e.message}));
        }
    })
}

const adminDeleteExhibition = async (req, res, next) => {
    adminOperation(req, res, next, async() => {
        try {
            const exhibition = await Exhibition.findByPk(req.params.exhibitionId)
            await exhibition.destroy();
            res.sendStatus(204);
        } catch (e) {
            next(createError(400, {debugMessage: e.message}));
        }
    })
}

const loadExhibition = async (req, res, next) => {
    userOperation(req, res, next, async(user_id) => {
        try {
            const ExhibitionWithData = Exhibition.scope('with_data');
            const exhibition = await ExhibitionWithData.findByPk(req.params.exhibitionId, {
                include: [User]
            });
            if(!exhibition)
                next(createError(404));
            else if(exhibition.User.id != user_id)
                next(createError(403, {debugMessage: "Cannot load exhibition you do not own"}))
            else
                res.status(200).json({data: exhibition})
        } catch(e) {
            next(createError(500), {debugMessage: e.message});
        }
    })
}


const saveExhibition = async (req, res, next) => {
    userOperation(req, res, next, async(user_id) => {
        try {
            const ExhibitionWithData = Exhibition.scope('with_data');
            const exhibition = await ExhibitionWithData.findByPk(req.params.exhibitionId, {
                include: [User]
            });
            if(!exhibition)
                next(createError(404));
            else if(exhibition.User.id != user_id)
                next(createError(403, {debugMessage: "Cannot save exhibition you do not own"}))
            else
                await exhibition.update({
                    data: req.body.data,
                    date_modified: Date.now()
                });
                res.status(200).json({data: exhibition})
        } catch(e) {
            next(createError(500), {debugMessage: e.message});
        }
    })
}

module.exports = { listPublicExhibitions, createExhibition, adminEditExhibition, ownerEditExhibition, ownerDeleteExhibition, adminDeleteExhibition, listExhibitions, getExhibition, loadExhibition, saveExhibition, listMyExhibitions }