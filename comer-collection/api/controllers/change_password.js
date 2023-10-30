const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
//const dotenv = require('dotenv').config()
const createError = require('http-errors');
const { User } = require('../sequelize')
const { userOperation, adminOperation } = require("../security.js");

const changePassword = async(req, res, next) => {
    userOperation(req, res, next, async (decoded) => {
        try {
            const { oldPassword, newPassword } = req.body;
            const user = await User.findOne({ where: { email: decoded.email } });
            //getDbConnection?
            if (user) {
                if(user.pw_hash != null) {
                    const result = bcrypt.compareSync(oldPassword, user.pw_hash)
                    if (result) {
                        const salt = bcrypt.genSaltSync(10);
                        const hash = bcrypt.hashSync(newPassword, salt);
                        user.set({pw_hash: hash, pw_temp: null});
                        // !!! Gets stuck on this user.save()
                        await user.save();
                    } else {
                        next(createError(401));
                    }
                } else {
                    if (oldPassword == user.pw_temp) {
                        const salt = bcrypt.genSaltSync(10);
                        const hash = bcrypt.hashSync(newPassword, salt);
                        user.set({pw_hash: hash, pw_temp: null});
                        await user.save();
                    } else {
                        next(createError(401));
                    }
                }

            } else {
                next(createError(404));
            }

        } catch(e) {
            next(createError(400, {debugMessage: e.message}));
        }
    });
};

module.exports = { changePassword }