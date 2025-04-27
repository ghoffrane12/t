import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlayArrow as ActiveIcon,
  Stop as InactiveIcon,
} from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import { 
  getSubscriptions, 
  createSubscription, 
  updateSubscription, 
  deleteSubscription,
  subscriptionCategories,
  Subscription 
} from '../services/subscriptionsService';

const SubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [newSubscription, setNewSubscription] = useState<Omit<Subscription, '_id' | 'user' | 'nextPaymentDate' | 'createdAt' | 'updatedAt'>>({
    name: '',
    amount: 0,
    category: '',
    startDate: new Date().toISOString().split('T')[0],
    frequency: 'monthly',
    description: '',
    isActive: true
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await getSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      setError('Erreur lors du chargement des abonnements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubscription = async () => {
    try {
      setLoading(true);
      await createSubscription(newSubscription);
      await fetchSubscriptions();
      setOpenDialog(false);
      resetForm();
    } catch (err) {
      setError('Erreur lors de la création de l\'abonnement');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setNewSubscription({
      name: subscription.name,
      amount: subscription.amount,
      category: subscription.category,
      startDate: subscription.startDate,
      frequency: subscription.frequency,
      description: subscription.description,
      isActive: subscription.isActive
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleUpdateSubscription = async () => {
    if (!selectedSubscription) return;
    try {
      setLoading(true);
      await updateSubscription(selectedSubscription._id!, newSubscription);
      await fetchSubscriptions();
      setOpenDialog(false);
      resetForm();
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'abonnement');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    try {
      setLoading(true);
      await deleteSubscription(id);
      await fetchSubscriptions();
    } catch (err) {
      setError('Erreur lors de la suppression de l\'abonnement');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (subscription: Subscription) => {
    try {
      setLoading(true);
      await updateSubscription(subscription._id!, { isActive: !subscription.isActive });
      await fetchSubscriptions();
    } catch (err) {
      setError('Erreur lors du changement de statut');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewSubscription({
      name: '',
      amount: 0,
      category: '',
      startDate: new Date().toISOString().split('T')[0],
      frequency: 'monthly',
      description: '',
      isActive: true
    });
    setSelectedSubscription(null);
    setIsEditing(false);
    setError(null);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, ml: '280px' }}>
        <AppBar position="static" sx={{ bgcolor: '#FF5733', boxShadow: 'none' }}>
          <Toolbar sx={{ minHeight: '64px !important' }} />
        </AppBar>

        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ color: '#000000', fontWeight: 500 }}>
              Abonnements
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                resetForm();
                setOpenDialog(true);
              }}
              sx={{
                bgcolor: '#FF5733',
                '&:hover': { bgcolor: '#ff6b4a' },
              }}
            >
              Nouvel abonnement
            </Button>
          </Box>

          {error && (
            <Alert 
              severity="error"
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Montant (DT)</TableCell>
                    <TableCell>Catégorie</TableCell>
                    <TableCell>Fréquence</TableCell>
                    <TableCell>Prochaine échéance</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subscriptions.map((subscription) => (
                    <TableRow key={subscription._id}>
                      <TableCell>{subscription.name}</TableCell>
                      <TableCell>{subscription.amount.toLocaleString()} DT</TableCell>
                      <TableCell>{subscription.category}</TableCell>
                      <TableCell>
                        {subscription.frequency === 'monthly' ? 'Mensuel' : 'Annuel'}
                      </TableCell>
                      <TableCell>{formatDate(subscription.nextPaymentDate)}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleToggleStatus(subscription)}
                          sx={{ color: subscription.isActive ? '#4CAF50' : '#FF5733' }}
                        >
                          {subscription.isActive ? <ActiveIcon /> : <InactiveIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell>{subscription.description}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEditSubscription(subscription)}
                          sx={{ color: '#4CAF50' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteSubscription(subscription._id!)}
                          sx={{ color: '#FF5733' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>

      <Dialog 
        open={openDialog} 
        onClose={() => {
          setOpenDialog(false);
          resetForm();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? 'Modifier l\'abonnement' : 'Nouvel abonnement'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Nom"
              fullWidth
              required
              value={newSubscription.name}
              onChange={(e) => setNewSubscription(prev => ({ ...prev, name: e.target.value }))}
            />
            <TextField
              label="Description"
              fullWidth
              required
              value={newSubscription.description}
              onChange={(e) => setNewSubscription(prev => ({ ...prev, description: e.target.value }))}
            />
            <TextField
              label="Montant"
              type="number"
              fullWidth
              required
              value={newSubscription.amount}
              onChange={(e) => setNewSubscription(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
            />
            <TextField
              select
              label="Catégorie"
              fullWidth
              required
              value={newSubscription.category}
              onChange={(e) => setNewSubscription(prev => ({ ...prev, category: e.target.value }))}
            >
              {subscriptionCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Fréquence"
              fullWidth
              required
              value={newSubscription.frequency}
              onChange={(e) => setNewSubscription(prev => ({ ...prev, frequency: e.target.value as 'monthly' | 'yearly' }))}
            >
              <MenuItem value="monthly">Mensuel</MenuItem>
              <MenuItem value="yearly">Annuel</MenuItem>
            </TextField>
            <TextField
              label="Date de début"
              type="date"
              fullWidth
              required
              value={newSubscription.startDate}
              onChange={(e) => setNewSubscription(prev => ({ ...prev, startDate: e.target.value }))}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={newSubscription.isActive}
                  onChange={(e) => setNewSubscription(prev => ({ ...prev, isActive: e.target.checked }))}
                />
              }
              label="Actif"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenDialog(false);
              resetForm();
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={isEditing ? handleUpdateSubscription : handleAddSubscription}
            disabled={loading}
            sx={{ bgcolor: '#FF5733', color: 'white', '&:hover': { bgcolor: '#ff6b4a' } }}
          >
            {loading ? <CircularProgress size={24} /> : (isEditing ? 'Modifier' : 'Ajouter')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubscriptionsPage; 