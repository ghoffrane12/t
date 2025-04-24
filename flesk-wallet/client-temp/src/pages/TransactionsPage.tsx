import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Payment as PaymentIcon } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';

const TransactionsPage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 2, 
            mb: 3, 
            display: 'flex', 
            alignItems: 'center',
            bgcolor: '#FFF3E0',
            borderRadius: 2
          }}
        >
          <PaymentIcon sx={{ color: '#FF9800', mr: 2, fontSize: 32 }} />
          <Typography variant="h4" sx={{ color: '#FF9800', fontWeight: 'bold' }}>
            Transactions
          </Typography>
        </Paper>
        {/* Contenu à venir */}
      </Box>
    </Box>
  );
};

export default TransactionsPage; 