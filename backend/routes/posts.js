const express = require("express");
const { getPosts } = require("../controllers/postController");
const router = express.Router();

// @desc    Get posts
// @route   GET /api/v1/posts
router.get("/", getPosts);

module.exports = router;