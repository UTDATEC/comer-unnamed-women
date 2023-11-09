const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createError = require('http-errors');
const { User } = require('../sequelize')
const { userOperation, adminOperation } = require("../security.js");

const signIn = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(password)
        const user = await User.findOne({ where: { email: email } });
        
        const match = user && ((password == user.pw_temp) || (user.pw_hash && await bcrypt.compare(password, user.pw_hash)));

        if(match) {
            const token = {
                id: user.id,
                email: user.email,
                is_admin: user.is_admin,
                isVerified: false,
                hasTempPassword: (password == user.pw_temp)
            };
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
                        await user.update({pw_hash: hash, pw_temp: null});
                        res.sendStatus(204);
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
    }, false, false);
};

module.exports = { changePassword, signIn }