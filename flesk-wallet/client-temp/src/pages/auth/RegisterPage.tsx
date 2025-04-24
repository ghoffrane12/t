import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Paper,
} from '@mui/material';
import { PersonAdd as RegisterIcon } from '@mui/icons-material';
import { register } from '../../services/authService';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      await register(formData.email, formData.password, formData.firstName, formData.lastName);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Erreur lors de l\'inscription');
    }
  };

  const inputStyle = {
    bgcolor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 1,
    '& .MuiOutlinedInput-root': {
      color: 'white',
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.2)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#FF5733',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7)',
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#2D1B69',
        color: 'white',
        p: 3,
      }}
    >
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          mb: 3, 
          display: 'flex', 
          alignItems: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 2
        }}
      >
       
      </Paper>

      <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography
            component="h1"
            variant="h3"
            sx={{
              color: '#FF5733',
              fontWeight: 'bold',
              mb: 1,
              textAlign: 'center',
            }}
          >
            FLESK WALLET
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              color: '#6B7280',
              mb: 4,
              textAlign: 'center',
            }}
          >
            Économisez plus, dépensez mieux
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                width: '100%', 
                mb: 2,
                bgcolor: 'rgba(244, 67, 54, 0.1)',
                color: '#f44336',
                '& .MuiAlert-icon': {
                  color: '#f44336',
                },
                border: '1px solid rgba(244, 67, 54, 0.3)',
              }}
            >
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Prénom"
              variant="outlined"
              sx={inputStyle}
            />

            <TextField
              fullWidth
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Nom"
              variant="outlined"
              sx={inputStyle}
            />

            <TextField
              fullWidth
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              variant="outlined"
              sx={inputStyle}
            />

            <TextField
              fullWidth
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mot de passe"
              variant="outlined"
              sx={inputStyle}
            />

            <TextField
              fullWidth
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmer le mot de passe"
              variant="outlined"
              sx={inputStyle}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                mb: 3,
                bgcolor: '#FF5733',
                color: 'white',
                py: 1.5,
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: '#ff4518',
                },
              }}
            >
              S'inscrire
            </Button>

            <Typography
              variant="body1"
              align="center"
              sx={{
                color: '#6B7280',
                '& a': {
                  color: '#FF5733',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                },
              }}
            >
              Déjà un compte ?{' '}
              <Link to="/login" style={{ color: '#FF5733' }}>
                Se connecter
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage; 