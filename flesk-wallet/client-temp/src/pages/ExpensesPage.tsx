import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Alert
} from '@mui/material';
import Sidebar from '../components/Sidebar';
import { getExpenses, createExpense, updateExpense, deleteExpense, expenseCategories, Expense } from '../services/expensesService';
import { getBudgetByCategory, createBudget, Budget, BudgetCreatePayload } from '../services/budgetService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
//import { predictExpenses } from '../services/predictionService';

// Ajout des périodes comme constante
const periods = [
  { value: 'DAILY', label: 'Quotidien' },
  { value: 'WEEKLY', label: 'Hebdomadaire' },
  { value: 'MONTHLY', label: 'Mensuel' },
  { value: 'YEARLY', label: 'Annuel' }
];

const ExpensesPage: React.FC = () => {
  const [prediction, setPrediction] = useState<{ 
    globalPrediction: number; 
    categoryPredictions: { [key: string]: number } 
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
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
      const existingBudget = await getBudgetByCategory(newExpense.category);
      
      if (!existingBudget) {
        setPendingExpense(newExpense);
        setOpenBudgetPrompt(true);
        setOpenDialog(false);
        setLoading(false);
        return;
      }

      if (newExpense.amount > existingBudget.remainingAmount) {
        setOpenDepassementDialog(true);
        setPendingExpense(newExpense);
        setLoading(false);
        return;
      }

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
        ...newBudget,
        category: pendingExpense?.category || newBudget.category
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
      setError('Erreur lors de la mise à jour de la dépense');
      console.error(error);
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
      try {
        setLoading(true);
        await createExpense(pendingExpense);
        await fetchExpenses();
      } catch (err) {
        setError('Erreur lors de la création de la dépense');
      } finally {
        setLoading(false);
      }
    }
    setOpenBudgetPrompt(false);
    setPendingExpense(null);
    resetForm();
  };

  const handleBudgetPromptCreate = () => {
    setOpenBudgetPrompt(false);
    setOpenBudgetForm(true);
  };

  {/*const handlePredict = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await predictExpenses();
      console.log('Données prédites:', data);
      
      if (!data || typeof data.globalPrediction !== 'number' || !data.categoryPredictions) {
        throw new Error('Format de réponse invalide de l\'API');
      }
      
      setPrediction(data);
    } catch (error) {
      console.error('Erreur complète lors de la prédiction:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue lors de la prédiction');
    } finally {
      setLoading(false);
    }
  };*/}

  const handleDepassementConfirm = async () => {
    if (pendingExpense) {
      try {
        setLoading(true);
        await createExpense(pendingExpense);
        await fetchExpenses();
        setOpenDepassementDialog(false);
        setOpenDialog(false);
        resetForm();
      } catch (err) {
        setError('Erreur lors de la création de la dépense');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDepassementCancel = () => {
    setOpenDepassementDialog(false);
    setPendingExpense(null);
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ color: '#000000', fontWeight: 500 }}>
              Dépenses
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
              Ajouter dépense
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Titre</TableCell>
                      <TableCell>Montant (DT)</TableCell>
                      <TableCell>Catégorie</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense._id}>
                        <TableCell>{expense.nom}</TableCell>
                        <TableCell>{expense.amount.toLocaleString()} DT</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell>{formatDate(expense.date)}</TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleEditExpense(expense)}
                            sx={{ color: '#4CAF50' }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteExpense(expense._id!)}
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

              <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditing ? 'Modifier la dépense' : 'Ajouter une dépense'}</DialogTitle>
                <DialogContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <TextField
                      label="Nom"
                      fullWidth
                      required
                      value={newExpense.nom}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, nom: e.target.value }))}
                    />
                    <TextField
                      label="Montant (DT)"
                      type="number"
                      fullWidth
                      required
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, amount: Number(e.target.value) }))}
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
                      InputLabelProps={{ shrink: true }}
                      value={newExpense.date}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                    />
                    <TextField
                      label="Description"
                      fullWidth
                      multiline
                      rows={3}
                      value={newExpense.description}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
                  <Button 
                    onClick={isEditing ? handleUpdateExpense : handleAddExpense}
                    variant="contained"
                    sx={{ bgcolor: '#FF5733', '&:hover': { bgcolor: '#ff6b4a' } }}
                  >
                    {isEditing ? 'Modifier' : 'Ajouter'}
                  </Button>
                </DialogActions>
              </Dialog>

              {/*<Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="contained"
                  color="success"
                  //onClick={handlePredict}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Prédire les dépenses'}
                </Button>
              </Box>*/}

              {prediction !== null && (
                <Paper elevation={3} sx={{ p: 2, bgcolor: '#ffffff', mt: 2 }}>
                  <Typography variant="h6">
                    Montant prédit pour le mois prochain :{' '}
                    <strong>{prediction.globalPrediction.toFixed(2)} DT</strong>
                  </Typography>
                  {Object.keys(prediction.categoryPredictions).length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1">Prédictions par catégorie :</Typography>
                      <TableContainer component={Paper} sx={{ mt: 1 }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Catégorie</TableCell>
                              <TableCell align="right">Montant prédit (DT)</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {Object.entries(prediction.categoryPredictions).map(([category, amount]) => (
                              <TableRow key={category}>
                                <TableCell>{category}</TableCell>
                                <TableCell align="right">{amount.toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}
                </Paper>
              )}

              {/* Dialogue de dépassement de budget */}
              <Dialog open={openDepassementDialog} onClose={handleDepassementCancel}>
                <DialogTitle>Attention - Dépassement de budget</DialogTitle>
                <DialogContent>
                  <Typography>
                    Cette dépense dépassera votre budget pour cette catégorie. Voulez-vous continuer ?
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleDepassementCancel}>Annuler</Button>
                  <Button 
                    onClick={handleDepassementConfirm}
                    variant="contained"
                    sx={{ bgcolor: '#FF5733', '&:hover': { bgcolor: '#ff6b4a' } }}
                  >
                    Confirmer
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Dialogue de proposition de création de budget */}
              <Dialog open={openBudgetPrompt} onClose={handleBudgetPromptCancel}>
                <DialogTitle>Créer un budget pour cette catégorie ?</DialogTitle>
                <DialogContent>
                  <Typography>
                    Vous n'avez pas encore de budget pour la catégorie "{pendingExpense?.category}". 
                    Voulez-vous en créer un maintenant ?
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleBudgetPromptCancel}>Non, ajouter juste la dépense</Button>
                  <Button 
                    onClick={handleBudgetPromptCreate}
                    variant="contained"
                    sx={{ bgcolor: '#FF5733', '&:hover': { bgcolor: '#ff6b4a' } }}
                  >
                    Oui, créer un budget
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Formulaire de création de budget */}
              <Dialog open={openBudgetForm} onClose={() => setOpenBudgetForm(false)} maxWidth="sm" fullWidth>
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
                      onChange={(e) => setNewBudget(prev => ({ 
                        ...prev, 
                        period: e.target.value as Budget['period']
                      }))}
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
                      label="Description"
                      fullWidth
                      multiline
                      rows={3}
                      value={newBudget.description}
                      onChange={(e) => setNewBudget(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenBudgetForm(false)}>Annuler</Button>
                  <Button 
                    onClick={handleCreateBudget}
                    variant="contained"
                    sx={{ bgcolor: '#FF5733', '&:hover': { bgcolor: '#ff6b4a' } }}
                  >
                    Créer le budget
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ExpensesPage;