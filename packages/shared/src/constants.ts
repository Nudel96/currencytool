export const CURRENCY_NAMES: Record<string, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc',
  NZD: 'New Zealand Dollar'
};

export const COUNTRY_MAPPINGS: Record<string, string> = {
  USD: 'United States',
  EUR: 'European Union',
  GBP: 'United Kingdom',
  JPY: 'Japan',
  AUD: 'Australia',
  CAD: 'Canada',
  CHF: 'Switzerland',
  NZD: 'New Zealand'
};

export const IMPACT_COLORS = {
  High: {
    bg: 'bg-red-800',
    text: 'text-red-200'
  },
  Medium: {
    bg: 'bg-amber-800', 
    text: 'text-amber-200'
  }
} as const;

export const SENTIMENT_COLORS = {
  Bullish: {
    bg: 'bg-green-900',
    text: 'text-green-200'
  },
  Bearish: {
    bg: 'bg-red-900',
    text: 'text-red-200'
  },
  Neutral: {
    bg: 'bg-gray-800',
    text: 'text-gray-300'
  }
} as const;

export const API_ENDPOINTS = {
  FINANCEFLOW_CALENDAR: '/financial-calendar',
  FINANCEFLOW_FX: '/currency-spot'
} as const;

export const CACHE_TTL = {
  API_RESPONSE: 60 * 1000, // 60 seconds
  ETL_CALENDAR: 10 * 60 * 1000, // 10 minutes
  ETL_FX: 2 * 60 * 1000 // 2 minutes
} as const;

export const DATE_RANGES = {
  CALENDAR_LOOKBACK: 14, // days
  CALENDAR_LOOKAHEAD: 60, // days
  EVENTS_DISPLAY_LOOKBACK: 30 // days
} as const;
