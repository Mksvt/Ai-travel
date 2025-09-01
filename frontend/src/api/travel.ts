import axios from 'axios';
import { Itinerary } from '../types/travel';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api', // Backend server URL
});

export const generateItinerary = async (data: {
  city: string;
  budget: number;
  days: number;
  preferences: string;
}) => {
  const response = await apiClient.post('/generate', data);
  return response.data;
};

export const exportToPdf = async (itinerary: Itinerary) => {
  const response = await apiClient.post('/export/pdf', itinerary);
  return response.data;
};
