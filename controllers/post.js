const Post = require("../models/Post");
const Comment = require("../models/Comment");

module.exports.addPost = (req,res) => {

	let newPost = new Post({
		title : req.body.title,
		content : req.body.content,
		author : req.user.id

	});

	newPost.save()
        .then(savedPost => {
            return Post.findById(savedPost._id).populate('author', 'userName');
        })
        .then(populatedPost => {
            res.status(201).send(populatedPost);
        })
		.catch(saveErr => {

			console.error("Error in saving the Post: ", saveErr)
			return res.status(500).send({ error: 'Failed to save the Post' });
		})

};

module.exports.getAllPosts = async (req, res) => {


    try {
        const posts = await Post.find({}).populate('author','userName');

        if (!posts.length) {
            return res.status(404).send({ message: 'No posts found.' });
        }

        res.status(200).send({ posts });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }

};


module.exports.getPostByUser = async (req, res) => {

	try {
        const posts = await Post.find({author: req.user.id}).populate('author','userName');

        if (!posts.length) {
            return res.status(404).send({ message: 'No posts found.' });
        }

        res.status(200).send({ posts });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }

};


module.exports.getPostById = async (req, res) => {
    try {
        let postId = req.params.postId;

        // Find the post by ID and populate the author field
        let post = await Post.findById(postId).populate('author', 'userName');

        if (!post) {
            return res.status(404).send({ error: 'Post not found' });
        }

        // Find all comments related to the post
        let comments = await Comment.find({ post: postId }).populate('author', 'userName');

        // Return the post along with its comments
        return res.status(200).send({ post, comments });

    } catch (findErr) {
        console.error('Error finding post: ', findErr);
        return res.status(500).send({ error: 'Failed to fetch post' });
    }
};


module.exports.updatePost = async (req, res) => {
    try {
        let postId = req.params.postId;
        let userId = req.user.id;

        // Find the post by ID
        let post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send({ error: 'Post not found' });
        }

        // Check if the user is the author of the post
        if (userId.toString() !== post.author.toString()) {
            return res.status(403).send({ error: 'You cannot edit this post' });
        }

        // Update the post
        let updatedPost = {
            title: req.body.title,
            content: req.body.content
        };

        let updatedPostData = await Post.findByIdAndUpdate(postId, updatedPost, { new: true });

        return res.status(200).send({
            message: 'Post updated successfully',
            updatedPost: updatedPostData
        });
    } catch (err) {
        console.error('Error in updating the Post: ', err);
        return res.status(500).send({ error: "Error in updating the Post" });
    }
};

module.exports.deletePost = async (req, res) => {
    try {
        let postId = req.params.postId;
        let userId = req.user.id;
        let isAdmin = req.user.isAdmin;

        // Find the post by ID
        let post = await Post.findById(postId);

        if (!post) {
            return res.status(404).send({ error: 'Post not found' });
        }

        // Check if the user is the author of the post or an admin
        if (userId.toString() !== post.author.toString() && !isAdmin) {
            return res.status(403).send({ error: 'You cannot delete this post' });
        }

        // Delete the post
        let deletedResult = await Post.deleteOne({ _id: postId });

        if (deletedResult.deletedCount === 0) {
            return res.status(400).send({ error: 'No Post deleted' });
        }

        // Delete all comments associated with the post
        await Comment.deleteMany({ post: postId });

        return res.status(200).send({ 
            message: 'Post and associated comments deleted successfully'
        });

    } catch (err) {
        console.error("Error in deleting the Post : ", err);
        return res.status(500).send({ error: 'Error in deleting the Post.' });
    }
};