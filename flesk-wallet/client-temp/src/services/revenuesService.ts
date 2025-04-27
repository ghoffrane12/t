import api from '../config/api';
import { AxiosError } from 'axios';

export interface Revenue {
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

export interface ApiError {
  message: string;
  status?: number;
}

interface ApiErrorResponse {
  message?: string;
  msg?: string;
  error?: string;
}

export const revenueCategories = [
  "Salaire",
  "Freelance",
  "Investissement",
  "Location",
  "Vente",
  "Remboursement",
  "Prime",
  "Autre"
] as const;

export type RevenueCategory = typeof revenueCategories[number];

const handleAxiosError = (error: unknown, defaultMessage: string): ApiError => {
  if (error instanceof AxiosError) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;
    return {
      message: errorData?.message || errorData?.msg || errorData?.error || defaultMessage,
      status: error.response?.status
    };
  }
  return {
    message: defaultMessage,
    status: 500
  };
};

export const getRevenues = async (): Promise<Revenue[]> => {
  try {
    const response = await api.get<Revenue[]>('/revenues');
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'Erreur lors de la récupération des revenus');
  }
};

export const createRevenue = async (revenue: Omit<Revenue, '_id' | 'user' | 'createdAt' | 'updatedAt'>): Promise<Revenue> => {
  try {
    const response = await api.post<Revenue>('/revenues', revenue);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'Erreur lors de la création du revenu');
  }
};

export const updateRevenue = async (id: string, revenue: Partial<Omit<Revenue, '_id' | 'user' | 'createdAt' | 'updatedAt'>>): Promise<Revenue> => {
  try {
    const response = await api.put<Revenue>(`/revenues/${id}`, revenue);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, 'Erreur lors de la mise à jour du revenu');
  }
};

export const deleteRevenue = async (id: string): Promise<void> => {
  try {
    await api.delete(`/revenues/${id}`);
  } catch (error) {
    throw handleAxiosError(error, 'Erreur lors de la suppression du revenu');
  }
}; 