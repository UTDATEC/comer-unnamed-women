const createError = require('http-errors');
const { User, Course, Exhibition, sequelize } = require("../sequelize.js");
const { adminOperation, userOperation } = require('../security.js');
const { canUserCreateExhibition } = require('./users.js');
const { convertEmptyFieldsToNullFields } = require('../helper_methods.js');
const { Op } = require('sequelize');
const { listItems, getItem, createItem, updateItem, deleteItem } = require('./items.js');


const isAppUserExhibitionOwner = (app_user, exhibition_id) => {
    // Exhibitions owned by current app user are already included 
    // during authentication process.  Scan that list to determine
    // whether the exhibition being edited is owned by the current user.
    return Boolean(app_user.Exhibitions
        .filter((ex) => ex.id == exhibition_id).length)
}


const listExhibitions = async (req, res, next) => {
    await listItems(req, res, next, Exhibition, {
        model: User,
        include: [Course]
    });
}

const listPublicExhibitions = async (req, res, next) => {
    await listItems(req, res, next, Exhibition.scope('with_public_curators'), [], {
        privacy: ["PUBLIC", "PUBLIC_ANONYMOUS"]
    })
}

const createExhibition = async (req, res, next) => {
    if(!canUserCreateExhibition(req.app_user)) {
        return next(createError(403));
    }
    const now = Date.now();
    req.body = {
        ...req.body,
        date_created: now,
        date_modified: now,
        exhibition_owner: req.app_user.id
    }
    await createItem(req, res, next, Exhibition, [
        'title', 'privacy', 
        'date_created', 'date_modified', 
        'exhibition_owner'
    ])
}

const getExhibition = async (req, res, next) => {
    await getItem(req, res, next, Exhibition, {
        model: User,
        include: [Course]
    }, req.params.exhibitionId);
}

const ownerEditExhibitionSettings = async (req, res, next) => {
    if(!isAppUserExhibitionOwner(req.app_user, req.params.exhibitionId)) {
        return next(createError(403));
    }
    await updateItem(req, res, next, Exhibition, req.params.exhibitionId, [
        'title', 'privacy'
    ]);
}

const ownerDeleteExhibition = async (req, res, next) => {
    if(!isAppUserExhibitionOwner(req.app_user, req.params.exhibitionId)) {
        return next(createError(403));
    }
    await deleteItem(req, res, next, Exhibition, req.params.exhibitionId);
}


const adminEditExhibitionSettings = async (req, res, next) => {
    await updateItem(req, res, next, Exhibition, req.params.exhibitionId, [
        'title', 'privacy'
    ]);
}

const adminDeleteExhibition = async (req, res, next) => {
    await deleteItem(req, res, next, Exhibition, req.params.exhibitionId);
}

const loadExhibitionOwner = async (req, res, next) => {
    try {
        const exhibition = await Exhibition.scope([
            'with_data', 
            'with_public_curators'
        ]).findByPk(req.params.exhibitionId);
        if(!exhibition) {
            next(createError(404));
        } else if(exhibition.exhibition_owner != req.app_user.id) {
            next(createError(403));
        } else {
            res.status(200).json({
                data: {
                    ...exhibition.toJSON(),
                    isEditable: true
                }
            })
        }
    } catch(e) {
        next(createError(400), {debugMessage: e.message});
    }
}

const loadExhibitionAdmin = async(req, res, next) => {
    try {
        const exhibition = await Exhibition.scope([
            'with_data', 
            'with_public_curators'
        ]).findByPk(req.params.exhibitionId);
        if(!exhibition) {
            next(createError(404));
        } else {
            res.status(200).json({
                data: {
                    ...exhibition.toJSON(),
                    isEditable: true
                }
            })
        }
    } catch(e) {
        next(createError(400), {debugMessage: e.message});
    }
}

const loadExhibitionPublic = async(req, res, next) => {
    try {
        const exhibition = await Exhibition.scope([
            'with_data', 
            'with_public_curators'
        ]).findOne({
            where: {
                id: req.params.exhibitionId,
                privacy: ["PUBLIC", "PUBLIC_ANONYMOUS"]
            }
        });
        if(!exhibition) {
            next(createError(401));
        } 
        else {
            res.status(200).json({
                data: {
                    ...exhibition.toJSON(),
                    isEditable: false
                }
            })
        }
    } catch(e) {
        next(createError(400), {debugMessage: e.message});
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

module.exports = { listPublicExhibitions, createExhibition, adminEditExhibitionSettings, ownerEditExhibitionSettings, ownerDeleteExhibition, adminDeleteExhibition, listExhibitions, getExhibition, loadExhibitionOwner, loadExhibitionAdmin, loadExhibitionPublic, saveExhibition, saveExhibitionAdmin }