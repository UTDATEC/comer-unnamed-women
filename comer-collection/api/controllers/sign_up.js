const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createError = require('http-errors');
const { User } = require('../sequelize')

const signUpRoute = async(req, res, next) => {
    try {
        const { user_email, password } = req.body;
        const user = await User.findOne({ where: { email: user_email}});
        //getDbConnection?
        if (user) {
            res.sendStatus(409);

        const passwordHash = await bcrypt.hash(password, 10)

        user.set({pw_hash: passwordHash});
        await user.save();
        //user.pw_salt = ?
        //Need to add salt
            
        jwt.sign({
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
                return res.status(500).send(err);
            }
            res.status(200).json({ token })
        });


        } else {
            next(createError(404));
        }

    } catch(e) {
        next(createError(400, {debugMessage: e.message}));
    }
};

module.exports = { signUpRoute }