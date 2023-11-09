const createError = require('http-errors');
const { User, Course, Exhibition } = require("../sequelize.js");
const { adminOperation } = require('../security.js');



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

module.exports = { listExhibitions, getExhibition }