import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Box, BottomNavigation, BottomNavigationAction, Paper, IconButton, Avatar, Typography, TextField } from '@mui/material';
import { Home as HomeIcon, Assignment, Public, EmojiEvents, Search, Notifications } from '@mui/icons-material';
import { useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const Header = () => {
  const { user } = useAuth();
  return (
    <Paper elevation={0} sx={{ position: 'sticky', top: 0, zIndex: 1000, px: 2, py: 1, borderBottom: '1px solid #E0E0E0', borderRadius: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Social</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ bgcolor: '#FFF4E5', color: '#B76E00', px: 1, py: 0.5, borderRadius: 5, fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <span style={{ color: '#FFD700' }}>★</span> 100
          </Box>
          <Box sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', px: 1, py: 0.5, borderRadius: 5, fontSize: '0.75rem', fontWeight: 'bold' }}>
            ₹0.00
          </Box>
          <IconButton size="small"><Notifications fontSize="small" /></IconButton>
          <Avatar src={user?.avatar} sx={{ width: 32, height: 32 }} />
        </Box>
      </Box>
      <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search promotions, users, posts..."
          variant="outlined"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 10, bgcolor: '#F2F2F2', '& fieldset': { border: 'none' } } }}
        />
        <IconButton sx={{ bgcolor: '#2F80ED', color: 'white', '&:hover': { bgcolor: '#2465BD' } }} size="small">
          <Search />
        </IconButton>
      </Box>
    </Paper>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [navValue, setNavValue] = useState(2);

  return (
    <Box sx={{ pb: 7 }}>
      {isAuthenticated && <Header />}
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

      {isAuthenticated && (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            value={navValue}
            onChange={(event, newValue) => setNavValue(newValue)}
            sx={{ '& .Mui-selected': { color: '#2F80ED' } }}
          >
            <BottomNavigationAction label="Home" icon={<HomeIcon />} />
            <BottomNavigationAction label="Tasks" icon={<Assignment />} />
            <BottomNavigationAction label="Social" icon={<Public />} />
            <BottomNavigationAction label="Rank" icon={<EmojiEvents />} />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
