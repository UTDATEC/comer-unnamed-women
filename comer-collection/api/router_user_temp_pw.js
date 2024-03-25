import { Router } from "express";
const router = Router();

import { getCurrentUser, changePassword } from "./controllers/users.js";


// Get current user
router.get("/profile", getCurrentUser);
router.put("/changepassword", changePassword);


export default router;