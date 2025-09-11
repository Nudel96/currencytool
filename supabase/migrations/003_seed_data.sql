-- Seed currencies with country mapping
INSERT INTO public.currencies(code, name, country) VALUES
('USD', 'US Dollar', 'United States'),
('EUR', 'Euro', 'European Union'),
('GBP', 'British Pound', 'United Kingdom'),
('JPY', 'Japanese Yen', 'Japan'),
('AUD', 'Australian Dollar', 'Australia'),
('CAD', 'Canadian Dollar', 'Canada'),
('CHF', 'Swiss Franc', 'Switzerland'),
('NZD', 'New Zealand Dollar', 'New Zealand')
ON CONFLICT (code) DO NOTHING;

-- Seed key indicators with sentiment inversion flags
INSERT INTO public.indicators(canonical_name, positive_is_bullish, surprise_tolerance) VALUES
-- Inflation indicators (higher = bullish for currency)
('CPI YoY', TRUE, 0.0),
('CPI MoM', TRUE, 0.0),
('Core CPI YoY', TRUE, 0.0),
('Core CPI MoM', TRUE, 0.0),
('PCE YoY', TRUE, 0.0),
('Core PCE YoY', TRUE, 0.0),
('Core PCE MoM', TRUE, 0.0),
('PPI YoY', TRUE, 0.0),
('PPI MoM', TRUE, 0.0),
('Core PPI YoY', TRUE, 0.0),

-- Growth indicators (higher = bullish)
('GDP QoQ', TRUE, 0.0),
('GDP Annualized QoQ', TRUE, 0.0),
('GDP YoY', TRUE, 0.0),
('GDP Preliminary QoQ', TRUE, 0.0),
('GDP Final QoQ', TRUE, 0.0),
('Retail Sales MoM', TRUE, 0.0),
('Retail Sales Ex Auto MoM', TRUE, 0.0),
('Industrial Production MoM', TRUE, 0.0),
('Capacity Utilization', TRUE, 0.0),

-- Employment indicators (higher employment = bullish, higher unemployment = bearish)
('Non-Farm Payrolls (NFP)', TRUE, 0.0),
('Employment Change', TRUE, 0.0),
('ADP Employment Change', TRUE, 0.0),
('Unemployment Rate', FALSE, 0.0),  -- Higher unemployment is bearish
('Initial Jobless Claims', FALSE, 0.0),  -- Higher claims is bearish
('Continuing Jobless Claims', FALSE, 0.0),  -- Higher claims is bearish
('Average Hourly Earnings YoY', TRUE, 0.0),
('Average Hourly Earnings MoM', TRUE, 0.0),
('Labor Force Participation Rate', TRUE, 0.0),
('Employment Cost Index QoQ', TRUE, 0.0),

-- PMI indicators (above 50 = expansion = bullish)
('Manufacturing PMI', TRUE, 0.0),
('ISM Manufacturing PMI', TRUE, 0.0),
('ISM Services PMI', TRUE, 0.0),
('Markit Manufacturing PMI', TRUE, 0.0),
('Markit Services PMI', TRUE, 0.0),
('Services PMI', TRUE, 0.0),
('Philadelphia Fed Index', TRUE, 0.0),
('NY Empire State Index', TRUE, 0.0),
('Richmond Fed Index', TRUE, 0.0),
('Kansas City Fed Index', TRUE, 0.0),

-- Central Bank rates (higher rates = bullish for currency)
('Federal Funds Rate Decision', TRUE, 0.0),
('ECB Interest Rate Decision', TRUE, 0.0),
('BoE Interest Rate', TRUE, 0.0),
('BoJ Interest Rate', TRUE, 0.0),
('RBA Interest Rate Decision', TRUE, 0.0),
('BoC Interest Rate', TRUE, 0.0),
('SNB Interest Rate Decision', TRUE, 0.0),
('RBNZ Interest Rate Decision', TRUE, 0.0),

-- Trade indicators (surplus = bullish)
('Trade Balance', TRUE, 0.0),
('Current Account', TRUE, 0.0),

-- Consumer indicators (higher = bullish)
('Consumer Confidence', TRUE, 0.0),
('Consumer Sentiment', TRUE, 0.0),

-- Business indicators (higher = bullish)
('Durable Goods Orders MoM', TRUE, 0.0),
('Factory Orders MoM', TRUE, 0.0),

-- Housing indicators (higher = bullish)
('Housing Starts', TRUE, 0.0),
('Building Permits', TRUE, 0.0),
('Existing Home Sales', TRUE, 0.0),
('New Home Sales', TRUE, 0.0),

-- Fed Communication (neutral by default)
('FOMC Minutes', TRUE, 0.0),
('FOMC Statement', TRUE, 0.0),
('Fed Chair Speech', TRUE, 0.0),
('Fed Officials Speech', TRUE, 0.0),
('Fed Monetary Policy Report', TRUE, 0.0),
('Fed Beige Book', TRUE, 0.0),

-- Business sentiment (higher = bullish)
('German IFO Business Climate', TRUE, 0.0),
('German ZEW Economic Sentiment', TRUE, 0.0),
('Tankan Large Manufacturing Index', TRUE, 0.0),
('Australia Westpac Consumer Sentiment', TRUE, 0.0),
('New Zealand Consumer Confidence', TRUE, 0.0),
('Switzerland Consumer Confidence', TRUE, 0.0),

-- Housing indicators (higher = bullish)
('Australia Building Permits MoM', TRUE, 0.0),
('New Zealand Building Permits MoM', TRUE, 0.0),
('Canada Housing Starts', TRUE, 0.0),

-- Earnings indicators (higher = bullish)
('UK Average Earnings Index', TRUE, 0.0),
('Canada Industrial Product Price MoM', TRUE, 0.0)

ON CONFLICT (canonical_name) DO NOTHING;
