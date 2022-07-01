const express = require("express");
const multer = require("../middleware/multer-config");
const router = express.Router();

const {
  createPost,
  updatePost,
  likePost,
  deletePost,
  getAllPosts,
} = require("../controllers/posts.js");

const isAuthenticated = require("../middleware/auth.js");

// route for get all posts
router.get("", isAuthenticated, getAllPosts);

// route for create post
router.post("/create", isAuthenticated, multer, createPost);

// route for update post
router.post("/:id/update", isAuthenticated, multer, updatePost);

// route for update post likes
router.post("/:id/like", isAuthenticated, multer, likePost);

// route for delete post
router.post("/:id/delete", isAuthenticated, deletePost);

module.exports = router;
