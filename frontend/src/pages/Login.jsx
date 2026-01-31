import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await authService.login(email, password);
            login(data.user, data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F8F9FA' }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>Login to Social</Typography>
                {error && <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>{error}</Typography>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        type="submit"
                        sx={{ mt: 3, mb: 2, bgcolor: '#2F80ED', '&:hover': { bgcolor: '#2465BD' } }}
                    >
                        Sign In
                    </Button>
                </form>
                <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    Don't have an account? <Link href="/signup" underline="hover">Sign Up</Link>
                </Typography>
            </Paper>
        </Box>
    );
};

export default Login;
