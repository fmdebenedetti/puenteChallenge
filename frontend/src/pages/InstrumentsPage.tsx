import React, { useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { InstrumentTable } from '../components/InstrumentTable';
import { instrumentService } from '../services/api';
import { Instrument } from '../types/instrument';

export const InstrumentsPage: React.FC = () => {
    const [instruments, setInstruments] = useState<Instrument[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [favoriteInstruments, setFavoriteInstruments] = useState<Instrument[]>([]); // Usado para la vista de favoritos
    const [tab, setTab] = useState<'all' | 'favorites'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadInstruments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await instrumentService.getAllInstruments();
            setInstruments(response.data);
            // Cargar favoritos
            const favResponse = await instrumentService.getFavorites();
            setFavorites(new Set(favResponse.data.map(inst => inst.symbol)));
            setFavoriteInstruments(favResponse.data);
        } catch (err) {
            setError('Error al cargar los instrumentos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadFavorites = async () => {
        try {
            setLoading(true);
            setError(null);
            const favResponse = await instrumentService.getFavorites();
            setFavoriteInstruments(favResponse.data);
            setFavorites(new Set(favResponse.data.map(inst => inst.symbol)));
        } catch (err) {
            setError('Error al cargar los favoritos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await instrumentService.searchInstruments(searchQuery);
            setInstruments(response.data);
        } catch (err) {
            setError('Error al buscar instrumentos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = async (symbol: string) => {
        try {
            await instrumentService.toggleFavorite(symbol);
            setFavorites(prev => {
                const newFavorites = new Set(prev);
                if (newFavorites.has(symbol)) {
                    newFavorites.delete(symbol);
                } else {
                    newFavorites.add(symbol);
                }
                return newFavorites;
            });
        } catch (err) {
            console.error('Error al actualizar favorito:', err);
        }
    };

    useEffect(() => {
        if (tab === 'all') {
            loadInstruments();
        } else {
            loadFavorites();
        }
        // Actualizar datos cada 5 minutos
        const interval = setInterval(() => {
            if (tab === 'all') {
                loadInstruments();
            } else {
                loadFavorites();
            }
        }, 5 * 60 * 1000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Instrumentos Financieros
                </h1>
                <div className="flex gap-4 mb-4">
                    <button
                        className={`px-4 py-2 rounded-lg font-semibold ${tab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setTab('all')}
                    >
                        Todos
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg font-semibold ${tab === 'favorites' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setTab('favorites')}
                    >
                        Favoritos
                    </button>
                    {tab === 'all' && (
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar por símbolo o nombre..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <MagnifyingGlassIcon 
                                    className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                                />
                            </div>
                        </div>
                    )}
                    {tab === 'all' && (
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Buscar
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            ) : (
                <InstrumentTable
                    instruments={tab === 'all' ? instruments : favoriteInstruments}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                />
            )}
        </div>
    );
};
