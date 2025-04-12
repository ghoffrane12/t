import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/login');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Error during registration');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: '#1A1B41',
          borderRadius: 2,
          p: 4,
        }}
      >
        <Box
          component="img"
          src="/logo.png"
          alt="Flesk Wallet"
          sx={{ width: 40, height: 40, mb: 4 }}
        />
        <Box sx={{ alignSelf: 'flex-end', textAlign: 'right', mb: 4 }}>
          <Typography component="h1" variant="h4" sx={{ color: '#FF6B6B', mb: 1 }}>
            FLESK WALLET
          </Typography>
          <Typography variant="h6" sx={{ color: '#fff' }}>
            Économisez plus,
          </Typography>
          <Typography variant="h6" sx={{ color: '#fff' }}>
            dépensez mieux.
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link href="/login" variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Vous avez déjà un compte? Login
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Register; 