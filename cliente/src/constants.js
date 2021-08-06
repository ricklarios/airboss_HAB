const FLIGHT_CLASSES = ['Turista', 'Turista Superior', 'Business', 'Primera'];
const OPTIONS_SEARCH = [
    {
        id: 1,
        value: 'Solo ida',
    },
    {
        id: 2,
        value: 'Ida y vuelta',
    },
];

const CURRENCY_CODES = [
    {
        id: 1,
        currency: 'EUR',
        symbol: '€',
        country: 'Union Europea',
    },
    {
        id: 2,
        currency: 'USD',
        symbol: 'US$',
        country: 'Estados Unidos',
    },
    {
        id: 3,
        currency: 'ARS',
        symbol: 'AR$',
        country: 'Argentina',
    },
    {
        id: 4,
        currency: 'CNY',
        symbol: '¥',
        country: 'China',
    },
    {
        id: 5,
        currency: 'NZD',
        symbol: 'NZ$',
        country: 'Nueva Zelanda',
    },
    {
        id: 6,
        currency: 'GBP',
        symbol: '£',
        country: 'Reino Unido',
    },
    {
        id: 7,
        currency: 'JPY',
        symbol: '¥',
        country: 'Japón',
    },
    {
        id: 8,
        currency: 'AUD',
        symbol: 'A$',
        country: 'Australia',
    },
    {
        id: 9,
        currency: 'CAD',
        symbol: 'C$',
        country: 'Canadá',
    },
    {
        id: 10,
        currency: 'CHF',
        symbol: 'CHF',
        country: 'Suiza',
    },
];

module.exports = { FLIGHT_CLASSES, OPTIONS_SEARCH, CURRENCY_CODES };
