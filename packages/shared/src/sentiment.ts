import type { Sentiment } from './types.js';

export interface ParsedNumeric {
  num?: number;
  units?: string;
}

export function parseNumeric(v?: string | number | null): ParsedNumeric {
  if (v == null) return {};
  if (typeof v === 'number') return { num: v };
  
  const s = String(v).trim();
  const units = s.replace(/[-+0-9.,]/g, '').trim() || undefined; // crude units extraction
  const numStr = s.replace('%', '').replace(/[^\d\.\-]/g, '');
  const n = Number(numStr);
  
  if (Number.isNaN(n)) return { units };
  return { num: n, units };
}

export function decideSentiment(
  actual?: number | null,
  forecast?: number | null,
  positiveIsBullish = true,
  tolerance = 0
): Sentiment {
  if (actual == null || forecast == null) return 'Neutral';
  
  const diff = actual - forecast;
  if (Math.abs(diff) <= tolerance) return 'Neutral';
  
  if (positiveIsBullish) {
    return diff > 0 ? 'Bullish' : 'Bearish';
  }
  return diff > 0 ? 'Bearish' : 'Bullish';
}

export function calculateSurprise(
  actual?: number | null,
  forecast?: number | null
): number | null {
  if (actual == null || forecast == null) return null;
  return actual - forecast;
}
