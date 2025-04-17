import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Paper,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getAnalysis } from '../services/savingGoalService';
import { AnalysisData } from '../services/savingGoalService';

const COLORS = ['#FF5733', '#FFB800', '#33FF57', '#3380FF', '#B833FF'];

interface PredictionData {
  name: string;
  value: number;
  confidence: string;
}

interface PieLabelProps {
  name: string;
  value: number;
}

const SpendingAnalysis: React.FC = () => {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Préparer les données pour le graphique de tendances
  const trendData = Object.entries(analysis.trends).map(([category, data]) => ({
    name: category,
    variation: data.trend,
  }));

  // Préparer les données pour le graphique circulaire des prévisions
  const predictionData: PredictionData[] = Object.entries(analysis.predictions).map(([category, data]) => ({
    name: category,
    value: data.predictedAmount,
    confidence: data.confidence,
  }));

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {/* Graphique des tendances */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tendances des dépenses
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Variation (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="variation"
                      stroke="#FF5733"
                      name="Variation mensuelle"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Graphique des prévisions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Prévisions du mois prochain
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={predictionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }: PieLabelProps) => `${name}: ${value.toFixed(2)} DT`}
                    >
                      {predictionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Insights et suggestions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Insights et suggestions
              </Typography>
              <Grid container spacing={2}>
                {analysis.insights.map((insight, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: insight.type === 'WARNING' ? '#FFF3E0' : '#E8F5E9',
                      }}
                    >
                      <Typography variant="body1">{insight.message}</Typography>
                      {insight.type === 'WARNING' && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Suggestion: Essayez de réduire vos dépenses dans cette catégorie de 10% ce mois-ci.
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SpendingAnalysis; 