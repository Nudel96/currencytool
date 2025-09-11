// Test enhanced USD economic events mapping
import { regexMap, canonicalize } from './packages/shared/src/eventMap.js';

console.log('🎯 Testing Enhanced USD Economic Events Mapping\n');

// Test events that should be captured for USD
const testEvents = [
  // Central Bank Decisions
  'Federal Funds Rate Decision',
  'Fed Rate Decision',
  'FOMC Rate Decision',
  'Interest Rate Decision US',
  'FOMC Minutes',
  'FOMC Statement',
  'Fed Chair Speech',
  'Powell Speech',
  'Fed Officials Speech',
  'Fed Monetary Policy Report',
  'Fed Beige Book',
  
  // Inflation Data
  'CPI YoY',
  'Consumer Price Index YoY',
  'Inflation YoY US',
  'Core CPI YoY',
  'Core Consumer Price YoY',
  'Core Inflation YoY',
  'CPI MoM',
  'Core CPI MoM',
  'PCE YoY',
  'Personal Consumption Expenditures YoY',
  'Core PCE YoY',
  'Core Personal Consumption YoY',
  'Core PCE Price Index YoY',
  'PPI YoY',
  'Producer Price Index YoY',
  'Core PPI YoY',
  
  // Employment Data
  'Non-Farm Payrolls',
  'Nonfarm Payrolls',
  'NFP',
  'Employment Change US',
  'Unemployment Rate',
  'Jobless Rate US',
  'Initial Jobless Claims',
  'Initial Claims',
  'Weekly Jobless Claims',
  'Continuing Jobless Claims',
  'ADP Employment Change',
  'ADP Payrolls',
  'ADP Jobs Report',
  'Average Hourly Earnings YoY',
  'Average Hourly Earnings MoM',
  'Labor Force Participation',
  'Employment Cost Index QoQ',
  
  // GDP Growth
  'GDP QoQ',
  'Gross Domestic Product QoQ',
  'US GDP QoQ',
  'GDP Annualized QoQ',
  'GDP SAAR',
  'Annualized GDP QoQ',
  'GDP YoY',
  'GDP Preliminary QoQ',
  'GDP Final QoQ',
  'GDP Deflator QoQ',
  
  // Manufacturing/PMI Data
  'ISM Manufacturing PMI',
  'Institute Supply Management Manufacturing',
  'ISM Services PMI',
  'ISM Non Manufacturing',
  'Markit Manufacturing PMI',
  'S&P Manufacturing PMI',
  'S&P Global Manufacturing PMI',
  'Markit Services PMI',
  'S&P Services PMI',
  'Philadelphia Fed Index',
  'Philly Fed',
  'Empire State Index',
  'NY Fed Index',
  'Richmond Fed Index',
  'Kansas City Fed Index',
  
  // Additional Key Indicators
  'Retail Sales MoM',
  'Retail Sales Ex Auto MoM',
  'Core Retail Sales',
  'Industrial Production MoM',
  'Capacity Utilization',
  'Trade Balance',
  'Current Account',
  'Consumer Confidence',
  'Consumer Sentiment',
  'Michigan Sentiment',
  'Durable Goods Orders MoM',
  'Factory Orders MoM',
  'Housing Starts',
  'Building Permits',
  'Existing Home Sales',
  'New Home Sales'
];

console.log('📊 Testing Event Mapping Results:\n');

let mapped = 0;
let unmapped = 0;
const mappingResults = {};

testEvents.forEach(event => {
  const canonical = canonicalize(event);
  if (canonical) {
    console.log(`✅ "${event}" → "${canonical}"`);
    mapped++;
    if (!mappingResults[canonical]) {
      mappingResults[canonical] = [];
    }
    mappingResults[canonical].push(event);
  } else {
    console.log(`❌ "${event}" → NOT MAPPED`);
    unmapped++;
  }
});

console.log(`\n📈 Summary:`);
console.log(`✅ Mapped: ${mapped}`);
console.log(`❌ Unmapped: ${unmapped}`);
console.log(`📊 Success Rate: ${((mapped / testEvents.length) * 100).toFixed(1)}%`);

console.log(`\n🎯 Canonical Indicators Found:`);
Object.keys(mappingResults).sort().forEach(canonical => {
  console.log(`  📌 ${canonical} (${mappingResults[canonical].length} variations)`);
});

// Test key economic categories
console.log(`\n🏦 Key Economic Categories Coverage:`);
const categories = {
  'Central Bank': ['Federal Funds Rate Decision', 'FOMC Minutes', 'FOMC Statement', 'Fed Chair Speech'],
  'Inflation': ['CPI YoY', 'Core CPI YoY', 'Core PCE YoY', 'PPI YoY'],
  'Employment': ['Non-Farm Payrolls (NFP)', 'Unemployment Rate', 'Initial Jobless Claims', 'ADP Employment Change'],
  'GDP': ['GDP QoQ', 'GDP Annualized QoQ', 'GDP YoY'],
  'Manufacturing/PMI': ['ISM Manufacturing PMI', 'ISM Services PMI', 'Markit Manufacturing PMI', 'Philadelphia Fed Index']
};

Object.entries(categories).forEach(([category, indicators]) => {
  const covered = indicators.filter(indicator => Object.keys(mappingResults).includes(indicator));
  console.log(`  ${category}: ${covered.length}/${indicators.length} indicators covered`);
  if (covered.length < indicators.length) {
    const missing = indicators.filter(indicator => !Object.keys(mappingResults).includes(indicator));
    console.log(`    Missing: ${missing.join(', ')}`);
  }
});

console.log('\n🚀 USD Economic Events Mapping Test Complete!');
