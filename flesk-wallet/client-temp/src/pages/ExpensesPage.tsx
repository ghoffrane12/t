import React, { useState } from 'react';
import axios from '../services/axiosInstance';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Paper,
  CircularProgress
} from '@mui/material';
import Sidebar from '../components/Sidebar';
import { getExpenses, createExpense, updateExpense, deleteExpense, expenseCategories, Expense } from '../services/expensesService';
import { getBudgetByCategory, createBudget, Budget, BudgetCreatePayload } from '../services/budgetService';

const ExpensesPage: React.FC = () => {
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [openBudgetForm, setOpenBudgetForm] = useState(false);
  const [pendingExpense, setPendingExpense] = useState<Omit<Expense, '_id'> | null>(null);
  const [newBudget, setNewBudget] = useState<BudgetCreatePayload>({
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

  const [newExpense, setNewExpense] = useState<Omit<Expense, '_id'>>({
    nom: '',
    description: '',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [openBudgetPrompt, setOpenBudgetPrompt] = useState(false);
  const [openDepassementDialog, setOpenDepassementDialog] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      setError('Erreur lors du chargement des dépenses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    try {
      setLoading(true);
      // Vérifier si un budget existe pour cette catégorie
      const existingBudget = await getBudgetByCategory(newExpense.category);
      
      if (!existingBudget) {
        setPendingExpense(newExpense);
        setOpenBudgetPrompt(true);
        setOpenDialog(false);
        setLoading(false);
        return;
      }

      // Contrôle du dépassement de budget
      if (newExpense.amount > existingBudget.remainingAmount) {
        setOpenDepassementDialog(true);
        // On laisse passer la dépense
      }

      // Créer la dépense même si elle dépasse le budget
      await createExpense(newExpense);
      await fetchExpenses();
      setOpenDialog(false);
      resetForm();
    } catch (err) {
      setError('Erreur lors de la création de la dépense');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = async () => {
    try {
      setLoading(true);
      const budgetData: BudgetCreatePayload = {
        name: newBudget.name,
        amount: newBudget.amount,
        category: pendingExpense?.category || '',
        period: newBudget.period,
        startDate: newBudget.startDate,
        endDate: newBudget.endDate,
        status: newBudget.status,
        notifications: newBudget.notifications,
        description: newBudget.description,
        tags: newBudget.tags
      };
      await createBudget(budgetData);
      if (pendingExpense) {
        await createExpense(pendingExpense);
        await fetchExpenses();
      }
      setOpenBudgetForm(false);
      setOpenDialog(false);
      resetForm();
    } catch (err) {
      setError('Erreur lors de la création du budget');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setNewExpense({
      nom: expense.nom,
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleUpdateExpense = async () => {
    if (!selectedExpense) return;
    try {
      setLoading(true);
      await updateExpense(selectedExpense._id!, newExpense);
      await fetchExpenses();
      setOpenDialog(false);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la prédiction :', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      setLoading(true);
      await deleteExpense(id);
      await fetchExpenses();
    } catch (err) {
      setError('Erreur lors de la suppression de la dépense');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewExpense({
      nom: '',
      description: '',
      amount: 0,
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
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
    setSelectedExpense(null);
    setIsEditing(false);
    setPendingExpense(null);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const handleBudgetPromptCancel = async () => {
    if (pendingExpense) {
      setLoading(true);
      try {
        await createExpense(pendingExpense);
        await fetchExpenses();
      } catch (err) {
        setError('Erreur lors de la création de la dépense');
      } finally {
        setLoading(false);
        setOpenBudgetPrompt(false);
        setPendingExpense(null);
        resetForm();
      }
    } else {
      setOpenBudgetPrompt(false);
      setPendingExpense(null);
      resetForm();
    }
  };

  const handleBudgetPromptCreate = () => {
    setOpenBudgetPrompt(false);
    setOpenBudgetForm(true);
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

        {/* Titre de la page */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ color: '#000000', mb: 4, fontWeight: 500 }}>
            Dépenses
          </Typography>

          {/* Contenu spécifique */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Bouton de prédiction */}
            <Button
              variant="contained"
              color="primary"
              onClick={handlePredict}
              disabled={loading}
              sx={{ width: '200px' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Prédire les dépenses'}
            </Button>

            {/* Affichage de la prédiction */}
            {prediction !== null && (
              <Paper elevation={3} sx={{ p: 2, bgcolor: '#ffffff' }}>
                <Typography variant="h6">
                  Montant prédit pour le mois prochain :{' '}
                  <strong>{prediction.toFixed(2)} TND</strong>
                </Typography>
              </Paper>
            )}
          </Box>
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
          {isEditing ? 'Modifier la dépense' : 'Nouvelle dépense'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Nom de la dépense"
              fullWidth
              required
              value={newExpense.nom}
              onChange={(e) => setNewExpense(prev => ({ ...prev, nom: e.target.value }))}
            />
            <TextField
              label="Description"
              fullWidth
              required
              value={newExpense.description}
              onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
            />
            <TextField
              label="Montant"
              type="number"
              fullWidth
              required
              value={newExpense.amount}
              onChange={(e) => setNewExpense(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
            />
            <TextField
              select
              label="Catégorie"
              fullWidth
              required
              value={newExpense.category}
              onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
            >
              {expenseCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Date"
              type="date"
              fullWidth
              required
              value={newExpense.date}
              onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
              InputLabelProps={{
                shrink: true,
              }}
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
            onClick={isEditing ? handleUpdateExpense : handleAddExpense}
            disabled={loading}
            sx={{ bgcolor: '#FF5733', color: 'white', '&:hover': { bgcolor: '#ff6b4a' } }}
          >
            {loading ? <CircularProgress size={24} /> : (isEditing ? 'Modifier' : 'Ajouter')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={openBudgetForm} 
        onClose={() => {
          setOpenBudgetForm(false);
          resetForm();
        }} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Créer un budget pour {pendingExpense?.category}</DialogTitle>
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
              label="Montant (DT)"
              type="number"
              fullWidth
              required
              value={newBudget.amount}
              onChange={(e) => setNewBudget(prev => ({ ...prev, amount: Number(e.target.value) }))}
            />
            <TextField
              select
              label="Période"
              fullWidth
              required
              value={newBudget.period}
              onChange={(e) => setNewBudget(prev => ({ ...prev, period: e.target.value as Budget['period'] }))}
            >
              <MenuItem value="DAILY">Quotidien</MenuItem>
              <MenuItem value="WEEKLY">Hebdomadaire</MenuItem>
              <MenuItem value="MONTHLY">Mensuel</MenuItem>
              <MenuItem value="YEARLY">Annuel</MenuItem>
            </TextField>
            <TextField
              label="Date de début"
              type="date"
              fullWidth
              required
              value={newBudget.startDate}
              onChange={(e) => setNewBudget(prev => ({ ...prev, startDate: e.target.value }))}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Date de fin (optionnel)"
              type="date"
              fullWidth
              value={newBudget.endDate}
              onChange={(e) => setNewBudget(prev => ({ ...prev, endDate: e.target.value }))}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Description"
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenBudgetForm(false);
              resetForm();
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleCreateBudget}
            disabled={loading}
            sx={{ bgcolor: '#FF5733', color: 'white', '&:hover': { bgcolor: '#ff6b4a' } }}
          >
            {loading ? <CircularProgress size={24} /> : 'Créer le budget'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openBudgetPrompt}
        onClose={handleBudgetPromptCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Créer un budget ?</DialogTitle>
        <DialogContent>
          <Typography>
            Aucun budget n'existe pour la catégorie "{pendingExpense?.category}".<br />
            Voulez-vous en créer un ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBudgetPromptCancel}>Annuler</Button>
          <Button onClick={handleBudgetPromptCreate} sx={{ bgcolor: '#FF5733', color: 'white', '&:hover': { bgcolor: '#ff6b4a' } }}>
            Créer un budget
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDepassementDialog}
        onClose={() => setOpenDepassementDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Attention</DialogTitle>
        <DialogContent>
          <Typography>
            Attention, vous dépassez votre budget !
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDepassementDialog(false)} sx={{ color: '#FF5733' }}>
            D'accord
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpensesPage;
