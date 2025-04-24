import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Alert,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  SavingGoal,
  getAllSavingGoals,
  createSavingGoal,
  updateSavingGoal,
  deleteSavingGoal,
} from '../../services/savingGoalService';

const CATEGORIES = [
  { value: 'VOYAGE', label: 'Voyage' },
  { value: 'VOITURE', label: 'Voiture' },
  { value: 'MAISON', label: 'Maison' },
  { value: 'EDUCATION', label: 'Éducation' },
  { value: 'AUTRE', label: 'Autre' },
];

const SavingsPage: React.FC = () => {
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingGoal | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: new Date(),
    category: 'VOYAGE',
    description: '',
    monthlyContribution: '',
  });

  const loadGoals = async () => {
    try {
      setLoading(true);
      const data = await getAllSavingGoals();
      setGoals(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la récupération des objectifs d'épargne");
      console.error('Erreur détaillée:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleOpenDialog = (goal?: SavingGoal) => {
    if (goal) {
      setEditingGoal(goal);
      setFormData({
        name: goal.name,
        targetAmount: goal.targetAmount.toString(),
        deadline: new Date(goal.deadline),
        category: goal.category,
        description: goal.description || '',
        monthlyContribution: goal.monthlyContribution.toString(),
      });
    } else {
      setEditingGoal(null);
      setFormData({
        name: '',
        targetAmount: '',
        deadline: new Date(),
        category: 'VOYAGE',
        description: '',
        monthlyContribution: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingGoal(null);
  };

  const handleSubmit = async () => {
    try {
      const goalData = {
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        deadline: formData.deadline.toISOString(),
        category: formData.category as SavingGoal['category'],
        description: formData.description,
        monthlyContribution: parseFloat(formData.monthlyContribution),
      };

      if (editingGoal) {
        await updateSavingGoal(editingGoal._id, goalData);
      } else {
        await createSavingGoal(goalData);
      }

      handleCloseDialog();
      loadGoals();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'enregistrement");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) {
      try {
        await deleteSavingGoal(id);
        loadGoals();
      } catch (err: any) {
        setError(err.message || "Erreur lors de la suppression de l'objectif");
      }
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

      {/* En-tête avec titre et bouton d'ajout */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Objectifs d'épargne
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nouvel objectif
        </Button>
      </Box>

      {/* Liste des objectifs */}
      <Grid container spacing={3}>
        {goals.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center" color="textSecondary">
                  Aucun objectif d'épargne pour le moment
                </Typography>
                <Typography variant="body2" align="center" color="textSecondary" sx={{ mt: 1 }}>
                  Commencez par créer votre premier objectif !
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          goals.map((goal) => (
            <Grid item xs={12} sm={6} md={4} key={goal._id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">{goal.name}</Typography>
                    <Chip
                      label={goal.status}
                      color={goal.status === 'ATTEINT' ? 'success' : goal.status === 'EN_RETARD' ? 'error' : 'primary'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {goal.currentAmount} / {goal.targetAmount} DT
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(goal.currentAmount / goal.targetAmount) * 100}
                    sx={{ mb: 2, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Objectif mensuel : {goal.monthlyContribution} DT
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Date limite : {new Date(goal.deadline).toLocaleDateString()}
                  </Typography>
                  <Chip
                    label={CATEGORIES.find(c => c.value === goal.category)?.label}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton onClick={() => handleOpenDialog(goal)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(goal._id)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Formulaire d'ajout/modification */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingGoal ? "Modifier l'objectif" : 'Ajouter un objectif'}
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
              label="Montant cible (DT)"
              type="number"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              fullWidth
            />
            <TextField
              label="Contribution mensuelle (DT)"
              type="number"
              value={formData.monthlyContribution}
              onChange={(e) => setFormData({ ...formData, monthlyContribution: e.target.value })}
              fullWidth
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date limite"
                value={formData.deadline}
                onChange={(date) => setFormData({ ...formData, deadline: date || new Date() })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
            <TextField
              select
              label="Catégorie"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              fullWidth
            >
              {CATEGORIES.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingGoal ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SavingsPage; 