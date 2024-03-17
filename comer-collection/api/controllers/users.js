const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createError = require('http-errors');
const { User, Course, Exhibition, sequelize } = require("../sequelize.js");
const { deleteItem, updateItem, createItem, listItems, getItem } = require('./items.js');



// the user parameter is a sequelize User instance
const generateTokenDataFromUserInstance = (user) => {
    return {
        id: user.id,
        // email: user.email,
        // is_admin: user.is_admin,
        // pw_type: user.pw_type,
        pw_updated: user.pw_updated
    };
};

const getSignedTokenForUser = async(user) => {
    const tokenData = {
        id: user.id,
        pw_updated: user.pw_updated
    };
    return jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '10d' } );
}

const doesPasswordMatchHash = async(password, hash) => {
    return Boolean(password) && Boolean(hash) &&
        bcrypt.compareSync(password, hash);
}


const canUserCreateExhibition = (userJSON) => {
    return Boolean(userJSON.is_admin || userJSON.Courses?.filter((c) => c.status == "Active").length && userJSON.exhibition_quota > userJSON.Exhibitions.length);
}


const userItemFunctions = {
    can_create_exhibition(user) {
        return canUserCreateExhibition(user);
    }
};

const listUsers = async (req, res, next) => {
    listItems(req, res, next, User, [Course, Exhibition], {}, userItemFunctions);
};

const createUser = async (req, res, next) => {
    await createItem(req, res, next, User, [
        'email', 'given_name', 'family_name', 'exhibition_quota'
    ]);
};

const updateUser = async (req, res, next) => {
    await updateItem(req, res, next, User, req.params.userId, [
        'email', 'family_name', 'given_name', 'exhibition_quota'
    ]);
};

const deactivateUser = async (req, res, next) => {
    if(req.params.userId == req.app_user.id) {
        next(createError(403, {debugMessage: "Admin cannot deactivate self"}))
    }
    req.body = {is_active: false};
    await updateItem(req, res, next, User, req.params.userId, ['is_active'])
};

const activateUser = async (req, res, next) => {
    if(req.params.userId == req.app_user.id) {
        next(createError(403, {debugMessage: "Admin cannot activate self"}))
    }
    req.body = {is_active: true};
    await updateItem(req, res, next, User, req.params.userId, ['is_active'])
};

const promoteUser = async (req, res, next) => {
    if(req.params.userId == req.app_user.id) {
        next(createError(403, {debugMessage: "Admin cannot promote self"}))
    }
    req.body = {is_admin: true};
    await updateItem(req, res, next, User, req.params.userId, ['is_admin'])
}

const demoteUser = async (req, res, next) => {
    if(req.params.userId == req.app_user.id) {
        next(createError(403, {debugMessage: "Admin cannot demote self"}))
    }
    req.body = {is_admin: false};
    await updateItem(req, res, next, User, req.params.userId, ['is_admin'])
}

const deleteUser = async (req, res, next) => {
    if(req.params.userId == req.app_user.id) {
        next(createError(401, {debugMessage: "Admin cannot delete self"}))
    }
    await deleteItem(req, res, next, User, req.params.userId);
}


const getUser = async (req, res, next) => {
    await getItem(req, res, next, User, [Course, Exhibition], req.params.userId, userItemFunctions);
};

const getCurrentUser = async (req, res, next) => {
    await getItem(req, res, next, User, [Course, Exhibition], req.app_user.id, userItemFunctions);
}


const resetUserPassword = async(req, res, next) => {
    if(req.params.userId == req.app_user.id) {
        next(createError(401, {debugMessage: "Admin cannot reset own password.  Use Change Password instead."}))
    }
    else if(!req.body.newPassword) {
        next(createError(400, {debugMessage: "Password reset request must contain the new password in the request body"}))
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.newPassword, salt);
    req.body = {
        pw_hash: hash, 
        pw_change_required: true,
        pw_updated: Date.now()
    };
    await updateItem(req, res, next, User, req.params.userId, ['pw_hash', 'pw_change_required', 'pw_updated']);

}


const signIn = async(req, res, next) => {
    try {
        await sequelize.transaction(async(t) => {
            const { email, password } = req.body;
            const user = await User.findOne({
                where: { 
                    email: email 
                },
                attributes: {
                    include: ['pw_hash']
                }
            });

            if(!user) {
                throw new Error("user does not exist");
            } else if(!user.is_active) {
                throw new Error("user is not active");
            } 

            if(await doesPasswordMatchHash(password, user.pw_hash)) {
                const token = await getSignedTokenForUser(user);
                res.status(200).json({ token });
            } else {
                throw new Error("password is incorrect");
            }

        })
    } catch(e) {
        await next(createError(401, {debugMessage: e.message + "\n" + e.stack}))
    }
}


const changePassword = async(req, res, next) => {
    try {
        await sequelize.transaction(async(t) => {
            const user = await User.findByPk(req.app_user.id, {
                attributes: {
                    include: ['pw_hash']
                }
            }, { transaction: t });
            const { oldPassword, newPassword } = req.body;
            if(!oldPassword || !newPassword)
                throw new Error("Request must have both oldPassword and newPassword parameters");
            else if(!user.pw_hash) {
                throw new Error("No current pw_hash found");
            }
            else if(!doesPasswordMatchHash(oldPassword, user.pw_hash)) {
                throw new Error("oldPassword is incorrect");
            }
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(newPassword, salt);
            await user.update({
                pw_hash: hash, 
                pw_change_required: false,
                pw_updated: Date.now()
            });

            const token = await getSignedTokenForUser(user);
            res.status(200).json({ token });
        })
    } catch(e) {
        next(createError(400, {debugMessage: e.message}));
    }
}


module.exports = { canUserCreateExhibition, listUsers, createUser, updateUser, deleteUser, getUser, getCurrentUser, resetUserPassword, deactivateUser, activateUser, promoteUser, demoteUser, signIn, changePassword, generateTokenDataFromUserInstance };