const express = require("express");
const multer = require("../middleware/multer-config");
const router = express.Router();

const { register, login } = require("../controllers/auth.js");

// route for register
router.post("/register", multer, register);

// route for login
router.post("/login", login);

module.exports = router;
