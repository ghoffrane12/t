import React from 'react';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Button,
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Barre orange en haut */}
        <AppBar position="static" sx={{ bgcolor: '#FF5733', boxShadow: 'none' }}>
          <Toolbar sx={{ 
            minHeight: '64px !important',
            display: 'flex',
            alignItems: 'center'
          }}>
            <IconButton
              edge="start"
              sx={{ color: 'white' }}
            >
              <ChevronLeft />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* En-tête avec titre */}
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h5" sx={{ 
            color: '#000000',
            fontWeight: 500,
          }}>
            Tableau de bord
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#FF5733',
              '&:hover': {
                bgcolor: '#ff4518',
              },
              textTransform: 'none',
              borderRadius: '8px',
              px: 3
            }}
          >
            Ajouter
          </Button>
        </Box>

        {/* Contenu */}
        <Box sx={{ p: 1 }}>
          {/* Le contenu du tableau de bord sera ajouté ici */}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard; 