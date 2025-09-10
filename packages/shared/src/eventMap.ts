export interface EventMapping {
  canonical: string;
  re: RegExp;
}

export const regexMap: EventMapping[] = [
  // US Events
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
  { canonical: 'FOMC Minutes', re: /FOMC.*Minutes/i },
  { canonical: 'Trade Balance', re: /Trade Balance/i },
  
  // EUR Events
  { canonical: 'ECB Interest Rate Decision', re: /ECB.*(Rate|Interest).*Decision|Deposit Facility/i },
  { canonical: 'Eurozone CPI YoY', re: /Eurozone.*CPI.*YoY|Euro.*CPI.*YoY/i },
  { canonical: 'Eurozone GDP QoQ', re: /Eurozone.*GDP.*QoQ|Euro.*GDP.*QoQ/i },
  { canonical: 'Eurozone Unemployment Rate', re: /Eurozone.*Unemployment|Euro.*Unemployment/i },
  { canonical: 'German IFO Business Climate', re: /German.*IFO|IFO.*Business.*Climate/i },
  { canonical: 'German Manufacturing PMI', re: /German.*Manufacturing.*PMI/i },
  { canonical: 'Eurozone Retail Sales MoM', re: /Eurozone.*Retail.*Sales|Euro.*Retail.*Sales/i },
  { canonical: 'German ZEW Economic Sentiment', re: /German.*ZEW|ZEW.*Economic.*Sentiment/i },
  { canonical: 'ECB Press Conference', re: /ECB.*Press.*Conference/i },
  { canonical: 'Eurozone Trade Balance', re: /Eurozone.*Trade.*Balance|Euro.*Trade.*Balance/i },
  { canonical: 'German Industrial Production MoM', re: /German.*Industrial.*Production/i },
  
  // GBP Events
  { canonical: 'BoE Interest Rate', re: /Bank of England|BoE.*(Rate|Interest).*Decision/i },
  { canonical: 'UK CPI YoY', re: /UK.*CPI.*YoY|United Kingdom.*CPI.*YoY/i },
  { canonical: 'UK GDP QoQ', re: /UK.*GDP.*QoQ|United Kingdom.*GDP.*QoQ/i },
  { canonical: 'UK Employment Change', re: /UK.*Employment.*Change|United Kingdom.*Employment.*Change/i },
  { canonical: 'UK Retail Sales MoM', re: /UK.*Retail.*Sales|United Kingdom.*Retail.*Sales/i },
  { canonical: 'UK Manufacturing PMI', re: /UK.*Manufacturing.*PMI|United Kingdom.*Manufacturing.*PMI/i },
  { canonical: 'UK Services PMI', re: /UK.*Services.*PMI|United Kingdom.*Services.*PMI/i },
  { canonical: 'UK Trade Balance', re: /UK.*Trade.*Balance|United Kingdom.*Trade.*Balance/i },
  { canonical: 'BoE MPC Vote', re: /BoE.*MPC.*Vote|Bank of England.*MPC/i },
  { canonical: 'UK Industrial Production MoM', re: /UK.*Industrial.*Production|United Kingdom.*Industrial.*Production/i },
  { canonical: 'UK Average Earnings Index', re: /UK.*Average.*Earnings|United Kingdom.*Average.*Earnings/i },
  
  // JPY Events
  { canonical: 'BoJ Interest Rate', re: /Bank of Japan|BoJ.*(Rate|Policy|YCC)/i },
  { canonical: 'Japan CPI YoY', re: /Japan.*CPI.*YoY/i },
  { canonical: 'Japan GDP QoQ', re: /Japan.*GDP.*QoQ/i },
  { canonical: 'Japan Unemployment Rate', re: /Japan.*Unemployment.*Rate/i },
  { canonical: 'Japan Trade Balance', re: /Japan.*Trade.*Balance/i },
  { canonical: 'Japan Manufacturing PMI', re: /Japan.*Manufacturing.*PMI/i },
  { canonical: 'Japan Industrial Production MoM', re: /Japan.*Industrial.*Production/i },
  { canonical: 'Japan Retail Sales YoY', re: /Japan.*Retail.*Sales.*YoY/i },
  { canonical: 'Tankan Large Manufacturing Index', re: /Tankan.*Large.*Manufacturing/i },
  { canonical: 'Japan Current Account', re: /Japan.*Current.*Account/i },
  { canonical: 'BoJ Press Conference', re: /BoJ.*Press.*Conference|Bank of Japan.*Press/i },
  
  // AUD Events
  { canonical: 'RBA Interest Rate Decision', re: /RBA.*(Cash|Interest) Rate|Policy Decision/i },
  { canonical: 'Australia CPI QoQ', re: /Australia.*CPI.*QoQ/i },
  { canonical: 'Australia GDP QoQ', re: /Australia.*GDP.*QoQ/i },
  { canonical: 'Australia Employment Change', re: /Australia.*Employment.*Change/i },
  { canonical: 'Australia Unemployment Rate', re: /Australia.*Unemployment.*Rate/i },
  { canonical: 'Australia Retail Sales MoM', re: /Australia.*Retail.*Sales/i },
  { canonical: 'Australia Trade Balance', re: /Australia.*Trade.*Balance/i },
  { canonical: 'RBA Minutes', re: /RBA.*Minutes/i },
  { canonical: 'Australia Manufacturing PMI', re: /Australia.*Manufacturing.*PMI/i },
  { canonical: 'Australia Building Permits MoM', re: /Australia.*Building.*Permits/i },
  { canonical: 'Australia Westpac Consumer Sentiment', re: /Australia.*Westpac.*Consumer.*Sentiment/i },
  
  // CAD Events
  { canonical: 'BoC Interest Rate', re: /Bank of Canada|BoC.*Rate Decision/i },
  { canonical: 'Canada CPI YoY', re: /Canada.*CPI.*YoY/i },
  { canonical: 'Canada GDP MoM', re: /Canada.*GDP.*MoM/i },
  { canonical: 'Canada Employment Change', re: /Canada.*Employment.*Change/i },
  { canonical: 'Canada Unemployment Rate', re: /Canada.*Unemployment.*Rate/i },
  { canonical: 'Canada Retail Sales MoM', re: /Canada.*Retail.*Sales/i },
  { canonical: 'Canada Trade Balance', re: /Canada.*Trade.*Balance/i },
  { canonical: 'Canada Manufacturing PMI', re: /Canada.*Manufacturing.*PMI/i },
  { canonical: 'Canada Industrial Product Price MoM', re: /Canada.*Industrial.*Product.*Price/i },
  { canonical: 'Canada Housing Starts', re: /Canada.*Housing.*Starts/i },
  { canonical: 'Canada Ivey PMI', re: /Canada.*Ivey.*PMI/i },
  
  // CHF Events
  { canonical: 'SNB Interest Rate Decision', re: /SNB.*(Policy|Interest) Rate/i },
  { canonical: 'Switzerland CPI YoY', re: /Switzerland.*CPI.*YoY/i },
  { canonical: 'Switzerland GDP QoQ', re: /Switzerland.*GDP.*QoQ/i },
  { canonical: 'Switzerland Unemployment Rate', re: /Switzerland.*Unemployment.*Rate/i },
  { canonical: 'Switzerland Trade Balance', re: /Switzerland.*Trade.*Balance/i },
  { canonical: 'Switzerland Manufacturing PMI', re: /Switzerland.*Manufacturing.*PMI/i },
  { canonical: 'Switzerland Retail Sales YoY', re: /Switzerland.*Retail.*Sales.*YoY/i },
  { canonical: 'SNB Quarterly Bulletin', re: /SNB.*Quarterly.*Bulletin/i },
  { canonical: 'Switzerland Industrial Production YoY', re: /Switzerland.*Industrial.*Production.*YoY/i },
  { canonical: 'Switzerland Consumer Confidence', re: /Switzerland.*Consumer.*Confidence/i },
  
  // NZD Events
  { canonical: 'RBNZ Interest Rate Decision', re: /RBNZ.*(Interest|Policy) Rate.*Decision/i },
  { canonical: 'New Zealand CPI QoQ', re: /New Zealand.*CPI.*QoQ/i },
  { canonical: 'New Zealand GDP QoQ', re: /New Zealand.*GDP.*QoQ/i },
  { canonical: 'New Zealand Employment Change', re: /New Zealand.*Employment.*Change/i },
  { canonical: 'New Zealand Unemployment Rate', re: /New Zealand.*Unemployment.*Rate/i },
  { canonical: 'New Zealand Trade Balance', re: /New Zealand.*Trade.*Balance/i },
  { canonical: 'New Zealand Retail Sales QoQ', re: /New Zealand.*Retail.*Sales.*QoQ/i },
  { canonical: 'RBNZ Monetary Policy Statement', re: /RBNZ.*Monetary.*Policy.*Statement/i },
  { canonical: 'New Zealand Manufacturing PMI', re: /New Zealand.*Manufacturing.*PMI/i },
  { canonical: 'New Zealand Building Permits MoM', re: /New Zealand.*Building.*Permits/i },
  { canonical: 'New Zealand Consumer Confidence', re: /New Zealand.*Consumer.*Confidence/i }
];

export function canonicalize(name: string): string | undefined {
  const hit = regexMap.find(m => m.re.test(name));
  return hit?.canonical;
}
