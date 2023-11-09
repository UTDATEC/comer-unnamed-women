const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createError = require('http-errors');
const { User } = require('../sequelize')
const { userOperation, generateTokenDataFromUserInstance } = require("../security.js");

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
        
        const match = user && ((password == user.pw_temp) || (user.pw_hash && await bcrypt.compare(password, user.pw_hash)));

        if(match) {
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
    userOperation(req, res, next, async (user) => {
        try {
            const { oldPassword, newPassword } = req.body;
            if(!user.pw_hash && !user.pw_temp) {
                next(createError(500, {debugMessage:
                    "No password found of either type" + JSON.stringify(user.toJSON())
                }))
            }
            else if(user.pw_hash) {
                if (!bcrypt.compareSync(oldPassword, user.pw_hash)) 
                    next(createError(401));
            }
            else if(user.pw_temp) {
                if (oldPassword != user.pw_temp)
                    next(createError(401));
            }

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

        } catch(e) {
            next(createError(400, {debugMessage: e.message}));
        }
    }, false, false, ['pw_temp', 'pw_hash']);
};

const getCurrentUser = async(req, res, next) => {
    userOperation(req, res, next, async(user) => {
        try {
            // const user = await User.findOne({
            //     where: {
            //         id: user.id 
            //     },
            //     include: [Course]
            // });
            res.status(200).json({ data: user });
        } catch(e) {
            next(createError(400, {debugMessage: e.message}));
        }
    });
}

module.exports = { changePassword, signIn, getCurrentUser }