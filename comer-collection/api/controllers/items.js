import createError from "http-errors";
import db from "../sequelize.js";
const { sequelize } = db;


const getItem = async (req, res, next, model, include, itemId, itemFunctions = {}) => {
    try {
        if (req.body.id) {
            throw new Error("The request body should not contain an ID.  Put the ID in the URL.");
        }
        const item = await model.findByPk(itemId, { include });
        if (!item) {
            next(createError(404));
        }
        let i = item.toJSON();
        for (let f in itemFunctions) {
            i[f] = itemFunctions[f](i);
        }
        res.status(200).json({ data: i });
    } catch (e) {
        next(createError(400, { debugMessage: e.message }));
    }
};


const listItems = async (req, res, next, model, include, where, itemFunctions = {}) => {
    try {
        const items = Array.from(await model.findAll({ include, where })).map((i) => {
            i = i.toJSON();
            for (let f in itemFunctions) {
                i[f] = itemFunctions[f](i);
            }
            return i;
        });
        res.status(200).json({ data: items });
    } catch (e) {
        next(createError(400, { debugMessage: e.message }));
    }
};


const createItem = async (req, res, next, model, restrictFields = null) => {
    try {
        if (req.body.id) {
            throw new Error("The request body should not contain an ID.  Put the ID in the URL.");
        }
        else if (restrictFields) {
            for (let f in req.body) {
                if (restrictFields.indexOf(f) < 0) {
                    throw new Error(`Request body contains field ${f} which is not in restrictFields`);
                }
            }
        }
        const newItem = await sequelize.transaction(async (t) => {
            return await model.create(req.body, {
                transaction: t
            });
        });
        res.status(201).json({ data: newItem.toJSON() });
    } catch (e) {
        next(createError(400, { debugMessage: e.message }));
    }
};


const updateItem = async (req, res, next, model, itemId, restrictFields = null) => {
    try {
        if (req.body.id) {
            throw new Error("The request body should not contain an ID.  Put the ID in the URL.");
        }
        else if (restrictFields) {
            for (let f in req.body) {
                if (restrictFields.indexOf(f) < 0) {
                    throw new Error(`Request body contains field ${f} which is not in restrictFields`);
                }
            }
        }
        await sequelize.transaction(async (t) => {
            const [rowsUpdated] = await model.update(req.body, {
                where: { id: itemId },
                transaction: t
            });
            if (rowsUpdated > 1) {
                throw new Error(`Number of updated rows was ${rowsUpdated}`);
            }
        });
        res.sendStatus(204);
    } catch (e) {
        next(createError(400, { debugMessage: e.message + "\n" + e.stack }));
    }
};

const deleteItem = async (req, res, next, model, itemId) => {
    try {
        if (req.body.id) {
            throw new Error("The request body should not contain an ID.  Put the ID in the URL.");
        }
        await sequelize.transaction(async (t) => {
            const rowsDeleted = await model.destroy({
                where: { id: itemId },
                transaction: t
            });
            if (rowsDeleted > 1) {
                throw new Error(`Number of deleted rows was ${rowsDeleted}`);
            }
        });
        res.sendStatus(204);
    } catch (e) {
        next(createError(400, { debugMessage: e.message }));
    }
};

export { getItem, listItems, updateItem, deleteItem, createItem };