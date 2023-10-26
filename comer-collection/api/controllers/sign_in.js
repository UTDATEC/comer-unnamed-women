const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createError = require('http-errors');
const { User } = require('../sequelize')

const signIn = async(req, res, next) => {
    try {
        //const { email, password } = req.body;
        console.log(email, password)
        console.log("Hello")
        const user = await User.findOne({ where: { email: req.body.email } });
        //getDbConnection?
        if (user) {

        bcrypt.compare(req.body.password, user.pw_hash, function(err, result) {
            if (err) {
                next(createError(400, {debugMessage: err.message}));
            }
            if (result) {
                //JWT verify logic
                console.log("Password Authenticated")
                //Grant acess?
                //Send some form of validation?
                res.status(201).json({ validated: true})
            }
            else {
                next(createError(400, {debugMessage: "Password not recognized"}));
            }
        })

        } else {
            next(createError(404));
        }

    } catch(e) {
        next(createError(400, {debugMessage: e.message}));
    }
};

module.exports = { signIn }