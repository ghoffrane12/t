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
  Divider,
  LinearProgress,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import fr from 'date-fns/locale/fr';
import Sidebar from '../components/Sidebar';
import { getSavingsGoals, createSavingsGoal, updateSavingsGoal, deleteSavingsGoal } from '../services/savingsService';
import { SavingsGoal } from '../services/savingsService';

const SavingsPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedGoalForDeduction, setSelectedGoalForDeduction] = useState<SavingsGoal | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addAmount, setAddAmount] = useState<number>(0);

  const [newGoal, setNewGoal] = useState<Omit<SavingsGoal, 'id'>>({
    title: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: new Date().toISOString().split('T')[0],
    category: ''
  });

  const categories = [
    "Voyage",
    "Technologie",
    "Voiture",
    "Maison",
    "Éducation",
    "Autre"
  ];

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await getSavingsGoals();
      setGoals(data);
    } catch (err) {
      setError('Erreur lors du chargement des objectifs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async () => {
    try {
      setLoading(true);
      await createSavingsGoal(newGoal);
      await fetchGoals();
      setOpenDialog(false);
      setNewGoal({
        title: '',
        targetAmount: 0,
        currentAmount: 0,
        deadline: new Date().toISOString().split('T')[0],
        category: ''
      });
    } catch (err) {
      setError('Erreur lors de la création de l\'objectif');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditGoal = (goal: SavingsGoal) => {
    console.log('handleEditGoal appelé avec goal:', goal);
    setSelectedGoal(goal);
    console.log('selectedGoal après setSelectedGoal:', selectedGoal);
    setNewGoal({
      title: goal.title,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: new Date(goal.deadline).toISOString().split('T')[0],
      category: goal.category
    });
    setEditDialogOpen(true);
  };

  const handleUpdateGoal = async () => {
    if (!selectedGoal) return;
    try {
      setLoading(true);
      await updateSavingsGoal(selectedGoal.id, newGoal);
      await fetchGoals();
      setEditDialogOpen(false);
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'objectif');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      setLoading(true);
      await deleteSavingsGoal(id);
      await fetchGoals();
    } catch (err) {
      setError('Erreur lors de la suppression de l\'objectif');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = (goal: SavingsGoal) => {
    setSelectedGoalForDeduction(goal);
    setAddDialogOpen(true);
  };

  const handleAddAmount = async () => {
    if (!selectedGoalForDeduction) return;
    try {
      setLoading(true);
      const updatedGoal = {
        ...selectedGoalForDeduction,
        currentAmount: selectedGoalForDeduction.currentAmount + addAmount
      };
      await updateSavingsGoal(selectedGoalForDeduction.id, updatedGoal);
      await fetchGoals();
      setAddDialogOpen(false);
      setAddAmount(0);
    } catch (err) {
      setError('Erreur lors de l\'ajout du montant');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, ml: '280px' }}>
      <AppBar position="static" sx={{ 
          bgcolor: '#F0F3F4', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          borderBottom: '2px solid rgba(200, 200, 200, 0.8)',
          borderRadius: 0
        }}>
          <Toolbar sx={{ minHeight: '64px !important' }} />
        </AppBar>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ color: '#000000', mb: 4, fontWeight: 500 }}>
            Épargne
          </Typography>

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
              Nouvel objectif
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
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 3 }}>
              {goals.map((goal) => (
                <Paper
                  key={goal.id}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" sx={{ color: '#000000', flex: 1 }}>
                      {goal.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        onClick={() => handleOpenAddDialog(goal)}
                        sx={{ color: '#FF5733' }}
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleEditGoal(goal)}
                        sx={{ color: '#FF5733' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteGoal(goal.id)}
                        sx={{ color: '#FF5733' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Progression
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(goal.currentAmount / goal.targetAmount) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(255, 87, 51, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: '#FF5733'
                        }
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        {((goal.currentAmount / goal.targetAmount) * 100).toFixed(0)}%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {goal.currentAmount.toLocaleString()} DT / {goal.targetAmount.toLocaleString()} DT
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Date limite : {formatDate(goal.deadline)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Catégorie : {goal.category}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Dialog de création */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nouvel objectif d'épargne</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Nom de l'objectif"
              fullWidth
              required
              value={newGoal.title}
              onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
            />
            <TextField
              label="Montant cible (DT)"
              type="number"
              fullWidth
              required
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: Number(e.target.value) }))}
            />
            <TextField
              label="Montant actuel (DT)"
              type="number"
              fullWidth
              required
              value={newGoal.currentAmount}
              onChange={(e) => setNewGoal(prev => ({ ...prev, currentAmount: Number(e.target.value) }))}
            />
            <TextField
              label="Date d'échéance"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={newGoal.deadline}
              onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
            />
            <TextField
              select
              label="Catégorie"
              fullWidth
              required
              value={newGoal.category}
              onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button 
            onClick={handleAddGoal}
            disabled={loading}
            sx={{ bgcolor: '#FF5733', color: 'white', '&:hover': { bgcolor: '#ff6b4a' } }}
          >
            {loading ? <CircularProgress size={24} /> : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier l'objectif d'épargne</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Nom de l'objectif"
              fullWidth
              required
              value={newGoal.title}
              onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
            />
            <TextField
              label="Montant cible (DT)"
              type="number"
              fullWidth
              required
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: Number(e.target.value) }))}
            />
            <TextField
              label="Montant actuel (DT)"
              type="number"
              fullWidth
              required
              value={newGoal.currentAmount}
              onChange={(e) => setNewGoal(prev => ({ ...prev, currentAmount: Number(e.target.value) }))}
            />
            <TextField
              label="Date d'échéance"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={newGoal.deadline}
              onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
            />
            <TextField
              select
              label="Catégorie"
              fullWidth
              required
              value={newGoal.category}
              onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleUpdateGoal}
            disabled={loading}
            sx={{ bgcolor: '#FF5733', color: 'white', '&:hover': { bgcolor: '#ff6b4a' } }}
          >
            {loading ? <CircularProgress size={24} /> : 'Modifier'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog d'ajout */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Ajouter un montant</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Montant actuel : {selectedGoalForDeduction?.currentAmount.toLocaleString()} DT
            </Typography>
            <TextField
              fullWidth
              label="Montant à ajouter"
              type="number"
              value={addAmount}
              onChange={(e) => setAddAmount(Number(e.target.value))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={handleAddAmount}
            disabled={loading || addAmount <= 0}
            sx={{ bgcolor: '#FF5733', color: 'white', '&:hover': { bgcolor: '#ff6b4a' } }}
          >
            {loading ? <CircularProgress size={24} /> : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SavingsPage;