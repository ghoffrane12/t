import React, { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormGroup,
  FormControlLabel,
  Divider,
  Alert,
  Paper,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from '@mui/material';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  category: 'alerts' | 'reminders' | 'tips';
}

const defaultSettings: NotificationSetting[] = [
  {
    id: 'budget_alerts',
    label: 'Alertes de dépassement de budget',
    description: 'Recevez une notification lorsque vous approchez ou dépassez vos limites de budget',
    enabled: true,
    category: 'alerts',
  },
  {
    id: 'suspicious_activity',
    label: 'Activités suspectes',
    description: 'Soyez alerté en cas de transactions inhabituelles ou suspectes',
    enabled: true,
    category: 'alerts',
  },
  {
    id: 'payment_reminders',
    label: 'Rappels de paiement',
    description: 'Recevez des rappels pour vos paiements récurrents',
    enabled: true,
    category: 'reminders',
  },
  {
    id: 'bill_due',
    label: 'Échéances de factures',
    description: 'Soyez notifié avant les échéances de vos factures',
    enabled: true,
    category: 'reminders',
  },
  {
    id: 'savings_tips',
    label: 'Conseils d\'économie',
    description: 'Recevez des suggestions personnalisées pour économiser',
    enabled: false,
    category: 'tips',
  },
  {
    id: 'investment_opportunities',
    label: 'Opportunités d\'investissement',
    description: 'Soyez informé des opportunités d\'investissement basées sur votre profil',
    enabled: false,
    category: 'tips',
  },
];

const NotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>(defaultSettings);
  const [notificationMethod, setNotificationMethod] = useState<string>('push');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleToggle = (settingId: string) => {
    setSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.id === settingId
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  const handleMethodChange = (event: any) => {
    setNotificationMethod(event.target.value);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Implement save notification settings logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setSuccess('Préférences de notification mises à jour avec succès');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const renderSettingsByCategory = (category: 'alerts' | 'reminders' | 'tips') => {
    const categorySettings = settings.filter(setting => setting.category === category);
    
    return categorySettings.map(setting => (
      <FormControlLabel
        key={setting.id}
        control={
          <Switch
            checked={setting.enabled}
            onChange={() => handleToggle(setting.id)}
            disabled={loading}
          />
        }
        label={
          <Box>
            <Typography variant="body1">{setting.label}</Typography>
            <Typography variant="body2" color="text.secondary">
              {setting.description}
            </Typography>
          </Box>
        }
        sx={{ mb: 2, display: 'flex', alignItems: 'flex-start' }}
      />
    ));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Préférences de Notification
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="notification-method-label">
              Méthode de notification préférée
            </InputLabel>
            <Select
              labelId="notification-method-label"
              value={notificationMethod}
              onChange={handleMethodChange}
              disabled={loading}
              label="Méthode de notification préférée"
            >
              <MenuItem value="push">Notifications push</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="sms">SMS</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 3, p: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Alertes Importantes
        </Typography>
        <FormGroup>
          {renderSettingsByCategory('alerts')}
        </FormGroup>
      </Paper>

      <Paper sx={{ mt: 3, p: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Rappels
        </Typography>
        <FormGroup>
          {renderSettingsByCategory('reminders')}
        </FormGroup>
      </Paper>

      <Paper sx={{ mt: 3, p: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Conseils et Suggestions
        </Typography>
        <FormGroup>
          {renderSettingsByCategory('tips')}
        </FormGroup>
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

export default NotificationSettings; 