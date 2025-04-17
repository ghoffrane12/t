import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Slider,
  Alert,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getAnalysis } from '../services/savingGoalService';
import { AnalysisData } from '../services/savingGoalService';

interface Scenario {
  name: string;
  factor: number;
  color: string;
}

interface ForecastData {
  name: string;
  base: number;
  adjusted: number;
}

interface Alert {
  category: string;
  increase: string;
}

const SCENARIOS: Scenario[] = [
  { name: 'Optimiste', factor: 0.8, color: '#33FF57' },
  { name: 'Réaliste', factor: 1, color: '#FFB800' },
  { name: 'Pessimiste', factor: 1.2, color: '#FF5733' },
];

const BudgetForecast: React.FC = () => {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState(1); // Index du scénario réaliste
  const [adjustments, setAdjustments] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        const data = await getAnalysis();
        setAnalysis(data);
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement de l'analyse");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!analysis) return null;

  const handleScenarioChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedScenario(newValue);
  };

  const handleAdjustmentChange = (category: string, value: number) => {
    setAdjustments(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  // Préparer les données pour le graphique de prévisions
  const forecastData: ForecastData[] = Object.entries(analysis.predictions).map(([category, prediction]) => {
    const baseAmount = prediction.predictedAmount;
    const adjustment = adjustments[category] || 0;
    const scenarioFactor = SCENARIOS[selectedScenario].factor;
    
    return {
      name: category,
      base: baseAmount,
      adjusted: baseAmount * (1 + adjustment / 100) * scenarioFactor,
    };
  });

  // Calculer les alertes
  const alerts: Alert[] = forecastData
    .filter(item => item.adjusted > item.base * 1.1)
    .map(item => ({
      category: item.name,
      increase: ((item.adjusted - item.base) / item.base * 100).toFixed(1),
    }));

  return (
    <Box p={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Simulation de budget
          </Typography>

          {/* Sélection du scénario */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={selectedScenario} onChange={handleScenarioChange}>
              {SCENARIOS.map((scenario, index) => (
                <Tab 
                  key={scenario.name} 
                  label={scenario.name}
                  sx={{ color: scenario.color }}
                />
              ))}
            </Tabs>
          </Box>

          {/* Ajustements par catégorie */}
          <Grid container spacing={3}>
            {Object.entries(analysis.predictions).map(([category, prediction]) => (
              <Grid item xs={12} sm={6} md={4} key={category}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Prévision: {prediction.predictedAmount.toFixed(2)} DT
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ajustement: {adjustments[category] || 0}%
                  </Typography>
                  <Slider
                    value={adjustments[category] || 0}
                    onChange={(_, value) => handleAdjustmentChange(category, value as number)}
                    min={-50}
                    max={50}
                    step={5}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Graphique de comparaison */}
          <Box height={400} mt={3}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="base"
                  stroke="#8884d8"
                  name="Prévision initiale"
                />
                <Line
                  type="monotone"
                  dataKey="adjusted"
                  stroke={SCENARIOS[selectedScenario].color}
                  name={`Prévision ajustée (${SCENARIOS[selectedScenario].name})`}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>

          {/* Alertes */}
          {alerts.length > 0 && (
            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                Alertes
              </Typography>
              {alerts.map((alert, index) => (
                <Alert 
                  key={index} 
                  severity="warning" 
                  sx={{ mb: 1 }}
                >
                  Attention: Les dépenses prévues en {alert.category} augmentent de {alert.increase}%
                </Alert>
              ))}
            </Box>
          )}

          {/* Suggestions */}
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Suggestions
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(analysis.predictions).map(([category, prediction]) => {
                const adjustment = adjustments[category] || 0;
                if (adjustment > 0) {
                  return (
                    <Grid item xs={12} sm={6} key={category}>
                      <Paper sx={{ p: 2, bgcolor: '#E8F5E9' }}>
                        <Typography variant="body1">
                          Pour compenser l'augmentation prévue en {category}, vous pourriez :
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          • Réduire les dépenses dans d'autres catégories
                          <br />
                          • Augmenter votre épargne mensuelle de {(prediction.predictedAmount * adjustment / 100).toFixed(2)} DT
                        </Typography>
                      </Paper>
                    </Grid>
                  );
                }
                return null;
              })}
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BudgetForecast; 