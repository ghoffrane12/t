import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';
import { 
  getRevenues, 
  createRevenue, 
  updateRevenue, 
  deleteRevenue, 
  Revenue, 
  revenueCategories,
  ApiError 
} from '../../services/revenuesService';
import { isAuthenticated } from '../../services/authService';

interface FormData {
  nom: string;
  description: string;
  amount: string;
  category: string;
  date: string;
}

const initialFormState: FormData = {
  nom: '',
  description: '',
  amount: '',
  category: '',
  date: new Date().toISOString().split('T')[0],
};

const RevenuesPage: React.FC = () => {
  const navigate = useNavigate();
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      if (!isAuthenticated()) {
        navigate('/login');
        return;
      }
      await fetchRevenues();
    };

    checkAuthAndFetchData();
  }, [navigate]);

  const fetchRevenues = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRevenues();
      setRevenues(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      if (apiError.status === 401 || apiError.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (revenue?: Revenue) => {
    if (revenue && revenue._id) {
      setFormData({
        nom: revenue.nom,
        description: revenue.description,
        amount: revenue.amount.toString(),
        category: revenue.category,
        date: new Date(revenue.date).toISOString().split('T')[0],
      });
      setEditingId(revenue._id);
    } else {
      setFormData(initialFormState);
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormState);
    setEditingId(null);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const revenueData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      if (editingId) {
        await updateRevenue(editingId, revenueData);
        showSnackbar('Revenu mis à jour avec succès', 'success');
      } else {
        await createRevenue(revenueData);
        showSnackbar('Revenu ajouté avec succès', 'success');
      }
      
      handleClose();
      await fetchRevenues();
    } catch (err) {
      const apiError = err as ApiError;
      showSnackbar(apiError.message, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce revenu ?')) {
      try {
        await deleteRevenue(id);
        showSnackbar('Revenu supprimé avec succès', 'success');
        await fetchRevenues();
      } catch (err) {
        const apiError = err as ApiError;
        showSnackbar(apiError.message, 'error');
      }
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      );
    }

    if (revenues.length === 0) {
      return (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            Aucun revenu trouvé
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Cliquez sur "Ajouter un revenu" pour commencer
          </Typography>
        </Paper>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Montant</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {revenues.map((revenue) => (
              <TableRow key={revenue._id}>
                <TableCell>{revenue.nom}</TableCell>
                <TableCell>{revenue.description}</TableCell>
                <TableCell>{revenue.amount.toFixed(2)} €</TableCell>
                <TableCell>{revenue.category}</TableCell>
                <TableCell>{new Date(revenue.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(revenue)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(revenue._id!)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, ml: '280px' }}>
        <AppBar position="static" sx={{ bgcolor: '#FF5733', boxShadow: 'none' }}>
          <Toolbar sx={{ minHeight: '64px !important' }} />
        </AppBar>

        <Box sx={{ p: 3 }}>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ color: '#000000', fontWeight: 500 }}>
              Revenus
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
              sx={{ bgcolor: '#FF5733', '&:hover': { bgcolor: '#ff6b4a' } }}
            >
              Ajouter un revenu
            </Button>
          </Grid>

          {renderContent()}
        </Box>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>{editingId ? 'Modifier le revenu' : 'Ajouter un revenu'}</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Montant"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    InputProps={{
                      inputProps: { min: 0, step: "0.01" }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Catégorie"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    {revenueCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Annuler</Button>
              <Button 
                type="submit" 
                variant="contained" 
                sx={{ bgcolor: '#FF5733', '&:hover': { bgcolor: '#ff6b4a' } }}
              >
                {editingId ? 'Modifier' : 'Ajouter'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default RevenuesPage; 