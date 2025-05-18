import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';

interface UserInfoFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  currency: string;
  language: string;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    currency: 'TND',
    language: 'fr',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = response.data.user;
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          currency: userData.currency || 'TND',
          language: userData.language || 'fr',
        });
      } catch (err) {
        setError('Erreur lors du chargement des données utilisateur');
      }
    };

    if (open) {
      fetchUserData();
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/auth/me', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Informations mises à jour avec succès');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Erreur lors de la mise à jour des informations');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Modifier mes informations</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="firstName"
              label="Prénom"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="lastName"
              label="Nom"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained" color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserInfoForm; 