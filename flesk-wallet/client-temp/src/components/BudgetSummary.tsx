import React from 'react';
import { Paper, Typography, Box, LinearProgress, Avatar } from '@mui/material';
import { getCategoryIcon, getCategoryColor } from '../utils/categoryIcons';
import { Budget as BudgetServiceBudget } from '../services/budgetService'; // Import as a different name

// Use the interface from budgetService directly
export interface Budget extends BudgetServiceBudget {}

interface BudgetSummaryProps {
  budgets: Budget[];
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({ budgets }) => {
  console.log('Budgets reçus dans BudgetSummary:', budgets); // Conserver le log pour le débogage
  return (
    <Paper sx={{ p: 3, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Récapitulatif des Budgets
      </Typography>
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {budgets.length === 0 ? (
          <Typography variant="body2" color="text.secondary">Aucun budget défini pour le moment.</Typography>
        ) : (
          budgets.map((budget) => {
            // Calculer currentSpent à partir de amount et remainingAmount
            const currentSpent = budget.amount - budget.remainingAmount;
            const progress = (currentSpent / budget.amount) * 100;
            const isOverBudget = currentSpent > budget.amount;
            const CategoryIcon = getCategoryIcon(budget.category);
            const categoryColor = getCategoryColor(budget.category);

            return (
              <Box key={budget.id} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: categoryColor, mr: 1, width: 32, height: 32, display: 'inline-flex' }}>
                    <CategoryIcon />
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, flexGrow: 1 }}>
                    {budget.category} ({budget.name})
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {currentSpent.toFixed(2)} TND / {budget.amount.toFixed(2)} TND
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(progress, 100)} // Limite la barre à 100%
                  sx={{
                    height: 8,
                    borderRadius: 5,
                    bgcolor: 'grey.300',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: isOverBudget ? 'error.main' : categoryColor, // Rouge si dépassement, sinon couleur catégorie
                    },
                  }}
                />
                {isOverBudget && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, fontWeight: 'bold' }}>
                    Dépassement de { (currentSpent - budget.amount).toFixed(2) } TND
                  </Typography>
                )}
              </Box>
            );
          })
        )}
      </Box>
    </Paper>
  );
};

export default BudgetSummary; 