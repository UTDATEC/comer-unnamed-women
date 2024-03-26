import { Router } from "express";
const router = Router();
import createError from "http-errors";
import jwt from "jsonwebtoken";


import apiRouterPublic from "./router_public.js";
import apiRouterUserTempPw from "./router_user_temp_pw.js";
import apiRouterUser from "./router_user.js";
import apiRouterCollectionManager from "./router_collection_manager.js";
import apiRouterAdmin from "./router_admin.js";

import db from "./sequelize.js";
const { User, Course, Exhibition } = db;


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

const requireAtLeastCollectionManager = async (req, res, next) => {
    const { app_user } = req;
    if (app_user?.is_collection_manager || app_user?.is_admin) {
        next();
    } else {
        next(createError(403, { debugMessage: "Action requires at least collection manager privileges" }));
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
router.use("/public", apiRouterPublic);
router.use("/user", requireAuthenticatedUser, apiRouterUserTempPw);
router.use("/user", requirePermanentPassword, apiRouterUser);
router.use("/admin", requireAuthenticatedUser, requirePermanentPassword, requireAtLeastCollectionManager, apiRouterCollectionManager);
router.use("/admin", requireAdmin, apiRouterAdmin);



export default router;