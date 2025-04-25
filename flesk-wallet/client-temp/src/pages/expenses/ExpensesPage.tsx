import React from 'react';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Paper,
} from '@mui/material';
import Sidebar from '../../components/Sidebar';

const ExpensesPage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, ml: '280px' }}>
        {/* Barre orange supérieure */}
        <AppBar position="static" sx={{ bgcolor: '#FF5733', boxShadow: 'none' }}>
          <Toolbar sx={{ minHeight: '64px !important' }} />
        </AppBar>

        {/* Titre de la page */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ color: '#000000', mb: 4, fontWeight: 500 }}>
            Dépenses
          </Typography>

          {/* Contenu de la page */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
            {/* Le contenu spécifique aux dépenses sera ajouté ici */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ExpensesPage; 