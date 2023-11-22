const createError = require('http-errors');
const { User, Course, Exhibition } = require("../sequelize.js");
const { adminOperation, verifyPasswordWithHash } = require('../security.js');

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
            const {email, given_name, family_name} = req.body;
            const newUser = await User.create({
                email, given_name, family_name,
                pw_temp: randomPassword(),
                ps_hash: null,
                is_admin: false,
                pw_updated: Date.now()
            });
            
            res.status(201).json({ data: {
                id: newUser.id,
                email: newUser.email, 
                given_name: newUser.given_name,
                family_name: newUser.family_name,
                pw_temp: newUser.pw_temp,
                is_admin: newUser.is_admin
            }});
        } catch (e) {
            next(createError(400, {debugMessage: e.message}));
        }
    })
};

const updateUser = async (req, res, next) => {
    adminOperation(req, res, next, async (user_id) => {
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
                if(user_id == req.params.userId) {
                    next(createError(401, {debugMessage: "Admin cannot update self through this method.  Use profile edit instead."}));
                } else {
                    await user.update({
                        email: req.body.email,
                        family_name: req.body.family_name,
                        given_name: req.body.given_name
                    })
                    res.status(200).json({ data: user })
                }
            }
            else
                next(createError(404));
        }
        catch(e) {
            next(createError(400, {debugMessage: e.message}));
        }
    })
};

const deactivateUser = async (req, res, next) => {
    adminOperation(req, res, next, async (user_id) => {
        const user = await User.findByPk(req.params.userId);
        if(user) {
            if(user_id == req.params.userId)
                next(createError(401, {debugMessage: "Admin cannot deactivate self"}));
            else {
                await user.update({
                    is_active: false
                })
                res.status(200).json({ data: user })
            }
        }
        else
            next(createError(404))
    })
};

const activateUser = async (req, res, next) => {
    adminOperation(req, res, next, async (user_id) => {
        const user = await User.findByPk(req.params.userId);
        if(user) {
            if(user_id == req.params.userId)
                next(createError(401, {debugMessage: "Admin cannot activate self"}));
            else {
                await user.update({
                    is_active: true
                })
                res.status(200).json({ data: user })
            }
        }
        else
            next(createError(404))
    })
};

const promoteUser = async (req, res, next) => {
    adminOperation(req, res, next, async (user_id) => {
        const user = await User.findByPk(req.params.userId);
        const appUser = await User.findByPk(user_id, {
            attributes: {
                include: ['pw_hash']
            }
        });
        if(user) {
            const passwordVerified = await verifyPasswordWithHash(req.body.verifyPassword, appUser.pw_hash);
            if(!passwordVerified)
                next(createError(401, {debugMessage: "Password verification failed"}));
            else if(user_id == req.params.userId)
                next(createError(401, {debugMessage: "Admin cannot promote self"}));
            else {
                await user.update({
                    is_admin: true
                })
                res.status(200).json({ data: user })
            }
        }
        else
            next(createError(404))
    })
}

const demoteUser = async (req, res, next) => {
    adminOperation(req, res, next, async (user_id) => {
        const user = await User.findByPk(req.params.userId);
        const appUser = await User.findByPk(user_id, {
            attributes: {
                include: ['pw_hash']
            }
        });
        if(user) {
            const passwordVerified = await verifyPasswordWithHash(req.body.verifyPassword, appUser.pw_hash);
            if(!passwordVerified)
                next(createError(401, {debugMessage: "Password verification failed"}));
            else if(user_id == req.params.userId)
                next(createError(401, {debugMessage: "Admin cannot demote self"}));
            else {
                await user.update({
                    is_admin: false
                })
                res.status(200).json({ data: user })
            }
        }
        else
            next(createError(404))
    })
}

const deleteUser = async (req, res, next) => {
    adminOperation(req, res, next, async () => {
        const user = await User.findByPk(req.params.userId);
        if(user) {
            const userCourses = await user.countCourses();
            const userExhibitions = await user.countExhibitions();
            if(userCourses || userExhibitions)
                next(createError(422, {debugMessage: "User has at least one course enrollment or owns at least one exhibition."}))
            else if(user.is_admin)
                next(createError(401, {debugMessage: "Admin cannot delete admin"}));
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
    adminOperation(req, res, next, async (currentUserId) => {
        try {
            if(currentUserId == req.params.userId) {
                throw new Error("User is trying to reset own password and should use change password instead")
            }
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

module.exports = { listUsers, createUser, updateUser, deleteUser, getUser, resetUserPassword, deactivateUser, activateUser, promoteUser, demoteUser }