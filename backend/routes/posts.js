const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const router = express.Router();

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'social_posts',
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});

const upload = multer({ storage: storage });

// Create Post
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const { text } = req.body;
        const imageUrl = req.file ? req.file.path : null;

        if (!text && !imageUrl) {
            return res.status(400).json({ message: 'Text or image is required' });
        }

        const post = new Post({
            userId: req.user._id,
            username: req.user.username,
            text,
            imageUrl,
        });

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get All Posts (Feed)
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Like/Unlike Post
router.post('/:id/like', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.id || req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const likeIndex = post.likes.findIndex(like => like.userId.toString() === req.user._id.toString());

        if (likeIndex > -1) {
            // Unlike
            post.likes.splice(likeIndex, 1);
        } else {
            // Like
            post.likes.push({ userId: req.user._id, username: req.user.username });
        }

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Comment on Post
router.post('/:id/comment', auth, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'Comment text is required' });

        const post = await Post.findById(req.id || req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.comments.push({
            userId: req.user._id,
            username: req.user.username,
            text,
        });

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
