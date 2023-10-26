const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
//const dotenv = require('dotenv').config()
const createError = require('http-errors');
const { User } = require('../sequelize')

const signUp = async(req, res, next) => {
    try {
        //const { email, password } = req.body;
        const user = await User.findOne({ where: { email: req.body.email } });
        //getDbConnection?
        if (user) {

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash){
                user.set({pw_hash: hash, pw_salt: salt});
            });
        });

        await user.save();

        jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60*60), //Creates expiration in 1 hour
            id: user.id,
            email: user.email,
            isVerified: false
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '180d'
        },
        (err, token) => {
            if (err) {
                next(createError(500, {debugMessage: err.message}));
            }
            console.log({ token })
            res.status(200).json({ token })
        });

        } else {
            next(createError(404));
        }

    } catch(e) {
        next(createError(400, {debugMessage: e.message}));
    }
};

module.exports = { signUp }