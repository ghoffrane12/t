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

// Define periods as a constant array
const periods = [
  { value: 'DAILY', label: 'Quotidien' },
  { value: 'WEEKLY', label: 'Hebdomadaire' },
  { value: 'MONTHLY', label: 'Mensuel' },
  { value: 'YEARLY', label: 'Annuel' }
];

const ExpensesPage: React.FC = () => {
  // State for expense prediction (currently commented out)
  const [prediction, setPrediction] = useState<{ 
    globalPrediction: number; 
    categoryPredictions: { [key: string]: number } 
  } | null>(null);
  // State for loading status
  const [loading, setLoading] = useState(false);
  // State for error messages
  const [error, setError] = useState<string | null>(null);
  // State to store the list of expenses
  const [expenses, setExpenses] = useState<Expense[]>([]);
  // State to control the main expense dialog (add/edit)
  const [openDialog, setOpenDialog] = useState(false);
  // State to hold the selected expense for editing
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  // State to indicate if currently in editing mode
  const [isEditing, setIsEditing] = useState(false);
  // State to control the new budget creation form dialog
  const [openBudgetForm, setOpenBudgetForm] = useState(false);
  // State to temporarily hold expense data if budget creation is prompted
  const [pendingExpense, setPendingExpense] = useState<Omit<Expense, '_id'> | null>(null);
  // State for the new budget form data
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

  // State for the new expense form data
  const [newExpense, setNewExpense] = useState<Omit<Expense, '_id'>>({
    nom: '',
    description: '',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  // State to control the budget prompt dialog (when no budget exists for category)
  const [openBudgetPrompt, setOpenBudgetPrompt] = useState(false);
  // State to control the budget exceedance warning dialog
  const [openDepassementDialog, setOpenDepassementDialog] = useState(false);

  // useEffect hook to fetch expenses on component mount
  useEffect(() => {
    fetchExpenses();
  }, []); // Empty dependency array means this runs once on mount

  // Function to fetch expenses from the service
  const fetchExpenses = async () => {
    try {
      setLoading(true); // Set loading to true while fetching
      const data = await getExpenses(); // Fetch expenses
      setExpenses(data); // Update expenses state with fetched data
    } catch (err) {
      setError('Erreur lors du chargement des dépenses'); // Set error state if fetching fails
      console.error(err); // Log the error
    } finally {
      setLoading(false); // Set loading to false after fetching (success or failure)
    }
  };

  // Function to handle adding a new expense
  const handleAddExpense = async () => {
    const trimmedDescription = newExpense.description.trim();
    if (trimmedDescription === '') {
      setError('La description de la dépense est obligatoire.');
      return;
    }

    try {
      setLoading(true); // Set loading to true
      // Check if a budget exists for the expense category
      const existingBudget = await getBudgetByCategory(newExpense.category);
      
      // If no budget exists for the category
      if (!existingBudget) {
        setPendingExpense(newExpense); // Store the expense data
        setOpenBudgetPrompt(true); // Open the budget prompt dialog
        setOpenDialog(false); // Close the main expense dialog
        setLoading(false); // Reset loading state
        return; // Stop the function here
      }

      // If budget exists but expense amount exceeds remaining amount
      if (newExpense.amount > existingBudget.remainingAmount) {
        setOpenDepassementDialog(true); // Open the budget exceedance dialog
        setPendingExpense(newExpense); // Store the expense data
        setLoading(false); // Reset loading state
        return; // Stop the function here
      }

      const expenseToCreate = { ...newExpense, description: trimmedDescription };
      console.log('handleAddExpense - Sending description:', expenseToCreate.description);

      // If budget exists and amount is within limit, create the expense
      await createExpense(expenseToCreate); // Create the expense
      await fetchExpenses(); // Refresh the expenses list
      setOpenDialog(false); // Close the main expense dialog
      resetForm(); // Reset the form fields
    } catch (err) {
      console.error("Erreur complète de l'API lors de l'ajout de dépense:", (err as any).response?.data);
      setError((err as any).response?.data?.message || 'Erreur lors de la création de la dépense');
      console.error(err);
    } finally {
      setLoading(false); // Set loading to false after operation
    }
  };

  // Function to handle creating a new budget (called from budget prompt)
  const handleCreateBudget = async () => {
    try {
      setLoading(true); // Set loading to true
      // Prepare budget data, using category from pending expense if available
      const budgetData: BudgetCreatePayload = {
        ...newBudget,
        category: pendingExpense?.category || newBudget.category
      };
      await createBudget(budgetData); // Create the budget
      // If there was a pending expense, create it after budget creation
      if (pendingExpense) {
        const expenseToCreate = { ...pendingExpense, description: pendingExpense.description.trim() };
        console.log('handleCreateBudget - Sending description:', expenseToCreate.description);
        await createExpense(expenseToCreate);
        await fetchExpenses();
      }
      setOpenBudgetForm(false); // Close the budget form dialog
      setOpenDialog(false); // Ensure main expense dialog is closed
      resetForm(); // Reset the form fields
    } catch (err) {
      setError((err as any).response?.data?.message || 'Erreur lors de la création du budget');
      console.error(err);
    } finally {
      setLoading(false); // Set loading to false after operation
    }
  };

  // Function to handle editing an existing expense
  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense); // Set the selected expense
    setNewExpense({
      nom: expense.nom,
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date
    }); // Populate the form with expense data
    setIsEditing(true); // Set editing mode to true
    setOpenDialog(true); // Open the main expense dialog
  };

  // Function to handle updating an existing expense
  const handleUpdateExpense = async () => {
    if (!selectedExpense) return;

    const trimmedDescription = newExpense.description.trim();
    if (trimmedDescription === '') {
      setError('La description de la dépense est obligatoire.');
      return;
    }

    try {
      setLoading(true);
      const expenseToUpdate = { ...newExpense, description: trimmedDescription };
      console.log('handleUpdateExpense - Sending description:', expenseToUpdate.description);
      await updateExpense(selectedExpense._id!, expenseToUpdate);
      await fetchExpenses();
      setOpenDialog(false);
      resetForm();
    } catch (error) {
      setError((error as any).response?.data?.message || 'Erreur lors de la mise à jour de la dépense');
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after operation
    }
  };

  // Function to handle deleting an expense
  const handleDeleteExpense = async (id: string) => {
    try {
      setLoading(true); // Set loading to true
      await deleteExpense(id); // Delete the expense by ID
      await fetchExpenses(); // Refresh the expenses list
    } catch (err) {
      setError((err as any).response?.data?.message || 'Erreur lors de la suppression de la dépense');
      console.error(err);
    } finally {
      setLoading(false); // Set loading to false after operation
    }
  };

  // Function to reset the expense and budget form states
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
    setSelectedExpense(null); // Clear selected expense
    setIsEditing(false); // Set editing mode to false
    setPendingExpense(null); // Clear pending expense
  };

  // Function to format a date string
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR'); // Format date to French locale
  };

  // Function to handle canceling the budget prompt
  const handleBudgetPromptCancel = async () => {
    // If there was a pending expense, create it even without a budget
    if (pendingExpense) {
      const trimmedDescription = pendingExpense.description.trim();
      if (trimmedDescription === '') {
        setError('La description de la dépense est obligatoire.');
        setOpenBudgetPrompt(false);
        setPendingExpense(null);
        resetForm();
        return;
      }
      try {
        setLoading(true); // Set loading
        const expenseToCreate = { ...pendingExpense, description: trimmedDescription };
        await createExpense(expenseToCreate);
        await fetchExpenses();
      } catch (err) {
        setError((err as any).response?.data?.message || 'Erreur lors de la création de la dépense après annulation budget');
        console.error(err);
      } finally {
        setLoading(false); // Reset loading
      }
    }
    setOpenBudgetPrompt(false); // Close the budget prompt dialog
    setPendingExpense(null); // Clear pending expense
    resetForm(); // Reset the form
  };

  // Function to handle confirming budget creation from the prompt
  const handleBudgetPromptCreate = () => {
    setOpenBudgetPrompt(false); // Close the budget prompt dialog
    setOpenBudgetForm(true); // Open the budget creation form dialog
  };

  {/*const handlePredict = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await predictExpenses();
      console.log('Données prédites:', data);
      
      if (!data || typeof data.globalPrediction !== 'number' || !data.categoryPredictions) {
        throw new Error('Format de réponse invalide de l'API');
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
      const trimmedDescription = pendingExpense.description.trim();
      if (trimmedDescription === '') {
        setError('La description de la dépense est obligatoire.');
        setOpenDepassementDialog(false);
        setPendingExpense(null);
        resetForm();
        return;
      }
      try {
        setLoading(true);
        const expenseToCreate = { ...pendingExpense, description: trimmedDescription };
        console.log('handleDepassementConfirm - Sending description:', expenseToCreate.description);
        await createExpense(expenseToCreate);
        await fetchExpenses();
        setOpenDepassementDialog(false);
        setOpenDialog(false);
        resetForm();
      } catch (err) {
        console.error("Erreur complète de l'API lors de la confirmation de dépassement:", (err as any).response?.data);
        setError((err as any).response?.data?.message || 'Erreur lors de la création de la dépense');
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
                      required
                      multiline
                      rows={3}
                      value={newExpense.description}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value.trim() }))}
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