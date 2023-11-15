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

const saveExhibition = async (req, res, next) => {
    try {
        const newExhibition = await Exhibition.create({
            title: req.body.title,
            data: req.body.data,
            date_created: Date.now(),
            date_modified: Date.now(),
            privacy: req.body.privacy
        });
        
        const temp_user = User.findByPk(req.body.user)
        await newExhibition.setUser(temp_user);

        res.status(201);

    } catch(e) {
        console.log(e.message)
        next(createError(500), {debugMessage: e.message});
    }
}

const loadExhibition = async (req, res, next) => {
    try {
        const ExhibitionWithData = Exhibition.scope('with_data');
        const exhibition = await ExhibitionWithData.findByPk(req.params.exhibitionId, {
            include: [User]
        });
        if(!exhibition)
            next(createError(404));
        else
            res.status(200).json({data: exhibition})
    } catch(e) {
        next(createError(500), {debugMessage: e.message});
    }
}

module.exports = { listExhibitions, getExhibition, saveExhibition, loadExhibition }