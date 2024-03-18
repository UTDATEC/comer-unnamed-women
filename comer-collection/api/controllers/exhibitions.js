const createError = require("http-errors");
const { User, Course, Exhibition, sequelize } = require("../sequelize.js");
const { canUserCreateExhibition } = require("./users.js");
const { listItems, getItem, createItem, updateItem, deleteItem } = require("./items.js");


const isAppUserExhibitionOwner = (app_user, exhibition_id) => {
    // Exhibitions owned by current app user are already included 
    // during authentication process.  Scan that list to determine
    // whether the exhibition being edited is owned by the current user.
    return Boolean(app_user.Exhibitions
        .filter((ex) => ex.id == exhibition_id).length);
};


const listExhibitions = async (req, res, next) => {
    await listItems(req, res, next, Exhibition, {
        model: User,
        include: [Course]
    });
};

const listPublicExhibitions = async (req, res, next) => {
    await listItems(req, res, next, Exhibition.scope("with_public_curators"), [], {
        privacy: ["PUBLIC", "PUBLIC_ANONYMOUS"]
    });
};

const createExhibition = async (req, res, next) => {
    if (!canUserCreateExhibition(req.app_user)) {
        return next(createError(403));
    }
    const now = Date.now();
    req.body = {
        ...req.body,
        date_created: now,
        date_modified: now,
        exhibition_owner: req.app_user.id
    };
    await createItem(req, res, next, Exhibition, [
        "title", "privacy",
        "date_created", "date_modified",
        "exhibition_owner"
    ]);
};

const getExhibition = async (req, res, next) => {
    await getItem(req, res, next, Exhibition, {
        model: User,
        include: [Course]
    }, req.params.exhibitionId);
};

const ownerEditExhibitionSettings = async (req, res, next) => {
    if (!isAppUserExhibitionOwner(req.app_user, req.params.exhibitionId)) {
        return next(createError(403));
    }
    await updateItem(req, res, next, Exhibition, req.params.exhibitionId, [
        "title", "privacy"
    ]);
};

const ownerDeleteExhibition = async (req, res, next) => {
    if (!isAppUserExhibitionOwner(req.app_user, req.params.exhibitionId)) {
        return next(createError(403));
    }
    await deleteItem(req, res, next, Exhibition, req.params.exhibitionId);
};


const adminEditExhibitionSettings = async (req, res, next) => {
    await updateItem(req, res, next, Exhibition, req.params.exhibitionId, [
        "title", "privacy"
    ]);
};

const adminDeleteExhibition = async (req, res, next) => {
    await deleteItem(req, res, next, Exhibition, req.params.exhibitionId);
};

const loadExhibitionOwner = async (req, res, next) => {
    if (!isAppUserExhibitionOwner(req.app_user, req.params.exhibitionId)) {
        return next(createError(403));
    }
    try {
        const exhibition = await Exhibition.scope([
            "with_data",
            "with_public_curators"
        ]).findByPk(req.params.exhibitionId);
        if (!exhibition) {
            next(createError(404));
        } else {
            res.status(200).json({
                data: {
                    ...exhibition.toJSON(),
                    isEditable: true
                }
            });
        }
    } catch (e) {
        next(createError(400), { debugMessage: e.message });
    }
};

const loadExhibitionAdmin = async (req, res, next) => {
    try {
        const exhibition = await Exhibition.scope([
            "with_data",
            "with_public_curators"
        ]).findByPk(req.params.exhibitionId);
        if (!exhibition) {
            next(createError(404));
        } else {
            res.status(200).json({
                data: {
                    ...exhibition.toJSON(),
                    isEditable: true
                }
            });
        }
    } catch (e) {
        next(createError(400), { debugMessage: e.message });
    }
};

const loadExhibitionPublic = async (req, res, next) => {
    try {
        const exhibition = await Exhibition.scope([
            "with_data",
            "with_public_curators"
        ]).findOne({
            where: {
                id: req.params.exhibitionId,
                privacy: ["PUBLIC", "PUBLIC_ANONYMOUS"]
            }
        });
        if (!exhibition) {
            next(createError(401));
        }
        else {
            res.status(200).json({
                data: {
                    ...exhibition.toJSON(),
                    isEditable: false
                }
            });
        }
    } catch (e) {
        next(createError(400), { debugMessage: e.message });
    }
};


const saveExhibition = async (req, res, next) => {
    try {
        await sequelize.transaction(async (t) => {
            const exhibition = await Exhibition.findByPk(req.params.exhibitionId, {
                transaction: t
            });
            if (!exhibition)
                next(createError(404));
            else {
                await exhibition.update({
                    data: req.body.data,
                    date_modified: Date.now()
                }, { transaction: t });
                await exhibition.setImages(
                    JSON.parse(req.body.data).images.map((i) => i.image_id), { transaction: t }
                );
            }
            res.sendStatus(204);
        });
    } catch (e) {
        next(createError(400), { debugMessage: e.message + "\n" + e.stack });
    }
};


const saveExhibitionOwner = async (req, res, next) => {
    if (!isAppUserExhibitionOwner(req.app_user, req.params.exhibitionId)) {
        return next(createError(403));
    }
    await saveExhibition(req, res, next);
};


const saveExhibitionAdmin = async (req, res, next) => {
    await saveExhibition(req, res, next);
};

module.exports = { listPublicExhibitions, createExhibition, adminEditExhibitionSettings, ownerEditExhibitionSettings, ownerDeleteExhibition, adminDeleteExhibition, listExhibitions, getExhibition, loadExhibitionOwner, loadExhibitionAdmin, loadExhibitionPublic, saveExhibitionOwner, saveExhibitionAdmin };