const createError = require('http-errors');
const jwt = require('jsonwebtoken')

const UserTypes = Object.freeze({
    PUBLIC: "PUBLIC",
    CURATOR: "CURATOR",
    ADMIN: "ADMIN"
});

/*
const getCurrentUserType = (decoded) => {
    switch(decoded.is_admin) {
        case null:
            return UserTypes.PUBLIC;
        case false:
            return UserTypes.CURATOR;
        case true:
            return UserTypes.ADMIN;
        default:
            return UserTypes.PUBLIC;
    }
}
*/

const userOperation = (req, res, next, callback, requirePermanentPassword = true, requireAdmin = false) => {
    var header = req.get("Authorization")
    if (header == undefined || header == null) {
        next(createError(401))
    } else {
        const token = header.replace("Bearer ","");
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);
            if(requirePermanentPassword && decoded.hasTempPassword) {
                next(createError(401));
            } else if(requireAdmin && !decoded.is_admin) {
                next(createError(403));
            } else{
                callback(decoded);
            }
        } catch(err) {
            next(createError(401));
        }
    }
}

const adminOperation = (req, res, next, callback) => {
    userOperation(req, res, next, callback, true, true);
}

module.exports = {userOperation, adminOperation};