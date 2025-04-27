import axios from 'axios';

export interface Revenue {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  isRecurring: boolean;
  frequency?: 'monthly' | 'yearly';
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getRevenues = async (): Promise<Revenue[]> => {
  const response = await axios.get(`${API_URL}/revenues`);
  return response.data;
};

export const createRevenue = async (revenue: Omit<Revenue, 'id'>): Promise<Revenue> => {
  const response = await axios.post(`${API_URL}/revenues`, revenue);
  return response.data;
};

export const updateRevenue = async (id: string, revenue: Partial<Revenue>): Promise<Revenue> => {
  const response = await axios.put(`${API_URL}/revenues/${id}`, revenue);
  return response.data;
};

export const deleteRevenue = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/revenues/${id}`);
};

export const revenueCategories = [
  "Salaire",
  "Freelance",
  "Investissement",
  "Location",
  "Vente",
  "Autre"
]; 