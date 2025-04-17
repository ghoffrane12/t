import React, { useState } from 'react';
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
  FormHelperText,
  Grid,
  InputAdornment,
} from '@mui/material';
import { TransactionFormData } from '../../types/transaction';

type TransactionType = 'EXPENSE' | 'INCOME';

const defaultCategories: Record<TransactionType, Array<{ id: string; name: string; icon: string }>> = {
  EXPENSE: [
    { id: 'transport', name: 'Transport', icon: '🚗' },
    { id: 'food', name: 'Alimentation', icon: '🍽️' },
    { id: 'housing', name: 'Logement', icon: '🏠' },
    { id: 'health', name: 'Santé', icon: '⚕️' },
    { id: 'leisure', name: 'Loisirs', icon: '🎮' },
  ],
  INCOME: [
    { id: 'salary', name: 'Salaire', icon: '💰' },
    { id: 'freelance', name: 'Freelance', icon: '💻' },
    { id: 'investment', name: 'Investissements', icon: '📈' },
    { id: 'other', name: 'Autres', icon: '📝' },
  ],
};

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => void;
  initialData?: TransactionFormData;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<TransactionFormData>(
    initialData || {
      amount: 0,
      type: 'EXPENSE',
      categoryId: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof TransactionFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TransactionFormData, string>> = {};

    if (formData.amount <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'Veuillez sélectionner une catégorie';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }
    if (!formData.date) {
      newErrors.date = 'La date est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleChange = (field: keyof TransactionFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when field is modified
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? 'Modifier la transaction' : 'Nouvelle transaction'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                label="Type"
                onChange={(e) => handleChange('type', e.target.value)}
              >
                <MenuItem value="EXPENSE">Dépense</MenuItem>
                <MenuItem value="INCOME">Revenu</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Montant"
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
              error={!!errors.amount}
              helperText={errors.amount}
              InputProps={{
                startAdornment: <InputAdornment position="start">TND</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.categoryId}>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={formData.categoryId}
                label="Catégorie"
                onChange={(e) => handleChange('categoryId', e.target.value)}
              >
                {defaultCategories[formData.type].map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.categoryId && (
                <FormHelperText>{errors.categoryId}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              error={!!errors.date}
              helperText={errors.date}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ backgroundColor: '#FF5733' }}
        >
          {initialData ? 'Modifier' : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionModal; 