const express = require("express");
const commentController = require("../controllers/comment");
const { verify, verifyAdmin, verifyNonAdmin } = require("../auth");

const router = express.Router();

// POST /comments/addComment/:postId - Add a comment to a given post by its ID.
// GET /comments/getComments/:postId - Retrieve the list of all comments to a post by its ID.
// PATCH /comments/updateComment/:commentId - Update an existing comment by its ID.
// DELETE /comments/deleteComment/:commentId - Delete a comment by its ID

/*
Comment Controller:

	addComment
	getComments
	updateComment
	deleteComment
*/


router.post("/addComment/:postId", verify, commentController.addComment);
router.get("/getComments/:postId", commentController.getComments);
router.patch("/updateComment/:commentId", verify, commentController.updateComment);
router.delete("/deleteComment/:commentId", verify, commentController.deleteComment);


module.exports = router;