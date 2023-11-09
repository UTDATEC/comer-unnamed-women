const createError = require('http-errors');
const jwt = require('jsonwebtoken')
const { User } = require('./sequelize')


const userOperation = async (req, res, next, callback, requirePermanentPassword = true, requireAdmin = false, includeUserFields = []) => {
    try {
        const header = req.get("Authorization")
        if (header == undefined || header == null)
            throw new Error("Authorization header not present");
        else if (!header.startsWith("Bearer "))
            throw new Error("Authorization header does not start with Bearer");
        
        const token = header.replace("Bearer ","");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(requireAdmin && !decoded.is_admin) {
            next(createError(403), { debugMessage: "Non-admin account in use when admin account is required"});
        }
        else if(requirePermanentPassword && decoded.pw_type == "TEMPORARY") {
            throw new Error("Temporary password in use when permanent password is required");
        } 
        else {
            const user = await User.findByPk(decoded.id, {
                attributes: {
                    include: includeUserFields
                }
            });
            if(!user)
                throw new Error("User not found");

            // Check if token was generated before 
            // the most recent password change
            if(`"${decoded.pw_updated}"` !== JSON.stringify(user.pw_updated))
                throw new Error("Token password update time does not match the latest password update time")
            callback(user);
        }
    } 
    catch(err) {
        next(createError(401, {debugMessage: err.message}));
    }
    
}

const adminOperation = async (req, res, next, callback, includeUserFields = []) => {
    await userOperation(req, res, next, callback, true, true, includeUserFields);
}

// the user parameter is a sequelize User instance
const generateTokenDataFromUserInstance = (user) => {
    return {
        id: user.id,
        email: user.email,
        is_admin: user.is_admin,
        pw_type: user.pw_type,
        pw_updated: user.pw_updated
    };
}

module.exports = {userOperation, adminOperation, generateTokenDataFromUserInstance};