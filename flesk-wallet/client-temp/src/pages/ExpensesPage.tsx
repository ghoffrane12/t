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
  FormControlLabel,
  Switch,
  Grid,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import { getExpenses, createExpense, updateExpense, deleteExpense, expenseCategories, Expense } from '../services/expensesService';
import { createBudget } from '../services/budgetService';

const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [newExpense, setNewExpense] = useState<Omit<Expense, '_id'>>({
    nom: '',
    description: '',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning'
  });
  const [createBudgetDialog, setCreateBudgetDialog] = useState({
    open: false,
    category: '',
    amount: 0,
    showForm: false,
    formData: {
      name: '',
      amount: 0,
      period: 'MONTHLY' as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY',
      startDate: new Date().toISOString().split('T')[0],
      notifications: {
        enabled: true,
        threshold: 0.2
      },
      description: '',
      tags: [] as string[]
    }
  });

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
      console.error('Erreur lors de la mise à jour de la dépense:', error);
      setError('Erreur lors de la mise à jour de la dépense');
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
    setSelectedExpense(null);
    setIsEditing(false);
    setError('');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const handleCreateExpense = async () => {
    try {
      const result = await createExpense(newExpense);
      setExpenses([...expenses, result.expense]);
      setOpenDialog(false);
      setNewExpense({
        nom: '',
        description: '',
        amount: 0,
        category: '',
        date: new Date().toISOString().split('T')[0]
      });

      // Gérer le résultat du budget
      if (result.budgetResult.shouldCreateBudget) {
        setCreateBudgetDialog({
          open: true,
          category: newExpense.category,
          amount: result.budgetResult.budgetAmount || newExpense.amount,
          showForm: false,
          formData: {
            name: `Budget ${newExpense.category}`,
            amount: result.budgetResult.budgetAmount || newExpense.amount,
            period: 'MONTHLY',
            startDate: new Date().toISOString().split('T')[0],
            notifications: {
              enabled: true,
              threshold: 0.2
            },
            description: '',
            tags: []
          }
        });
      } else {
        setSnackbar({
          open: true,
          message: result.budgetResult.message,
          severity: result.budgetResult.success ? 'success' : 'warning'
        });
      }
    } catch (error) {
      setError('Erreur lors de la création de la dépense');
      console.error(error);
    }
  };

  const handleCreateBudget = async () => {
    try {
      await createBudget({
        name: createBudgetDialog.formData.name || `Budget ${createBudgetDialog.category}`,
        amount: createBudgetDialog.formData.amount,
        remainingAmount: createBudgetDialog.formData.amount,
        category: createBudgetDialog.category,
        period: createBudgetDialog.formData.period,
        startDate: createBudgetDialog.formData.startDate,
        status: 'ACTIVE',
        notifications: createBudgetDialog.formData.notifications,
        description: createBudgetDialog.formData.description,
        tags: createBudgetDialog.formData.tags
      });
      setCreateBudgetDialog({ 
        open: false, 
        category: '', 
        amount: 0,
        showForm: false,
        formData: {
          name: '',
          amount: 0,
          period: 'MONTHLY',
          startDate: new Date().toISOString().split('T')[0],
          notifications: {
            enabled: true,
            threshold: 0.2
          },
          description: '',
          tags: []
        }
      });
      setSnackbar({
        open: true,
        message: 'Budget créé avec succès',
        severity: 'success'
      });
    } catch (error) {
      setError('Erreur lors de la création du budget');
      console.error(error);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, ml: '280px' }}>
        <AppBar position="static" sx={{ bgcolor: '#FF5733', boxShadow: 'none' }}>
          <Toolbar sx={{ minHeight: '64px !important' }} />
        </AppBar>

        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ color: '#000000', mb: 4, fontWeight: 500 }}>
            Dépenses
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
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
              Nouvelle dépense
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
          )}
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

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
            onClick={isEditing ? handleUpdateExpense : handleCreateExpense}
            disabled={loading}
            sx={{ bgcolor: '#FF5733', color: 'white', '&:hover': { bgcolor: '#ff6b4a' } }}
          >
            {loading ? <CircularProgress size={24} /> : (isEditing ? 'Modifier' : 'Ajouter')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={createBudgetDialog.open}
        onClose={() => setCreateBudgetDialog({ 
          open: false, 
          category: '', 
          amount: 0,
          showForm: false,
          formData: {
            name: '',
            amount: 0,
            period: 'MONTHLY',
            startDate: new Date().toISOString().split('T')[0],
            notifications: {
              enabled: true,
              threshold: 0.2
            },
            description: '',
            tags: []
          }
        })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {createBudgetDialog.showForm ? 'Créer un nouveau budget' : 'Budget manquant'}
        </DialogTitle>
        <DialogContent>
          {createBudgetDialog.showForm ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Nom du budget"
                fullWidth
                value={createBudgetDialog.formData.name}
                onChange={(e) => setCreateBudgetDialog(prev => ({
                  ...prev,
                  formData: { ...prev.formData, name: e.target.value }
                }))}
              />
              <TextField
                label="Montant"
                type="number"
                fullWidth
                required
                value={createBudgetDialog.formData.amount}
                onChange={(e) => setCreateBudgetDialog(prev => ({
                  ...prev,
                  formData: { ...prev.formData, amount: Number(e.target.value) }
                }))}
                InputProps={{
                  inputProps: { min: 0, step: "0.01" }
                }}
              />
              <TextField
                select
                label="Période"
                fullWidth
                value={createBudgetDialog.formData.period}
                onChange={(e) => setCreateBudgetDialog(prev => ({
                  ...prev,
                  formData: { ...prev.formData, period: e.target.value as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' }
                }))}
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
                value={createBudgetDialog.formData.startDate}
                onChange={(e) => setCreateBudgetDialog(prev => ({
                  ...prev,
                  formData: { ...prev.formData, startDate: e.target.value }
                }))}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                value={createBudgetDialog.formData.description}
                onChange={(e) => setCreateBudgetDialog(prev => ({
                  ...prev,
                  formData: { ...prev.formData, description: e.target.value }
                }))}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={createBudgetDialog.formData.notifications.enabled}
                    onChange={(e) => setCreateBudgetDialog(prev => ({
                      ...prev,
                      formData: {
                        ...prev.formData,
                        notifications: {
                          ...prev.formData.notifications,
                          enabled: e.target.checked
                        }
                      }
                    }))}
                  />
                }
                label="Activer les notifications"
              />
              {createBudgetDialog.formData.notifications.enabled && (
                <TextField
                  label="Seuil de notification (%)"
                  type="number"
                  fullWidth
                  value={createBudgetDialog.formData.notifications.threshold * 100}
                  onChange={(e) => setCreateBudgetDialog(prev => ({
                    ...prev,
                    formData: {
                      ...prev.formData,
                      notifications: {
                        ...prev.formData.notifications,
                        threshold: Number(e.target.value) / 100
                      }
                    }
                  }))}
                  InputProps={{
                    inputProps: { min: 0, max: 100, step: "1" }
                  }}
                />
              )}
            </Box>
          ) : (
            <Typography>
              Voulez-vous créer un budget de  pour la catégorie {createBudgetDialog.category} ?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateBudgetDialog({ 
            open: false, 
            category: '', 
            amount: 0,
            showForm: false,
            formData: {
              name: '',
              amount: 0,
              period: 'MONTHLY',
              startDate: new Date().toISOString().split('T')[0],
              notifications: {
                enabled: true,
                threshold: 0.2
              },
              description: '',
              tags: []
            }
          })}>
            Annuler
          </Button>
          {!createBudgetDialog.showForm ? (
            <Button 
              onClick={() => setCreateBudgetDialog(prev => ({ ...prev, showForm: true }))}
              variant="contained" 
              color="primary"
            >
              Créer le budget
            </Button>
          ) : (
            <Button 
              onClick={handleCreateBudget} 
              variant="contained" 
              color="primary"
            >
              Confirmer
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpensesPage; 