import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Error during login');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: '#1A1B41', // Dark blue background from your design
          borderRadius: 2,
          p: 4,
        }}
      >
        <Box
          component="img"
          src="/logo.png"
          alt="Flesk Wallet"
          sx={{ width: 50, height: 50, mb: 2 }}
        />
        <Typography component="h1" variant="h4" sx={{ color: '#FF6B6B', mb: 1 }}>
          FLESK WALLET
        </Typography>
        <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
          Économisez plus, dépensez mieux.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
              '& input': { color: '#fff' },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
              '& input': { color: '#fff' },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: '#FF6B6B',
              '&:hover': { bgcolor: '#FF5252' },
              borderRadius: 1,
            }}
          >
            SE CONNECTER
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Link href="#" variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Forget password ? reset
            </Link>
            <Link href="/register" variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Créer un compte →
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login; 