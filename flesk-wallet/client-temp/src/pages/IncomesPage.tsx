import React from 'react';
import { Box, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';

const IncomesPage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>Revenus</Typography>
        {/* Contenu à venir */}
      </Box>
    </Box>
  );
};

export default IncomesPage; 