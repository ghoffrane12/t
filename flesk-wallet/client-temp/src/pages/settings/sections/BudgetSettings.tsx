import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

interface BudgetCategory {
  id: string;
  name: string;
  type: 'EXPENSE' | 'INCOME';
  limit: number;
  icon: string;
  isDefault: boolean;
}

const defaultCategories: BudgetCategory[] = [
  { id: 'food', name: 'Alimentation', type: 'EXPENSE', limit: 500, icon: '🍽️', isDefault: true },
  { id: 'transport', name: 'Transport', type: 'EXPENSE', limit: 200, icon: '🚗', isDefault: true },
  { id: 'housing', name: 'Logement', type: 'EXPENSE', limit: 1000, icon: '🏠', isDefault: true },
  { id: 'utilities', name: 'Factures', type: 'EXPENSE', limit: 300, icon: '📄', isDefault: true },
  { id: 'health', name: 'Santé', type: 'EXPENSE', limit: 200, icon: '🏥', isDefault: true },
  { id: 'leisure', name: 'Loisirs', type: 'EXPENSE', limit: 150, icon: '🎮', isDefault: true },
];

const BudgetSettings = () => {
  const [budgetCycle, setBudgetCycle] = useState('monthly');
  const [categories, setCategories] = useState<BudgetCategory[]>(defaultCategories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editDialog, setEditDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<BudgetCategory | null>(null);
  const [autoAdjust, setAutoAdjust] = useState(true);

  const handleCycleChange = (event: any) => {
    setBudgetCycle(event.target.value);
  };

  const handleAutoAdjustChange = (event: any) => {
    setAutoAdjust(event.target.checked);
  };

  const handleEditCategory = (category: BudgetCategory) => {
    setCurrentCategory(category);
    setEditDialog(true);
  };

  const handleAddCategory = () => {
    setCurrentCategory(null);
    setEditDialog(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      return;
    }

    try {
      setLoading(true);
      // Implement delete category logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      setSuccess('Catégorie supprimée avec succès');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async (formData: any) => {
    try {
      setLoading(true);
      // Implement save category logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call

      if (currentCategory) {
        setCategories(prev =>
          prev.map(cat =>
            cat.id === currentCategory.id
              ? { ...cat, ...formData }
              : cat
          )
        );
      } else {
        setCategories(prev => [...prev, { ...formData, id: Date.now().toString(), isDefault: false }]);
      }

      setSuccess('Catégorie sauvegardée avec succès');
      setEditDialog(false);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      // Implement save settings logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setSuccess('Paramètres de budget sauvegardés avec succès');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Paramètres de Budget
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Cycle de Budget</InputLabel>
            <Select
              value={budgetCycle}
              onChange={handleCycleChange}
              label="Cycle de Budget"
              disabled={loading}
            >
              <MenuItem value="weekly">Hebdomadaire</MenuItem>
              <MenuItem value="monthly">Mensuel</MenuItem>
              <MenuItem value="quarterly">Trimestriel</MenuItem>
              <MenuItem value="yearly">Annuel</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={autoAdjust}
                onChange={handleAutoAdjustChange}
                disabled={loading}
              />
            }
            label="Ajuster automatiquement les limites en fonction des dépenses moyennes"
          />
        </Grid>
      </Grid>

      <Paper sx={{ mt: 4, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1">
            Catégories de Budget
          </Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddCategory}
            disabled={loading}
          >
            Ajouter une catégorie
          </Button>
        </Box>

        <List>
          {categories.map((category) => (
            <ListItem
              key={category.id}
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': { borderBottom: 'none' },
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{category.icon}</span>
                    <Typography>{category.name}</Typography>
                    {category.isDefault && (
                      <Typography variant="caption" color="text.secondary">
                        (Par défaut)
                      </Typography>
                    )}
                  </Box>
                }
                secondary={`Limite: ${category.limit.toLocaleString('fr-FR')} TND / ${budgetCycle === 'monthly' ? 'mois' : budgetCycle === 'weekly' ? 'semaine' : budgetCycle === 'quarterly' ? 'trimestre' : 'an'}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEditCategory(category)}
                  disabled={loading}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteCategory(category.id)}
                  disabled={loading || category.isDefault}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleSaveSettings}
          disabled={loading}
        >
          Enregistrer les paramètres
        </Button>
      </Box>

      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom de la catégorie"
                defaultValue={currentCategory?.name}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Icône"
                defaultValue={currentCategory?.icon}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  defaultValue={currentCategory?.type || 'EXPENSE'}
                  label="Type"
                  disabled={loading}
                >
                  <MenuItem value="EXPENSE">Dépense</MenuItem>
                  <MenuItem value="INCOME">Revenu</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Limite"
                type="number"
                defaultValue={currentCategory?.limit}
                disabled={loading}
                InputProps={{
                  startAdornment: <span>TND </span>,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={() => handleSaveCategory({})} disabled={loading}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetSettings; 