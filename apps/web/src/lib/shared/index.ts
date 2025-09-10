// Inline shared types and utilities for Vercel compatibility

export type Impact = 'High' | 'Medium';
export type Sentiment = 'Bullish' | 'Bearish' | 'Neutral';

export interface EventRow {
  event_datetime: string;
  currency_code: string;
  country: string;
  canonical_indicator?: string;
  report_name: string;
  impact: 'High' | 'Medium';
  forecast?: number;
  actual?: number;
  previous?: number;
  units?: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
}

export interface FxQuote {
  pair: string;
  price?: number;
  change_percent?: number;
  last_update?: string;
}

export interface CurrencyOverview {
  currency: {
    code: string;
    name: string;
    country: string;
  };
  pairs: FxQuote[];
  events: EventRow[];
}

// Currency pairs configuration
export const PAIRS_BY_CURRENCY: Record<string, string[]> = {
  USD: ['EURUSD', 'USDJPY', 'GBPUSD', 'USDCHF'],
  EUR: ['EURUSD', 'EURJPY', 'EURGBP'],
  GBP: ['GBPUSD', 'EURGBP', 'GBPJPY'],
  JPY: ['USDJPY', 'EURJPY', 'GBPJPY'],
  AUD: ['AUDUSD', 'AUDJPY', 'EURAUD'],
  CAD: ['USDCAD', 'CADJPY', 'EURCAD'],
  CHF: ['USDCHF', 'EURCHF', 'CHFJPY'],
  NZD: ['NZDUSD', 'NZDJPY', 'EURNZD']
};

// Constants
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

// Helper functions
export const supportedCurrencies = Object.keys(PAIRS_BY_CURRENCY);

export function getPairsForCurrency(currency: string): string[] {
  return PAIRS_BY_CURRENCY[currency] || [];
}

export function isSupportedCurrency(currency: string): boolean {
  return currency in PAIRS_BY_CURRENCY;
}
