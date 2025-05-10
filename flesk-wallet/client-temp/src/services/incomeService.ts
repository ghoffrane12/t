import axios from 'axios';

export interface Income {
  _id?: string;
  nom: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const API_URL = '/api';

export const getIncomes = async (): Promise<ApiResponse<Income[]>> => {
  try {
    const response = await axios.get(`${API_URL}/incomes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching incomes:', error);
    return { success: false, data: [] };
  }
};

export const createIncome = async (income: Omit<Income, '_id'>): Promise<ApiResponse<Income>> => {
  const response = await axios.post(`${API_URL}/incomes`, income);
  return response.data;
};

export const updateIncome = async (id: string, income: Partial<Income>): Promise<ApiResponse<Income>> => {
  const response = await axios.put(`${API_URL}/incomes/${id}`, income);
  return response.data;
};

export const deleteIncome = async (id: string): Promise<ApiResponse<void>> => {
  const response = await axios.delete(`${API_URL}/incomes/${id}`);
  return response.data;
}; 