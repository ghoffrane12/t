import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, Typography } from '@mui/material';
import axios from 'axios';

interface DeleteAccountDialogProps {
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({ open, onClose, onDeleted }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      onDeleted();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression du compte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Supprimer mon compte</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Typography color="error" sx={{ mb: 2 }}>
          Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est <b>irréversible</b> et toutes vos données seront perdues.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Annuler</Button>
        <Button onClick={handleDelete} color="error" variant="contained" disabled={loading}>
          Supprimer définitivement
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAccountDialog; 