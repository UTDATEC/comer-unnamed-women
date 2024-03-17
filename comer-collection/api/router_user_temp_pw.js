const createError = require('http-errors');
const express = require("express");
const router = express.Router();

const { getCurrentUser, changePassword } = require("./controllers/users.js");


// Get current user
router.get("/profile", getCurrentUser);
router.put("/changepassword", changePassword);


module.exports = router;