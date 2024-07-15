const express = require("express");
const postController = require("../controllers/post");
const { verify, verifyAdmin, verifyNonAdmin } = require("../auth");

const router = express.Router();

// POST /posts/addPost - Add a new post.
// GET /posts/getPosts - Retrieve the list of all posts.
// GET /posts/getMyPosts - Retrieve the list of all posts made by the user.
// GET /posts/getPost/:postId - Retrieve a specific post by its ID.
// PATCH /posts/updatePost/:postId - Update an existing post.
// DELETE /posts/deletePost/:postId - Delete a post by its ID.


/*
Post Controller:

	addPost
	getAllPosts
	getPostByUser
	getPostById
	updatePost
	deletePost
*/


router.post("/addPost", verify, postController.addPost);
router.get("/getPosts", postController.getAllPosts);
router.get("/getMyPosts", verify, postController.getPostByUser);
router.get("/getPost/:postId", postController.getPostById);
router.patch("/updatePost/:postId", verify, postController.updatePost);
router.delete("/deletePost/:postId", verify, postController.deletePost);


module.exports = router;