const createError = require('http-errors');
const express = require("express");
const router = express.Router();

const { getCurrentUser } = require("./controllers/users.js");


// Get current user
router.get("/profile", getCurrentUser);


module.exports = router;