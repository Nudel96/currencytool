// Comprehensive test for USD economic events integration
import { createClient } from '@supabase/supabase-js';
import { canonicalize } from './packages/shared/src/eventMap.js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ffApiBase = process.env.FINANCEFLOW_API_BASE;
const ffApiKey = process.env.FINANCEFLOW_API_KEY;

console.log('🇺🇸 USD Economic Events Integration Test\n');

if (!supabaseUrl || !supabaseKey || !ffApiBase || !ffApiKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Key USD economic indicators we want to track
const keyUSDIndicators = {
  'Central Bank': [
    'Federal Funds Rate Decision',
    'FOMC Minutes',
    'FOMC Statement',
    'Fed Chair Speech',
    'Fed Officials Speech'
  ],
  'Inflation': [
    'CPI YoY',
    'Core CPI YoY', 
    'Core PCE YoY',
    'PPI YoY'
  ],
  'Employment': [
    'Non-Farm Payrolls (NFP)',
    'Unemployment Rate',
    'Initial Jobless Claims',
    'ADP Employment Change',
    'Average Hourly Earnings YoY'
  ],
  'GDP': [
    'GDP QoQ',
    'GDP Annualized QoQ',
    'GDP YoY'
  ],
  'Manufacturing/PMI': [
    'ISM Manufacturing PMI',
    'ISM Services PMI',
    'Markit Manufacturing PMI',
    'Philadelphia Fed Index',
    'NY Empire State Index'
  ],
  'Other Key': [
    'Retail Sales MoM',
    'Industrial Production MoM',
    'Consumer Confidence',
    'Trade Balance'
  ]
};

async function testUSDIntegration() {
  try {
    console.log('1️⃣ Testing Database Connection...');
    
    // Test 1: Check if USD currency exists
    const { data: usdCurrency, error: currError } = await supabase
      .from('currencies')
      .select('*')
      .eq('code', 'USD')
      .single();
    
    if (currError || !usdCurrency) {
      console.error('❌ USD currency not found in database');
      return;
    }
    console.log(`✅ USD currency found: ${usdCurrency.name} (${usdCurrency.country})`);

    // Test 2: Check indicators in database
    console.log('\n2️⃣ Testing Indicators in Database...');
    const allIndicators = Object.values(keyUSDIndicators).flat();
    
    const { data: indicators, error: indError } = await supabase
      .from('indicators')
      .select('canonical_name, positive_is_bullish')
      .in('canonical_name', allIndicators);
    
    if (indError) {
      console.error('❌ Error fetching indicators:', indError);
      return;
    }
    
    console.log(`✅ Found ${indicators?.length || 0} indicators in database`);
    const foundIndicators = new Set(indicators?.map(i => i.canonical_name) || []);
    
    Object.entries(keyUSDIndicators).forEach(([category, categoryIndicators]) => {
      const found = categoryIndicators.filter(ind => foundIndicators.has(ind));
      console.log(`  ${category}: ${found.length}/${categoryIndicators.length} indicators`);
      
      const missing = categoryIndicators.filter(ind => !foundIndicators.has(ind));
      if (missing.length > 0) {
        console.log(`    Missing: ${missing.join(', ')}`);
      }
    });

    // Test 3: Check recent USD events
    console.log('\n3️⃣ Testing Recent USD Events...');
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data: events, error: eventsError } = await supabase
      .from('economic_events')
      .select('*')
      .eq('currency_code', 'USD')
      .in('impact', ['High', 'Medium'])
      .gte('event_datetime', since)
      .order('event_datetime', { ascending: false })
      .limit(20);
    
    if (eventsError) {
      console.error('❌ Error fetching events:', eventsError);
      return;
    }
    
    console.log(`✅ Found ${events?.length || 0} recent USD events`);
    
    if (events && events.length > 0) {
      console.log('\n📊 Recent USD Events Sample:');
      events.slice(0, 5).forEach(event => {
        console.log(`  📅 ${event.event_datetime}: ${event.report_name}`);
        console.log(`     Impact: ${event.impact}, Canonical: ${event.canonical_indicator || 'Not mapped'}`);
        console.log(`     Forecast: ${event.forecast}, Actual: ${event.actual}, Previous: ${event.previous}`);
        console.log(`     Sentiment: ${event.sentiment || 'N/A'}`);
        console.log('');
      });
      
      // Analyze canonical mapping coverage
      const mappedEvents = events.filter(e => e.canonical_indicator);
      const unmappedEvents = events.filter(e => !e.canonical_indicator);
      
      console.log(`📈 Mapping Analysis:`);
      console.log(`  ✅ Mapped events: ${mappedEvents.length}`);
      console.log(`  ❌ Unmapped events: ${unmappedEvents.length}`);
      console.log(`  📊 Mapping rate: ${((mappedEvents.length / events.length) * 100).toFixed(1)}%`);
      
      if (unmappedEvents.length > 0) {
        console.log('\n🔍 Unmapped Events (need regex patterns):');
        unmappedEvents.slice(0, 5).forEach(event => {
          console.log(`  - "${event.report_name}"`);
        });
      }
    }

    // Test 4: Test FinanceFlow API directly
    console.log('\n4️⃣ Testing FinanceFlow API...');
    const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const to = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    
    const url = new URL(`${ffApiBase}/financial-calendar`);
    url.searchParams.set('api_key', ffApiKey);
    url.searchParams.set('country', 'United States');
    url.searchParams.set('date_from', from);
    url.searchParams.set('date_to', to);
    
    const response = await fetch(url, {
      headers: { 'accept': 'application/json' }
    });
    
    if (!response.ok) {
      console.error(`❌ FinanceFlow API error: ${response.status}`);
      return;
    }
    
    const apiData = await response.json();
    const apiEvents = apiData?.data ?? apiData ?? [];
    
    console.log(`✅ FinanceFlow API returned ${apiEvents.length} events`);
    
    // Filter for High/Medium impact
    const importantEvents = apiEvents.filter(e => {
      const impact = String(e.economicImpact ?? e.impact ?? '').toLowerCase();
      return impact === 'high' || impact === 'moderate' || impact === 'medium';
    });
    
    console.log(`📈 High/Medium impact events: ${importantEvents.length}`);
    
    if (importantEvents.length > 0) {
      console.log('\n🎯 Key Events from API:');
      importantEvents.slice(0, 5).forEach(event => {
        const canonical = canonicalize(event.report_name || event.title || '');
        console.log(`  📅 ${event.datetime || event.date}: ${event.report_name || event.title}`);
        console.log(`     Impact: ${event.economicImpact || event.impact}, Canonical: ${canonical || 'Not mapped'}`);
        console.log(`     Forecast: ${event.forecast || event.consensus}, Actual: ${event.actual}, Previous: ${event.previous}`);
        console.log('');
      });
    }

    // Test 5: Test API endpoint
    console.log('\n5️⃣ Testing API Endpoint...');
    const apiResponse = await fetch(`http://localhost:5173/api/currency/USD/overview`);
    
    if (apiResponse.ok) {
      const overviewData = await apiResponse.json();
      console.log(`✅ API endpoint working: ${overviewData.events?.length || 0} events, ${overviewData.pairs?.length || 0} FX pairs`);
    } else {
      console.log(`⚠️ API endpoint not available (dev server not running): ${apiResponse.status}`);
    }

    console.log('\n🎉 USD Integration Test Complete!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testUSDIntegration();
