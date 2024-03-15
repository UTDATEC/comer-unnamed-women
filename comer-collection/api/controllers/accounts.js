const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createError = require('http-errors');
const { User, Course, Exhibition, sequelize } = require('../sequelize')
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
                include: ['pw_hash']
            }
        });
        
        const match = user && (user.pw_hash && await verifyPasswordWithHash(password, user.pw_hash));

        if(match && user.is_active) {
            token = generateTokenDataFromUserInstance(user);
            await jwt.sign(token, process.env.JWT_SECRET, { expiresIn: '10d' }, (err, token) => {
                if (err) {
                    next(createError(500, {debugMessage: err.message}));
                }
                res.status(200).json({ token: token });
            });
            return true;
        } else {
            console.log(match, user.is_active);
            await next(createError(401));
            return false;
        }

    } catch(e) {
        await next(createError(400, {debugMessage: e.message + "\n" + e.stack}));
        return false;
    }
};

const changePassword = async(req, res, next) => {
    userOperation(req, res, next, async (user_id) => {
        try {
            const user = await User.findByPk(user_id, {
                attributes: {
                    include: ['pw_hash']
                }
            });
            const { oldPassword, newPassword } = req.body;
            if(!oldPassword || !newPassword)
                throw new Error("Request must have both oldPassword and newPassword parameters");

            if(!user.pw_hash) {
                next(createError(500, { debugMessage: "No current password found" }))
            }
            else if(user.pw_hash && !bcrypt.compareSync(oldPassword, user.pw_hash)) {
                next(createError(401, { debugMessage: "Password hashes do not match" }));
            }
            else {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(newPassword, salt);
                await user.update({
                    pw_hash: hash, 
                    pw_change_required: false,
                    pw_updated: Date.now()
                });
    
                token = generateTokenDataFromUserInstance(user);
                jwt.sign(token, process.env.JWT_SECRET, { expiresIn: '10d' }, (err, token) => {
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
    console.log("started getCurrentUser")
    const { app_user } = req;
    const dataToSend = {...app_user.toJSON(),
        can_create_exhibition: canUserCreateExhibition(app_user.toJSON())
    }
    dataToSend.Courses = await app_user.getCourses();
    dataToSend.Exhibitions = await app_user.getExhibitions();
    res.status(200).json({ data: dataToSend });
    console.log("reached the end of getCurrentUser")
}

module.exports = { changePassword, signIn, getCurrentUser }