import React from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';

export interface SavingGoal {
  id: string;
  label: string;
  percent: number;
  color: string;
}

const SavingGoalsSummary: React.FC<{ goals: SavingGoal[] }> = ({ goals }) => (
  <Paper sx={{ p: 3, borderRadius: 3 }}>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
      Objectifs d'épargne
    </Typography>
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 4 }}>
      {goals.map((g) => (
        <Box key={g.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
            <CircularProgress
              variant="determinate"
              value={g.percent}
              size={90}
              thickness={6}
              sx={{
                color: g.color,
                backgroundColor: '#f0f0f0',
                borderRadius: '50%',
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              <Typography variant="h5" sx={{ color: g.color, fontWeight: 700 }}>
                {g.percent}%
              </Typography>
            </Box>
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#222' }}>
            {g.label}
          </Typography>
        </Box>
      ))}
    </Box>
  </Paper>
);

export default SavingGoalsSummary; 