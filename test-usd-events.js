// Test script for USD Event Mappings
import { canonicalize } from './packages/shared/src/eventMap.js';

// Sample USD event names from FinanceFlow API (typical formats)
const testEvents = [
  // Central Bank Decisions
  'Federal Funds Rate Decision',
  'FOMC Rate Decision', 
  'FOMC Minutes',
  'FOMC Statement',
  'Fed Chair Powell Speech',
  'Fed Official Speech',
  
  // Inflation Data
  'Consumer Price Index YoY',
  'CPI YoY',
  'CPI MoM', 
  'Core CPI YoY',
  'Core CPI MoM',
  'Personal Consumption Expenditures YoY',
  'Core PCE YoY',
  'Core PCE MoM',
  'Producer Price Index YoY',
  'PPI YoY',
  'PPI MoM',
  'Core PPI YoY',
  
  // Employment Data
  'Non-Farm Payrolls',
  'Nonfarm Payrolls',
  'Unemployment Rate',
  'Initial Jobless Claims',
  'Continuing Jobless Claims',
  'ADP Employment Change',
  'ADP Payrolls',
  'Average Hourly Earnings YoY',
  'Average Hourly Earnings MoM',
  'Labor Force Participation Rate',
  
  // GDP Growth
  'GDP Growth Rate QoQ',
  'GDP QoQ',
  'GDP Annualized QoQ',
  'GDP YoY',
  'GDP Deflator QoQ',
  'GDP Deflator YoY',
  
  // Manufacturing/PMI
  'ISM Manufacturing PMI',
  'ISM Services PMI',
  'ISM Non-Manufacturing PMI',
  'Markit Manufacturing PMI',
  'S&P Manufacturing PMI',
  'Markit Services PMI',
  'Philadelphia Fed Index',
  'Philly Fed Manufacturing Index',
  'Empire State Manufacturing Index',
  'NY Fed Empire State Index',
  
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
  'Michigan Consumer Sentiment',
  'Durable Goods Orders MoM',
  'Factory Orders MoM',
  'Housing Starts',
  'Building Permits',
  'Existing Home Sales',
  'New Home Sales'
];

console.log('🎯 USD Event Mapping Test Results:\n');

let mapped = 0;
let unmapped = 0;

testEvents.forEach(event => {
  const canonical = canonicalize(event);
  if (canonical) {
    console.log(`✅ "${event}" → "${canonical}"`);
    mapped++;
  } else {
    console.log(`❌ "${event}" → NOT MAPPED`);
    unmapped++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`✅ Mapped: ${mapped}/${testEvents.length} (${Math.round(mapped/testEvents.length*100)}%)`);
console.log(`❌ Unmapped: ${unmapped}/${testEvents.length} (${Math.round(unmapped/testEvents.length*100)}%)`);

if (unmapped === 0) {
  console.log('\n🎉 All USD events successfully mapped!');
} else {
  console.log('\n⚠️  Some events need additional regex patterns.');
}
