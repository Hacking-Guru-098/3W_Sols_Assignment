import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },
    signup: async (username, email, password) => {
        const response = await api.post('/auth/signup', { username, email, password });
        return response.data;
    },
};

export const postService = {
    getPosts: async () => {
        const response = await api.get('/posts');
        return response.data;
    },
    createPost: async (formData) => {
        const response = await api.post('/posts', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
    likePost: async (postId) => {
        const response = await api.post(`/posts/${postId}/like`);
        return response.data;
    },
    commentPost: async (postId, text) => {
        const response = await api.post(`/posts/${postId}/comment`, { text });
        return response.data;
    },
};

export default api;
