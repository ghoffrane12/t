import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  FormControlLabel,
  Switch,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import fr from 'date-fns/locale/fr';
import Sidebar from '../components/Sidebar';
import { getBudgets, createBudget, updateBudget, deleteBudget } from '../services/budgetService';
import { Budget } from '../types/budget';

interface FormData {
  name: string;
  amount: string;
  category: string;
  period: string;
  startDate: Date | null;
  endDate: Date | null;
  description: string;
  notifications: {
    enabled: boolean;
    threshold: number;
  };
  tags: string;
}

const BudgetsPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    amount: '',
    category: '',
    period: 'MONTHLY',
    startDate: new Date(),
    endDate: null,
    description: '',
    notifications: {
      enabled: true,
      threshold: 80
    },
    tags: ''
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedBudgets = await getBudgets();
      setBudgets(fetchedBudgets);
    } catch (err) {
      setError('Erreur lors de la récupération des budgets');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        enabled: e.target.checked
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const budgetData = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        remainingAmount: parseFloat(formData.amount),
        category: formData.category,
        period: formData.period as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY',
        startDate: formData.startDate ? formData.startDate.toISOString() : new Date().toISOString(),
        endDate: formData.endDate ? formData.endDate.toISOString() : undefined,
        status: 'ACTIVE' as const,
        description: formData.description,
        notifications: formData.notifications,
        tags: formData.tags.split(',').map(tag => tag.trim()),
      };

      await createBudget(budgetData);
      await fetchBudgets(); // Rafraîchir la liste
      setOpenDialog(false);
      
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        amount: '',
        category: '',
        period: 'MONTHLY',
        startDate: new Date(),
        endDate: null,
        description: '',
        notifications: {
          enabled: true,
          threshold: 80
        },
        tags: ''
      });
    } catch (err) {
      setError('Erreur lors de la création du budget');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Alimentation',
    'Transport',
    'Logement',
    'Loisirs',
    'Santé',
    'Éducation',
    'Shopping',
    'Autres'
  ];

  const periods = [
    { value: 'DAILY', label: 'Quotidien' },
    { value: 'WEEKLY', label: 'Hebdomadaire' },
    { value: 'MONTHLY', label: 'Mensuel' },
    { value: 'YEARLY', label: 'Annuel' }
  ];

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
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
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Budgets
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            disabled={loading}
            sx={{
              bgcolor: '#FF5733',
              color: 'white',
              '&:hover': {
                bgcolor: '#ff4518',
              },
            }}
          >
            Créer un budget
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {budgets.map((budget) => (
              <Grid item xs={12} sm={6} md={4} key={budget.id}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    bgcolor: '#1E1E2D',
                    color: 'white',
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    {budget.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {budget.category}
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#FF5733' }}>
                    {budget.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Restant: {budget.remainingAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Début: {new Date(budget.startDate).toLocaleDateString('fr-FR')}
                  </Typography>
                  {budget.endDate && (
                    <Typography variant="body2">
                      Fin: {new Date(budget.endDate).toLocaleDateString('fr-FR')}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Dialog de création de budget */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#1E1E2D',
              color: 'white',
            }
          }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: '#FF5733' }}>
              Créer un nouveau budget
            </Typography>
            <IconButton
              onClick={() => setOpenDialog(false)}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ bgcolor: '#1E1E2D' }}>
            <Box component="form" sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Nom du budget"
                    value={formData.name}
                    onChange={handleChange}
                    sx={{
                      ...inputStyle,
                      '& .MuiInputLabel-root': { color: 'white' },
                      '& .MuiOutlinedInput-root': { color: 'white' },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="amount"
                    label="Montant"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    sx={{
                      ...inputStyle,
                      '& .MuiInputLabel-root': { color: 'white' },
                      '& .MuiOutlinedInput-root': { color: 'white' },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    name="category"
                    label="Catégorie"
                    value={formData.category}
                    onChange={handleChange}
                    sx={{
                      ...inputStyle,
                      '& .MuiInputLabel-root': { color: 'white' },
                      '& .MuiOutlinedInput-root': { color: 'white' },
                    }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    name="period"
                    label="Période"
                    value={formData.period}
                    onChange={handleChange}
                    sx={{
                      ...inputStyle,
                      '& .MuiInputLabel-root': { color: 'white' },
                      '& .MuiOutlinedInput-root': { color: 'white' },
                    }}
                  >
                    {periods.map((period) => (
                      <MenuItem key={period.value} value={period.value}>
                        {period.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                    <DatePicker
                      label="Date de début"
                      value={formData.startDate}
                      onChange={(newValue) => {
                        setFormData(prev => ({ ...prev, startDate: newValue }));
                      }}
                      sx={{
                        width: '100%',
                        ...inputStyle,
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiOutlinedInput-root': { color: 'white' },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    name="description"
                    label="Description"
                    value={formData.description}
                    onChange={handleChange}
                    sx={{
                      ...inputStyle,
                      '& .MuiInputLabel-root': { color: 'white' },
                      '& .MuiOutlinedInput-root': { color: 'white' },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.notifications.enabled}
                        onChange={handleNotificationChange}
                        name="notifications"
                        color="primary"
                      />
                    }
                    label="Activer les notifications"
                    sx={{ color: 'white' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="tags"
                    label="Tags (séparés par des virgules)"
                    value={formData.tags}
                    onChange={handleChange}
                    sx={{
                      ...inputStyle,
                      '& .MuiInputLabel-root': { color: 'white' },
                      '& .MuiOutlinedInput-root': { color: 'white' },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ bgcolor: '#1E1E2D', p: 3 }}>
            <Button
              onClick={() => setOpenDialog(false)}
              sx={{
                color: '#6B7280',
                '&:hover': {
                  bgcolor: 'rgba(107, 114, 128, 0.1)',
                },
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                bgcolor: '#FF5733',
                color: 'white',
                '&:hover': {
                  bgcolor: '#ff4518',
                },
              }}
            >
              Créer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default BudgetsPage; 