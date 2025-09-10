export const pairsByCurrency: Record<string, string[]> = {
  USD: ['EURUSD', 'USDJPY', 'GBPUSD', 'USDCHF'],
  EUR: ['EURUSD', 'EURJPY', 'EURGBP'],
  GBP: ['GBPUSD', 'EURGBP', 'GBPJPY'],
  JPY: ['USDJPY', 'EURJPY', 'GBPJPY'],
  AUD: ['AUDUSD', 'AUDJPY', 'EURAUD'],
  CAD: ['USDCAD', 'CADJPY', 'EURCAD'],
  CHF: ['USDCHF', 'EURCHF', 'CHFJPY'],
  NZD: ['NZDUSD', 'NZDJPY', 'EURNZD']
};

export const supportedCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD'] as const;

export type SupportedCurrency = typeof supportedCurrencies[number];

export function getPairsForCurrency(currency: string): string[] {
  return pairsByCurrency[currency.toUpperCase()] || [];
}

export function isSupportedCurrency(currency: string): currency is SupportedCurrency {
  return supportedCurrencies.includes(currency.toUpperCase() as SupportedCurrency);
}
