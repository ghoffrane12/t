import React, { useState, useEffect } from 'react';
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
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';
import { Budget, getBudgets, createBudget } from '../../services/budgetService';

const BudgetsPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les budgets au montage du composant
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        setLoading(true);
        const response = await getBudgets();
        // Ensure we're setting an array
        setBudgets(Array.isArray(response) ? response : []);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des budgets');
        console.error('Erreur:', err);
        // Set empty array in case of error
        setBudgets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  const categories = [
    "Alimentation",
    "Transport",
    "Logement",
    "Loisirs",
    "Santé",
    "Shopping",
    "Autre"
  ];

  const periods = [
    { value: 'DAILY', label: 'Quotidien' },
    { value: 'WEEKLY', label: 'Hebdomadaire' },
    { value: 'MONTHLY', label: 'Mensuel' },
    { value: 'YEARLY', label: 'Annuel' }
  ];

  const [newBudget, setNewBudget] = useState<Omit<Budget, 'id' | 'currentSpending'>>({
    name: '',
    amount: 0,
    category: '',
    period: 'MONTHLY',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'ACTIVE',
    notifications: {
      enabled: true,
      threshold: 80
    },
    description: '',
    tags: []
  });

  const handleAddTag = () => {
    if (newTag.trim() && !newBudget.tags.includes(newTag.trim())) {
      setNewBudget(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewBudget(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddBudget = async () => {
    try {
      setLoading(true);
      const createdBudget = await createBudget(newBudget);
      // Ensure we're adding to an array
      setBudgets(prev => Array.isArray(prev) ? [...prev, createdBudget] : [createdBudget]);
      setError(null);
      setOpenDialog(false);
      setNewBudget({
        name: '',
        amount: 0,
        category: '',
        period: 'MONTHLY',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        status: 'ACTIVE',
        notifications: {
          enabled: true,
          threshold: 80
        },
        description: '',
        tags: []
      });
    } catch (err) {
      setError('Erreur lors de la création du budget');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // Rendu des budgets existants
  const renderBudgets = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress sx={{ color: '#FF5733' }} />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      );
    }

    // Ensure budgets is an array before mapping
    if (!Array.isArray(budgets) || budgets.length === 0) {
      return (
        <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Aucun budget pour le moment
        </Typography>
      );
    }

    return budgets.map((budget) => (
      <Paper
        key={budget.id}
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h6" sx={{ color: '#000000' }}>
          {budget.name}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1">
            Montant: {budget.amount}€
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {budget.category}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {budget.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{ bgcolor: '#FF5733', color: 'white' }}
            />
          ))}
        </Box>
      </Paper>
    ));
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, ml: '280px' }}>
        {/* Barre orange supérieure */}
        <AppBar position="static" sx={{ bgcolor: '#FF5733', boxShadow: 'none' }}>
          <Toolbar sx={{ minHeight: '64px !important' }} />
        </AppBar>

        {/* Titre de la page */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ color: '#000000', mb: 4, fontWeight: 500 }}>
            Budgets
          </Typography>

          {/* Bouton Créer budget */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{
                bgcolor: '#FF5733',
                '&:hover': { bgcolor: '#ff6b4a' },
              }}
            >
              Créer budget
            </Button>
          </Box>

          {/* Grille des budgets */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
            {renderBudgets()}
          </Box>
        </Box>
      </Box>

      {/* Dialog de création de budget */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Créer un nouveau budget</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Nom du budget"
              fullWidth
              required
              value={newBudget.name}
              onChange={(e) => setNewBudget(prev => ({ ...prev, name: e.target.value }))}
            />
            <TextField
              label="Montant (€)"
              type="number"
              fullWidth
              required
              value={newBudget.amount}
              onChange={(e) => setNewBudget(prev => ({ ...prev, amount: Number(e.target.value) }))}
            />
            <TextField
              select
              label="Catégorie"
              fullWidth
              required
              value={newBudget.category}
              onChange={(e) => setNewBudget(prev => ({ ...prev, category: e.target.value }))}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Période"
              fullWidth
              required
              value={newBudget.period}
              onChange={(e) => setNewBudget(prev => ({ ...prev, period: e.target.value as Budget['period'] }))}
            >
              {periods.map((period) => (
                <MenuItem key={period.value} value={period.value}>
                  {period.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Date de début"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={newBudget.startDate}
              onChange={(e) => setNewBudget(prev => ({ ...prev, startDate: e.target.value }))}
            />
            <TextField
              label="Date de fin (optionnel)"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newBudget.endDate}
              onChange={(e) => setNewBudget(prev => ({ ...prev, endDate: e.target.value }))}
            />
            <TextField
              label="Description (optionnel)"
              fullWidth
              multiline
              rows={3}
              value={newBudget.description}
              onChange={(e) => setNewBudget(prev => ({ ...prev, description: e.target.value }))}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={newBudget.notifications.enabled}
                  onChange={(e) => setNewBudget(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      enabled: e.target.checked
                    }
                  }))}
                />
              }
              label="Activer les notifications"
            />
            {newBudget.notifications.enabled && (
              <TextField
                label="Seuil de notification (%)"
                type="number"
                fullWidth
                value={newBudget.notifications.threshold}
                onChange={(e) => setNewBudget(prev => ({
                  ...prev,
                  notifications: {
                    ...prev.notifications,
                    threshold: Number(e.target.value)
                  }
                }))}
                inputProps={{ min: 0, max: 100 }}
              />
            )}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Tags</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                {newBudget.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    sx={{ bgcolor: '#FF5733', color: 'white' }}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  label="Ajouter un tag"
                  size="small"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <IconButton onClick={handleAddTag} sx={{ color: '#FF5733' }}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button 
            onClick={handleAddBudget}
            disabled={loading}
            sx={{ bgcolor: '#FF5733', color: 'white', '&:hover': { bgcolor: '#ff6b4a' } }}
          >
            {loading ? <CircularProgress size={24} /> : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetsPage; 