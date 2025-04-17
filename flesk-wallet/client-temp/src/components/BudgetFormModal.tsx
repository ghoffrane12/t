import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  InputAdornment
} from '@mui/material';
import { Budget } from '../types/budget';

interface BudgetFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  initialData?: Budget | null;
}

const BudgetFormModal: React.FC<BudgetFormModalProps> = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState<Omit<Budget, 'id' | 'spent'>>({
    category: '',
    amount: 0,
    period: 'monthly',
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({ category: '', amount: 0, period: 'monthly' });
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'amount' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.amount) return;
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? 'Modifier le budget' : 'Nouveau budget'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Catégorie"
              name="category"
              value={form.category}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Montant"
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">TND</InputAdornment>,
                inputProps: { min: 0, step: 1 }
              }}
            />
            <FormControl fullWidth>
              <InputLabel>Période</InputLabel>
              <Select
                name="period"
                value={form.period}
                label="Période"
                onChange={handleChange as any}
              >
                <MenuItem value="monthly">Mensuel</MenuItem>
                <MenuItem value="weekly">Hebdomadaire</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BudgetFormModal; 