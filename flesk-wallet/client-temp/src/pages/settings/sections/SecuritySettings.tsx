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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import FaceIcon from '@mui/icons-material/Face';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import SecurityIcon from '@mui/icons-material/Security';

interface SecurityMethod {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
  requiresSetup: boolean;
  isConfigured: boolean;
}

const SecuritySettings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [setupDialog, setSetupDialog] = useState(false);
  const [currentMethod, setCurrentMethod] = useState<SecurityMethod | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [securityMethods, setSecurityMethods] = useState<SecurityMethod[]>([
    {
      id: '2fa',
      name: 'Authentification à deux facteurs (2FA)',
      description: 'Sécurisez votre compte avec un code à usage unique',
      enabled: false,
      icon: <SecurityIcon />,
      requiresSetup: true,
      isConfigured: false,
    },
    {
      id: 'face',
      name: 'Reconnaissance faciale',
      description: 'Utilisez votre visage pour valider les actions sensibles',
      enabled: false,
      icon: <FaceIcon />,
      requiresSetup: true,
      isConfigured: false,
    },
    {
      id: 'fingerprint',
      name: 'Empreinte digitale',
      description: 'Utilisez votre empreinte digitale pour une authentification rapide',
      enabled: false,
      icon: <FingerprintIcon />,
      requiresSetup: true,
      isConfigured: false,
    },
    {
      id: 'qr',
      name: 'Code QR de sécurité',
      description: 'Générez un code QR unique pour les connexions sécurisées',
      enabled: false,
      icon: <QrCode2Icon />,
      requiresSetup: true,
      isConfigured: false,
    },
  ]);

  const handleMethodToggle = async (methodId: string) => {
    const method = securityMethods.find(m => m.id === methodId);
    if (!method) return;

    if (method.requiresSetup && !method.isConfigured) {
      setCurrentMethod(method);
      setSetupDialog(true);
      return;
    }

    try {
      setLoading(true);
      // Implement security method toggle logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call

      setSecurityMethods(prev =>
        prev.map(m =>
          m.id === methodId
            ? { ...m, enabled: !m.enabled }
            : m
        )
      );

      setSuccess(`${method.name} ${!method.enabled ? 'activée' : 'désactivée'} avec succès`);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupComplete = async (methodId: string) => {
    try {
      setLoading(true);
      // Implement security method setup logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call

      setSecurityMethods(prev =>
        prev.map(m =>
          m.id === methodId
            ? { ...m, isConfigured: true, enabled: true }
            : m
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
    if (!currentMethod) return null;

    return (
      <Dialog open={setupDialog} onClose={() => setSetupDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Configuration de {currentMethod.name}
        </DialogTitle>
        <DialogContent>
          {currentMethod.id === '2fa' && (
            <Box sx={{ mt: 2 }}>
              <Typography gutterBottom>
                Scannez le QR code ci-dessous avec votre application d'authentification :
              </Typography>
              <Box sx={{ textAlign: 'center', my: 3 }}>
                {/* Placeholder for QR code */}
                <Paper
                  sx={{
                    width: 200,
                    height: 200,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'grey.100',
                  }}
                >
                  <QrCode2Icon sx={{ fontSize: 100, color: 'grey.500' }} />
                </Paper>
              </Box>
              <TextField
                fullWidth
                label="Code de vérification"
                placeholder="Entrez le code à 6 chiffres"
                sx={{ mt: 2 }}
              />
            </Box>
          )}

          {currentMethod.id === 'face' && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <FaceIcon sx={{ fontSize: 100, color: 'primary.main', mb: 2 }} />
              <Typography>
                Positionnez votre visage dans le cadre et suivez les instructions
              </Typography>
            </Box>
          )}

          {currentMethod.id === 'fingerprint' && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <FingerprintIcon sx={{ fontSize: 100, color: 'primary.main', mb: 2 }} />
              <Typography>
                Placez votre doigt sur le capteur d'empreintes digitales
              </Typography>
            </Box>
          )}

          {currentMethod.id === 'qr' && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography gutterBottom>
                Voici votre code QR de sécurité personnel :
              </Typography>
              <Paper
                sx={{
                  width: 200,
                  height: 200,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'grey.100',
                  my: 2,
                }}
              >
                <QrCode2Icon sx={{ fontSize: 100, color: 'grey.500' }} />
              </Paper>
              <Typography variant="caption" display="block">
                Conservez ce code en lieu sûr. Il vous sera demandé lors de certaines opérations sensibles.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSetupDialog(false)} disabled={loading}>
            Annuler
          </Button>
          <Button
            onClick={() => handleSetupComplete(currentMethod.id)}
            variant="contained"
            disabled={loading}
          >
            Terminer la configuration
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Paramètres de Sécurité
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Méthodes d'Authentification
        </Typography>

        <List>
          {securityMethods.map((method) => (
            <ListItem
              key={method.id}
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': { borderBottom: 'none' },
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {method.icon}
                    <Typography>{method.name}</Typography>
                  </Box>
                }
                secondary={method.description}
              />
              <ListItemSecondaryAction>
                <FormControlLabel
                  control={
                    <Switch
                      checked={method.enabled}
                      onChange={() => handleMethodToggle(method.id)}
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

      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Journal de Connexion
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Surveillez l'activité de votre compte et détectez les accès non autorisés.
        </Typography>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          Voir l'historique de connexion
        </Button>
      </Paper>

      {renderSetupDialog()}
    </Box>
  );
};

export default SecuritySettings; 