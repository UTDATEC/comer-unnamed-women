const createError = require('http-errors');
const jwt = require('jsonwebtoken')
const { User } = require('./sequelize')


const userOperation = async (req, res, next, callback, requirePermanentPassword = true, requireAdmin = false) => {
    try {
        const header = req.get("Authorization")
        if (header == undefined || header == null)
            throw new Error("Authorization header not present");
        else if (!header.startsWith("Bearer "))
            throw new Error("Authorization header does not start with Bearer");
        
        const token = header.replace("Bearer ","");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id, {
            attributes: {
                include: ['pw_hash', 'pw_temp']
            }
        });
        
        
        if(!user)
            throw new Error("User not found");

        // Check if password has changed since token was generated
        else if(`"${decoded.pw_updated}"` !== JSON.stringify(user.pw_updated))
            throw new Error("Token password update time does not match the latest password update time")
        
        // Check if temporary password is being used improperly
        else if(requirePermanentPassword && !user.getDataValue('pw_hash')) 
            throw new Error("Temporary password in use when permanent password is required");
        
        // Check if a non-admin user is attempting an admin operation
        else if(requireAdmin && !user.is_admin) 
            next(createError(403), { debugMessage: "Non-admin account in use when admin account is required"});
        
        callback(user.id);

    } 
    catch(err) {
        next(createError(401, {debugMessage: err.message}));
    }
    
}

const adminOperation = async (req, res, next, callback) => {
    await userOperation(req, res, next, callback, true, true);
}

// the user parameter is a sequelize User instance
const generateTokenDataFromUserInstance = (user) => {
    return {
        id: user.id,
        // email: user.email,
        // is_admin: user.is_admin,
        // pw_type: user.pw_type,
        pw_updated: user.pw_updated
    };
}


const filterUserData = (user) => {
    const { id, email, family_name, given_name, pw_updated, is_admin } = user;
    return { id, email, family_name, given_name, pw_updated, is_admin };
}


module.exports = {userOperation, adminOperation, generateTokenDataFromUserInstance, filterUserData};