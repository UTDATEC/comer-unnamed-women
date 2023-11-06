const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createError = require('http-errors');
const { User } = require('../sequelize')

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
                temporaryPassword: (password == user.pw_temp)
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

module.exports = { signIn }