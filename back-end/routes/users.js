const express = require("express");
const multer = require("../middleware/multer-config");
const router = express.Router();

const isAuthenticated = require("../middleware/auth.js");

const { getProfil, updateProfil } = require("../controllers/users.js");

// route for get profil
router.get("/:id", isAuthenticated, getProfil);

// route for update profil
router.post("/:id/update", isAuthenticated, multer, updateProfil);

module.exports = router;
