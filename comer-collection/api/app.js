require("dotenv").config();
require("express-async-errors");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
const toobusy = require("toobusy-js");
const { rateLimit } = require("express-rate-limit");
const jwt = require("jsonwebtoken");


const apiRouter = require("./router");
const apiRouterPublic = require("./router_public.js");
const apiRouterUserTempPw = require("./router_user_temp_pw.js");
const apiRouterUser = require("./router_user.js");
const apiRouterAdmin = require("./router_admin.js");

global.__basedir = __dirname;

const { User, sequelize, Course, Exhibition } = require("./sequelize.js");
// sequelize.sync({ alter: false }).then(() => {
//     console.log("Database & tables created! (unless table already existed)");
// });

var app = express();


const limiter = rateLimit({
    windowMs: 5000,
    limit: 100,
    statusCode: 429,
    standardHeaders: false,
    legacyHeaders: false
});

app.use(limiter);


app.use((req, res, next) => {
    if (toobusy()) {
        next(createError(503));
    } else {
        next();
    }
});



// view engine setup
app.use(cors());
app.use(hpp());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// This line allows the public files to be read from/rendered by path in the front end
app.use("/static", express.static(path.join(__dirname, "static")));
app.use(helmet());


app.use(helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
        "default-src": "none"
    }
}));

app.use(helmet.frameguard({
    action: "deny"
}));



const requireAuthenticatedUser = async (req, res, next) => {
    try {
        const header = req.get("Authorization");
        if (header == undefined || header == null)
            throw new Error("Authorization header not present");
        else if (!header.startsWith("Bearer "))
            throw new Error("Authorization header does not start with Bearer");

        const token = header.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id, {
            include: [Course, Exhibition]
        });

        if (!user)
            throw new Error("User not found");
        else if (!user.is_active)
            throw new Error("User is not active");

        // Check if password has changed since token was generated
        else if (`"${decoded.pw_updated}"` !== JSON.stringify(user.pw_updated))
            throw new Error("Token password update time does not match the latest password update time");

        req.app_user = user;
        console.log("authorized successfully and User instance attached to request object");
        next();

    } catch (e) {
        next(createError(401, { debugMessage: e.message }));
    }
};

const requireAdmin = async (req, res, next) => {
    const { app_user } = req;
    if (app_user?.is_admin) {
        next();
    } else {
        next(createError(403, { debugMessage: "Action requires admin privileges" }));
    }
};


const requirePermanentPassword = async (req, res, next) => {
    const { app_user } = req;
    if (app_user && !app_user.pw_change_required) {
        next();
    } else {
        next(createError(401, { debugMessage: "Please change your password and try again" }));
    }
};


// Routes for querying data
app.use("/api", apiRouter);
app.use("/api/public", apiRouterPublic);
app.use("/api/user", requireAuthenticatedUser, apiRouterUserTempPw);
app.use("/api/user", requirePermanentPassword, apiRouterUser);
app.use("/api/admin", requireAuthenticatedUser, requirePermanentPassword, requireAdmin, apiRouterAdmin);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
    const res_status = err.status || 500;
    res.status(res_status);
    res.json({
        error: {
            status: res_status,
            message: err.message,
            debugMessage: req.app.get("env") === "development" ? (err.debugMessage + "\n" + err.stack) : ""
        }
    });
});



// module.exports = app;
app.set("port", process.env.PORT || 9000);

var server = app.listen(app.get("port"), function () {
    console.log("Express server listening on port " + server.address().port);
});