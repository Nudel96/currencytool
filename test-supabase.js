// Test Supabase connection and data
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔗 Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Check currencies table
    console.log('\n📊 Testing currencies table...');
    const { data: currencies, error: currError } = await supabase
      .from('currencies')
      .select('*');
    
    if (currError) {
      console.error('❌ Currencies error:', currError);
    } else {
      console.log('✅ Currencies found:', currencies?.length || 0);
      currencies?.forEach(c => console.log(`  - ${c.code}: ${c.country}`));
    }

    // Test 2: Check economic_events table for USD
    console.log('\n📈 Testing economic_events for USD...');
    const { data: events, error: eventsError } = await supabase
      .from('economic_events')
      .select('*')
      .eq('currency_code', 'USD')
      .limit(5);
    
    if (eventsError) {
      console.error('❌ Events error:', eventsError);
    } else {
      console.log('✅ USD Events found:', events?.length || 0);
      events?.forEach(e => console.log(`  - ${e.event_datetime}: ${e.report_name} (${e.impact})`));
    }

    // Test 3: Check fx_quotes table
    console.log('\n💱 Testing fx_quotes...');
    const { data: quotes, error: quotesError } = await supabase
      .from('fx_quotes')
      .select('*')
      .limit(5);
    
    if (quotesError) {
      console.error('❌ Quotes error:', quotesError);
    } else {
      console.log('✅ FX Quotes found:', quotes?.length || 0);
      quotes?.forEach(q => console.log(`  - ${q.pair}: ${q.price}`));
    }

    // Test 4: Check ETL logs
    console.log('\n📝 Testing ETL logs...');
    const { data: logs, error: logsError } = await supabase
      .from('etl_log')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(3);
    
    if (logsError) {
      console.error('❌ Logs error:', logsError);
    } else {
      console.log('✅ ETL Logs found:', logs?.length || 0);
      logs?.forEach(l => console.log(`  - ${l.job}: ${l.ok ? '✅' : '❌'} ${l.started_at}`));
    }

  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

testConnection();
