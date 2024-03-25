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

import apiRouterMain from "./router_main.js";

var app = express();


const limiter = rateLimit({
    windowMs: 1000,
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




// Routes for querying data
app.use("/api", apiRouterMain);


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