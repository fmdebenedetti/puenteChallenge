import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { instrumentService } from '../services/api';
import { Instrument } from '../types/instrument';

export const InstrumentDetailPage: React.FC = () => {
    const { symbol } = useParams<{ symbol: string }>();
    const navigate = useNavigate();
    const [instrument, setInstrument] = useState<Instrument | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadInstrumentDetails = async () => {
            if (!symbol) return;
            
            try {
                setLoading(true);
                setError(null);
                const response = await instrumentService.getInstrumentDetails(symbol);
                setInstrument(response.data);
            } catch (err) {
                setError('Error al cargar los detalles del instrumento');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadInstrumentDetails();
    }, [symbol]);

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    };

    const formatVolume = (volume: number) => {
        return new Intl.NumberFormat('es-AR', {
            notation: "compact",
            maximumFractionDigits: 1
        }).format(volume);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !instrument) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error || 'No se encontró el instrumento'}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Volver
            </button>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-2xl font-bold leading-6 text-gray-900">
                        {instrument.symbol}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {instrument.name}
                    </p>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Precio Actual
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                ${formatNumber(instrument.currentPrice)}
                            </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Variación Diaria
                            </dt>
                            <dd className={`mt-1 text-sm sm:mt-0 sm:col-span-2 ${instrument.dailyChange > 0 ? 'text-green-600' : instrument.dailyChange < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                {instrument.dailyChange > 0 ? '+' : ''}{formatNumber(instrument.dailyChange)}%
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Variación Semanal
                            </dt>
                            <dd className={`mt-1 text-sm sm:mt-0 sm:col-span-2 ${instrument.weeklyChange > 0 ? 'text-green-600' : instrument.weeklyChange < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                {instrument.weeklyChange > 0 ? '+' : ''}{formatNumber(instrument.weeklyChange)}%
                            </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Máximo del Día
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                ${formatNumber(instrument.dayHigh)}
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Mínimo del Día
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                ${formatNumber(instrument.dayLow)}
                            </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Volumen
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {formatVolume(instrument.volume)}
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Última Actualización
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {new Date(instrument.lastUpdated).toLocaleString('es-AR')}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};
