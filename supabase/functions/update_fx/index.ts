import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.5';

// Types
interface FinanceFlowFxData {
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

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const FF_BASE = Deno.env.get('FINANCEFLOW_API_BASE')!;
const FF_KEY = Deno.env.get('FINANCEFLOW_API_KEY')!;

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// FX pairs configuration
const pairsByCurrency: Record<string, string[]> = {
  USD: ['EURUSD', 'USDJPY', 'GBPUSD', 'USDCHF'],
  EUR: ['EURUSD', 'EURJPY', 'EURGBP'],
  GBP: ['GBPUSD', 'EURGBP', 'GBPJPY'],
  JPY: ['USDJPY', 'EURJPY', 'GBPJPY'],
  AUD: ['AUDUSD', 'AUDJPY', 'EURAUD'],
  CAD: ['USDCAD', 'CADJPY', 'EURCAD'],
  CHF: ['USDCHF', 'EURCHF', 'CHFJPY'],
  NZD: ['NZDUSD', 'NZDJPY', 'EURNZD']
};

function safeNumber(value?: string | number | null): number | null {
  if (value == null) return null;
  const num = typeof value === 'number' ? value : Number(String(value).replace('%', ''));
  return Number.isNaN(num) ? null : num;
}

async function fetchPair(pair: string): Promise<FinanceFlowFxData> {
  const url = new URL(`${FF_BASE}/currency-spot`);
  url.searchParams.set('api_key', FF_KEY);
  url.searchParams.set('pair', pair);
  
  const res = await fetch(url, {
    headers: { 'accept': 'application/json' }
  });
  
  if (!res.ok) {
    throw new Error(`FX pair ${pair} ${res.status}: ${await res.text()}`);
  }
  
  const data = await res.json();
  return Array.isArray(data?.data) ? data.data[0] : data;
}

serve(async (req) => {
  const started = new Date();
  
  try {
    console.log('Starting FX update job...');
    
    // Get all unique pairs from all currencies
    const allPairs = new Set<string>();
    Object.values(pairsByCurrency).forEach(pairs => {
      pairs.forEach(pair => allPairs.add(pair));
    });
    
    console.log(`Updating ${allPairs.size} FX pairs`);
    
    for (const pair of allPairs) {
      try {
        console.log(`Fetching ${pair}...`);
        const data = await fetchPair(pair);
        
        const { error: upsertError } = await sb
          .from('fx_quotes')
          .upsert({
            pair,
            price: safeNumber(data?.price ?? data?.mid ?? data?.last),
            bid: safeNumber(data?.bid),
            ask: safeNumber(data?.ask),
            open: safeNumber(data?.open),
            high: safeNumber(data?.high),
            low: safeNumber(data?.low),
            change_abs: safeNumber(data?.change),
            change_percent: safeNumber(data?.change_percent),
            last_update: new Date().toISOString()
          });
        
        if (upsertError) {
          console.error(`Upsert error for ${pair}:`, upsertError);
        } else {
          console.log(`Updated ${pair} successfully`);
        }
        
        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Error fetching ${pair}:`, error);
        // Continue with other pairs even if one fails
      }
    }
    
    // Update cursor
    await sb.from('etl_cursor').upsert({
      name: 'update_fx',
      last_run: new Date().toISOString()
    });
    
    // Log successful run
    await sb.from('etl_log').insert({
      job: 'update_fx',
      started_at: started.toISOString(),
      ended_at: new Date().toISOString(),
      ok: true,
      message: `FX update completed for ${allPairs.size} pairs`
    });
    
    console.log('FX update job completed successfully');
    return new Response('FX update completed', { status: 200 });
    
  } catch (err) {
    const errorMessage = String(err);
    console.error('FX update job failed:', errorMessage);
    
    // Log failed run
    await sb.from('etl_log').insert({
      job: 'update_fx',
      started_at: started.toISOString(),
      ended_at: new Date().toISOString(),
      ok: false,
      message: errorMessage
    });
    
    return new Response(errorMessage, { status: 500 });
  }
});
