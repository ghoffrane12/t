import React, { useState } from 'react';
import axios from '../services/axiosInstance';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Paper,
  CircularProgress
} from '@mui/material';
import Sidebar from '../components/Sidebar';

const ExpensesPage: React.FC = () => {
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/predictions/predict');
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error('Erreur lors de la prédiction :', error);
    } finally {
      setLoading(false);
    }
  };

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

          {/* Contenu spécifique */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Bouton de prédiction */}
            <Button
              variant="contained"
              color="primary"
              onClick={handlePredict}
              disabled={loading}
              sx={{ width: '200px' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Prédire les dépenses'}
            </Button>

            {/* Affichage de la prédiction */}
            {prediction !== null && (
              <Paper elevation={3} sx={{ p: 2, bgcolor: '#ffffff' }}>
                <Typography variant="h6">
                  Montant prédit pour le mois prochain :{' '}
                  <strong>{prediction.toFixed(2)} TND</strong>
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ExpensesPage;
