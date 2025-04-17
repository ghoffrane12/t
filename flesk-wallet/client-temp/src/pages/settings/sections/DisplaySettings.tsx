import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Button,
  Alert,
  FormControlLabel,
  Switch,
} from '@mui/material';

interface DisplayPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  currencyFormat: string;
  dateFormat: string;
  numberFormat: string;
  showDecimals: boolean;
}

const DisplaySettings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<DisplayPreferences>({
    theme: 'system',
    language: 'fr',
    currencyFormat: 'TND',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'fr-TN',
    showDecimals: true,
  });

  const handlePreferenceChange = (key: keyof DisplayPreferences) => (event: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: event.target.value || event.target.checked,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      // Implement save preferences logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setSuccess('Préférences d\'affichage mises à jour avec succès');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Paramètres d'Affichage
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Thème et Langue
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Thème</InputLabel>
              <Select
                value={preferences.theme}
                onChange={handlePreferenceChange('theme')}
                label="Thème"
                disabled={loading}
              >
                <MenuItem value="light">Clair</MenuItem>
                <MenuItem value="dark">Sombre</MenuItem>
                <MenuItem value="system">Système</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Langue</InputLabel>
              <Select
                value={preferences.language}
                onChange={handlePreferenceChange('language')}
                label="Langue"
                disabled={loading}
              >
                <MenuItem value="fr">Français</MenuItem>
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ar">العربية</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Format d'Affichage
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Format de la monnaie</InputLabel>
              <Select
                value={preferences.currencyFormat}
                onChange={handlePreferenceChange('currencyFormat')}
                label="Format de la monnaie"
                disabled={loading}
              >
                <MenuItem value="TND">Dinar tunisien (TND)</MenuItem>
                <MenuItem value="EUR">Euro (EUR)</MenuItem>
                <MenuItem value="USD">Dollar américain (USD)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Format de date</InputLabel>
              <Select
                value={preferences.dateFormat}
                onChange={handlePreferenceChange('dateFormat')}
                label="Format de date"
                disabled={loading}
              >
                <MenuItem value="DD/MM/YYYY">JJ/MM/AAAA</MenuItem>
                <MenuItem value="MM/DD/YYYY">MM/JJ/AAAA</MenuItem>
                <MenuItem value="YYYY-MM-DD">AAAA-MM-JJ</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Format des nombres</InputLabel>
              <Select
                value={preferences.numberFormat}
                onChange={handlePreferenceChange('numberFormat')}
                label="Format des nombres"
                disabled={loading}
              >
                <MenuItem value="fr-TN">1 234,56 (Tunisien)</MenuItem>
                <MenuItem value="fr-FR">1 234,56 (Français)</MenuItem>
                <MenuItem value="en-US">1,234.56 (Américain)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.showDecimals}
                  onChange={handlePreferenceChange('showDecimals')}
                  disabled={loading}
                />
              }
              label="Afficher les décimales pour les montants"
            />
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
        >
          Enregistrer les préférences
        </Button>
      </Box>
    </Box>
  );
};

export default DisplaySettings; 