const mongoose = require('mongoose');

// Post Schema
const postSchema = new mongoose.Schema({

	title: {
		type: String,
		required: [true, 'Title is required']
	},
	content: {
		type: String,
		required: [true, 'Content is required']
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'Author is required']
	},
	createdOn: {
		type: Date,
        default: Date.now
	}
})

module.exports = mongoose.model('Post', postSchema);