const createError = require('http-errors');
const { User, Course } = require("../sequelize.js");
const { adminOperation } = require('../security.js');

const listUsers = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        const users = await User.findAll({
            attributes: ['id', 'email', 'is_admin'],
            include: [Course]
        });
        res.status(200).json({ data: users });
    })
};

const createUser = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        try {
            if(req.body.id)
                throw new Error("User id should not be included when creating a user")
            const tempPass = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const newUser = await User.create({
                email: req.body.email,
                pw_temp: tempPass,
                is_admin: false
            });
            // await newUser.set({pw_temp: tempPass});   
            res.status(201).json({ data: {
                id: newUser.id,
                email: newUser.email, 
                pw_temp: newUser.pw_temp,
                is_admin: newUser.is_admin
            }});
        } catch (e) {
            next(createError(400, {debugMessage: e.message}));
        }
    })
};

const updateUser = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        try {
            const user = await User.findByPk(req.params.userId)
            if(user) {
                if(req.body.id && req.body.id !== req.params.userId) {
                    throw new Error("User id in request body does not match User id in URL")
                }
                user.set(req.body)
                await user.save();
                res.status(200).json({ data: user })
            }
            else
                next(createError(404));
        }
        catch(e) {
            next(createError(400, {debugMessage: e.message}));
        }
    })
};

const deleteUser = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        const user = await User.findByPk(req.params.userId);
        if(user) {
            await user.destroy();
            res.sendStatus(204);
        }
        else
            next(createError(404))
    })
};

const getUser = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        const user = await User.findByPk(req.params.userId, {
            attributes: ['id', 'email', 'is_admin'],
            include: [Course]
        });
        if (user) {
            res.status(200).json({ data: user });
        }
        else {
            next(createError(404));
        }
    })
};

module.exports = { listUsers, createUser, updateUser, deleteUser, getUser }