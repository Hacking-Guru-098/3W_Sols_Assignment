import { useState, useEffect } from 'react';
import {
    Box, Container, Card, CardHeader, CardContent, CardMedia, CardActions,
    Avatar, Typography, IconButton, TextField, Button, Divider, Paper, Tab, Tabs
} from '@mui/material';
import {
    Favorite, FavoriteBorder, ChatBubbleOutline, Share, Send,
    PhotoCamera, EmojiEmotions, Link as LinkIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/api';
import { useDropzone } from 'react-dropzone';

const Home = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [newPostText, setNewPostText] = useState('');
    const [newPostImage, setNewPostImage] = useState(null);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const data = await postService.getPosts();
            setPosts(data);
        } catch (err) {
            console.error('Failed to fetch posts', err);
        }
    };

    const handleCreatePost = async () => {
        if (!newPostText && !newPostImage) return;

        const formData = new FormData();
        if (newPostText) formData.append('text', newPostText);
        if (newPostImage) formData.append('image', newPostImage);

        try {
            await postService.createPost(formData);
            setNewPostText('');
            setNewPostImage(null);
            fetchPosts();
        } catch (err) {
            console.error('Failed to create post', err);
        }
    };

    const onDrop = (acceptedFiles) => {
        setNewPostImage(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false
    });

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            {/* Create Post Section - Inspired by Screenshot */}
            <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid #E0E0E0' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Create Post</Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Avatar src={user?.avatar} />
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="What's on your mind?"
                        variant="standard"
                        value={newPostText}
                        onChange={(e) => setNewPostText(e.target.value)}
                        InputProps={{ disableUnderline: true }}
                    />
                </Box>
                {newPostImage && (
                    <Box sx={{ mb: 2, position: 'relative' }}>
                        <img
                            src={URL.createObjectURL(newPostImage)}
                            alt="preview"
                            style={{ width: '100%', borderRadius: 8, maxHeight: 300, objectFit: 'cover' }}
                        />
                    </Box>
                )}
                <Divider sx={{ mb: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton {...getRootProps()} color="primary">
                            <input {...getInputProps()} />
                            <PhotoCamera />
                        </IconButton>
                        <IconButton color="primary"><EmojiEmotions /></IconButton>
                        <IconButton color="primary"><LinkIcon /></IconButton>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<Send />}
                        onClick={handleCreatePost}
                        sx={{ borderRadius: 20, bgcolor: '#2F80ED', px: 3 }}
                        disabled={!newPostText && !newPostImage}
                    >
                        Post
                    </Button>
                </Box>
            </Paper>

            {/* Filter Tabs - Inspired by Screenshot */}
            <Tabs
                value={tabValue}
                onChange={(e, v) => setTabValue(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 2, '& .MuiTab-root': { textTransform: 'none', minWidth: 100 } }}
            >
                <Tab label="All Post" sx={{ bgcolor: tabValue === 0 ? '#2F80ED' : 'transparent', color: tabValue === 0 ? 'white !important' : 'inherit', borderRadius: 5, mr: 1 }} />
                <Tab label="Most Liked" sx={{ borderRadius: 5, mr: 1, border: '1px solid #E0E0E0' }} />
                <Tab label="Most Commented" sx={{ borderRadius: 5, mr: 1, border: '1px solid #E0E0E0' }} />
            </Tabs>

            {/* Feed */}
            {posts.map((post) => (
                <PostCard key={post._id} post={post} onUpdate={fetchPosts} />
            ))}
        </Container>
    );
};

const PostCard = ({ post, onUpdate }) => {
    const { user } = useAuth();
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const isLiked = post.likes.some(like => like.userId === user?.id);

    const handleLike = async () => {
        try {
            await postService.likePost(post._id);
            onUpdate();
        } catch (err) {
            console.error('Failed to like post', err);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText) return;
        try {
            await postService.commentPost(post._id, commentText);
            setCommentText('');
            onUpdate();
        } catch (err) {
            console.error('Failed to comment', err);
        }
    };

    return (
        <Card sx={{ mb: 3, borderRadius: 3, border: '1px solid #E0E0E0' }} elevation={0}>
            <CardHeader
                avatar={<Avatar src={post.userAvatar} />}
                title={<Typography sx={{ fontWeight: 'bold' }}>{post.username}</Typography>}
                subheader={new Date(post.createdAt).toLocaleString()}
                action={<Button variant="contained" size="small" sx={{ borderRadius: 5, textTransform: 'none' }}>Follow</Button>}
            />
            <CardContent sx={{ pt: 0 }}>
                <Typography variant="body1">{post.text}</Typography>
            </CardContent>
            {post.imageUrl && (
                <CardMedia
                    component="img"
                    image={post.imageUrl}
                    alt="post image"
                    sx={{ maxHeight: 500, objectFit: 'contain', bgcolor: '#f0f2f5' }}
                />
            )}
            <CardActions sx={{ px: 2, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={handleLike} color={isLiked ? "error" : "default"}>
                            {isLiked ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                        <Typography variant="body2">{post.likes.length}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={() => setShowComments(!showComments)}>
                            <ChatBubbleOutline />
                        </IconButton>
                        <Typography variant="body2">{post.comments.length}</Typography>
                    </Box>
                </Box>
                <IconButton><Share /></IconButton>
            </CardActions>

            {showComments && (
                <Box sx={{ px: 2, pb: 2 }}>
                    <Divider sx={{ mb: 2 }} />
                    {post.comments.map((comment, idx) => (
                        <Box key={idx} sx={{ mb: 1, display: 'flex', gap: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{comment.username}:</Typography>
                            <Typography variant="body2">{comment.text}</Typography>
                        </Box>
                    ))}
                    <form onSubmit={handleComment}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            sx={{ mt: 1 }}
                            InputProps={{
                                endAdornment: (
                                    <IconButton type="submit" size="small" color="primary">
                                        <Send fontSize="small" />
                                    </IconButton>
                                )
                            }}
                        />
                    </form>
                </Box>
            )}
        </Card>
    );
};

export default Home;
