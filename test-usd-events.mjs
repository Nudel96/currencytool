// Test USD economic events from FinanceFlow API
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ffApiBase = process.env.FINANCEFLOW_API_BASE;
const ffApiKey = process.env.FINANCEFLOW_API_KEY;

console.log('🔗 Testing USD Economic Events...');
console.log('Supabase URL:', supabaseUrl);
console.log('FinanceFlow API:', ffApiBase);
console.log('API Key:', ffApiKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseKey || !ffApiBase || !ffApiKey) {
  console.error('❌ Missing credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUSDEvents() {
  try {
    // Test 1: Check current USD events in database
    console.log('\n📊 Current USD Events in Database...');
    const { data: events, error: eventsError } = await supabase
      .from('economic_events')
      .select('*')
      .eq('currency_code', 'USD')
      .in('impact', ['High', 'Medium'])
      .order('event_datetime', { ascending: false })
      .limit(10);
    
    if (eventsError) {
      console.error('❌ Database error:', eventsError);
    } else {
      console.log(`✅ Found ${events?.length || 0} USD events in database`);
      events?.forEach(e => {
        console.log(`  - ${e.event_datetime}: ${e.report_name} (${e.impact})`);
        console.log(`    Forecast: ${e.forecast}, Actual: ${e.actual}, Previous: ${e.previous}`);
        console.log(`    Sentiment: ${e.sentiment}, Canonical: ${e.canonical_indicator}`);
      });
    }

    // Test 2: Test direct FinanceFlow API call for US events
    console.log('\n🌐 Testing FinanceFlow API for US events...');
    const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const to = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    
    const url = new URL(`${ffApiBase}/financial-calendar`);
    url.searchParams.set('api_key', ffApiKey);
    url.searchParams.set('country', 'United States');
    url.searchParams.set('date_from', from);
    url.searchParams.set('date_to', to);
    
    console.log('API URL:', url.toString().replace(ffApiKey, 'HIDDEN'));
    
    const response = await fetch(url, {
      headers: { 'accept': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${await response.text()}`);
    }
    
    const apiData = await response.json();
    const apiEvents = apiData?.data ?? apiData ?? [];
    
    console.log(`✅ Found ${apiEvents.length} events from FinanceFlow API`);
    
    // Filter for High/Medium impact events
    const importantEvents = apiEvents.filter(e => 
      e.impact === 'High' || e.impact === 'Medium' || 
      e.economicImpact === 'High' || e.economicImpact === 'Medium'
    );
    
    console.log(`📈 High/Medium impact events: ${importantEvents.length}`);
    
    // Show key economic indicators we're looking for
    const keyIndicators = [
      'Federal Funds Rate',
      'Non-Farm Payrolls',
      'CPI',
      'GDP',
      'PMI',
      'Unemployment',
      'PCE',
      'Retail Sales',
      'Industrial Production'
    ];
    
    console.log('\n🎯 Key USD Economic Indicators Found:');
    keyIndicators.forEach(indicator => {
      const found = importantEvents.filter(e => 
        (e.report_name || e.title || '').toLowerCase().includes(indicator.toLowerCase())
      );
      if (found.length > 0) {
        console.log(`  ✅ ${indicator}: ${found.length} events`);
        found.slice(0, 2).forEach(e => {
          console.log(`    - ${e.datetime || e.date}: ${e.report_name || e.title}`);
        });
      } else {
        console.log(`  ❌ ${indicator}: No events found`);
      }
    });

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testUSDEvents();
