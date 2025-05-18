import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box
} from '@mui/material';
import axios from 'axios';

interface ChangePasswordFormProps {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ open, onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/auth/change-password', {
        oldPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Mot de passe modifié avec succès.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du changement de mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Modifier le mot de passe</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Ancien mot de passe"
              type="password"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Nouveau mot de passe"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Confirmer le nouveau mot de passe"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Annuler</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            Enregistrer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChangePasswordForm; 