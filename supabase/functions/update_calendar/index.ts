import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.5';

// Types (simplified for Deno environment)
interface FinanceFlowCalendarEvent {
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

interface ParsedNumeric {
  num?: number;
  units?: string;
}

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const FF_BASE = Deno.env.get('FINANCEFLOW_API_BASE')!;
const FF_KEY = Deno.env.get('FINANCEFLOW_API_KEY')!;

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Utility functions
function parseNumeric(v?: string | number | null): ParsedNumeric {
  if (v == null) return {};
  if (typeof v === 'number') return { num: v };
  
  const s = String(v).trim();
  const units = s.replace(/[-+0-9.,]/g, '').trim() || undefined;
  const numStr = s.replace('%', '').replace(/[^\d\.\-]/g, '');
  const n = Number(numStr);
  
  if (Number.isNaN(n)) return { units };
  return { num: n, units };
}

function decideSentiment(
  actual?: number | null,
  forecast?: number | null,
  positiveIsBullish = true,
  tolerance = 0
): string {
  if (actual == null || forecast == null) return 'Neutral';
  
  const diff = actual - forecast;
  if (Math.abs(diff) <= tolerance) return 'Neutral';
  
  if (positiveIsBullish) {
    return diff > 0 ? 'Bullish' : 'Bearish';
  }
  return diff > 0 ? 'Bearish' : 'Bullish';
}

// Event canonicalization (simplified regex map)
const regexMap = [
  { canonical: 'Non-Farm Payrolls (NFP)', re: /Non[- ]?Farm(?: Payrolls)?|Nonfarm Payrolls/i },
  { canonical: 'Federal Funds Rate Decision', re: /Federal Funds Rate|Fed Rate|FOMC.*Rate/i },
  { canonical: 'CPI YoY', re: /\bCPI\b.*\bYoY\b|Consumer Price Index.*YoY/i },
  { canonical: 'Core CPI YoY', re: /Core.*CPI.*YoY/i },
  { canonical: 'GDP QoQ', re: /\bGDP(\s+Growth)?\s*Rate?.*\bQoQ\b/i },
  { canonical: 'Unemployment Rate', re: /Unemployment Rate/i },
  { canonical: 'Initial Jobless Claims', re: /Initial Jobless Claims/i },
  { canonical: 'ISM Manufacturing PMI', re: /ISM.*Manufacturing.*PMI/i },
  { canonical: 'Retail Sales MoM', re: /Retail Sales.*MoM/i },
  { canonical: 'Core PCE YoY', re: /\bCore PCE\b.*YoY/i },
  { canonical: 'ECB Interest Rate Decision', re: /ECB.*(Rate|Interest).*Decision|Deposit Facility/i },
  { canonical: 'BoE Interest Rate', re: /Bank of England|BoE.*(Rate|Interest).*Decision/i },
  { canonical: 'BoJ Interest Rate', re: /Bank of Japan|BoJ.*(Rate|Policy|YCC)/i },
  { canonical: 'RBA Interest Rate Decision', re: /RBA.*(Cash|Interest) Rate|Policy Decision/i },
  { canonical: 'BoC Interest Rate', re: /Bank of Canada|BoC.*Rate Decision/i },
  { canonical: 'SNB Interest Rate Decision', re: /SNB.*(Policy|Interest) Rate/i },
  { canonical: 'RBNZ Interest Rate Decision', re: /RBNZ.*(Interest|Policy) Rate.*Decision/i },
  { canonical: 'Trade Balance', re: /Trade Balance/i }
];

function canonicalize(name: string): string | undefined {
  const hit = regexMap.find(m => m.re.test(name));
  return hit?.canonical;
}

async function fetchCalendar(country: string, from: string, to: string) {
  const url = new URL(`${FF_BASE}/financial-calendar`);
  url.searchParams.set('api_key', FF_KEY);
  url.searchParams.set('country', country);
  url.searchParams.set('date_from', from);
  url.searchParams.set('date_to', to);
  
  const res = await fetch(url, { 
    headers: { 'accept': 'application/json' }
  });
  
  if (!res.ok) {
    throw new Error(`FinanceFlow calendar ${country} ${res.status}: ${await res.text()}`);
  }
  
  return res.json();
}

serve(async (req) => {
  const started = new Date();
  
  try {
    console.log('Starting calendar update job...');
    
    // Get currencies
    const { data: currencies, error: currError } = await sb
      .from('currencies')
      .select('code,country');
    
    if (currError) throw currError;
    
    const from = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const to = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    
    console.log(`Fetching calendar data from ${from} to ${to}`);
    
    for (const currency of currencies ?? []) {
      console.log(`Processing ${currency.code} (${currency.country})`);
      
      try {
        const payload = await fetchCalendar(currency.country, from, to);
        const events = payload?.data ?? payload ?? [];
        
        console.log(`Found ${events.length} events for ${currency.country}`);
        
        for (const e of events) {
          const impactRaw = String(e.economicImpact ?? e.impact ?? '').toLowerCase();
          if (impactRaw !== 'high' && impactRaw !== 'moderate') continue;
          
          const impact = impactRaw === 'high' ? 'High' : 'Medium';
          const report_name = String(e.report_name ?? e.title ?? '');
          const canonical = canonicalize(report_name);
          
          const { num: f, units } = parseNumeric(e.consensus ?? e.forecast);
          const { num: a } = parseNumeric(e.actual);
          const { num: p } = parseNumeric(e.previous);
          
          // Get indicator polarity
          let positive = true;
          let tolerance = 0;
          
          if (canonical) {
            const { data: ind } = await sb
              .from('indicators')
              .select('positive_is_bullish,surprise_tolerance')
              .eq('canonical_name', canonical)
              .maybeSingle();
            
            if (ind) {
              positive = ind.positive_is_bullish;
              tolerance = ind.surprise_tolerance ?? 0;
            }
          }
          
          const sentiment = decideSentiment(a ?? null, f ?? null, positive, tolerance);
          
          // Parse event datetime
          let eventDateTime: string;
          try {
            eventDateTime = new Date(e.datetime ?? e.event_time ?? e.date).toISOString();
          } catch {
            console.warn(`Invalid datetime for event: ${report_name}`);
            continue;
          }
          
          const { error: upsertError } = await sb
            .from('economic_events')
            .upsert({
              currency_code: currency.code,
              country: currency.country,
              report_name,
              canonical_indicator: canonical ?? null,
              impact,
              event_datetime: eventDateTime,
              forecast: f ?? null,
              actual: a ?? null,
              previous: p ?? null,
              units: units ?? null,
              sentiment,
              source: 'FinanceFlow',
              updated_at: new Date().toISOString()
            }, { 
              onConflict: 'country,report_name,event_datetime',
              ignoreDuplicates: false 
            });
          
          if (upsertError) {
            console.error(`Upsert error for ${report_name}:`, upsertError);
          }
        }
      } catch (error) {
        console.error(`Error processing ${currency.country}:`, error);
      }
    }
    
    // Log successful run
    await sb.from('etl_log').insert({
      job: 'update_calendar',
      started_at: started.toISOString(),
      ended_at: new Date().toISOString(),
      ok: true,
      message: 'Calendar update completed successfully'
    });
    
    console.log('Calendar update job completed successfully');
    return new Response('Calendar update completed', { status: 200 });
    
  } catch (err) {
    const errorMessage = String(err);
    console.error('Calendar update job failed:', errorMessage);
    
    // Log failed run
    await sb.from('etl_log').insert({
      job: 'update_calendar',
      started_at: started.toISOString(),
      ended_at: new Date().toISOString(),
      ok: false,
      message: errorMessage
    });
    
    return new Response(errorMessage, { status: 500 });
  }
});
