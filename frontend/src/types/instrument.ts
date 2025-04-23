export interface Instrument {
    symbol: string;
    name: string;
    currentPrice: number;
    dailyChange: number;
    weeklyChange: number;
    dayHigh: number;
    dayLow: number;
    volume: number;
    lastUpdated: string;
}

export interface InstrumentDetail extends Instrument {
    // Podemos agregar más campos específicos para la vista detallada si es necesario
}
