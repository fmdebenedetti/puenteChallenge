import axios from 'axios';
import { Instrument } from '../types/instrument';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para incluir el token en las peticiones
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const instrumentService = {
    getAllInstruments: () => api.get<Instrument[]>('/instruments'),
    searchInstruments: (query: string) => api.get<Instrument[]>(`/instruments/search?query=${query}`),
    getInstrumentDetails: (symbol: string) => api.get<Instrument>(`/instruments/${symbol}/details`),
    getFavorites: () => api.get<Instrument[]>('/instruments/favorites'),
    toggleFavorite: (symbol: string) => api.post(`/instruments/${symbol}/favorite`),
};
