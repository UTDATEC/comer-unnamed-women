const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createError = require('http-errors');
const { User } = require('../sequelize')

const signIn = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(email, password)
        const user = await User.findOne({ where: { email: email } });
        console.log(user.pw_hash)
        //getDbConnection?
        if (user) {
            if(user.pw_hash == null) {
                if(password == user.pw_temp) {
                    jwt.sign({
                        id: user.id,
                        email: user.email,
                        is_admin: user.is_admin,
                        isVerified: false
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '30d'
                    },
                    (err, token) => {
                        if (err) {
                            next(createError(500, {debugMessage: err.message}));
                        }
                        console.log({ token })
                        res.status(200).json({ token: token })
                    });
                }
            } else {
                bcrypt.compare(password, user.pw_hash, function(err, result) {
                    if (err) {
                        //console.log("bcrypt error")
                        next(createError(400, {debugMessage: err.message}));
                    }
                    else if (result) {
                        jwt.sign({
                            id: user.id,
                            email: user.email,
                            is_admin: user.is_admin,
                            isVerified: false
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: '30d'
                        },
                        (err, token) => {
                            if (err) {
                                next(createError(500, {debugMessage: err.message}));
                            }
                            console.log({ token })
                            res.status(200).json({ token: token })
                        });
                    }
                    else {
                        next(createError(400, {debugMessage: "Invalid credentials"}));
                    }
                })
            }

        } else {
            next(createError(404));
        }

    } catch(e) {
        next(createError(400, {debugMessage: e.message}));
    }
};

module.exports = { signIn }