const bcrypt = require('bcrypt')
const createError = require('http-errors');
const { User, Course, Exhibition } = require("../sequelize.js");
const { adminOperation, verifyPasswordWithHash } = require('../security.js');
const { deleteItem, updateItem, createItem, listItems, getItem } = require('./items.js');




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
        next(createError(401, {debugMessage: "Admin cannot deactivate self"}))
    }
    req.body = {is_active: false};
    await updateItem(req, res, next, User, req.params.userId, ['is_active'])
};

const activateUser = async (req, res, next) => {
    if(req.params.userId == req.app_user.id) {
        next(createError(401, {debugMessage: "Admin cannot activate self"}))
    }
    req.body = {is_active: true};
    await updateItem(req, res, next, User, req.params.userId, ['is_active'])
};

const promoteUser = async (req, res, next) => {
    if(req.params.userId == req.app_user.id) {
        next(createError(401, {debugMessage: "Admin cannot promote self"}))
    }
    req.body = {is_admin: true};
    await updateItem(req, res, next, User, req.params.userId, ['is_admin'])
}

const demoteUser = async (req, res, next) => {
    if(req.params.userId == req.app_user.id) {
        next(createError(401, {debugMessage: "Admin cannot demote self"}))
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

module.exports = { canUserCreateExhibition, listUsers, createUser, updateUser, deleteUser, getUser, getCurrentUser, resetUserPassword, deactivateUser, activateUser, promoteUser, demoteUser }