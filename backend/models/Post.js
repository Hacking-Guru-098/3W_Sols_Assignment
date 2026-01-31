const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: function () {
            return !this.imageUrl;
        }
    },
    imageUrl: {
        type: String,
        required: function () {
            return !this.text;
        }
    },
    likes: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            username: String
        }
    ],
    comments: [commentSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Post', postSchema);
