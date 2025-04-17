import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';

const Transactions: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTransactionAdded = () => {
    console.log('Transaction ajoutée, rafraîchissement de la liste');
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 2, height: '100%', backgroundColor: 'transparent' }}>
            <TransactionForm onTransactionAdded={handleTransactionAdded} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 2, height: '100%', backgroundColor: 'transparent' }}>
            <TransactionList key={refreshKey} onUpdate={handleTransactionAdded} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Transactions; 