import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
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
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getExpenses, Expense } from '../services/expensesService';
import { getRevenues, Revenue } from '../services/revenuesService';

interface ChartData {
  month: string;
  expenses: number;
  income: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const ExpenseIncomeChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<number>(1);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      const startDate = subMonths(endDate, timeRange - 1);

      // Récupérer les dépenses et les revenus
      const [expensesResponse, revenuesResponse] = await Promise.all([
        getExpenses(),
        getRevenues()
      ]) as [Expense[] | ApiResponse<Expense[]>, Revenue[]];

      // Extraire les données des réponses
      const expenses = Array.isArray(expensesResponse) ? expensesResponse : expensesResponse.data;
      const revenues = revenuesResponse;

      // Préparer les données pour le graphique
      const data: ChartData[] = [];
      let currentDate = startDate;

      while (currentDate <= endDate) {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);

        // Calculer les dépenses du mois
        const monthExpenses = expenses
          .filter((expense: Expense) => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= monthStart && expenseDate <= monthEnd;
          })
          .reduce((sum: number, expense: Expense) => sum + expense.amount, 0);

        // Calculer les revenus du mois
        const monthIncomes = revenues
          .filter((revenue: Revenue) => {
            const revenueDate = new Date(revenue.date);
            return revenueDate >= monthStart && revenueDate <= monthEnd;
          })
          .reduce((sum: number, revenue: Revenue) => sum + revenue.amount, 0);

        data.push({
          month: format(currentDate, 'MMM', { locale: fr }),
          expenses: monthExpenses,
          income: monthIncomes,
        });

        currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
      }

      setChartData(data);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const handleTimeRangeChange = (event: SelectChangeEvent<number>) => {
    setTimeRange(event.target.value as number);
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2">
          Évolution des dépenses et revenus
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={timeRange}
            onChange={handleTimeRangeChange}
            displayEmpty
          >
            <MenuItem value={1}>1 mois</MenuItem>
            <MenuItem value={2}>2 mois</MenuItem>
            <MenuItem value={3}>3 mois</MenuItem>
            <MenuItem value={6}>6 mois</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [`${value.toLocaleString()} TND`, '']}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="expenses"
              name="Dépenses"
              stroke="#FF5733"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="income"
              name="Revenus"
              stroke="#4CAF50"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default ExpenseIncomeChart; 