import React, { useState } from 'react';
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
    // TODO: Implémenter la création du budget
    setOpenDialog(false);
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

        {/* Liste des budgets à implémenter */}
        <Grid container spacing={3}>
          {/* Les cartes de budget seront affichées ici */}
        </Grid>

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