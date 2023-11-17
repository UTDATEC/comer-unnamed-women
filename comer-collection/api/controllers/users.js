const createError = require('http-errors');
const { User, Course, Exhibition } = require("../sequelize.js");
const { adminOperation } = require('../security.js');

const randomPassword = () => {
    return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
}


const listUsers = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        const users = await User.findAll({
            include: [Course, Exhibition],
            attributes: {
                include: ['pw_temp']
            }
        });
        res.status(200).json({ data: users });
    })
};

const createUser = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        try {
            if(req.body.id)
                throw new Error("User id should not be included when creating a user")
            const newUser = await User.create({
                email: req.body.email,
                pw_temp: randomPassword(),
                ps_hash: null,
                is_admin: false,
                pw_updated: Date.now()
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
            const user = await User.findByPk(req.params.userId, {
                attributes: {
                    include: ['pw_temp']
                }
            });
            if(user) {
                if(req.body.id && req.body.id !== req.params.userId) {
                    throw new Error("User id in request body does not match User id in URL")
                }
                await user.update({
                    email: user.email,
                    family_name: user.family_name,
                    given_name: user.given_name
                })
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
            if(user.is_admin)
                next(createError(401));
            else {
                await user.destroy();
                res.sendStatus(204);
            }
        }
        else
            next(createError(404))
    })
};

const getUser = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        const user = await User.findByPk(req.params.userId, {
            include: [Course, Exhibition],
            attributes: {
                include: ['pw_temp']
            }
        });
        if (user) {
            res.status(200).json({ data: user });
        }
        else {
            next(createError(404));
        }
    })
};


const resetUserPassword = async(req, res, next) => {
    adminOperation(req, res, next, async () => {
        try {
            const user = await User.findByPk(req.params.userId, {
                attributes: {
                    include: ['pw_temp']
                }
            });
            if(user) {
                if(req.body.id && req.body.id !== req.params.userId) {
                    throw new Error("User id in request body does not match User id in URL")
                }
                await user.update({
                    pw_temp: randomPassword(),
                    pw_hash: null,
                    pw_updated: Date.now()
                })
                res.status(200).json({ data: user })
            }
            else
                next(createError(404));
        }
        catch(e) {
            next(createError(400, {debugMessage: e.message}));
        } 
    });
}

module.exports = { listUsers, createUser, updateUser, deleteUser, getUser, resetUserPassword }