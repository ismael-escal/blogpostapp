const mongoose = require('mongoose');

// Post Schema
const commentSchema = new mongoose.Schema({

	comment: {
		type: String,
		required: [true, 'Comment is required']
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'Author is required']
	},
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post',
		required: [true, 'Post is required']
	},
	createdOn: {
		type: Date,
        default: Date.now
	}
})

module.exports = mongoose.model('Comment', commentSchema);