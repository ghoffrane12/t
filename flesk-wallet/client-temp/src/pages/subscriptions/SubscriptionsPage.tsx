import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import fr from 'date-fns/locale/fr';
import { Subscription, SubscriptionStats, getAllSubscriptions, getSubscriptionStats, createSubscription, updateSubscription, deleteSubscription } from '../../services/subscriptionService';

type Frequency = 'MONTHLY' | 'YEARLY' | 'QUARTERLY';
type Category = 'ENTERTAINMENT' | 'FITNESS' | 'SERVICES' | 'EDUCATION' | 'OTHER';
type Status = 'ACTIVE' | 'PAUSED' | 'CANCELLED';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'ENTERTAINMENT', label: 'Divertissement' },
  { value: 'FITNESS', label: 'Fitness' },
  { value: 'SERVICES', label: 'Services' },
  { value: 'EDUCATION', label: 'Éducation' },
  { value: 'OTHER', label: 'Autre' }
];

const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: 'MONTHLY', label: 'Mensuel' },
  { value: 'YEARLY', label: 'Annuel' },
  { value: 'QUARTERLY', label: 'Trimestriel' }
];

const STATUSES: { value: Status; label: string }[] = [
  { value: 'ACTIVE', label: 'Actif' },
  { value: 'PAUSED', label: 'En pause' },
  { value: 'CANCELLED', label: 'À annuler' }
];

interface FormData {
  name: string;
  amount: string;
  frequency: Frequency;
  nextPaymentDate: Date;
  category: Category;
  status: Status;
  logo: string;
  notes: string;
}

const SubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    amount: '',
    frequency: 'MONTHLY',
    nextPaymentDate: new Date(),
    category: 'ENTERTAINMENT',
    status: 'ACTIVE',
    logo: '',
    notes: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [subscriptionsData, statsData] = await Promise.all([
        getAllSubscriptions(),
        getSubscriptionStats()
      ]);
      setSubscriptions(subscriptionsData);
      setStats(statsData);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenDialog = (subscription?: Subscription) => {
    if (subscription) {
      setEditingSubscription(subscription);
      setFormData({
        name: subscription.name,
        amount: subscription.amount.toString(),
        frequency: subscription.frequency,
        nextPaymentDate: new Date(subscription.nextPaymentDate),
        category: subscription.category,
        status: subscription.status,
        logo: subscription.logo || '',
        notes: subscription.notes || ''
      });
    } else {
      setEditingSubscription(null);
      setFormData({
        name: '',
        amount: '',
        frequency: 'MONTHLY',
        nextPaymentDate: new Date(),
        category: 'ENTERTAINMENT',
        status: 'ACTIVE',
        logo: '',
        notes: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSubscription(null);
  };

  const handleSubmit = async () => {
    try {
      const subscriptionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        nextPaymentDate: formData.nextPaymentDate.toISOString()
      };

      if (editingSubscription) {
        await updateSubscription(editingSubscription._id, subscriptionData);
      } else {
        await createSubscription(subscriptionData);
      }

      handleCloseDialog();
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet abonnement ?')) {
      try {
        await deleteSubscription(id);
        loadData();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'PAUSED': return 'warning';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Stats Section */}
      {stats && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Récapitulatif des abonnements
            </Typography>
            <Typography variant="h4" color="primary">
              {stats.totalMonthly.toFixed(2)} €/mois
            </Typography>
            <Box mt={2}>
              <Typography variant="subtitle1" gutterBottom>
                Prochains paiements :
              </Typography>
              {stats.upcomingPayments.map((sub) => (
                <Typography key={sub._id} variant="body2">
                  {sub.name} - {new Date(sub.nextPaymentDate).toLocaleDateString()} : {sub.amount} €
                </Typography>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Add Subscription Button */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Ajouter un abonnement
        </Button>
      </Box>

      {/* Subscriptions Grid */}
      <Grid container spacing={3}>
        {subscriptions.map((subscription) => (
          <Grid item xs={12} sm={6} md={4} key={subscription._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">{subscription.name}</Typography>
                  <Chip
                    label={STATUSES.find(s => s.value === subscription.status)?.label}
                    color={getStatusColor(subscription.status)}
                    size="small"
                  />
                </Box>
                <Typography variant="h4" color="primary" gutterBottom>
                  {subscription.amount} €
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {FREQUENCIES.find(f => f.value === subscription.frequency)?.label}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Prochain paiement : {new Date(subscription.nextPaymentDate).toLocaleDateString()}
                </Typography>
                <Chip
                  label={CATEGORIES.find(c => c.value === subscription.category)?.label}
                  size="small"
                  sx={{ mt: 1 }}
                />
                {subscription.notes && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {subscription.notes}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleOpenDialog(subscription)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(subscription._id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSubscription ? 'Modifier l\'abonnement' : 'Ajouter un abonnement'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Nom"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Montant"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Fréquence</InputLabel>
              <Select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as Frequency })}
                label="Fréquence"
              >
                {FREQUENCIES.map((freq) => (
                  <MenuItem key={freq.value} value={freq.value}>
                    {freq.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
              <DatePicker
                label="Date du prochain paiement"
                value={formData.nextPaymentDate}
                onChange={(date) => setFormData({ ...formData, nextPaymentDate: date || new Date() })}
                slotProps={{ 
                  textField: { fullWidth: true },
                  actionBar: {
                    actions: ['clear', 'today', 'accept']
                  }
                }}
              />
            </LocalizationProvider>
            <FormControl fullWidth>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                label="Catégorie"
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
                label="Statut"
              >
                {STATUSES.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Logo (URL)"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              fullWidth
            />
            <TextField
              label="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingSubscription ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubscriptionsPage; 