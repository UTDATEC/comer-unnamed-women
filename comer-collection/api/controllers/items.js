const createError = require('http-errors');
const { sequelize } = require("../sequelize.js");

const updateItem = async (req, res, next, model, itemId) => {
    try {
        if (req.body.id) {
            throw new Error("The request body should not contain an ID.  Put the ID in the URL.");
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
        next(createError(400, { debugMessage: e.message }));
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
}

module.exports = { updateItem, deleteItem }