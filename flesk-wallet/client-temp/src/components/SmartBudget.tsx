import React, { useState } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Alert,
  IconButton,
  Paper,
  Grid,
  Tooltip,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';

interface BudgetCategory {
  id: number;
  name: string;
  allocated: number;
  spent: number;
  icon: string;
}

const SmartBudget: React.FC = () => {
  const [budgets] = useState<BudgetCategory[]>([
    {
      id: 1,
      name: 'Courses',
      allocated: 1200,
      spent: 980,
      icon: '🛒',
    },
    {
      id: 2,
      name: 'Transport',
      allocated: 500,
      spent: 480,
      icon: '🚗',
    },
    {
      id: 3,
      name: 'Divertissement',
      allocated: 300,
      spent: 350,
      icon: '🎮',
    },
  ]);

  const calculateProgress = (spent: number, allocated: number) => {
    return (spent / allocated) * 100;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return '#FF5733';
    if (progress >= 75) return '#FFC300';
    return '#4CAF50';
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Budget Intelligent</Typography>
        <Tooltip title="L'IA analyse vos dépenses et ajuste les recommandations">
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={2}>
        {budgets.map((budget) => {
          const progress = calculateProgress(budget.spent, budget.allocated);
          const progressColor = getProgressColor(progress);

          return (
            <Grid item xs={12} key={budget.id}>
              <Paper 
                sx={{ 
                  p: 2,
                  borderLeft: progress >= 90 ? '4px solid #FF5733' : 'none',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ mr: 1 }}>
                    {budget.icon}
                  </Typography>
                  <Typography variant="subtitle1">
                    {budget.name}
                  </Typography>
                  {progress > 100 && (
                    <Tooltip title="Dépassement de budget">
                      <WarningIcon sx={{ ml: 1, color: '#FF5733' }} />
                    </Tooltip>
                  )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {budget.spent} DT / {budget.allocated} DT
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: progressColor,
                      fontWeight: 'bold',
                    }}
                  >
                    {progress.toFixed(1)}%
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={Math.min(progress, 100)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: progressColor,
                    },
                  }}
                />

                {progress >= 90 && (
                  <Alert 
                    severity="warning" 
                    sx={{ mt: 1 }}
                  >
                    Attention : Vous approchez de votre limite pour {budget.name.toLowerCase()}
                  </Alert>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default SmartBudget; 