import React from 'react';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Paper,
} from '@mui/material';
import Sidebar from '../components/Sidebar';

const Dashboard: React.FC = () => {
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
            Tableau de bord
          </Typography>

          {/* Grille des cartes */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
            {/* Solde actuel */}
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0px 2px 4px rgba(0,0,0,0.05)' }}>
              <Typography variant="h6" sx={{ color: '#000000', mb: 2 }}>
                Solde actuel
              </Typography>
            </Paper>

            {/* Dépenses du mois */}
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0px 2px 4px rgba(0,0,0,0.05)' }}>
              <Typography variant="h6" sx={{ color: '#000000', mb: 2 }}>
                Dépenses du mois
              </Typography>
            </Paper>

            {/* Objectifs d'épargne */}
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0px 2px 4px rgba(0,0,0,0.05)', gridColumn: '1 / -1' }}>
              <Typography variant="h6" sx={{ color: '#000000', mb: 2 }}>
                Objectifs d'épargne
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard; 