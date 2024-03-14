const createError = require('http-errors');
const { User, Course, Exhibition, sequelize } = require("../sequelize.js");
const { adminOperation, userOperation } = require('../security.js');
const { canUserCreateExhibition } = require('./users.js');
const { convertEmptyFieldsToNullFields } = require('../helper_methods.js');
const { Op } = require('sequelize');


const listExhibitions = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        try {
            const exhibitions = await Exhibition.findAll({
                include: [{
                    model: User,
                    include: [Course]
                }]
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
            const exhibitionItem = {id, title, date_created, date_modified}
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
                include: [Course, Exhibition]
            });
            if(req.body.id)
                throw new Error("Image id should not be included when creating an Image");
            else if(!canUserCreateExhibition(user.toJSON())) {
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
            const exhibition = await ExhibitionWithData.findByPk(req.params.exhibitionId);
            const owner = await exhibition?.getUser();
            if(!exhibition)
                next(createError(404));
            else if(exhibition.privacy != "PUBLIC" && exhibition.privacy != "PUBLIC_ANONYMOUS" && owner.id != user_id)
                next(createError(403, {debugMessage: "Cannot load private exhibition you do not own"}))
            else {
                const {id, title, date_created, date_modified, data} = exhibition.toJSON();
                const exhibitionJSON = {id, title, date_created, date_modified, data};
                if(exhibition.privacy == "PUBLIC")
                    exhibitionJSON.curator = owner.full_name
                res.status(200).json({data: {
                    ...exhibitionJSON, 
                    isEditable: owner.id == user_id
                }})
            }
        } catch(e) {
            next(createError(500), {debugMessage: e.message});
        }
    })
}

const loadExhibitionAdmin = async(req, res, next) => {
    adminOperation(req, res, next, async(user_id) => {
        try {
            const ExhibitionWithData = Exhibition.scope('with_data');
            const exhibition = await ExhibitionWithData.findByPk(req.params.exhibitionId, {
                include: [User]
            });
            const owner = exhibition?.User;
            if(!exhibition)
                next(createError(404));
            else {
                const {id, title, date_created, date_modified, data} = exhibition.toJSON();
                const exhibitionJSON = {id, title, date_created, date_modified, data};
                if(exhibition.privacy == "PUBLIC")
                    exhibitionJSON.curator = owner.full_name
                res.status(200).json({data: {
                    ...exhibitionJSON, 
                    isEditable: true
                }})
            }
        } catch(e) {
            next(createError(500), {debugMessage: e.message});
        }
    })
}

const loadExhibitionPublic = async(req, res, next) => {
    try {
        const ExhibitionWithData = Exhibition.scope('with_data');
        const exhibition = await ExhibitionWithData.findByPk(req.params.exhibitionId);
        const owner = await exhibition?.getUser();
        if(!exhibition)
            next(createError(404));
        else if(exhibition.privacy != "PUBLIC" && exhibition.privacy != "PUBLIC_ANONYMOUS")
            next(createError(403, {debugMessage: "This exhibition is private and no user is logged in."}));
        else {
            const {id, title, date_created, date_modified, data} = exhibition.toJSON();
            const exhibitionJSON = {id, title, date_created, date_modified, data};
            if(exhibition.privacy == "PUBLIC")
                exhibitionJSON.curator = owner.full_name
            res.status(200).json({data: {
                ...exhibitionJSON, 
                isEditable: false
            }})
        }
    } catch(e) {
        next(createError(500, {debugMessage: e.message}));
    }
}


const saveExhibition = async (req, res, next) => {
    userOperation(req, res, next, async(user_id) => {
        const t = await sequelize.transaction();
        try {
            const ExhibitionWithData = Exhibition.scope('with_data');
            const exhibition = await ExhibitionWithData.findByPk(req.params.exhibitionId, {
                include: [User]
            }, { transaction: t });
            if(!exhibition)
                next(createError(404));
            else if(exhibition.User.id != user_id)
                next(createError(403, {debugMessage: "Cannot save exhibition you do not own"}))
            else {
                await exhibition.update({
                    data: req.body.data,
                    date_modified: Date.now()
                }, { transaction: t });
                await exhibition.setImages(
                    JSON.parse(req.body.data).images.map((i) => i.image_id), { transaction: t }
                );
                await t.commit();
                res.status(200).json({data: exhibition})
            }
        } catch(e) {
            await t.rollback();
            next(createError(500), {debugMessage: e.message});
        }
    })
}


const saveExhibitionAdmin = async (req, res, next) => {
    adminOperation(req, res, next, async(user_id) => {
        const t = await sequelize.transaction();
        try {
            const ExhibitionWithData = Exhibition.scope('with_data');
            const exhibition = await ExhibitionWithData.findByPk(req.params.exhibitionId, {
                include: [User]
            }, { transaction: t });
            if(!exhibition)
                next(createError(404));
            else {
                await exhibition.update({
                    data: req.body.data,
                    date_modified: Date.now()
                }, { transaction: t });
                await exhibition.setImages(
                    JSON.parse(req.body.data).images.map((i) => i.image_id), {
                        transaction: t
                    }
                );
                await t.commit();
                res.status(200).json({data: exhibition})
            }
        } catch(e) {
            await t.rollback();
            next(createError(500), {debugMessage: e.message});
        }
    })
}

module.exports = { listPublicExhibitions, createExhibition, adminEditExhibition, ownerEditExhibition, ownerDeleteExhibition, adminDeleteExhibition, listExhibitions, getExhibition, loadExhibition, loadExhibitionAdmin, loadExhibitionPublic, saveExhibition, saveExhibitionAdmin, listMyExhibitions }