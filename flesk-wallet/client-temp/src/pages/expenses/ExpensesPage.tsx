import React from 'react';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { TrendingDown } from '@mui/icons-material';

const ExpensesPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          mb: 3, 
          display: 'flex', 
          alignItems: 'center',
          bgcolor: 'rgba(255, 87, 51, 0.1)',
          borderRadius: 2
        }}
      >
        <TrendingDown sx={{ color: '#FF5733', mr: 2, fontSize: 32 }} />
        <Typography variant="h4" sx={{ color: '#FF5733', fontWeight: 'bold' }}>
          Dépenses
        </Typography>
      </Paper>

      {/* Contenu de la page */}
    </Box>
  );
};

export default ExpensesPage; 