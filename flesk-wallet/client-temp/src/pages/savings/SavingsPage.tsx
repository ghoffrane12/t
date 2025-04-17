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
  Paper,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, TrendingUp, AddCircle } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  SavingGoal,
  AnalysisData,
  getAllSavingGoals,
  createSavingGoal,
  updateSavingGoal,
  deleteSavingGoal,
  getAnalysis,
} from '../../services/savingGoalService';
import TransactionHistory from '../../components/TransactionHistory';
import SmartBudget from '../../components/SmartBudget';
import SubscriptionManager from '../../components/SubscriptionManager';
import SpendingAnalysis from '../../components/SpendingAnalysis';
import BudgetForecast from '../../components/BudgetForecast';

const CATEGORIES = [
  { value: 'VOYAGE', label: 'Voyage' },
  { value: 'VOITURE', label: 'Voiture' },
  { value: 'MAISON', label: 'Maison' },
  { value: 'EDUCATION', label: 'Éducation' },
  { value: 'AUTRE', label: 'Autre' },
];

const SavingsPage: React.FC = () => {
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
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

  const loadData = async () => {
    try {
      setLoading(true);
      const [goalsData, analysisData] = await Promise.all([
        getAllSavingGoals(),
        getAnalysis(),
      ]);
      setGoals(goalsData);
      setAnalysis(analysisData);
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
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) {
      try {
        await deleteSavingGoal(id);
        loadData();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATTEINT': return 'success';
      case 'EN_RETARD': return 'error';
      default: return 'primary';
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

      {/* Analyse des dépenses */}
      <Box mb={4}>
        <SpendingAnalysis />
      </Box>

      {/* Simulation de budget */}
      <Box mb={4}>
        <BudgetForecast />
      </Box>

      {/* Analyse des tendances */}
      {analysis && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Analyse des dépenses
            </Typography>
            <Grid container spacing={2}>
              {analysis.insights.map((insight, index) => (
                <Grid item xs={12} key={index}>
                  <Alert severity={insight.type === 'WARNING' ? 'warning' : 'success'}>
                    {insight.message}
                  </Alert>
                </Grid>
              ))}
              {Object.entries(analysis.predictions).map(([category, prediction]) => (
                <Grid item xs={12} sm={6} md={4} key={category}>
                  <Box>
                    <Typography variant="subtitle1">
                      {category} - Prévision du mois prochain
                    </Typography>
                    <Typography variant="h6">
                      {prediction.predictedAmount.toFixed(2)} DT
                    </Typography>
                    <Chip
                      size="small"
                      label={`Confiance: ${prediction.confidence}`}
                      color={prediction.confidence === 'ÉLEVÉ' ? 'success' : 'warning'}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Header with Add Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Tableau de bord
        </Typography>
        <IconButton 
          sx={{ 
            bgcolor: '#FF5733',
            color: 'white',
            '&:hover': {
              bgcolor: '#E64A2E',
            },
          }}
        >
          <AddCircle />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        {/* Wallet Balance */}
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3,
              bgcolor: '#1B1B3A',
              color: 'white',
              borderRadius: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              WALLET
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {/* Replace with actual wallet balance */}
              800 DT
            </Typography>
          </Paper>
        </Grid>

        {/* Smart Budget Summary */}
        <Grid item xs={12} md={8}>
          <SmartBudget />
        </Grid>

        {/* Chart */}
        <Grid item xs={12}>
          {/* Replace with actual ExpenseRevenueChart component */}
          ExpenseRevenueChart
        </Grid>

        {/* Subscription Manager */}
        <Grid item xs={12} md={6}>
          <SubscriptionManager />
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={6}>
          <TransactionHistory />
        </Grid>
      </Grid>

      {/* Bouton d'ajout */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Ajouter un objectif
        </Button>
      </Box>

      {/* Liste des objectifs */}
      <Grid container spacing={3}>
        {goals.map((goal) => (
          <Grid item xs={12} sm={6} md={4} key={goal._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">{goal.name}</Typography>
                  <Chip
                    label={goal.status}
                    color={getStatusColor(goal.status)}
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
              </CardContent>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton onClick={() => handleOpenDialog(goal)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(goal._id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
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