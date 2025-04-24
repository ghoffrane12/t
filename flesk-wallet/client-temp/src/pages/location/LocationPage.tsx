import React from 'react';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';

const LocationPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          mb: 3, 
          display: 'flex', 
          alignItems: 'center',
          bgcolor: '#F3E5F5',
          borderRadius: 2
        }}
      >
        <LocationOn sx={{ color: '#9C27B0', mr: 2, fontSize: 32 }} />
        <Typography variant="h4" sx={{ color: '#9C27B0', fontWeight: 'bold' }}>
          Localisation
        </Typography>
      </Paper>

      {/* Contenu de la page */}
    </Box>
  );
};

export default LocationPage; 