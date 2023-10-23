const createError = require('http-errors');

const UserTypes = Object.freeze({
    PUBLIC: "PUBLIC",
    CURATOR: "CURATOR",
    ADMIN: "ADMIN"
});

const getCurrentUserType = () => {
    return UserTypes.ADMIN;
}


const adminOperation = (req, res, next, callback) => {
    switch (getCurrentUserType()) {
        case UserTypes.PUBLIC:
            next(createError(401));
            break;
        case UserTypes.CURATOR:
            next(createError(403));
            break;
        case UserTypes.ADMIN:
            callback();
    }
}

module.exports = {getCurrentUserType, UserTypes, adminOperation};