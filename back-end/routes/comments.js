const express = require("express");
const router = express.Router();

const {
  createComment,
  deleteComment,
  getAllComments,
} = require("../controllers/comments.js");

const isAuthenticated = require("../middleware/auth.js");

// route for get all comments on a specific post
router.get("/:postId", isAuthenticated, getAllComments);

// route for create comment for a specific post
router.post("/create", isAuthenticated, createComment);

// route for delete comment for a specific post
router.post("/:id/delete", isAuthenticated, deleteComment);

module.exports = router;
