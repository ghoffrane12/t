import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import authService from '../../../services/authService';

interface BankAccount {
  id: string;
  name: string;
  type: string;
  lastSync: string;
}

const AccountSettings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [addBankDialog, setAddBankDialog] = useState(false);

  const currentUser = authService.getCurrentUser();

  const [formData, setFormData] = useState({
    email: currentUser?.email || '',
    username: currentUser?.username || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Implement user update logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setSuccess('Informations mises à jour avec succès');
      setEditMode(false);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Implement password change logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setSuccess('Mot de passe modifié avec succès');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Implement account deletion logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      authService.logout();
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Informations Personnelles
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nom d'utilisateur"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={!editMode || loading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!editMode || loading}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {!editMode ? (
                <Button
                  variant="contained"
                  onClick={() => setEditMode(true)}
                  disabled={loading}
                >
                  Modifier
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={loading}
                  >
                    Enregistrer
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setEditMode(false)}
                    disabled={loading}
                  >
                    Annuler
                  </Button>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </form>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Changer le mot de passe
      </Typography>

      <form onSubmit={handlePasswordChange}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mot de passe actuel"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleInputChange}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nouveau mot de passe"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleInputChange}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Confirmer le nouveau mot de passe"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
            >
              Changer le mot de passe
            </Button>
          </Grid>
        </Grid>
      </form>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Comptes Bancaires Liés
      </Typography>

      <List>
        {bankAccounts.map((account) => (
          <ListItem key={account.id}>
            <ListItemText
              primary={account.name}
              secondary={`${account.type} • Dernière synchro: ${new Date(account.lastSync).toLocaleDateString('fr-FR')}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setAddBankDialog(true)}
        sx={{ mt: 2 }}
      >
        Lier un nouveau compte
      </Button>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom sx={{ color: 'error.main' }}>
        Zone Dangereuse
      </Typography>

      <Button
        variant="outlined"
        color="error"
        onClick={handleDeleteAccount}
        disabled={loading}
      >
        Supprimer mon compte
      </Button>

      <Dialog open={addBankDialog} onClose={() => setAddBankDialog(false)}>
        <DialogTitle>Lier un nouveau compte bancaire</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Cette fonctionnalité sera bientôt disponible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddBankDialog(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountSettings;