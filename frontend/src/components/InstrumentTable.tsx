import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { Instrument } from '../types/instrument';

interface Props {
    instruments: Instrument[];
    favorites: Set<string>;
    onToggleFavorite: (symbol: string) => void;
}

export const InstrumentTable: React.FC<Props> = ({ instruments, favorites, onToggleFavorite }) => {
    const navigate = useNavigate();

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    };

    const formatPercent = (num: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            signDisplay: 'exceptZero'
        }).format(num / 100);
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Favorito
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Símbolo
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Precio
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cambio Diario
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Volumen
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {instruments.map((instrument) => (
                        <tr 
                            key={instrument.symbol}
                            onClick={() => navigate(`/instruments/${instrument.symbol}`)}
                            className="hover:bg-gray-50 cursor-pointer"
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleFavorite(instrument.symbol);
                                    }}
                                    className="focus:outline-none hover:text-yellow-500 bg-transparent border-none p-0 shadow-none"
                                >
                                    {favorites.has(instrument.symbol) ? (
                                        <StarIconSolid className="h-5 w-5 text-yellow-500" />
                                    ) : (
                                        <StarIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {instrument.symbol}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {instrument.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                ${formatNumber(instrument.currentPrice)}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${instrument.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatPercent(instrument.dailyChange)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                {formatNumber(instrument.volume)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
