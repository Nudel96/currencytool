import { json } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabase.js';
import { getPairsForCurrency, isSupportedCurrency } from 'shared/pairs';
import type { CurrencyOverview } from 'shared/types';
import type { RequestHandler } from './$types.js';

// In-memory cache for 60 seconds
const cache = new Map<string, { data: CurrencyOverview; timestamp: number; etag: string }>();
const CACHE_TTL = 60 * 1000; // 60 seconds

function generateETag(data: any): string {
  return `"${Buffer.from(JSON.stringify(data)).toString('base64').slice(0, 16)}"`;
}

export const GET: RequestHandler = async ({ params, setHeaders, request }) => {
  const code = params.code?.toUpperCase();
  
  if (!code || !isSupportedCurrency(code)) {
    return json({ error: 'Invalid currency code' }, { status: 400 });
  }
  
  const cacheKey = `overview-${code}`;
  const now = Date.now();
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    const ifNoneMatch = request.headers.get('if-none-match');
    if (ifNoneMatch === cached.etag) {
      return new Response(null, { status: 304 });
    }
    
    setHeaders({
      'Cache-Control': 'public, max-age=60',
      'ETag': cached.etag
    });
    
    return json(cached.data);
  }
  
  try {
    const pairs = getPairsForCurrency(code);
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const until = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();
    
    // Fetch events
    const { data: events, error: eventsError } = await supabaseAdmin
      .from('economic_events')
      .select(`
        event_datetime,
        country,
        report_name,
        canonical_indicator,
        impact,
        forecast,
        actual,
        previous,
        units,
        sentiment
      `)
      .eq('currency_code', code)
      .in('impact', ['High', 'Medium'])
      .gte('event_datetime', since)
      .lte('event_datetime', until)
      .order('event_datetime', { ascending: false });
    
    if (eventsError) {
      console.error('Events query error:', eventsError);
      return json({ error: 'Failed to fetch events' }, { status: 500 });
    }
    
    // Fetch FX quotes
    const { data: quotes, error: quotesError } = await supabaseAdmin
      .from('fx_quotes')
      .select(`
        pair,
        price,
        change_percent,
        last_update
      `)
      .in('pair', pairs);
    
    if (quotesError) {
      console.error('Quotes query error:', quotesError);
      return json({ error: 'Failed to fetch quotes' }, { status: 500 });
    }
    
    const overview: CurrencyOverview = {
      currency: code,
      pairs: quotes ?? [],
      events: events ?? []
    };
    
    const etag = generateETag(overview);
    
    // Update cache
    cache.set(cacheKey, {
      data: overview,
      timestamp: now,
      etag
    });
    
    // Clean old cache entries
    for (const [key, value] of cache.entries()) {
      if ((now - value.timestamp) > CACHE_TTL) {
        cache.delete(key);
      }
    }
    
    setHeaders({
      'Cache-Control': 'public, max-age=60',
      'ETag': etag
    });
    
    return json(overview);
    
  } catch (error) {
    console.error('Overview API error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
