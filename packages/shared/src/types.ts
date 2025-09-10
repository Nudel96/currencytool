export type Impact = 'High' | 'Medium';
export type Sentiment = 'Bullish' | 'Bearish' | 'Neutral';

export interface EventRow {
  currency_code: string;
  country: string;
  report_name: string;
  canonical_indicator?: string;
  impact: Impact;
  event_datetime: string; // ISO UTC
  forecast?: number | null;
  actual?: number | null;
  previous?: number | null;
  units?: string | null;
  sentiment?: Sentiment;
  revised?: number | null;
}

export interface FxQuote {
  pair: string;
  price?: number | null;
  bid?: number | null;
  ask?: number | null;
  open?: number | null;
  high?: number | null;
  low?: number | null;
  change_abs?: number | null;
  change_percent?: number | null;
  last_update?: string | null;
}

export interface CurrencyOverview {
  currency: string;
  pairs: FxQuote[];
  events: EventRow[];
}

export interface Currency {
  code: string;
  name: string;
  country: string;
}

export interface Indicator {
  id: number;
  canonical_name: string;
  positive_is_bullish: boolean;
  surprise_tolerance: number;
}

export interface ETLLog {
  id: number;
  job: string;
  started_at: string;
  ended_at?: string;
  ok: boolean;
  message: string;
}

export interface ETLCursor {
  name: string;
  last_run: string;
}

// FinanceFlow API Types
export interface FinanceFlowCalendarEvent {
  datetime?: string;
  event_time?: string;
  date?: string;
  report_name?: string;
  title?: string;
  economicImpact?: string;
  impact?: string;
  consensus?: string | number;
  forecast?: string | number;
  actual?: string | number;
  previous?: string | number;
  country?: string;
}

export interface FinanceFlowFxData {
  pair?: string;
  price?: string | number;
  mid?: string | number;
  last?: string | number;
  bid?: string | number;
  ask?: string | number;
  open?: string | number;
  high?: string | number;
  low?: string | number;
  change?: string | number;
  change_percent?: string | number;
}

export interface FinanceFlowResponse<T> {
  data?: T[];
  [key: string]: any;
}
