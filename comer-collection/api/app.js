// require("dotenv").config();
import "dotenv/config.js";
import "express-async-errors";
import createError from "http-errors";
import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import helmet, { contentSecurityPolicy, frameguard } from "helmet";
import hpp from "hpp";
import toobusy from "toobusy-js";
import { rateLimit } from "express-rate-limit";
import jwt from "jsonwebtoken";


import apiRouterPublic from "./router_public.js";
import apiRouterUserTempPw from "./router_user_temp_pw.js";
import apiRouterUser from "./router_user.js";
import apiRouterAdmin from "./router_admin.js";

import db from "./sequelize.js";
const { User, Course, Exhibition } = db;

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
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
// This line allows the public files to be read from/rendered by path in the front end
// app.use("/static", static(join(__dirname, "static")));
app.use(helmet());


app.use(contentSecurityPolicy({
    useDefaults: false,
    directives: {
        "default-src": "none"
    }
}));

app.use(frameguard({
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