const Comment = require("../models/Comment");
const Post = require('../models/Post');


module.exports.addComment = async (req, res) => {
    try {
        let newComment = new Comment({
            comment: req.body.comment,
            author: req.user.id,
            post: req.params.postId
        });

        const savedComment = await newComment.save();
        const populatedComment = await Comment.findById(savedComment._id)
            .populate('author', 'userName')
            .populate('post','title content');

        res.status(201).send(populatedComment);
    } catch (saveErr) {
        console.error("Error in saving the Comment: ", saveErr);
        return res.status(500).send({ error: 'Failed to save the Comment' });
    }
};

module.exports.getComments = (req, res) => {

	let postId = req.params.postId;

	return Comment.find({ post: postId }).populate('author','userName').then(comments => {

		if(!comments.length) {

			return res.status(404).send({message: 'No comments yet'});
		}

		return res.status(200).send({comments});
		

	}).catch(findErr => {

		console.error('Error finding comments: ', findErr);
		return res.status(500).send({ error: 'Failed to fetch comments' });
	});

};

module.exports.updateComment = async (req, res) => {
    try {
        let commentId = req.params.commentId;
        let userId = req.user.id;

        // Find the comment by ID
        let comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).send({ error: 'Comment not found' });
        }

        // Check if the user is the author of the comment
        if (userId.toString() !== comment.author.toString()) {
            return res.status(403).send({ error: 'You cannot edit this comment' });
        }

        // Update the post
        let updatedComment = {
            comment: req.body.comment
        };

        let updatedCommentData = await Comment.findByIdAndUpdate(commentId, updatedComment, { new: true });

        return res.status(200).send({
            message: 'Comment updated successfully',
            updatedComment: updatedCommentData
        });
    } catch (err) {
        console.error('Error in updating the Comment: ', err);
        return res.status(500).send({ error: "Error in updating the Comment" });
    }
};


module.exports.deleteComment = async (req, res) => {
    try {
        let commentId = req.params.commentId;
        let userId = req.user.id;
        let isAdmin = req.user.isAdmin;

        // Find the comment by ID
        let comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).send({ error: 'Comment not found' });
        }

        // Find the post associated with the comment
        let post = await Post.findById(comment.post);

        if (!post) {
            return res.status(404).send({ error: 'Post not found' });
        }

        // Check if the user is the author of the comment, the post, or an admin
        if (userId.toString() !== comment.author.toString() && userId.toString() !== post.author.toString() && !isAdmin) {
            return res.status(403).send({ error: 'You cannot delete this comment' });
        }

        // Delete the comment
        let deletedResult = await Comment.deleteOne({ _id: commentId });

        if (deletedResult.deletedCount === 0) {
            return res.status(400).send({ error: 'No Comment deleted' });
        }

        return res.status(200).send({ 
            message: 'Comment deleted successfully'
        });

    } catch (err) {
        console.error("Error in deleting the Comment : ", err);
        return res.status(500).send({ error: 'Error in deleting the Comment.' });
    }
};