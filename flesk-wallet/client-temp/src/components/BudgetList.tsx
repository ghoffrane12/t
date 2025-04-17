import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, LinearProgress, Grid, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { getBudgets, createBudget, updateBudget, deleteBudget } from '../services/budgetService';
import { Budget } from '../types/budget';
import BudgetFormModal from './BudgetFormModal';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatCurrency } from '../utils/currency';

const getProgressColor = (percent: number) => {
  if (percent < 80) return 'success';
  if (percent < 100) return 'warning';
  return 'error';
};

const BudgetList: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBudget, setEditBudget] = useState<Budget | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    const data = await getBudgets();
    setBudgets(data);
    setLoading(false);
  };

  const handleAdd = () => {
    setEditBudget(null);
    setModalOpen(true);
  };

  const handleEdit = (budget: Budget) => {
    setEditBudget(budget);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditBudget(null);
  };

  const handleSubmit = async (form: Omit<Budget, 'id' | 'spent'>) => {
    if (editBudget) {
      await updateBudget(editBudget.id, form);
    } else {
      await createBudget(form);
    }
    await fetchBudgets();
    handleCloseModal();
  };

  const handleDeleteClick = (budget: Budget) => {
    setBudgetToDelete(budget);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (budgetToDelete) {
      await deleteBudget(budgetToDelete.id);
      await fetchBudgets();
    }
    setDeleteDialogOpen(false);
    setBudgetToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setBudgetToDelete(null);
  };

  if (loading) return <Typography>Chargement...</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Budgets</Typography>
      <Grid container spacing={3}>
        {budgets.map((budget) => {
          const percent = Math.min((budget.spent / budget.amount) * 100, 100);
          const color = getProgressColor(percent);
          return (
            <Grid item xs={12} md={6} lg={4} key={budget.id}>
              <Paper sx={{ p: 3, mb: 2 }} elevation={2}>
                <Typography variant="h6">{budget.category}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Période : {budget.period === 'monthly' ? 'Mensuel' : 'Hebdomadaire'}
                </Typography>
                <Box mt={2} mb={1}>
                  <LinearProgress
                    variant="determinate"
                    value={percent}
                    color={color as any}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1">
                    Alloué : <b>{formatCurrency(budget.amount)}</b>
                  </Typography>
                  <Typography variant="body1" color={color + ".main"}>
                    Dépensé : <b>{formatCurrency(budget.spent)}</b>
                  </Typography>
                  <Typography variant="body1">
                    Reste : <b>{formatCurrency(budget.amount - budget.spent)}</b>
                  </Typography>
                </Box>
                <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                  <Button variant="outlined" size="small" onClick={() => handleEdit(budget)}>Modifier</Button>
                  <IconButton color="error" size="small" onClick={() => handleDeleteClick(budget)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={handleAdd}>Ajouter un budget</Button>
      </Box>
      <BudgetFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editBudget}
      />
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Supprimer le budget</DialogTitle>
        <DialogContent>
          Voulez-vous vraiment supprimer le budget "{budgetToDelete?.category}" ?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Annuler</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetList; 