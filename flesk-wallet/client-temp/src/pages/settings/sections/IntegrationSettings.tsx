import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Button,
  Grid,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MapIcon from '@mui/icons-material/Map';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ReceiptIcon from '@mui/icons-material/Receipt';

interface Integration {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  apiKey?: string;
  icon: React.ReactNode;
  requiresSetup: boolean;
  isConfigured: boolean;
}

const IntegrationSettings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [setupDialog, setSetupDialog] = useState(false);
  const [currentIntegration, setCurrentIntegration] = useState<Integration | null>(null);

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'google_maps',
      name: 'Google Maps',
      description: 'Intégration pour la visualisation des transactions sur la carte',
      enabled: false,
      icon: <MapIcon />,
      requiresSetup: true,
      isConfigured: false,
    },
    {
      id: 'bank_api',
      name: 'API Bancaire',
      description: 'Connexion avec votre banque pour la synchronisation automatique',
      enabled: false,
      icon: <AccountBalanceIcon />,
      requiresSetup: true,
      isConfigured: false,
    },
    {
      id: 'receipt_scan',
      name: 'Scanner de Reçus',
      description: 'Extraction automatique des données depuis les reçus',
      enabled: false,
      icon: <ReceiptIcon />,
      requiresSetup: true,
      isConfigured: false,
    },
    {
      id: 'push_notifications',
      name: 'Notifications Push',
      description: 'Notifications en temps réel sur votre appareil',
      enabled: false,
      icon: <NotificationsIcon />,
      requiresSetup: true,
      isConfigured: false,
    },
  ]);

  const handleIntegrationToggle = async (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration) return;

    if (integration.requiresSetup && !integration.isConfigured) {
      setCurrentIntegration(integration);
      setSetupDialog(true);
      return;
    }

    try {
      setLoading(true);
      // Implement integration toggle logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call

      setIntegrations(prev =>
        prev.map(i =>
          i.id === integrationId
            ? { ...i, enabled: !i.enabled }
            : i
        )
      );

      setSuccess(`${integration.name} ${!integration.enabled ? 'activée' : 'désactivée'} avec succès`);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupComplete = async (formData: any) => {
    if (!currentIntegration) return;

    try {
      setLoading(true);
      // Implement integration setup logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call

      setIntegrations(prev =>
        prev.map(i =>
          i.id === currentIntegration.id
            ? { ...i, isConfigured: true, enabled: true, apiKey: formData.apiKey }
            : i
        )
      );

      setSuccess('Configuration terminée avec succès');
      setSetupDialog(false);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const renderSetupDialog = () => {
    if (!currentIntegration) return null;

    return (
      <Dialog open={setupDialog} onClose={() => setSetupDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Configuration de {currentIntegration.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {currentIntegration.description}
          </Typography>

          <TextField
            fullWidth
            label="Clé API"
            type="password"
            sx={{ mb: 2 }}
          />

          {currentIntegration.id === 'google_maps' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Vous pouvez obtenir votre clé API Google Maps depuis la Console Google Cloud.
            </Alert>
          )}

          {currentIntegration.id === 'bank_api' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Contactez votre banque pour obtenir vos identifiants d'API.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSetupDialog(false)} disabled={loading}>
            Annuler
          </Button>
          <Button
            onClick={() => handleSetupComplete({ apiKey: 'test-api-key' })}
            variant="contained"
            disabled={loading}
          >
            Configurer
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Intégrations
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ p: 3 }}>
        <List>
          {integrations.map((integration) => (
            <ListItem
              key={integration.id}
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': { borderBottom: 'none' },
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {integration.icon}
                    <Typography>{integration.name}</Typography>
                  </Box>
                }
                secondary={integration.description}
              />
              <ListItemSecondaryAction>
                <FormControlLabel
                  control={
                    <Switch
                      checked={integration.enabled}
                      onChange={() => handleIntegrationToggle(integration.id)}
                      disabled={loading}
                    />
                  }
                  label=""
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      {renderSetupDialog()}
    </Box>
  );
};

export default IntegrationSettings;