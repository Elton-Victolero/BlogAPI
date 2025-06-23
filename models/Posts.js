const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Post title is required']
	},
	content: {
		type: String,
		required: [true, 'Contents are required']
	},
	coverImage: {
		type: String,
		default: 'https://videos.openai.com/vg-assets/assets%2Ftask_01jyd90geweaybpk2d069p4egh%2F1750644885_img_0.webp?st=2025-06-23T02%3A54%3A56Z&se=2025-06-29T03%3A54%3A56Z&sks=b&skt=2025-06-23T02%3A54%3A56Z&ske=2025-06-29T03%3A54%3A56Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=ihpm2qvX3St8Fyp%2BGasKXsFuRJi%2Bxzl4XqWKzS45s6I%3D&az=oaivgprodscus'
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'User Id is required']
	}, 
	comments: [
    	{
    		userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: [true, 'User ID is Required']
            },
            comment: {
                type: String,
                required: [true, 'Comment is required']
            }, 
            createdAt: {
                type: Date,
                default: Date.now
            }
    	}
    ]
}, {
	timestamps: true
});

module.exports = mongoose.model('Post', postSchema);