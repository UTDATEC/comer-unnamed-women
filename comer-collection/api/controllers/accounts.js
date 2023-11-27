const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createError = require('http-errors');
const { User, Course } = require('../sequelize')
const { userOperation, generateTokenDataFromUserInstance, filterUserData, verifyPasswordWithHash } = require("../security.js");
const { canUserCreateExhibition } = require('./users.js');

const signIn = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            where: { 
                email: email 
            },
            attributes: {
                include: ['pw_hash', 'pw_temp']
            }
        });
        
        const match = user && ((password == user.pw_temp) || (user.pw_hash && await verifyPasswordWithHash(password, user.pw_hash)));

        if(match && user.is_active) {
            token = generateTokenDataFromUserInstance(user);
            jwt.sign(token, process.env.JWT_SECRET, { expiresIn: '30d' }, (err, token) => {
                if (err) {
                    next(createError(500, {debugMessage: err.message}));
                }
                res.status(200).json({ token: token });
            });
        } else {
            next(createError(401));
        }

    } catch(e) {
        next(createError(400, {debugMessage: e.message}));
    }
};

const changePassword = async(req, res, next) => {
    userOperation(req, res, next, async (user_id) => {
        try {
            const user = await User.findByPk(user_id, {
                attributes: {
                    include: ['pw_temp', 'pw_hash']
                }
            });
            const { oldPassword, newPassword } = req.body;
            if(!oldPassword || !newPassword)
                throw new Error("Request must have both oldPassword and newPassword parameters");

            if(!user.pw_hash && !user.pw_temp) {
                next(createError(500, { debugMessage: "No current temporary or permanent password found" }))
            }
            else if(user.pw_hash && !bcrypt.compareSync(oldPassword, user.pw_hash)) {
                next(createError(401, { debugMessage: "Password hashes do not match" }));
            }
            else if(user.pw_temp && oldPassword != user.pw_temp) {
                next(createError(401, { debugMessage: "Temporary password does not match" }));
            }
            else {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(newPassword, salt);
                await user.update({
                    pw_hash: hash, 
                    pw_temp: null,
                    pw_updated: Date.now()
                });
    
                token = generateTokenDataFromUserInstance(user);
                jwt.sign(token, process.env.JWT_SECRET, { expiresIn: '30d' }, (err, token) => {
                    if (err) {
                        next(createError(500, {debugMessage: err.message}));
                    }
                    res.status(200).json({ token: token });
                });
            }


        } catch(e) {
            next(createError(400, {debugMessage: e.message}));
        }
    }, false, false);
};

const getCurrentUser = async(req, res, next) => {
    userOperation(req, res, next, async(user_id, password_change_required) => {
        try {
            const user = await User.findByPk(user_id, {
                include: [Course]
            });
            const dataToSend = {...user.toJSON(), 
                password_change_required,
                can_create_exhibition: canUserCreateExhibition(user.toJSON())
            }
            res.status(200).json({ data: dataToSend });
        } catch(e) {
            next(createError(400, {debugMessage: e.message}));
        }
    }, false);
}

module.exports = { changePassword, signIn, getCurrentUser }